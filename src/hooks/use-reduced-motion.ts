"use client";
import { useSyncExternalStore } from "react";
import { useMediaQuery } from "./use-media-query";
function subscribe(notify: () => void) {
  window.addEventListener("motion-preference", notify);
  return () => window.removeEventListener("motion-preference", notify);
}
export function useMotionPaused() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.motion === "paused",
    () => false,
  );
}
export function toggleMotion() {
  const root = document.documentElement;
  root.dataset.motion = root.dataset.motion === "paused" ? "running" : "paused";
  window.dispatchEvent(new Event("motion-preference"));
}
export function useReducedMotion() {
  const system = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const paused = useMotionPaused();
  return system || paused;
}
