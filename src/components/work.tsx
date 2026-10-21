"use client";
import { useState } from "react";
import { filterProjects, type Project } from "@/lib/portfolio";
import { Toolbox } from "./toolbox";
import { ProjectArt } from "./project-art";
import { ProjectDialog } from "./project-dialog";
export function Work({
  projects,
  skills,
  children,
}: {
  projects: Project[];
  skills: string[];
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const visible = filterProjects(projects, filter);
  function changeFilter(value: string) {
    setSelected(null);
    setFilter(value);
  }
  return (
    <>
      <div className="wrap hero-grid">
        {children}
        <Toolbox
          skills={skills}
          filter={filter}
          count={visible.length}
          onFilter={changeFilter}
        />
      </div>
      <section className="sec" id="work">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow mono">Selected work</span>
              <h2 className="h2">
                Projects built to be <em>used</em>, not just looked at.
              </h2>
            </div>
          </div>
          <div
            className="filters"
            role="group"
            aria-label="Filter projects by category"
          >
            {["All", ...skills].map((skill) => (
              <button
                key={skill}
                className="f"
                aria-pressed={filter === skill}
                onClick={() => changeFilter(skill)}
              >
                {skill}
              </button>
            ))}
            <span className="count mono" role="status">
              {visible.length} of {projects.length}
            </span>
          </div>
          <div className="grid">
            {visible.map((project, index) => (
              <article
                key={project.no}
                className="card"
                onMouseEnter={() => setHovered(project.no)}
                onMouseLeave={() => setHovered(null)}
              >
                <ProjectArt
                  project={project}
                  hovered={hovered === project.no}
                />
                <div className="card-body">
                  <span className="no mono">
                    {project.no} / {project.year}
                  </span>
                  <h3>
                    <button
                      className="project-open"
                      onClick={() => setSelected(index)}
                      aria-label={`Open ${project.title}`}
                    >
                      {project.title}
                    </button>
                  </h3>
                  <span className="go" aria-hidden="true">
                    ↗
                  </span>
                  <p>{project.brief}</p>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <a
                    className="project-website"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.title} website (opens in a new tab)`}
                  >
                    Visit website <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          {visible.length === 0 && (
            <p role="status">
              No projects match this category.{" "}
              <button className="f" onClick={() => changeFilter("All")}>
                Show all projects
              </button>
            </p>
          )}
        </div>
      </section>
      {selected !== null && visible[selected] && (
        <ProjectDialog
          projects={visible}
          index={selected}
          onNavigate={setSelected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
