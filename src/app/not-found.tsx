import Link from "next/link";
export default function NotFound() {
  return (
    <main className="wrap sec">
      <p className="mono">404</p>
      <h1>That page isn’t here.</h1>
      <Link className="btn" href="/">
        Back to the portfolio
      </Link>
    </main>
  );
}
