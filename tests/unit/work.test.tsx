import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Work } from "@/components/work";
import { portfolio } from "@/lib/portfolio";
function setup(skills = portfolio.skills) {
  return render(
    <Work projects={portfolio.projects} skills={skills}>
      <p>Introduction</p>
    </Work>,
  );
}
describe("project discovery", () => {
  it("renders all cards and synchronizes both filter controls", async () => {
    const user = userEvent.setup();
    setup();
    expect(screen.getAllByRole("article")).toHaveLength(3);
    const filters = screen.getByRole("group", {
      name: "Filter projects by category",
    });
    await user.click(within(filters).getByRole("button", { name: "React.js" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(
      screen
        .getAllByRole("button", { name: "React.js" })
        .every((button) => button.getAttribute("aria-pressed") === "true"),
    ).toBe(true);
    const toolbox = screen.getByRole("complementary");
    await user.click(within(toolbox).getByRole("button", { name: "React.js" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });
  it("supports keyboard filtering and an empty-result recovery", async () => {
    const user = userEvent.setup();
    setup([...portfolio.skills, "Unknown"]);
    const button = within(screen.getByRole("complementary")).getByRole(
      "button",
      { name: "Unknown" },
    );
    button.focus();
    await user.keyboard("{Enter}");
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "Show all projects" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });
  it("navigates only filtered projects, wraps and restores focus on close", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(
      within(screen.getByRole("group")).getByRole("button", {
        name: "React.js",
      }),
    );
    const trigger = screen.getByRole("button", { name: "Open Netflix Clone" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading")).toHaveTextContent(
      "Netflix Clone",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Previous project" }),
    );
    expect(within(dialog).getByRole("heading")).toHaveTextContent(
      "Youtube Clone",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Next project" }),
    );
    expect(within(dialog).getByRole("heading")).toHaveTextContent(
      "Netflix Clone",
    );
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(within(dialog).getByRole("heading")).toHaveTextContent(
      "Offer Application",
    );
    fireEvent.keyDown(dialog, { key: "ArrowLeft" });
    expect(within(dialog).getByRole("heading")).toHaveTextContent(
      "Netflix Clone",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Close project" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.documentElement).not.toHaveClass("lock");
  });
  it("disables navigation for a single project and handles native Escape cancellation", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(
      within(screen.getByRole("group")).getByRole("button", { name: "Offers" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Open Offer Application" }),
    );
    expect(screen.getByRole("button", { name: "Next project" })).toBeDisabled();
    fireEvent(
      screen.getByRole("dialog"),
      new Event("cancel", { bubbles: true }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("closes on backdrop but not on dialog content clicks", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(
      screen.getByRole("button", { name: "Open Netflix Clone" }),
    );
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("heading"));
    expect(dialog).toBeInTheDocument();
    fireEvent.click(dialog, { clientX: -10, clientY: -10 });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("renders malicious text as text", () => {
    render(
      <Work
        projects={[
          { ...portfolio.projects[0], title: "<img src=x onerror=alert(1)>" },
        ]}
        skills={[]}
      >
        <p>Intro</p>
      </Work>,
    );
    expect(
      screen.getByRole("heading", { name: "<img src=x onerror=alert(1)>" }),
    ).toBeInTheDocument();
    expect(document.querySelector("img[onerror]")).toBeNull();
  });
});

it("wraps forward and backward keyboard focus inside the dialog", async () => {
  const user = userEvent.setup();
  setup();
  await user.click(screen.getByRole("button", { name: "Open Netflix Clone" }));
  const dialog = screen.getByRole("dialog");
  const first = within(dialog).getByRole("button", {
    name: "Previous project",
  });
  const last = within(dialog).getByRole("link", {
    name: "View live project ↗",
  });
  last.focus();
  await user.tab();
  expect(first).toHaveFocus();
  await user.tab({ shift: true });
  expect(last).toHaveFocus();
});
