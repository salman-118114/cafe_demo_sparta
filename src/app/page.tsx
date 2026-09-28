import Image from "next/image";
import Link from "next/link";
import CupQuiz from "@/components/home/CupQuiz";
import SignatureRail, { RailControls } from "@/components/home/SignatureRail";
import { ArrowIcon, StarIcon } from "@/components/icons";
import { img } from "@/lib/data";

const MARQUEE = ["Saffron Gold Latte", "Pistachio Kunafa Croissant", "Date & Cardamom Cold Brew", "Gold Leaf Opera", "High Tea from 2 pm", "Roasted every Tuesday"];
const flow = (v: string) => ({ "--flow": v }) as React.CSSProperties;
const idx = (i: number) => ({ "--i": i }) as React.CSSProperties;

const DAY = [
  { time: "07:00 — Morning", title: <>Brunch with <em>no curfew.</em></>, body: "Crème brûlée French toast, truffle eggs on 72-hour sourdough and a flat white pulled from this week's roast.", photo: "1484723091739-30a097e8f929", alt: "Stacked French toast with blueberries and banana", cta: <Link className="link-arrow" href="/menu#breakfast">See breakfast <ArrowIcon /></Link> },
  { time: "14:00 — Afternoon", title: <>High tea, <em>higher standards.</em></>, body: "Twelve petit fours, warm scones and a pot of rare oolong, served on brass from two until six.", photo: "1565958011703-44f9829ba187", alt: "Slice of raspberry pistachio cake on a dark plate", cta: <Link className="btn btn--light" href="/menu#desserts" style={{ justifySelf: "start" }}>Explore desserts</Link> },
  { time: "20:00 — Evening", title: <>Wagyu, lanterns, <em>and the sea.</em></>, body: "The kitchen turns up the heat after sunset: MB6 wagyu, slow ragù and smoked date tonics until 1 am on weekends.", photo: "1600891964092-4316c288032e", alt: "Sliced wagyu steak with frites and herbs", cta: <Link className="btn btn--gold" href="/reserve" style={{ justifySelf: "start" }}>Book dinner</Link> },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <span className="hero-arabic" aria-hidden="true" lang="ar">قهوة</span>
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Jumeirah · Dubai · Est. 2019</span>
            <h1 id="hero-title">
              <span className="line"><span style={idx(0)}>Coffee,</span></span>
              <span className="line"><span style={idx(1)}><em>gilded.</em></span></span>
            </h1>
            <p className="lede">Saffron lattes, pistachio kunafa croissants and slow brunch on a terrace that faces the Burj Al Arab. Roasted in-house, finished in 24k gold.</p>
            <div className="hero-ctas">
              <Link className="btn" href="/order" data-magnetic>Order for delivery <ArrowIcon /></Link>
              <Link className="btn btn--ghost" href="/reserve">Book a sea-view table</Link>
            </div>
            <div className="hero-meta">
              <div><b>07:00</b><span>First pour, daily</span></div>
              <div><b>35 min</b><span>Average delivery</span></div>
              <div><b>18</b><span>Origins on rotation</span></div>
            </div>
          </div>

          <div className="hero-arches">
            <svg className="seal" viewBox="0 0 120 120" aria-hidden="true">
              <defs><path id="seal-path" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" /></defs>
              <g className="seal-ring"><text><textPath href="#seal-path">SPARTA CAFÉ · DUBAI · EST 2019 · </textPath></text></g>
              <path d="M44 84V58a16 16 0 0 1 32 0v26" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <text x="60" y="78" textAnchor="middle" fontSize="22" fontStyle="italic" style={{ letterSpacing: 0, fontFamily: "var(--font-display)", fontWeight: 500 }}>S</text>
            </svg>
            <figure className="arch arch--outline" style={{ ...idx(1), margin: 0 }}>
              <Image src={img("1579372786545-d24232daf58c", 600)} alt="High tea tower with raspberry tarts and cupcakes" width={600} height={900} priority sizes="(max-width: 900px) 30vw, 200px" />
            </figure>
            <figure className="arch arch--outline" style={{ ...idx(0), margin: 0 }}>
              <Image src={img("1541167760496-1628856ab772", 800)} alt="Barista pouring latte art into a white cup" width={800} height={1200} priority sizes="(max-width: 900px) 40vw, 260px" />
            </figure>
            <figure className="arch arch--outline" style={{ ...idx(2), margin: 0 }}>
              <Image src={img("1555507036-ab1f4038808a", 600)} alt="Golden croissants dusted with sugar on a dark board" width={600} height={900} priority sizes="(max-width: 900px) 30vw, 200px" />
            </figure>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee" aria-label="Today's highlights">
        <div className="marquee-track">
          {[0, 1].map((g) => (
            <div className="marquee-group" key={g} aria-hidden={g === 1 || undefined}>
              {MARQUEE.map((w) => <span key={w} style={{ display: "contents" }}><span>{w}</span><StarIcon /></span>)}
            </div>
          ))}
        </div>
      </div>

      {/* Signatures */}
      <section className="section" aria-labelledby="sig-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <div className="stack" style={flow("16px")}>
              <span className="eyebrow">The Signatures</span>
              <h2 id="sig-title">Four reasons people <em>cross the city.</em></h2>
            </div>
            <div className="stack" style={flow("18px")}>
              <p>Drag the rail or use the arrows. Tap any dish to choose the size, milk and finish.</p>
              <div className="rail-controls">
                <RailControls />
                <Link className="link-arrow" href="/menu" style={{ marginLeft: 12, alignSelf: "center" }}>Full menu <ArrowIcon /></Link>
              </div>
            </div>
          </div>
          <SignatureRail />
        </div>
      </section>

      {/* Terrace */}
      <section className="section section--sunken" aria-labelledby="terrace-title">
        <div className="container split">
          <div className="split-media" data-reveal="scale">
            <div className="arch arch--outline">
              <Image src={img("1559339352-11d035aa65de")} alt="Sea-facing terrace with blue chairs under a pergola at golden hour" width={900} height={1125} sizes="(max-width: 900px) 90vw, 520px" />
            </div>
            <div className="inset"><Image src={img("1546412414-e1885259563a", 500)} alt="The Burj Al Arab across the water at dusk" width={500} height={500} sizes="240px" /></div>
          </div>
          <div className="stack" style={flow("24px")} data-reveal>
            <span className="eyebrow">The Terrace</span>
            <h2 id="terrace-title" style={{ fontSize: "var(--step-4)" }}>Gold hour, <em>every hour.</em></h2>
            <p className="lede">Forty-two seats on the sand side of Jumeirah Beach Road, shaded by day and lantern-lit by night. The sea breeze is free; the view of the Burj Al Arab is on the house.</p>
            <p className="muted">We roast every Tuesday in a 5-kilo Giesen behind the bar, bake before sunrise, and close the kitchen only when the last table does.</p>
            <div className="stats">
              <div className="stat"><b data-count="42">42</b><span>Terrace seats</span></div>
              <div className="stat"><b data-count="18">18</b><span>Single origins a year</span></div>
              <div className="stat"><b data-count="24" data-suffix="k">24k</b><span>Gold on the signatures</span></div>
            </div>
            <div><Link className="btn" href="/reserve">Reserve the terrace</Link></div>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className="section" aria-labelledby="quiz-title">
        <div className="container quiz">
          <div className="stack" style={flow("22px")} data-reveal>
            <span className="eyebrow">Find your cup</span>
            <h2 id="quiz-title" style={{ fontSize: "var(--step-4)" }}>Three questions. <em>One perfect cup.</em></h2>
            <p className="lede">Not sure what to order? Tell us how today is going and our head barista&apos;s matchmaker will pour the rest.</p>
            <p className="muted">Every answer changes the pour. Try it twice.</p>
          </div>
          <div data-reveal="scale"><CupQuiz /></div>
        </div>
      </section>

      {/* A day at Sparta */}
      <section className="section section--sunken" aria-labelledby="day-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <div className="stack" style={flow("16px")}><span className="eyebrow">A day at Sparta</span><h2 id="day-title">From first pour <em>to last light.</em></h2></div>
            <p>Scroll through a day on Jumeirah Beach Road. Each chapter stacks on the last.</p>
          </div>
          <div className="day-stack">
            {DAY.map((d, i) => (
              <article className="day-card" style={idx(i)} key={d.time}>
                <div className="day-copy">
                  <div className="stack" style={flow("16px")}>
                    <span className="day-time">{d.time}</span>
                    <h3>{d.title}</h3>
                    <p className="muted">{d.body}</p>
                  </div>
                  {d.cta}
                </div>
                <div className="day-media"><Image src={img(d.photo, 1000)} alt={d.alt} width={1000} height={800} sizes="(max-width: 760px) 100vw, 600px" /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax quote */}
      <section className="quote-band" aria-label="Our philosophy">
        <Image src={img("1590846406792-0adc7f938f1d", 1800)} alt="" width={1800} height={1200} sizes="100vw" />
        <div className="container" data-reveal>
          <blockquote>“Luxury is not gold leaf. It&apos;s <em>twelve hours</em> of cold brew, and someone who remembers your order.”</blockquote>
          <cite>Head Barista, Sparta Café</cite>
        </div>
      </section>

      {/* CTA band */}
      <section className="section">
        <div className="container">
          <div className="cta-band" data-reveal="scale">
            <span className="arabic-bg" aria-hidden="true" lang="ar">أهلاً</span>
            <div>
              <h2>Your table <em>is waiting.</em></h2>
              <p>Delivered across Dubai in about 35 minutes, or kept warm on the terrace for you. Your call.</p>
            </div>
            <div className="btns">
              <Link className="btn btn--gold" href="/order">Start an order</Link>
              <Link className="btn ghost-inv" href="/reserve">Reserve a table</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
