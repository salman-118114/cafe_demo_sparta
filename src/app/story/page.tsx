import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, PlusThin } from "@/components/icons";
import { ContactForm, Gallery, HoursTable } from "@/components/story/StoryClient";
import { img } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story of Sparta Café: from a six-seat espresso bar to Jumeirah's sea-facing café. Visit us, see the gallery, and get in touch.",
};

const idx = (i: number) => ({ "--i": i }) as React.CSSProperties;
const flow = (v: string) => ({ "--flow": v }) as React.CSSProperties;

const TIMELINE = [
  ["2019", "Six seats and a lever machine", "A 20 m² espresso bar on Street 17b. We served 40 cups on day one, 38 of them to neighbours who came back the next morning."],
  ["2020", "The Saffron Gold Latte", "An experiment for a regular's wedding became the drink people now cross the city for. Iranian saffron, cardamom, and a single sheet of 24k gold."],
  ["2022", "Roasting in-house", "A 5-kilo Giesen roaster arrived from the Netherlands. Every bean we pour has been roasted within 10 days, behind the bar, every Tuesday."],
  ["2024", "The move to the sea", "We took the ground floor facing the Burj Al Arab: 120 seats, a 42-seat terrace, a majlis lounge and a pastry kitchen that starts at 4 am."],
  ["2026", "Delivery, done properly", "Insulated brass-lined bags, drinks sealed at the bar, and riders who know that foam has a 12-minute half-life. Across Dubai in about 35 minutes."],
];
const PROCESS = [
  ["Source", "Direct from 18 farms across Ethiopia, Colombia, Yemen and Brazil. We pay above Fair Trade, and visit."],
  ["Roast", "Light-to-medium profiles, tuned weekly by taste, never by habit. Every bag carries its roast date."],
  ["Brew", "Water filtered and remineralised for Dubai's hardness, and recipes dialled in every morning at 6:30."],
  ["Serve", "By baristas trained for 300 hours before they pour for a guest. And yes, they'll remember your order."],
];
const FAQ = [
  ["Do you take walk-ins?", "Always. About half our tables are kept for walk-ins. Window and terrace seats at sunset are best booked ahead."],
  ["Is the gold leaf real?", "Yes: 24-karat edible gold, food-grade and flavourless. It's there for joy, not taste."],
  ["Do you cater for allergies?", "Every dish on the menu lists vegetarian, vegan and gluten-free options. Tell your server or add a note at checkout and the kitchen will adapt."],
  ["Where do you deliver?", "Jumeirah, Umm Suqeim, Al Barsha, Downtown, DIFC, Business Bay, the Marina and the Palm. Free over AED 150."],
  ["Can I book the majlis privately?", "Yes, for up to 14 guests with a set menu from AED 180 per person. Use the form and choose “Private event”."],
];

