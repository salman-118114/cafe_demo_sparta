"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { money } from "@/lib/data";
import { canAnimate, store } from "@/lib/motion";
import { useApp } from "../AppProvider";
import { EmptyState, LineItem } from "../CartBits";
import Modal from "../Modal";
import { ArrowIcon, CheckIcon, CupIcon, InfoIcon, StarIcon } from "../icons";

type Mode = "delivery" | "pickup" | "dinein";
interface Promo { label?: string; pct?: number; flat?: number; freeDelivery?: boolean }
const PROMOS: Record<string, Promo> = {
  SPARTA10: { label: "SPARTA10 · 10% off", pct: 0.1 },
  GOLD: { label: "GOLD · free delivery", freeDelivery: true },
  WELCOME: { label: "WELCOME · AED 20 off", flat: 20 },
};
const AREAS: [string, number][] = [["Jumeirah", 25], ["Umm Suqeim", 20], ["Al Barsha", 30], ["Downtown Dubai", 35], ["DIFC", 35], ["Business Bay", 38], ["Dubai Marina", 40], ["Palm Jumeirah", 40]];
const STAGES: Record<Mode, string[]> = {
  delivery: ["Received", "Brewing", "On its way", "Enjoy"],
  pickup: ["Received", "Brewing", "Ready at bar", "Collected"],
  dinein: ["Received", "Brewing", "Plating", "At your table"],
};
const STEP_LABELS = ["Continue to details", "Continue to payment"];
const UAE_MOBILE = /^(\+?971|0)?\s?5\d([\s-]?\d){7}$/;

const EMPTY_FORM = { addr: "", area: "Jumeirah", pickup: "As soon as possible", table: "", name: "", phone: "", email: "", notes: "", ccNum: "", ccName: "", ccExp: "", ccCvc: "" };
type Form = typeof EMPTY_FORM;
type Field = keyof Form;

function Err({ show, id, children }: { show: boolean; id: string; children: ReactNode }) {
  return show ? <span className="field-error" id={id}>{children}</span> : null;
}

