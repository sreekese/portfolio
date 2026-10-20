"use client";
import { useEffect, useRef } from "react";
import {
  nextProjectIndex,
  safeExternalUrl,
  type Project,
} from "@/lib/portfolio";
import { ProjectArt } from "./project-art";
export function ProjectDialog({
  projects,
  index,
  onNavigate,
  onClose,
}: {
  projects: Project[];
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog.showModal();
    document.documentElement.classList.add("lock");
    return () => {
      dialog.close();
      document.documentElement.classList.remove("lock");
      trigger?.focus();
    };
  }, []);
  const project = projects[index];
  if (!project) return null;
  const projectUrl = safeExternalUrl(project.url);
  const step = (direction: number) =>
    onNavigate(nextProjectIndex(index, direction, projects.length));
  return (
    <dialog
      ref={ref}
      aria-labelledby="project-title"
      onCancel={() => closeRef.current()}
      onClose={() => closeRef.current()}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            "button:not(:disabled), a[href]",
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          step(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="dlg-top">
        <span className="mono mute" aria-live="polite">
          Project {index + 1} of {projects.length}
        </span>
        <div className="dlg-nav">
          <button
            className="icon-btn"
            aria-label="Previous project"
            onClick={() => step(-1)}
            disabled={projects.length < 2}
          >
            ←
          </button>
          <button
            className="icon-btn"
            aria-label="Next project"
            onClick={() => step(1)}
            disabled={projects.length < 2}
          >
            →
          </button>
          <button
            className="icon-btn"
            aria-label="Close project"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
      <div className="dlg-body">
        <ProjectArt project={project} />
        <div className="dlg-text">
          <span className="mono mute">
            {project.no} / {project.year}
          </span>
          <h3 id="project-title">{project.title}</h3>
          <p>{project.brief}</p>
          <dl className="facts">
            {project.facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {projectUrl && (
            <a
              className="btn project-demo"
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View live project ↗
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
}
