import { useEffect, useRef, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { config } from "../config";
import { useLoading } from "../context/LoadingProvider";
import { setProgress } from "./Loading";
import "./styles/CursorHero.css";

/*
 * Cursor-tracking character hero.
 *
 * Frames live in /public/frames as frame_00.webp ... frame_63.webp plus center.webp,
 * produced by scripts/extract_frames.py from public/character.mp4.
 * Frame i shows the head looking toward screen angle i * (360 / N) degrees,
 * where 0 deg = right and angles increase clockwise (screen y points down),
 * i.e. the same convention as Math.atan2(dy, dx) in the browser.
 *
 * Rules: no CSS 3D transforms, no runtime <video> seeking, and exactly one frame
 * drawn at full opacity per paint (no alpha blending, so no ghosting).
 */

const TAU = Math.PI * 2;
const LERP = 0.26; // response factor: ~35 ms to catch up at 60 fps
const DEADZONE = 0.12; // fraction of the screen radius that triggers eye contact
const FACE = { x: 0.5, y: 0.42 }; // face centre as a fraction of the hero size (updated on resize)
const SUBJECT_X_DESKTOP = 0.76; // on wide screens the portrait sits on the right, above the role line
const SUBJECT_Y_SHIFT = -0.04; // nudge the portrait up so it clears the role line

const lerpAngle = (a: number, b: number, t: number) => {
  let d = ((b - a + Math.PI) % TAU + TAU) % TAU - Math.PI;
  return a + d * t;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const CursorHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();
  const [hasFrames, setHasFrames] = useState(false);
  const { hero, developer } = config;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = sectionRef.current!;
    const ctx = canvas.getContext("2d")!;
    const progress = setProgress((v) => setLoading(v));

    let frames: HTMLImageElement[] = [];
    let center: HTMLImageElement | null = null;
    let ready = false;
    let raf = 0;
    let disposed = false;

    const pointer = { x: 0, y: 0, active: false };
    let smoothed = 0;
    let lastDrawn = "";
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      FACE.x = w > 900 ? SUBJECT_X_DESKTOP : 0.5;
      FACE.y = w > 900 ? 0.42 + SUBJECT_Y_SHIFT : 0.42;
      pointer.x = w * FACE.x;
      pointer.y = h * FACE.y;
      lastDrawn = "";
    };

    // object-fit: cover, anchored so the face stays in frame on wide screens
    const drawCover = (img: HTMLImageElement) => {
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.fillStyle = hero.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      // frames have the subject centred; shift so it lands on FACE.x
      const dx = w * FACE.x - dw / 2;
      const dy = (h - dh) / 2 + (w > 900 ? h * SUBJECT_Y_SHIFT : 0);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    // Shown until real frames are added: a soft orb with a monogram that
    // leans toward the cursor so the hero still feels alive.
    const drawPlaceholder = (angle: number, strength: number) => {
      ctx.fillStyle = hero.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      const r = Math.min(w, h) * (w < 768 ? 0.3 : 0.24);
      const cx = w * (w < 768 ? 0.5 : 0.62) + Math.cos(angle) * r * 0.12 * strength;
      const cy = h * (w < 768 ? 0.34 : 0.44) + Math.sin(angle) * r * 0.12 * strength;

      const halo = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 2.2);
      halo.addColorStop(0, "rgba(255, 143, 179, 0.28)");
      halo.addColorStop(1, "rgba(255, 143, 179, 0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      const orb = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
      orb.addColorStop(0, "#ffe3ec");
      orb.addColorStop(0.45, "#f4a6c0");
      orb.addColorStop(1, "#8e3a5e");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.fillStyle = orb;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.12, 0, TAU);
      ctx.strokeStyle = "rgba(231, 183, 163, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const ex = cx + Math.cos(angle) * r * 0.08 * strength;
      const ey = cy + Math.sin(angle) * r * 0.08 * strength;
      ctx.fillStyle = "rgba(42, 20, 32, 0.92)";
      ctx.font = `600 ${Math.round(r * 0.78)}px "Dancing Script", cursive`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(developer.initials, ex, ey + r * 0.04);
    };

    const tick = () => {
      if (disposed) return;
      const fx = w * FACE.x;
      const fy = h * FACE.y;
      const dx = pointer.x - fx;
      const dy = pointer.y - fy;
      const dist = Math.hypot(dx, dy);
      const radius = Math.hypot(w, h) / 2;
      const inDeadzone = !pointer.active || dist < radius * DEADZONE;
      const target = Math.atan2(dy, dx);
      smoothed = lerpAngle(smoothed, target, LERP);

      if (ready && center) {
        let key: string;
        let img: HTMLImageElement;
        if (inDeadzone) {
          key = "c";
          img = center;
        } else {
          const n = frames.length;
          const norm = ((smoothed % TAU) + TAU) % TAU;
          const idx = Math.round((norm / TAU) * n) % n;
          key = String(idx);
          img = frames[idx];
        }
        if (key !== lastDrawn) {
          drawCover(img);
          lastDrawn = key;
        }
      } else {
        const strength = inDeadzone ? 0 : Math.min(1, dist / (radius * 0.6));
        drawPlaceholder(smoothed, strength);
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    const n = hero.frameCount;
    const pad = (i: number) => String(i).padStart(2, "0");
    Promise.all([
      loadImage(`${hero.framesPath}/center.webp`),
      ...Array.from({ length: n }, (_, i) => loadImage(`${hero.framesPath}/frame_${pad(i)}.webp`)),
    ])
      .then(([c, ...f]) => {
        if (disposed) return;
        center = c;
        frames = f;
        ready = true;
        lastDrawn = "";
        setHasFrames(true);
      })
      .catch(() => {
        /* frames not added yet: keep the placeholder */
      })
      .finally(() => {
        if (!disposed) progress.loaded();
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      progress.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`landing-section hero ${hasFrames ? "hero-has-frames" : ""}`}
      id="landingDiv"
      ref={sectionRef}
      style={{ backgroundColor: hero.backgroundColor }}
    >
      <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-copy">
        <p className="hero-greeting">{hero.greeting}</p>
        <h1 className="hero-name">{developer.name}</h1>
        <p className="hero-bio">{hero.bio}</p>
        <div className="hero-actions">
          <a className="hero-btn hero-btn-solid" href={hero.resume} target="_blank" rel="noopener noreferrer">
            Resume <MdArrowOutward />
          </a>
          <a className="hero-btn hero-btn-glass" href={`mailto:${config.contact.email}`}>
            Let's Talk
          </a>
        </div>
      </div>

      <div className="hero-role" aria-hidden="true">
        <span>{developer.title}</span>
        <span>{config.social.location}</span>
      </div>
    </div>
  );
};

export default CursorHero;