export default function OrderFlow({ children }: { children: ReactNode }) {
  const { lines, subtotal, count, clearCart, toast } = useApp();
  const [mode, setMode] = useState<Mode>("delivery");
  const [tip, setTip] = useState(0.1);
  const [promo, setPromo] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [pay, setPay] = useState<"card" | "cash">("card");
  const [f, setF] = useState<Form>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});
  const [flipped, setFlipped] = useState(false);
  const [confirm, setConfirm] = useState<null | { no: string; total: number; sub: string; etaLabel: string; stages: string[]; secs: number }>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const [secs, setSecs] = useState(0);
  const stepRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((s) => ({ ...s, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: false }));
  };

  /* Totals */
  const p: Promo = (promo && PROMOS[promo]) || {};
  const discount = p.pct ? subtotal * p.pct : p.flat ? Math.min(subtotal, p.flat) : 0;
  const delivery = mode === "delivery" && subtotal > 0 && subtotal < 150 && !p.freeDelivery ? 9 : 0;
  const vat = (subtotal - discount + delivery) * 0.05;
  const tipAmt = mode === "pickup" ? 0 : subtotal * tip;
  const total = subtotal - discount + delivery + vat + tipAmt;

  /* Step transitions */
  useEffect(() => {
    if (!canAnimate() || !stepRef.current) return;
    stepRef.current.animate([{ opacity: 0, transform: `translateX(${dir * 24}px)` }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(0.22,1,0.36,1)" });
  }, [step, dir]);
  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    document.getElementById("checkout")?.scrollIntoView({ block: "start" });
  };

  const validate = () => {
    const bad: Partial<Record<Field, boolean>> = {};
    if (step === 0) {
      if (mode === "delivery" && f.addr.trim().length < 3) bad.addr = true;
      if (mode === "dinein") { const t = Number(f.table); if (!(t >= 1 && t <= 42)) bad.table = true; }
    }
    if (step === 1) {
      if (f.name.trim().length < 2) bad.name = true;
      if (!UAE_MOBILE.test(f.phone.trim())) bad.phone = true;
      if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) bad.email = true;
    }
    if (step === 2 && pay === "card") {
      if (f.ccNum.replace(/\s/g, "").length !== 16) bad.ccNum = true;
      if (f.ccName.trim().length < 2) bad.ccName = true;
      if (!/^(0[1-9]|1[0-2])\/\d\d$/.test(f.ccExp)) bad.ccExp = true;
      if (!/^\d{3,4}$/.test(f.ccCvc)) bad.ccCvc = true;
    }
    setErrors(bad);
    const first = Object.keys(bad)[0];
    if (first) document.getElementById(`f-${first}`)?.focus();
    return !first;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (step < 2) return go(step + 1);
    if (!lines.length) return toast({ text: "Your order is empty. Add something first.", icon: "info" });
    placeOrder();
  };

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (PROMOS[code]) { setPromo(code); toast({ text: <>Code <b>{code}</b> applied. Nice.</> }); }
    else { setPromo(null); toast({ text: code ? `“${code}” isn't a code we know. Try SPARTA10.` : "Enter a promo code first.", icon: "info" }); }
  };

  /* Card formatting */
  const onCard = (k: "ccNum" | "ccExp" | "ccCvc") => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (k === "ccNum") v = v.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (k === "ccExp") { v = v.slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); }
    if (k === "ccCvc") v = v.slice(0, 4);
    setF((s) => ({ ...s, [k]: v }));
    setErrors((er) => ({ ...er, [k]: false }));
  };
  const digits = f.ccNum.replace(/\s/g, "");
  const shownNum = (digits + "•".repeat(16 - digits.length)).replace(/(.{4})/g, "$1 ").trim();

  /* Confirmation */
  function placeOrder() {
    const no = "SP-" + Math.floor(1000 + Math.random() * 9000);
    const areaEta = AREAS.find((a) => a[0] === f.area)?.[1] ?? 30;
    const eta = mode === "delivery" ? areaEta + 10 : mode === "pickup" ? 15 : 12;
    const who = f.name.trim().split(" ")[0] || "friend";
    const sub = mode === "delivery" ? `Heading to ${f.addr.trim()}, ${f.area}. We'll text ${f.phone.trim()} when the rider leaves, ${who}.`
      : mode === "pickup" ? `We'll have it waiting at the bar under “${who}”.` : `Table ${f.table}: sit back, ${who}, it's coming to you.`;
    setConfirm({ no, total, sub, stages: STAGES[mode], secs: eta * 60, etaLabel: mode === "pickup" ? "Ready in" : mode === "delivery" ? "Estimated arrival" : "At your table in" });
    setConfirmOpen(true);
    setStage(0);
    setSecs(eta * 60);
    store.set("sparta-last-order", { no, total, at: Date.now() });
    clearCart();
    setF(EMPTY_FORM);
    setMode("delivery");
    setStep(0);
    setTimeout(confetti, 450);
  }

  // Demo: advance the tracker every few seconds; countdown runs in real time
  useEffect(() => {
    if (!confirm || !confirmOpen) return;
    const t1 = setInterval(() => setStage((s) => Math.min(confirm.stages.length - 1, s + 1)), 4000);
    const t2 = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, [confirm, confirmOpen]);

  function confetti() {
    if (!canAnimate() || !confirmRef.current) return;
    const cv = document.createElement("canvas");
    cv.className = "confetti";
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    confirmRef.current.closest("dialog")?.append(cv);
    const ctx = cv.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const colors = ["#e3b454", "#f0cf85", "#c9952f", "#fff4dc", "#14614d"];
    const P = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 3,
      a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 0.3, c: colors[(Math.random() * colors.length) | 0],
    }));
    const t0 = performance.now();
    const frame = (t: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const q of P) {
        q.vy += 0.35; q.vx *= 0.99; q.x += q.vx; q.y += q.vy; q.a += q.va;
        ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.a); ctx.fillStyle = q.c;
        ctx.globalAlpha = Math.max(0, 1 - (t - t0) / 2600);
        ctx.beginPath(); ctx.moveTo(0, -q.r); ctx.lineTo(q.r * 0.8, q.r * 0.4); ctx.lineTo(-q.r * 0.6, q.r * 0.7); ctx.fill(); ctx.restore();
      }
      if (t - t0 < 2600) requestAnimationFrame(frame); else cv.remove();
    };
    requestAnimationFrame(frame);
  }

  const input = (k: Field, label: ReactNode, err: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, full = false) => (
    <div className={`field${full ? " full" : ""}${errors[k] ? " has-error" : ""}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <input className="input" id={`f-${k}`} value={f[k]} onChange={set(k)} aria-invalid={errors[k] || undefined} aria-describedby={errors[k] ? `e-${k}` : undefined} {...props} />
      <Err show={!!errors[k]} id={`e-${k}`}>{err}</Err>
    </div>
  );
  const cardInput = (k: "ccNum" | "ccExp" | "ccCvc", label: string, err: string, props: React.InputHTMLAttributes<HTMLInputElement>, full = false) => (
    <div className={`field${full ? " full" : ""}${errors[k] ? " has-error" : ""}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <input className="input" id={`f-${k}`} inputMode="numeric" autoComplete="off" value={f[k]} onChange={onCard(k)} aria-invalid={errors[k] || undefined} {...props} />
      <Err show={!!errors[k]} id={`e-${k}`}>{err}</Err>
    </div>
  );
  const icons = [<CheckIcon key="a" />, <CupIcon key="b" width={16} />, <ArrowIcon key="c" />, <StarIcon key="d" />];

  return (
    <div className="container order-layout" style={{ paddingBottom: "var(--section)" }}>
      <div>
        {children}

        <section className="panel" id="checkout" aria-labelledby="co-title">
          <div className="panel-head"><h2 id="co-title"><span className="num-badge">03</span>Checkout</h2></div>
          <ol className="steps" role="list" aria-label="Checkout progress">
            {["How", "Details", "Payment"].map((s, i) => <li key={s} className={i < step ? "is-done" : i === step ? "is-current" : ""} aria-current={i === step ? "step" : undefined}>{s}</li>)}
          </ol>

          <form noValidate className="mt-6" onSubmit={submit}>
            <div ref={stepRef}>
              {step === 0 && (
                <>
                  <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                    <legend className="label" style={{ fontWeight: 800, marginBottom: 12 }}>How would you like it?</legend>
                    <div className="choice-grid">
                      {([["delivery", "Delivery", "35–45 min · free over AED 150"], ["pickup", "Pickup", "Ready in 15 min at the bar"], ["dinein", "Dine-in", "Straight to your table"]] as [Mode, string, string][]).map(([v, t, s]) => (
                        <label className="choice" key={v}>
                          <input type="radio" name="mode" value={v} checked={mode === v} onChange={() => setMode(v)} />
                          <span className="choice-card"><b>{t}</b><span>{s}</span></span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {mode === "delivery" && (
                    <div className="form-grid mt-6">
                      <div className="field">
                        <label htmlFor="f-area">Area</label>
                        <select className="select" id="f-area" value={f.area} onChange={set("area")}>
                          {AREAS.map(([a, m]) => <option key={a} value={a}>{a} · {m} min</option>)}
                        </select>
                      </div>
                      {input("addr", "Building, floor and apartment", "Where should the rider go?", { autoComplete: "street-address", placeholder: "Villa 12, Street 4b" })}
                    </div>
                  )}
                  {mode === "pickup" && (
                    <div className="form-grid mt-6">
                      <div className="field">
                        <label htmlFor="f-pickup">Pickup time</label>
                        <select className="select" id="f-pickup" value={f.pickup} onChange={set("pickup")}>
                          {["As soon as possible", "In 30 minutes", "In 1 hour", "In 2 hours"].map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                  {mode === "dinein" && (
                    <div className="form-grid mt-6">
                      {input("table", "Table number", "Your table number is on the brass plate, 1 to 42.", { inputMode: "numeric", placeholder: "1 – 42" })}
                    </div>
                  )}
                </>
              )}

              {step === 1 && (
                <div className="form-grid">
                  {input("name", "Full name", "We need a name for the cup.", { autoComplete: "name", placeholder: "Layla Al Mansouri" })}
                  {input("phone", "Mobile", "Enter a UAE mobile, like +971 50 123 4567.", { type: "tel", autoComplete: "tel", placeholder: "+971 50 123 4567" })}
                  {input("email", <>Email for the receipt <span className="muted">(optional)</span></>, "That email doesn't look right.", { type: "email", autoComplete: "email", placeholder: "you@email.com" }, true)}
                  <div className="field full">
                    <label htmlFor="f-notes">Notes for the kitchen</label>
                    <textarea className="textarea" id="f-notes" value={f.notes} onChange={set("notes")} placeholder="Allergies, extra hot, birthday candle…" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <>
                  <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                    <legend className="label" style={{ fontWeight: 800, marginBottom: 12 }}>Payment method</legend>
                    <div className="choice-grid">
                      <label className="choice"><input type="radio" name="pay" checked={pay === "card"} onChange={() => setPay("card")} /><span className="choice-card"><b>Card</b><span>Visa, Mastercard, Amex</span></span></label>
                      <label className="choice"><input type="radio" name="pay" checked={pay === "cash"} onChange={() => setPay("cash")} /><span className="choice-card"><b>{mode === "pickup" ? "Pay at the counter" : "Cash or card on arrival"}</b><span>Pay the rider or server</span></span></label>
                    </div>
                  </fieldset>
                  {pay === "card" && (
                    <div className="pay-grid mt-6">
                      <div className={`card-3d${flipped ? " is-flipped" : ""}`} aria-hidden="true">
                        <div className="card-3d-inner">
                          <div className="card-face">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="chip-ic" /><span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.3rem" }}>Sparta Gold</span></div>
                            <div className="card-num">{shownNum}</div>
                            <div className="card-row"><div>Card holder<b>{f.ccName.toUpperCase() || "YOUR NAME"}</b></div><div style={{ textAlign: "right" }}>Expires<b>{f.ccExp || "MM/YY"}</b></div></div>
                          </div>
                          <div className="card-face card-back"><div className="stripe" /><div className="cvc">{f.ccCvc.replace(/./g, "•") || "•••"}</div></div>
                        </div>
                      </div>
                      <div className="form-grid">
                        {cardInput("ccNum", "Card number", "Card numbers have 16 digits.", { placeholder: "1234 5678 9012 3456", maxLength: 19 }, true)}
                        {input("ccName", "Name on card", "Add the name on the card.", { autoComplete: "off", placeholder: "As printed" }, true)}
                        {cardInput("ccExp", "Expiry", "Use MM/YY.", { placeholder: "MM/YY", maxLength: 5 })}
                        {cardInput("ccCvc", "CVC", "3 or 4 digits.", { placeholder: "123", maxLength: 4, onFocus: () => setFlipped(true), onBlur: () => setFlipped(false) })}
                        <div className="full" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
                          <p className="demo-note"><InfoIcon />Demo checkout: nothing is charged and nothing leaves this browser.</p>
                          <button className="btn btn--ghost btn--sm" type="button"
                            onClick={() => { setF((s) => ({ ...s, ccNum: "4242 4242 4242 4242", ccName: s.name || "Layla Al Mansouri", ccExp: "09/29", ccCvc: "123" })); setErrors({}); }}>
                            Fill demo card
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 28 }}>
              {step > 0 && <button className="btn btn--ghost" type="button" onClick={() => go(step - 1)}>Back</button>}
              <button className="btn" type="submit" style={{ marginLeft: "auto" }} disabled={step === 2 && !lines.length}>
                {step === 2 ? `Place order · ${money(total)}` : STEP_LABELS[step]}
              </button>
            </div>
          </form>
        </section>
      </div>

      <aside className="order-summary" aria-labelledby="sum-title">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 id="sum-title">Your order</h2>
          <span className="muted" style={{ fontWeight: 700, fontSize: ".85rem" }}>{count ? `${count} item${count === 1 ? "" : "s"}` : ""}</span>
        </div>
        <div className="lines">{lines.length ? lines.map((l) => <LineItem key={l.key} line={l} />) : <EmptyState action={null} />}</div>
        {lines.length > 0 && (
          <div className="stack" style={{ "--flow": "14px" } as React.CSSProperties}>
            {mode !== "pickup" && (
              <div className="field">
                <span className="label" id="tip-l">Tip the team</span>
                <div className="tips" role="radiogroup" aria-labelledby="tip-l">
                  {[0, 0.1, 0.15, 0.2].map((t) => <button key={t} type="button" className="chip" role="radio" aria-checked={tip === t} onClick={() => setTip(t)}>{t ? `${t * 100}%` : "No tip"}</button>)}
                </div>
              </div>
            )}
            <form className="promo" onSubmit={applyPromo}>
              <label className="sr-only" htmlFor="promo-code">Promo code</label>
              <input className="input" id="promo-code" placeholder="Promo code (try SPARTA10)" autoComplete="off" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} />
              <button className="btn btn--ghost btn--sm" type="submit">Apply</button>
            </form>
            <div className="totals">
              <div><span>Subtotal</span><span>{money(subtotal)}</span></div>
              {discount > 0 && <div className="discount"><span>{p.label}</span><span>− {money(discount)}</span></div>}
              {mode === "delivery" && <div><span>Delivery</span><span>{delivery ? money(delivery) : "Free"}</span></div>}
              <div><span>VAT (5%)</span><span>{money(vat)}</span></div>
              {tipAmt > 0 && <div><span>Tip</span><span>{money(tipAmt)}</span></div>}
              <div className="grand"><span>Total</span><span>{money(total)}</span></div>
            </div>
            <div className="points"><StarIcon /><span>This order earns <b>{Math.floor(total * 10)} Sparta Gold</b> points.</span></div>
          </div>
        )}
      </aside>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} className="modal confirm" labelledBy="confirm-title">
        {confirm && (
          <div className="confirm-inner" ref={confirmRef}>
            <svg className="check-draw" viewBox="0 0 84 84" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="42" cy="42" r="38" pathLength={1} /><path d="m27 43 10 10 21-22" pathLength={1} />
            </svg>
            <div className="stack" style={{ "--flow": "8px" } as React.CSSProperties}>
              <span className="eyebrow">Order {confirm.no} · {money(confirm.total)}</span>
              <h2 id="confirm-title">Shukran! It&apos;s <em>in the works.</em></h2>
              <p className="muted">{confirm.sub}</p>
            </div>
            <div>
              <div className="eta">{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}</div>
              <p className="muted" style={{ fontSize: ".85rem", fontWeight: 700 }}>{confirm.etaLabel}</p>
            </div>
            <ol className="track" role="list" style={{ "--p": stage / (confirm.stages.length - 1) } as React.CSSProperties}>
              <span className="track-fill" aria-hidden="true" />
              {confirm.stages.map((s, i) => <li key={s} className={i <= stage ? "done" : ""}><i>{icons[i]}</i>{s}</li>)}
            </ol>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              <Link className="btn" href="/">Back to home</Link>
              <button className="btn btn--ghost" type="button" data-close>Keep browsing</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
