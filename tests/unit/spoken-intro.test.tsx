import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSpokenIntro } from "@/hooks/use-spoken-intro";

class FakeUtterance {
  constructor(public text: string) {}
  lang = "";
  rate = 1;
  pitch = 1;
  voice = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
}
let current: FakeUtterance;
const cancel = vi.fn();
const speak = vi.fn((utterance: FakeUtterance) => {
  current = utterance;
});
beforeEach(() => {
  vi.useFakeTimers();
  cancel.mockClear();
  speak.mockClear();
  vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
  vi.stubGlobal("speechSynthesis", {
    speak,
    cancel,
    getVoices: () => [{ lang: "en-IN", localService: true }],
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("spoken introduction", () => {
  it("does not autoplay; starts from a click and stops on the next click", () => {
    const { result } = renderHook(() => useSpokenIntro("Hi, I’m Sreekese."));
    expect(speak).not.toHaveBeenCalled();
    act(() => result.current.toggle());
    expect(current.text).toBe("Hi, I’m Sreekese.");
    expect(current.lang).toBe("en-IN");
    expect(result.current.state).toBe("starting");
    act(() => current.onstart?.());
    expect(result.current.state).toBe("speaking");
    act(() => result.current.toggle());
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(result.current.active).toBe(false);
  });
  it("resets on completion and permits replay", () => {
    const { result } = renderHook(() => useSpokenIntro("Intro"));
    act(() => result.current.toggle());
    act(() => current.onstart?.());
    act(() => current.onend?.());
    expect(result.current.state).toBe("idle");
    act(() => result.current.toggle());
    expect(speak).toHaveBeenCalledTimes(2);
  });
  it("offers a fallback when speech is unavailable", () => {
    vi.stubGlobal("SpeechSynthesisUtterance", undefined);
    const { result } = renderHook(() => useSpokenIntro("Intro"));
    act(() => result.current.toggle());
    expect(result.current.state).toBe("unavailable");
    expect(speak).not.toHaveBeenCalled();
  });
  it("handles voice errors without leaving an active animation", () => {
    const { result } = renderHook(() => useSpokenIntro("Intro"));
    act(() => result.current.toggle());
    act(() => current.onerror?.());
    expect(result.current.state).toBe("error");
    expect(result.current.active).toBe(false);
  });
  it("times out if the platform never starts speech", () => {
    const { result } = renderHook(() => useSpokenIntro("Intro"));
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(10000));
    expect(result.current.state).toBe("error");
    expect(cancel).toHaveBeenCalled();
  });
  it("does not cancel speech after it has started when the startup deadline passes", () => {
    const { result } = renderHook(() => useSpokenIntro("Intro"));
    act(() => result.current.toggle());
    act(() => current.onstart?.());
    act(() => vi.advanceTimersByTime(10000));
    expect(result.current.state).toBe("speaking");
    expect(cancel).not.toHaveBeenCalled();
  });
  it("cancels owned speech and removes callbacks on unmount", () => {
    const { result, unmount } = renderHook(() => useSpokenIntro("Intro"));
    act(() => result.current.toggle());
    unmount();
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(current.onend).toBeNull();
    expect(current.onstart).toBeNull();
  });
  it("stops when the tab becomes hidden", () => {
    const { result } = renderHook(() => useSpokenIntro("Intro"));
    act(() => result.current.toggle());
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current.active).toBe(false);
    expect(cancel).toHaveBeenCalled();
  });
});
