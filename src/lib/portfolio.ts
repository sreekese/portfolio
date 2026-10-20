import data from "@/data/portfolio.json";
export type Project = (typeof data.projects)[number];
export type Filter = "All" | (typeof data.skills)[number];
export const portfolio = data;
export function filterProjects(
  projects: readonly Project[],
  filter: Filter,
): Project[] {
  return projects.filter(
    (project) => filter === "All" || project.tags.includes(filter),
  );
}
export function nextProjectIndex(
  current: number,
  direction: number,
  count: number,
): number {
  return count <= 0 ? -1 : (((current + direction) % count) + count) % count;
}
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, Math.max(min, max)));
}
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => [...word][0])
    .join("")
    .toUpperCase();
}
export function safeExternalUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
