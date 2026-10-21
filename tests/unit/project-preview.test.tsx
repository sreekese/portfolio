import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectArt } from "@/components/project-art";
import { portfolio } from "@/lib/portfolio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
vi.mock("@/hooks/use-reduced-motion", () => ({ useReducedMotion: vi.fn() }));
beforeEach(() => vi.mocked(useReducedMotion).mockReturnValue(false));
describe("project previews", () => {
  it("loads animation only on hover and removes it when leaving", () => {
    const { container } = render(
      <ProjectArt project={portfolio.projects[0]} />,
    );
    const preview = screen.getByRole("img", { name: /website preview/ });
    expect(container.querySelector('img[src*=".gif"]')).toBeNull();
    fireEvent.mouseEnter(preview);
    expect(container.querySelector('img[src*=".gif"]')).not.toBeNull();
    fireEvent.mouseLeave(preview);
    expect(container.querySelector('img[src*=".gif"]')).toBeNull();
  });
  it("plays on keyboard focus", () => {
    render(<ProjectArt project={portfolio.projects[0]} />);
    const preview = screen.getByRole("img", { name: /website preview/ });
    fireEvent.focus(preview);
    expect(preview).toHaveAttribute("data-playing", "true");
    fireEvent.blur(preview);
    expect(preview).toHaveAttribute("data-playing", "false");
  });
  it("keeps a still image under reduced motion even when the card is hovered", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(
      <ProjectArt project={portfolio.projects[0]} hovered />,
    );
    expect(container.querySelector('img[src*=".gif"]')).toBeNull();
  });
});
