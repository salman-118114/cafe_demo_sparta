import type { Metadata } from "next";
import ReservePlanner from "@/components/reserve/ReservePlanner";

export const metadata: Metadata = {
  title: "Reserve a table",
  description: "Book a table at Sparta Café, Jumeirah. Choose your exact seat: Burj Al Arab window, terrace, majlis lounge or the bar.",
};

const idx = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function ReservePage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="res-title">
        <span className="hero-arabic" aria-hidden="true" lang="ar">حجز</span>
        <div className="container">
          <span className="eyebrow reveal-load" style={idx(0)}>Reservations · up to 14 days ahead</span>
          <h1 id="res-title" className="reveal-load" style={idx(1)}>Choose your <em>seat.</em></h1>
          <p className="lede reveal-load" style={idx(2)}>Not just a time, the actual table. Pick a window facing the Burj Al Arab, a lantern-lit terrace spot or the majlis for a long afternoon.</p>
        </div>
      </section>
      <ReservePlanner />
    </>
  );
}
