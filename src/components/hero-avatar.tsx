"use client";

import { AvatarStudio } from "@/components/avatar-studio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSpokenIntro } from "@/hooks/use-spoken-intro";
import { portfolio } from "@/lib/portfolio";

export function HeroAvatar() {
  const reduced = useReducedMotion();
  const speech = useSpokenIntro(portfolio.spokenIntro);

  function introduce() {
    speech.toggle();
  }

  return (
    <div
      className="hero-avatar hero-studio"
      data-reduced-motion={reduced}
      data-speaking={speech.state === "speaking"}
    >
      <span className="avatar-orbit" aria-hidden="true" />
      <span className="avatar-code mono" aria-hidden="true">
        &lt;/&gt;
      </span>
      <button
        type="button"
        className="avatar-button"
        aria-label={
          speech.active ? "Stop introduction" : "Hear Sreekese’s introduction"
        }
        aria-pressed={speech.active}
        aria-describedby="avatar-hint"
        data-greeting={speech.active}
        onClick={introduce}
      >
        <AvatarStudio
          speaking={speech.state === "speaking"}
          reduced={reduced}
        />
      </button>
      <p className="avatar-caption mono" id="avatar-hint">
        Meet the person behind the code.
        <span>
          {speech.active
            ? "Click again to stop"
            : "Click or tap to hear my introduction"}
        </span>
      </p>
      <div className="speech-controls">
        <button type="button" className="speech-toggle" onClick={introduce}>
          {speech.active ? "Stop audio" : "Play introduction"}
          <span className="speech-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
        <p className="speech-status" role="status">
          {speech.state === "starting"
            ? "Preparing voice…"
            : speech.state === "speaking"
              ? "Speaking · browser voice"
              : speech.state === "unavailable"
                ? "Voice playback isn’t supported in this browser. Try Chrome or Edge."
                : speech.state === "error"
                  ? "Voice playback couldn’t start. Tap Play introduction to retry."
                  : "Browser voice · plays only when you choose"}
        </p>
      </div>
    </div>
  );
}
