"use client";

import { useEffect, useRef } from "react";

const DOTS = 3;

export function OrbitCursorTrail() {
  const areaRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const area = areaRef.current;
    if (!area || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(pointer: coarse)").matches) return;

    const positions = Array.from({ length: DOTS }, () => ({ x: -30, y: -30 }));
    let target = { x: -30, y: -30 };
    let active = false;
    let frame = 0;

    const render = () => {
      positions.forEach((position, index) => {
        const source = index === 0 ? target : positions[index - 1];
        const ease = index === 0 ? 0.18 : 0.12;
        position.x += (source.x - position.x) * ease;
        position.y += (source.y - position.y) * ease;
        const dot = dotRefs.current[index];
        if (dot) {
          dot.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
          dot.style.opacity = active ? String(0.48 - index * 0.14) : "0";
        }
      });
      frame = requestAnimationFrame(render);
    };

    const move = (event: PointerEvent) => {
      const bounds = area.getBoundingClientRect();
      target = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      active = true;
    };
    const leave = () => { active = false; };

    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={areaRef} className="orbit-cursor-trail" aria-hidden="true">
      {Array.from({ length: DOTS }, (_, index) => (
        <span key={index} ref={(element) => { dotRefs.current[index] = element; }} className={`orbit-cursor-dot orbit-cursor-dot-${index + 1}`} />
      ))}
    </div>
  );
}
