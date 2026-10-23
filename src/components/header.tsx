"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { initials } from "@/lib/portfolio";
function storedTheme(): string | null {
  try {
    return localStorage.getItem("portfolio-theme");
  } catch {
    return null;
  }
}
function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener("theme-change", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("theme-change", notify);
  };
}
export function Header({ name }: { name: string }) {
  const preferredDark = useMediaQuery("(prefers-color-scheme: dark)");
  const stored = useSyncExternalStore(subscribe, storedTheme, () => null);
  const [override, setOverride] = useState<string | null>(null);
  const [active, setActive] = useState("");
  const theme = override ?? stored;
  const dark = theme === "dark" || (theme !== "light" && preferredDark);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  function toggle() {
    const next = dark ? "light" : "dark";
    setOverride(next);
    try {
      localStorage.setItem("portfolio-theme", next);
      window.dispatchEvent(new Event("theme-change"));
    } catch {
      /* Theme still works without browser storage. */
    }
  }
  return (
    <header className="top">
      <div className="wrap">
        <a className="brand" href="#top">
          <span className="mk">{initials(name)}</span>
          <span>{name}</span>
        </a>
        <nav className="menu" aria-label="Main navigation">
          {["Work", "About", "Experience", "Contact"].map((label) => (
            <a
              key={label}
              className={`l ${label === "Contact" ? "keep" : ""} ${active === label.toLowerCase() ? "on" : ""}`}
              href={`#${label.toLowerCase()}`}
              aria-current={
                active === label.toLowerCase() ? "location" : undefined
              }
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            className="icon-btn"
            onClick={toggle}
            aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
          >
            <i aria-hidden="true" />
          </button>
        </nav>
      </div>
    </header>
  );
}
