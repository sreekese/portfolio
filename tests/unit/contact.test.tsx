import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Contact } from "@/components/contact";
describe("contact", () => {
  it("copies the configured address and keeps mailto available", async () => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<Contact email="hello@example.com" />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Copy address" }));
    expect(copy).toHaveBeenCalledWith("hello@example.com");
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
  });
  it("explains clipboard rejection without falsely claiming success", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("Denied"),
    );
    render(<Contact email="hello@example.com" />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("status")).toHaveTextContent("Copy unavailable");
  });
  it("clears feedback after the timeout", async () => {
    vi.useFakeTimers();
    try {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
      });
      render(<Contact email="hello@example.com" />);
      await act(async () => {
        fireEvent.click(screen.getByRole("button"));
      });
      expect(screen.getByRole("status")).toHaveTextContent("Copied");
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.getByRole("status")).toBeEmptyDOMElement();
    } finally {
      vi.useRealTimers();
    }
  });
  it("ignores duplicate requests and a completion after unmount", async () => {
    let resolve!: () => void;
    const copy = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: copy },
    });
    const { unmount } = render(<Contact email="hello@example.com" />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    expect(copy).toHaveBeenCalledTimes(1);
    unmount();
    await act(async () => resolve());
  });
});