export default function StoryPage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="story-title">
        <span className="hero-arabic" aria-hidden="true" lang="ar">قصتنا</span>
        <div className="container story-hero">
          <div className="stack" style={flow("24px")}>
            <span className="eyebrow reveal-load" style={idx(0)}>Our story</span>
            <h1 id="story-title" className="reveal-load" style={idx(1)}>Six seats, <em>one obsession.</em></h1>
            <p className="lede reveal-load" style={idx(2)}>Sparta began in 2019 as a six-seat espresso bar in an Umm Suqeim side street, run by two friends who thought Dubai deserved coffee as considered as its skyline. The obsession stayed. The seats multiplied.</p>
            <div className="reveal-load" style={{ ...idx(3), display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn" href="#visit">Plan your visit</a>
              <a className="btn btn--ghost" href="#gallery">See the space</a>
            </div>
          </div>
          <div className="arch arch--outline reveal-load" style={idx(2)}>
            <Image src={img("1600565193348-f74bd3c7ccdf", 800)} alt="A chef flambéing a pan in the open kitchen" width={800} height={1067} priority sizes="(max-width: 860px) 90vw, 480px" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tl-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <div className="stack" style={flow("16px")}><span className="eyebrow">Since 2019</span><h2 id="tl-title">How we got <em>here.</em></h2></div>
            <p>The line draws as you scroll. Every dot is a year we&apos;re proud of.</p>
          </div>
          <div className="timeline">
            <div className="timeline-line" aria-hidden="true">
              <svg preserveAspectRatio="none" viewBox="0 0 2 100"><line className="track-line" x1="1" y1="0" x2="1" y2="100" /><line className="draw" x1="1" y1="0" x2="1" y2="100" pathLength={1} /></svg>
            </div>
            {TIMELINE.map(([y, t, d]) => (
              <div className="tl-item" data-reveal key={y}><span className="tl-year">{y}</span><div><h3>{t}</h3><p>{d}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sunken" aria-labelledby="proc-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <div className="stack" style={flow("16px")}><span className="eyebrow">Bean to cup</span><h2 id="proc-title">Four steps, <em>no shortcuts.</em></h2></div>
          </div>
          <ol className="process" role="list" data-reveal-group>
            {PROCESS.map(([t, d]) => <li data-reveal key={t}><h3>{t}</h3><p>{d}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="section" id="gallery" aria-labelledby="gal-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <div className="stack" style={flow("16px")}><span className="eyebrow">The space</span><h2 id="gal-title">Come <em>look around.</em></h2></div>
            <p>Tap any photo to open it full screen. Use the arrow keys to move through.</p>
          </div>
          <Gallery />
        </div>
      </section>

      <section className="section section--sunken" id="visit" aria-labelledby="visit-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <div className="stack" style={flow("16px")}><span className="eyebrow">Visit</span><h2 id="visit-title">On the sand side of <em>Jumeirah.</em></h2></div>
            <a className="link-arrow" href="https://www.google.com/maps/search/?api=1&query=Umm+Suqeim+3+Jumeirah+Beach+Road+Dubai" target="_blank" rel="noopener noreferrer">Get directions <ArrowIcon /></a>
          </div>
          <div className="visit">
            <div className="map-card" data-reveal="scale">
              <svg viewBox="0 0 600 420" role="img" aria-label="Map: Sparta Café on Jumeirah Beach Road, Umm Suqeim, facing the Burj Al Arab">
                <rect className="land" width="600" height="420" />
                <path className="sea" d="M0 0h600v70C520 90 470 120 420 170S330 260 260 300 110 360 0 380Z" />
                <path className="road-main" d="M0 410C140 380 260 340 330 290S470 170 600 120" />
                <path className="road" d="M40 420 180 240M300 420 360 260M520 420 470 160M0 250h180" />
                <g transform="translate(250 190)"><path d="M0 0c10-30 30-50 30-50l4 50Z" fill="currentColor" opacity=".5" /><circle r="10" cx="18" cy="6" fill="none" stroke="currentColor" opacity=".4" /></g>
                <text className="map-label" x="200" y="150">BURJ AL ARAB</text>
                <text className="map-label" x="420" y="60">ARABIAN GULF</text>
                <text className="map-label" x="360" y="360" transform="rotate(-28 360 360)">JUMEIRAH BEACH RD</text>
                <g className="pin" transform="translate(330 285)">
                  <circle className="pulse" r="18" />
                  <path d="M0 -8a14 14 0 0 1 14 14v18h-28v-18a14 14 0 0 1 14-14Z" transform="translate(0 -26)" fill="var(--brand)" />
                  <text y="-4" textAnchor="middle" fontStyle="italic" fontSize="16" fill="var(--on-brand)" style={{ fontFamily: "var(--font-display)" }}>S</text>
                </g>
              </svg>
            </div>
            <div className="stack" style={flow("24px")} data-reveal>
              <div><h3 style={{ fontSize: "var(--step-2)", marginBottom: 8 }}>Sparta Café</h3><p className="muted">Jumeirah Beach Road, Umm Suqeim 3, Dubai<br />Valet parking at the front, free for two hours.</p></div>
              <HoursTable />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link className="btn" href="/reserve">Book a table</Link>
                <a className="btn btn--ghost" href="tel:+97140000000">Call +971 4 000 0000</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="contact-title">
        <div className="container visit">
          <div className="stack" style={flow("24px")} data-reveal>
            <span className="eyebrow">Write to us</span>
            <h2 id="contact-title" style={{ fontSize: "var(--step-4)" }}>Events, press, <em>or just hello.</em></h2>
            <p className="muted">Private hire of the majlis, corporate gifting boxes, wholesale beans. We answer within a day.</p>
            <ContactForm />
          </div>
          <div className="stack" style={flow("20px")} data-reveal>
            <span className="eyebrow">Questions</span>
            <div className="faq">
              {FAQ.map(([q, a]) => (
                <details key={q}><summary>{q}<PlusThin /></summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
