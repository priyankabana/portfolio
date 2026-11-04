#!/usr/bin/env python3
"""
Extract cursor-tracking frames from the character head-turn video.

Input : public/character.mp4  (head + shoulders on a flat background, head turning
        through every direction, neutral "looking at camera" pose at start/end)
Output: public/frames/frame_00.webp ... frame_63.webp  (64 directions, ~5.6 deg apart)
        public/frames/center.webp                       (eye-contact pose)
        public/frames/_preview.jpg                      (contact sheet to eyeball the result)
        and prints the detected background colour as a hex string.

Frame i looks toward screen angle i * 360/64 degrees, where 0 deg = right and angles
increase clockwise (screen y points down). That is exactly Math.atan2(dy, dx) in the
browser, which CursorHero.tsx uses.

How it works
1. Background colour = median of the border pixels of the first frame.
2. The neutral reference is the first frame (the video starts looking at the camera).
3. For every frame, dense optical flow (Farneback) from the reference is averaged over
   the head region (foreground pixels in the upper part of the subject). The mean flow
   vector points where the face moved, i.e. where the character is looking.
4. Frames with a clear turn are kept; for each of the 64 target angles the closest
   frame by angle is chosen. The frame with the least motion becomes center.webp.

Usage
    pip install opencv-python numpy
    python3 scripts/extract_frames.py
    python3 scripts/extract_frames.py --flip-x        # if left/right come out mirrored
    python3 scripts/extract_frames.py --flip-y        # if up/down come out mirrored
    python3 scripts/extract_frames.py --width 1280 --quality 88

Check public/frames/_preview.jpg: frame_00 should look RIGHT, frame_16 DOWN,
frame_32 LEFT, frame_48 UP. Then set hero.backgroundColor in src/config.ts to the
printed hex.
"""
import argparse
import math
import os
import sys

try:
    import cv2
    import numpy as np
except ImportError:
    sys.exit("Missing dependencies. Run: pip install opencv-python numpy")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def parse_args():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--video", default=os.path.join(ROOT, "public", "character.mp4"))
    p.add_argument("--out", default=os.path.join(ROOT, "public", "frames"))
    p.add_argument("--count", type=int, default=64, help="number of directional frames")
    p.add_argument("--width", type=int, default=1280, help="output width in px (keeps aspect)")
    p.add_argument("--quality", type=int, default=86, help="WebP quality 0-100")
    p.add_argument("--min-turn", type=float, default=0.35,
                   help="keep frames whose motion is at least this fraction of the max")
    p.add_argument("--flip-x", action="store_true", help="mirror horizontal direction")
    p.add_argument("--flip-y", action="store_true", help="mirror vertical direction")
    return p.parse_args()


def read_frames(path):
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        sys.exit(f"Could not open {path}. Put the Google Flow video there as character.mp4")
    frames = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        frames.append(f)
    fps = cap.get(cv2.CAP_PROP_FPS) or 0
    cap.release()
    if len(frames) < 10:
        sys.exit(f"Only {len(frames)} frames decoded; is the video valid?")
    return frames, fps


