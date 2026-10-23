import { describe, expect, it } from "vitest";
import {
  clamp,
  filterProjects,
  initials,
  nextProjectIndex,
  portfolio,
  safeExternalUrl,
} from "@/lib/portfolio";
import { contentSecurityPolicy } from "@/lib/security";
describe("portfolio domain rules", () => {
  it("preserves all projects and their order without mutating the input", () => {
    const original = JSON.stringify(portfolio.projects);
    expect(filterProjects(portfolio.projects, "All")).toHaveLength(4);
    expect(
      filterProjects(portfolio.projects, "React.js").map((p) => p.title),
    ).toEqual(["Netflix Clone", "Offer Application", "Youtube Clone"]);
    expect(JSON.stringify(portfolio.projects)).toBe(original);
  });
  it.each([
    ["React.js", 3],
    ["Movies", 2],
    ["Booking", 1],
    ["Offers", 1],
    ["Video", 1],
    ["Unknown", 0],
  ])("filters %s accurately", (filter, count) => {
    expect(filterProjects(portfolio.projects, filter)).toHaveLength(count);
  });
  it("handles empty lists and navigation wraparound", () => {
    expect(filterProjects([], "All")).toEqual([]);
    expect(nextProjectIndex(0, -1, 3)).toBe(2);
    expect(nextProjectIndex(2, 1, 3)).toBe(0);
    expect(nextProjectIndex(0, 1, 1)).toBe(0);
    expect(nextProjectIndex(0, 1, 0)).toBe(-1);
  });
  it("bounds dragging even when a chip exceeds its container", () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(100, 0, 10)).toBe(10);
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(0, 0, -10)).toBe(0);
  });
  it("creates initials with whitespace and empty names", () => {
    expect(initials(" Sreekese   P S ")).toBe("SPS");
    expect(initials("")).toBe("");
  });
  it("validates unique ids, known tags and complete project content", () => {
    expect(new Set(portfolio.projects.map((p) => p.no)).size).toBe(
      portfolio.projects.length,
    );
    for (const project of portfolio.projects) {
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.facts).toHaveLength(3);
      for (const tag of project.tags) expect(portfolio.skills).toContain(tag);
    }
  });
  it.each([
    "javascript:alert(1)",
    "data:text/html,hello",
    "http://example.com",
    "https://user:password@example.com",
    "/relative",
    "nonsense",
  ])("rejects unsafe external URL %s", (url) =>
    expect(safeExternalUrl(url)).toBeNull(),
  );
  it("allows HTTPS links", () =>
    expect(safeExternalUrl("https://github.com/sreekese")).toBe(
      "https://github.com/sreekese",
    ));
});
describe("Content Security Policy", () => {
  it("restricts production scripts, framing and plugins", () => {
    const csp = contentSecurityPolicy("request-nonce");
    expect(csp).toContain("'nonce-request-nonce'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("unsafe-eval");
    expect(
      csp.split("; ").find((line) => line.startsWith("script-src")),
    ).not.toContain("unsafe-inline");
    expect(csp).toContain("upgrade-insecure-requests");
  });
  it("permits development HMR only in development", () => {
    const csp = contentSecurityPolicy("dev", true);
    expect(csp).toContain("unsafe-eval");
    expect(csp).toContain("ws:");
    expect(csp).not.toContain("upgrade-insecure-requests");
  });
});
