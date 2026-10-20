"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="wrap sec">
      <h1>Something went wrong.</h1>
      <p>Please try loading the portfolio again.</p>
      <button className="btn" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
