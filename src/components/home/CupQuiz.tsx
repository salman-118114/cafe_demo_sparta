"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { byId, img } from "@/lib/data";
import { useApp } from "../AppProvider";
import { ArrowLeftIcon, PlusIcon } from "../icons";

type Key = "mood" | "flavour" | "temp";
const QUESTIONS: { q: string; key: Key; opts: [string, string, string][] }[] = [
  { q: "How's the day going?", key: "mood", opts: [["energy", "Just getting started", "Need a clean jolt"], ["focus", "Deep in it", "Emails, deadlines, momentum"], ["calm", "Winding down", "Something gentle"], ["treat", "Celebrating", "Go on, spoil me"]] },
  { q: "Pick a flavour mood.", key: "flavour", opts: [["bold", "Bold & dark", "Cocoa, roast, depth"], ["sweet", "Sweet & creamy", "Velvet, caramel, comfort"], ["floral", "Floral & bright", "Jasmine, rose, citrus"], ["spiced", "Nutty & spiced", "Saffron, cardamom, date"]] },
  { q: "Hot or over ice?", key: "temp", opts: [["hot", "Hot, always", "Even in August"], ["iced", "Over ice", "It's Dubai, habibi"]] },
];
const WHY: Record<string, string> = {
  energy: "a clean, bright lift to start the day",
  focus: "steady energy that won't crash before your 4 pm call",
  calm: "a slower, gentler cup to land the day softly",
  treat: "because today deserves a little gold",
};

function pick(a: Partial<Record<Key, string>>) {
  const hot = a.temp === "hot";
  const table: Record<string, string> = {
    bold: hot ? (a.mood === "energy" ? "americano" : "cortado") : "date-cold-brew",
    sweet: hot ? (a.mood === "treat" ? "saffron-latte" : "spanish-latte") : "pearl-tea",
    floral: hot ? (a.mood === "calm" ? "chemex" : "matcha") : (a.mood === "treat" ? "rose-shake" : "mint-lime"),
    spiced: hot ? "saffron-latte" : (a.mood === "calm" ? "date-tonic" : "date-cold-brew"),
  };
  return byId[table[a.flavour ?? "bold"]];
}

export default function CupQuiz() {
  const { addItem } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<Key, string>>>({});
  const panel = useRef<HTMLDivElement>(null);
  const done = step >= QUESTIONS.length;
  const dots = <div className="quiz-dots" aria-hidden="true">{QUESTIONS.map((_, i) => <i key={i} className={i <= step ? "on" : ""} />)}</div>;

  const answer = (key: Key, v: string) => {
    setAnswers((a) => ({ ...a, [key]: v }));
    setStep((s) => s + 1);
    requestAnimationFrame(() => panel.current?.querySelector("button")?.focus({ preventScroll: true }));
  };

  if (done) {
    const it = pick(answers);
    return (
      <div className="quiz-panel" data-fly-root aria-live="polite" ref={panel}>
        {dots}
        <span className="eyebrow">Your match</span>
        <div className="quiz-result" key="result">
          <div className="arch"><Image src={img(it.photo, 400)} alt={it.name} width={400} height={533} /></div>
          <div className="stack" style={{ "--flow": "10px" } as React.CSSProperties}>
            <h3 style={{ fontSize: "var(--step-3)" }}>{it.name}</h3>
            <p className="muted">{it.desc}</p>
            <p style={{ fontSize: ".9rem" }}>Poured for you: {WHY[answers.mood ?? "treat"]}.</p>
            <span className="price"><small>AED</small>{it.price}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" type="button" onClick={(e) => addItem(it, e.currentTarget)}><PlusIcon /> Add to order</button>
          <button className="btn btn--ghost" type="button" onClick={() => setStep(0)}>Try again</button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div className="quiz-panel" data-fly-root aria-live="polite" ref={panel}>
      {dots}
      <div className="quiz-q" key={step}>
        <span className="eyebrow">Question {step + 1} of {QUESTIONS.length}</span>
        <h3>{q.q}</h3>
        <div className="quiz-opts">
          {q.opts.map(([v, t, s]) => (
            <button key={v} type="button" className="quiz-opt" onClick={() => answer(q.key, v)}><b>{t}</b><span>{s}</span></button>
          ))}
        </div>
      </div>
      {step > 0 && (
        <button type="button" className="link-arrow" onClick={() => setStep((s) => s - 1)} style={{ background: "none", borderWidth: "0 0 1px", justifySelf: "start" }}>
          <ArrowLeftIcon /> Back
        </button>
      )}
    </div>
  );
}
