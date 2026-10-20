"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechState = "idle" | "starting" | "speaking" | "unavailable" | "error";

export function useSpokenIntro(text: string) {
  const [state, setState] = useState<SpeechState>("idle");
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispose = useCallback(() => {
    if (startTimer.current) clearTimeout(startTimer.current);
    startTimer.current = null;
    const current = utterance.current;
    utterance.current = null;
    if (current) {
      current.onstart = null;
      current.onend = null;
      current.onerror = null;
      window.speechSynthesis.cancel();
    }
  }, []);

  const stop = useCallback(() => {
    dispose();
    setState("idle");
  }, [dispose]);

  useEffect(() => {
    const onHide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      dispose();
    };
  }, [dispose, stop]);

  function toggle() {
    if (utterance.current) {
      stop();
      return;
    }
    if (
      !("speechSynthesis" in window) ||
      typeof window.SpeechSynthesisUtterance !== "function"
    ) {
      setState("unavailable");
      return;
    }
    try {
      const synth = window.speechSynthesis;
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-IN";
      speech.rate = 0.95;
      speech.pitch = 1;
      const voices = synth.getVoices();
      const voice =
        voices.find((v) => v.lang === "en-IN" && v.localService) ??
        voices.find((v) => v.lang.startsWith("en") && v.localService) ??
        voices.find((v) => v.lang.startsWith("en"));
      if (voice) {
        speech.voice = voice;
        speech.lang = voice.lang;
      }
      utterance.current = speech;
      setState("starting");
      speech.onstart = () => {
        if (utterance.current !== speech) return;
        if (startTimer.current) clearTimeout(startTimer.current);
        startTimer.current = null;
        setState("speaking");
      };
      speech.onend = () => {
        if (utterance.current === speech) {
          dispose();
          setState("idle");
        }
      };
      speech.onerror = () => {
        if (utterance.current === speech) {
          dispose();
          setState("error");
        }
      };
      startTimer.current = setTimeout(() => {
        if (utterance.current === speech) {
          dispose();
          setState("error");
        }
      }, 10000);
      synth.speak(speech);
    } catch {
      dispose();
      setState("error");
    }
  }

  return {
    state,
    active: state === "starting" || state === "speaking",
    toggle,
    stop,
  };
}
