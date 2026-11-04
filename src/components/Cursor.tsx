import { useEffect, useRef } from "react";
import "./styles/Cursor.css";

// Glowing dot that follows the pointer exactly, plus a trailing aura ring
// that eases behind it and grows over anything interactive.
const INTERACTIVE = "a, button, [data-cursor], .what-content, .techstack-item, .myworks-card";

const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const mouse = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      document.body.classList.add("cursor-visible");
    };
    const onOver = (e: Event) => {
      const t = e.target as Element | null;
      document.body.classList.toggle("cursor-hover", Boolean(t?.closest?.(INTERACTIVE)));
    };
    const onDown = () => document.body.classList.add("cursor-press");
    const onUp = () => document.body.classList.remove("cursor-press");
    const onLeave = () => document.body.classList.remove("cursor-visible");

    const loop = () => {
      trail.x += (mouse.x - trail.x) * 0.18;
      trail.y += (mouse.y - trail.y) * 0.18;
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span />
      </div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true">
        <span />
      </div>
    </>
  );
};

export default Cursor;
