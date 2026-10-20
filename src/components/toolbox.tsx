"use client";
import { useEffect, useRef, type PointerEvent } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { clamp } from "@/lib/portfolio";
type Motion = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  px: number;
  py: number;
  moved: number;
  dragging: boolean;
  frame: number;
  suppressClick: boolean;
};
function SkillChip({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const motion = useRef<Motion>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    px: 0,
    py: 0,
    moved: 0,
    dragging: false,
    frame: 0,
    suppressClick: false,
  });
  useEffect(() => {
    const state = motion.current;
    function reset() {
      cancelAnimationFrame(state.frame);
      state.x = 0;
      state.y = 0;
      state.dragging = false;
      if (ref.current) ref.current.style.transform = "";
    }
    if (reduced) reset();
    window.addEventListener("resize", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      cancelAnimationFrame(state.frame);
      window.removeEventListener("resize", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, [reduced]);
  function move(dx: number, dy: number) {
    const el = ref.current,
      state = motion.current;
    if (!el || !el.parentElement) return;
    const parent = el.parentElement.getBoundingClientRect(),
      box = el.getBoundingClientRect();
    state.x = clamp(
      state.x + dx,
      parent.left - (box.left - state.x),
      parent.right - (box.right - state.x),
    );
    state.y = clamp(
      state.y + dy,
      parent.top - (box.top - state.y),
      parent.bottom - (box.bottom - state.y),
    );
    el.style.transform = `translate(${state.x}px, ${state.y}px)`;
  }
  function release(event: PointerEvent<HTMLButtonElement>) {
    const state = motion.current;
    if (!state.dragging) return;
    state.dragging = false;
    state.suppressClick = state.moved >= 6 || event.type === "pointercancel";
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (reduced || event.type === "pointercancel") return;
    function glide() {
      state.vx *= 0.88;
      state.vy *= 0.88;
      move(state.vx, state.vy);
      if (Math.abs(state.vx) + Math.abs(state.vy) > 0.2)
        state.frame = requestAnimationFrame(glide);
    }
    state.frame = requestAnimationFrame(glide);
  }
  return (
    <button
      ref={ref}
      type="button"
      className={`chip ${selected ? "on" : ""}`}
      aria-pressed={selected}
      onClick={(event) => {
        if (event.detail === 0 || !motion.current.suppressClick) onSelect();
        motion.current.suppressClick = false;
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        const state = motion.current;
        cancelAnimationFrame(state.frame);
        Object.assign(state, {
          dragging: true,
          moved: 0,
          vx: 0,
          vy: 0,
          px: event.clientX,
          py: event.clientY,
          suppressClick: false,
        });
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const state = motion.current;
        if (!state.dragging) return;
        const dx = event.clientX - state.px,
          dy = event.clientY - state.py;
        state.moved += Math.abs(dx) + Math.abs(dy);
        state.px = event.clientX;
        state.py = event.clientY;
        state.vx = dx;
        state.vy = dy;
        move(dx, dy);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      {label}
    </button>
  );
}
export function Toolbox({
  skills,
  filter,
  count,
  onFilter,
}: {
  skills: string[];
  filter: string;
  count: number;
  onFilter: (filter: string) => void;
}) {
  return (
    <aside className="toolbox" aria-label="Interactive project explorer">
      <div className="tb-head mono">
        <span>Explore projects</span>
        <span>Drag, throw or click to filter</span>
      </div>
      <div className="tb-field">
        {skills.map((skill) => (
          <SkillChip
            key={skill}
            label={skill}
            selected={filter === skill}
            onSelect={() => onFilter(filter === skill ? "All" : skill)}
          />
        ))}
      </div>
      <div className="tb-foot">
        <span className="mono mute" role="status">
          {filter === "All"
            ? "Showing all projects"
            : `${filter}: ${count} project${count === 1 ? "" : "s"}`}
        </span>
        {filter !== "All" && <a href="#work">View work ↓</a>}
      </div>
    </aside>
  );
}
