"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { clamp } from "@/lib/portfolio";
export function Motion() {
  const bar = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const height = document.documentElement.scrollHeight - innerHeight;
      if (bar.current)
        bar.current.style.transform = `scaleX(${height > 0 ? clamp(scrollY / height, 0, 1) : 0})`;
      document
        .querySelectorAll<HTMLElement>(".job")
        .forEach((job) =>
          job.classList.toggle(
            "on",
            job.getBoundingClientRect().top < innerHeight * 0.8,
          ),
        );
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  useEffect(() => {
    if (reduced) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            animations.push(
              entry.target.animate(
                [
                  { transform: "translateY(20px)", opacity: 0.35 },
                  { transform: "translateY(0)", opacity: 1 },
                ],
                { duration: 650, easing: "ease-out" },
              ),
            );
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".svc, .stat, .statement")
      .forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [reduced]);
  return <div ref={bar} className="progress" aria-hidden="true" />;
}
export function HeroName({ name }: { name: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  return (
    <h1
      ref={ref}
      className="name"
      aria-label={name}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        ref.current?.querySelectorAll<HTMLElement>(".ch").forEach((letter) => {
          const rect = letter.getBoundingClientRect(),
            strength = clamp(
              1 -
                Math.hypot(
                  event.clientX - rect.left - rect.width / 2,
                  event.clientY - rect.top - rect.height / 2,
                ) /
                  180,
              0,
              1,
            );
          letter.style.transform = `translateY(${-strength * 7}%)`;
          letter.style.setProperty("--p", String(strength));
        });
      }}
      onPointerLeave={() =>
        ref.current?.querySelectorAll<HTMLElement>(".ch").forEach((letter) => {
          letter.style.transform = "";
          letter.style.setProperty("--p", "0");
        })
      }
    >
      {name.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} className="ln" aria-hidden="true">
          {[...word].map((letter, i) => (
            <span key={i} className="ch">
              {letter}
            </span>
          ))}{" "}
        </span>
      ))}
    </h1>
  );
}