def background_bgr(frame):
    h, w = frame.shape[:2]
    b = max(4, min(h, w) // 40)
    border = np.concatenate([
        frame[:b].reshape(-1, 3), frame[-b:].reshape(-1, 3),
        frame[:, :b].reshape(-1, 3), frame[:, -b:].reshape(-1, 3),
    ])
    return np.median(border, axis=0).astype(np.uint8)


def head_mask(frame, bg, tol=38):
    diff = np.linalg.norm(frame.astype(np.int16) - bg.astype(np.int16), axis=2)
    fg = (diff > tol).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    ys, xs = np.nonzero(fg)
    if len(ys) == 0:
        return np.ones(frame.shape[:2], bool)
    top, bottom = ys.min(), ys.max()
    # the head is roughly the upper 55% of the subject silhouette
    cut = top + int((bottom - top) * 0.55)
    m = np.zeros(frame.shape[:2], bool)
    m[top:cut] = fg[top:cut].astype(bool)
    return m


def main():
    a = parse_args()
    frames, fps = read_frames(a.video)
    print(f"Decoded {len(frames)} frames at {fps:.2f} fps, size {frames[0].shape[1]}x{frames[0].shape[0]}")

    bg = background_bgr(frames[0])
    hexcol = "#{:02x}{:02x}{:02x}".format(int(bg[2]), int(bg[1]), int(bg[0]))

    scale = 480 / frames[0].shape[1]
    small = [cv2.resize(f, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA) for f in frames]
    grays = [cv2.cvtColor(s, cv2.COLOR_BGR2GRAY) for s in small]
    mask = head_mask(small[0], bg)

    ref = grays[0]
    vecs = []
    for g in grays:
        flow = cv2.calcOpticalFlowFarneback(ref, g, None, 0.5, 4, 21, 4, 5, 1.1, 0)
        fx = float(flow[..., 0][mask].mean())
        fy = float(flow[..., 1][mask].mean())
        if a.flip_x:
            fx = -fx
        if a.flip_y:
            fy = -fy
        vecs.append((fx, fy))

    mags = np.array([math.hypot(x, y) for x, y in vecs])
    angs = np.array([math.atan2(y, x) % (2 * math.pi) for x, y in vecs])
    peak = mags.max()
    if peak < 0.5:
        sys.exit("Almost no head motion detected. Is this the head-turn video?")

    strong = np.nonzero(mags >= peak * a.min_turn)[0]
    center_idx = int(np.argmin(mags))
    print(f"Head-turn frames found: {len(strong)} of {len(frames)} (center pose = frame {center_idx})")

    os.makedirs(a.out, exist_ok=True)
    out_w = min(a.width, frames[0].shape[1])
    out_scale = out_w / frames[0].shape[1]

    def save(img, name):
        if out_scale != 1:
            img = cv2.resize(img, None, fx=out_scale, fy=out_scale, interpolation=cv2.INTER_AREA)
        cv2.imwrite(os.path.join(a.out, name), img, [cv2.IMWRITE_WEBP_QUALITY, a.quality])
        return img

    picks = []
    worst = 0.0
    for i in range(a.count):
        target = 2 * math.pi * i / a.count
        d = np.abs((angs[strong] - target + math.pi) % (2 * math.pi) - math.pi)
        j = int(strong[int(np.argmin(d))])
        worst = max(worst, math.degrees(float(d.min())))
        picks.append(j)
        save(frames[j], f"frame_{i:02d}.webp")
    center_img = save(frames[center_idx], "center.webp")

    # contact sheet: 8 x 8 thumbnails + center
    th_w = 160
    th_h = int(center_img.shape[0] * th_w / center_img.shape[1])
    sheet = np.full((th_h * 8, th_w * 8, 3), bg, np.uint8)
    for i, j in enumerate(picks):
        t = cv2.resize(frames[j], (th_w, th_h), interpolation=cv2.INTER_AREA)
        r, c = divmod(i, 8)
        sheet[r * th_h:(r + 1) * th_h, c * th_w:(c + 1) * th_w] = t
        cv2.putText(sheet, f"{i:02d}", (c * th_w + 6, r * th_h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)
    cv2.imwrite(os.path.join(a.out, "_preview.jpg"), sheet, [cv2.IMWRITE_JPEG_QUALITY, 80])

    print(f"Wrote {a.count} directional frames + center.webp to {a.out}")
    print(f"Largest angle gap between target and chosen frame: {worst:.1f} deg")
    if worst > 20:
        print("  Some directions are missing from the video; regenerate it with a fuller circle for smoother tracking.")
    print(f"Background colour: {hexcol}")
    print(f'  -> set hero.backgroundColor: "{hexcol}" in src/config.ts')
    print("Check frames/_preview.jpg: 00 = right, 16 = down, 32 = left, 48 = up. Use --flip-x / --flip-y if mirrored.")


if __name__ == "__main__":
    main()
