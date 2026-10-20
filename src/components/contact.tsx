"use client";
import { useEffect, useRef, useState } from "react";
export function Contact({ email }: { email: string }) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  const pending = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  async function copy() {
    if (pending.current) return;
    pending.current = true;
    let feedback =
      "Copy unavailable. Select the email address and copy it manually.";
    try {
      await navigator.clipboard.writeText(email);
      feedback = "Copied to clipboard";
    } catch {
      /* Email and mailto remain available. */
    }
    pending.current = false;
    if (!alive.current) return;
    setMessage(feedback);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 4000);
  }
  return (
    <div className="mail">
      <a className="mail-t" href={`mailto:${email}`}>
        {email}
      </a>
      <button className="btn" onClick={copy}>
        Copy address
      </button>
      <span className="msg mono" role="status" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
