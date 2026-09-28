import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero" aria-labelledby="nf-title" style={{ minHeight: "70svh", display: "grid", alignItems: "center" }}>
      <span className="hero-arabic" aria-hidden="true" lang="ar">ضائع</span>
      <div className="container">
        <span className="eyebrow">404 · Page not found</span>
        <h1 id="nf-title">This table <em>doesn&apos;t exist.</em></h1>
        <p className="lede">The page you&apos;re after has moved, or never existed. The coffee, however, is very real.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn" href="/">Back to home</Link>
          <Link className="btn btn--ghost" href="/menu">See the menu</Link>
        </div>
      </div>
    </section>
  );
}
