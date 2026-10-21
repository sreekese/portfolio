"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ProjectArt({
  project,
  hovered = false,
}: {
  project: Project;
  hovered?: boolean;
}) {
  const assetName = project.no === "01" ? "01-v2" : project.no;
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const playing = (active || hovered) && !reduced;
  return (
    <div
      className="art project-preview"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
      role="img"
      aria-label={`${project.title} website preview${reduced ? "" : "; hover or focus to animate"}`}
      data-playing={playing}
    >
      <Image
        src={`/projects/${assetName}.png`}
        alt={`${project.title} website screenshot`}
        width={1280}
        height={800}
        sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
      />
      {playing && (
        <Image
          className="project-preview-animation"
          src={`/projects/${assetName}.gif`}
          alt=""
          width={640}
          height={400}
          unoptimized
        />
      )}
      <span className="project-preview-label" aria-hidden="true">
        {playing
          ? "Recorded site preview"
          : reduced
            ? "Website preview"
            : "Hover to preview"}
      </span>
    </div>
  );
}
