"use client";

import { useEffect, useRef, useState } from "react";
import { SpeakingCharacter } from "@/components/speaking-character";

type Props = { speaking: boolean; reduced: boolean };
export function AvatarStudio({ speaking, reduced }: Props) {
  const host = useRef<HTMLSpanElement>(null);
  const controls = useRef({ speaking, reduced });
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    controls.current = { speaking, reduced };
  }, [speaking, reduced]);
  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    async function start() {
      const [T, { createAvatarStudio }] = await Promise.all([
        import("three"),
        import("@/lib/avatar/model"),
      ]);
      if (cancelled || !host.current) return;
      const element = host.current;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try {
        renderer = new T.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        });
      } catch {
        setStatus("fallback");
        return;
      }
      const { scene, pose } = createAvatarStudio();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.domElement.setAttribute("aria-hidden", "true");
      element.appendChild(renderer.domElement);
      const camera = new T.PerspectiveCamera(36, 1, 0.1, 30);
      camera.position.set(3.5, 2.9, 6.8);
      camera.lookAt(0, 1, 0);
      let visible = true;
      let elapsed = 0;
      let last = 0;
      let lastRender = 0;
      let dirty = true;
      let lastSpeaking = false;
      let lastReduced = false;
      function resize() {
        const { width, height } = element.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        dirty = true;
      }
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(element);
      resize();
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        dirty = true;
      });
      intersection.observe(element);
      const onLost = (event: Event) => {
        event.preventDefault();
        renderer.setAnimationLoop(null);
        setStatus("fallback");
      };
      renderer.domElement.addEventListener("webglcontextlost", onLost);
      renderer.setAnimationLoop((now: number) => {
        const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
        last = now;
        if (!visible || document.hidden) return;
        const state = controls.current;
        if (!state.reduced) elapsed += dt;
        if (
          state.reduced &&
          !dirty &&
          lastSpeaking === state.speaking &&
          lastReduced === state.reduced
        )
          return;
        if (!dirty && !state.reduced && now - lastRender < 1000 / 30) return;
        lastRender = now;
        pose(elapsed, state.speaking, state.reduced);
        renderer.render(scene, camera);
        dirty = false;
        lastSpeaking = state.speaking;
        lastReduced = state.reduced;
      });
      setStatus("ready");
      dispose = () => {
        renderer.setAnimationLoop(null);
        resizeObserver.disconnect();
        intersection.disconnect();
        renderer.domElement.removeEventListener("webglcontextlost", onLost);
        const materials = new Set<InstanceType<typeof T.Material>>();
        scene.traverse((object) => {
          if (object instanceof T.Mesh) {
            object.geometry.dispose();
            const list = Array.isArray(object.material)
              ? object.material
              : [object.material];
            list.forEach((m) => materials.add(m));
          }
          if (object instanceof T.DirectionalLight) object.shadow.dispose();
        });
        materials.forEach((m) => m.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    }
    void start().catch(() => {
      if (!cancelled) setStatus("fallback");
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);
  return (
    <span
      className="avatar-studio"
      data-status={status}
      data-motion={reduced ? "paused" : speaking ? "talking" : "walking"}
    >
      <span ref={host} className="avatar-canvas" />
      {status !== "ready" && (
        <span className="studio-fallback">
          <SpeakingCharacter />
          <span className="studio-loading">
            {status === "loading"
              ? "Preparing my studio…"
              : "3D unavailable · tap to hear my intro"}
          </span>
        </span>
      )}
    </span>
  );
}
