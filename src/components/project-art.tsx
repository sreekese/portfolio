import type { Project } from "@/lib/portfolio";
export function ProjectArt({ project }: { project: Project }) {
  const seed = Number(project.no);
  return (
    <svg
      className="art"
      viewBox="0 0 320 200"
      role="img"
      aria-label={`Abstract drawing for ${project.title}`}
    >
      {project.kind === "bars" && (
        <>
          {Array.from({ length: 20 }, (_, n) => {
            const height = 25 + ((n * 37 + seed * 17) % 105);
            return (
              <rect
                key={n}
                x={28 + n * 13.6}
                y={160 - height}
                width="8"
                height={height}
                rx="1"
                className={n === 14 ? "ac" : "sf"}
              />
            );
          })}
          <path d="M28 75 Q70 32 110 70 T200 65 T294 58" className="acs" />
          <path d="M20 162H300" className="s" />
        </>
      )}
      {project.kind === "nodes" && (
        <>
          {Array.from({ length: 11 }, (_, n) => {
            const x = 34 + ((n * 61) % 252),
              y = 24 + ((n * 43) % 130);
            return (
              <g key={n}>
                <path
                  d={`M${x} ${y} L${34 + (((n + 1) * 61) % 252)} ${24 + (((n + 1) * 43) % 130)} L160 100`}
                  className="s"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={n === 4 ? 8 : 4}
                  className={n === 4 ? "ac" : "sf"}
                />
              </g>
            );
          })}
        </>
      )}
      {project.kind === "rings" &&
        Array.from({ length: 9 }, (_, n) => (
          <circle
            key={n}
            cx={110 + n * 8}
            cy="100"
            r={14 + n * 9}
            className={n === 6 ? "acs" : "s"}
          />
        ))}
      {project.kind === "contour" &&
        Array.from({ length: 11 }, (_, n) => (
          <path
            key={n}
            d={Array.from(
              { length: 41 },
              (_, i) =>
                `${i ? "L" : "M"}${i * 8} ${(22 + n * 14 + Math.sin((i * 8) / 38 + n * 0.5) * 13).toFixed(2)}`,
            ).join(" ")}
            className={n === 6 ? "acs" : "s"}
          />
        ))}
      {project.kind === "grid" &&
        Array.from({ length: 144 }, (_, n) => {
          const x = n % 16,
            y = Math.floor(n / 16),
            hot = Math.hypot(x - 10, y - 4) < 3.2;
          return (
            <circle
              key={n}
              cx={28 + x * 17.6}
              cy={22 + y * 17}
              r={hot ? 4.6 : 2}
              className={hot ? "ac" : "sf"}
            />
          );
        })}
      {project.kind === "dial" && (
        <>
          <circle cx="160" cy="100" r="76" className="s" />
          {Array.from({ length: 60 }, (_, n) => {
            const a = (n / 60) * Math.PI * 2,
              length = n % 5 ? 5 : 11;
            return (
              <line
                key={n}
                x1={(160 + Math.cos(a) * 70).toFixed(2)}
                y1={(100 + Math.sin(a) * 70).toFixed(2)}
                x2={(160 + Math.cos(a) * (70 - length)).toFixed(2)}
                y2={(100 + Math.sin(a) * (70 - length)).toFixed(2)}
                className="s"
              />
            );
          })}
          <path d="M160 100L186 55" className="acs" />
          <circle cx="160" cy="100" r="5" className="ac" />
        </>
      )}
      <text x="22" y="184" className="lb">
        {project.no} / {project.title.toUpperCase()}
      </text>
    </svg>
  );
}
