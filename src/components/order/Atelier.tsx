"use client";

import { useRef, useState } from "react";
import { img } from "@/lib/data";
import { canAnimate } from "@/lib/motion";
import { useApp } from "../AppProvider";

interface Opt { id: string; label: string; sub?: string; price: number; color?: string | null; level?: number; photo?: string }
type Group = "base" | "temp" | "milk" | "sweet" | "finish" | "size";

const A: Record<Group, Opt[]> = {
  base: [
    { id: "espresso", label: "Espresso", sub: "Double ristretto", price: 22, color: "#3d2314", level: 0.26, photo: "1572442388796-11668a67e53d" },
    { id: "coldbrew", label: "Cold brew", sub: "18-hour steep", price: 26, color: "#2a170c", level: 0.5, photo: "1461023058943-07fcbe16d735" },
    { id: "matcha", label: "Matcha", sub: "Uji ceremonial", price: 28, color: "#6f9a3a", level: 0.3, photo: "1515823064-d6e0c04616a7" },
    { id: "cacao", label: "Cacao", sub: "70% Ecuador", price: 24, color: "#5a2e1b", level: 0.3, photo: "1572442388796-11668a67e53d" },
  ],
  temp: [{ id: "hot", label: "Hot", sub: "Steamed to 65°C", price: 0 }, { id: "iced", label: "Iced", sub: "Over clear ice", price: 0 }],
  milk: [
    { id: "none", label: "No milk", sub: "Keep it pure", price: 0, color: null },
    { id: "whole", label: "Whole", sub: "Local dairy", price: 0, color: "#efe1c8" },
    { id: "oat", label: "Oat", sub: "Barista oat", price: 4, color: "#e8d3ad" },
    { id: "camel", label: "Camel", sub: "Al Ain, creamy", price: 6, color: "#f4ead8" },
  ],
  sweet: [
    { id: "none", label: "Unsweetened", sub: "As roasted", price: 0, color: null },
    { id: "date", label: "Date syrup", sub: "Khalas dates", price: 3, color: "#6b3417" },
    { id: "saffron", label: "Saffron honey", sub: "Sidr + saffron", price: 5, color: "#d98a1d" },
    { id: "rose", label: "Rose", sub: "Taifi rose", price: 3, color: "#d8718a" },
  ],
  finish: [
    { id: "none", label: "No finish", sub: "Clean top", price: 0 },
    { id: "foam", label: "Cardamom foam", sub: "Cold, spiced cloud", price: 4 },
    { id: "pistachio", label: "Pistachio dust", sub: "Iranian pistachio", price: 4 },
    { id: "gold", label: "24k gold leaf", sub: "The Sparta way", price: 15 },
  ],
  size: [{ id: "regular", label: "Regular", price: 0 }, { id: "large", label: "Large", price: 6 }],
};
const LABELS: Record<Exclude<Group, "size">, string> = { base: "Base", temp: "Temperature", milk: "Milk", sweet: "Sweetness", finish: "Finish" };

// Deterministic scatter for gold flakes and pistachio dust
const rnd = (i: number) => (Math.sin(i * 91.7) + 1) / 2;
const FLAKES = Array.from({ length: 16 }, (_, i) => ({ x: 60 + rnd(i) * 80, y: -4 + rnd(i + 40) * 16, r: rnd(i + 9) * 360 }));
const DUST = Array.from({ length: 26 }, (_, i) => ({ x: 58 + rnd(i + 17) * 84, y: -2 + rnd(i + 5) * 10, r: 1.2 + rnd(i + 3) }));

const TOP = 30, BOT = 255, H = BOT - TOP;
const yAt = (lvl: number) => BOT - H * Math.min(0.97, lvl);
const layerY = (lvl: number) => ({ transform: `translateY(${lvl > 0 ? yAt(lvl) : BOT + 4}px)` });

export default function Atelier() {
  const { addLine, toast } = useApp();
  const [pick, setPick] = useState<Record<Group, string>>({ base: "espresso", temp: "iced", milk: "oat", sweet: "saffron", finish: "gold", size: "regular" });
  const [name, setName] = useState("");
  const cup = useRef<SVGSVGElement>(null);
  const get = (g: Group) => A[g].find((o) => o.id === pick[g])!;

  const price = (Object.keys(A) as Group[]).reduce((n, g) => n + get(g).price, 0);
  const autoName = [
    pick.temp === "iced" ? "Iced" : "",
    pick.milk !== "none" && pick.milk !== "whole" ? get("milk").label : "",
    ({ saffron: "Saffron", date: "Date", rose: "Rose" } as Record<string, string>)[pick.sweet] ?? "",
    get("base").label,
  ].filter(Boolean).join(" ") + (pick.finish === "gold" ? ", gilded" : "");
  const title = name.trim() || autoName;

  // Layer levels (0–1 of the glass)
  const b = get("base"), m = get("milk"), s = get("sweet"), iced = pick.temp === "iced";
  const syrup = s.color ? 0.07 : 0;
  const base = syrup + (b.level ?? 0.3);
  const milk = m.color ? base + (b.id === "coldbrew" ? 0.3 : 0.44) : 0;
  const top = Math.max(base, milk);
  const foam = pick.finish === "foam" ? top + 0.12 : m.color && !iced ? top + 0.05 : 0;
  const surfaceY = yAt(Math.max(top, foam));
  const milkColor = m.color ? (b.id === "matcha" ? "#cfe0a8" : b.id === "cacao" ? "#b98d6c" : m.color) : "#e9d6b8";

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const note = (["temp", "milk", "sweet", "finish", "size"] as Group[]).map(get).filter((o) => o.id !== "none" && o.id !== "regular").map((o) => o.label).join(" · ");
    const line = { key: `atelier|${Object.values(pick).join("-")}|${title}`, id: "atelier", name: title, img: img(b.photo!, 200), unit: price, qty: 1, note };
    addLine(line, cup.current, true);
    if (canAnimate() && cup.current) {
      const t = getComputedStyle(cup.current).transform;
      cup.current.animate([{ transform: t }, { transform: "translateY(-10px) rotate(-6deg) scale(1.05)" }, { transform: t }], { duration: 600, easing: "cubic-bezier(0.22,1,0.36,1)" });
    }
    toast({ img: line.img, text: <><b>{title}</b> is on your order</>, action: { label: "Checkout", fn: () => document.getElementById("checkout")?.scrollIntoView() } });
  };

  return (
    <div className="atelier" data-fly-root>
      <div className="atelier-cup" aria-live="polite">
        <svg viewBox="0 0 200 270" role="img" aria-label={`Your drink: ${autoName}`} ref={cup}
          style={{ transform: pick.size === "large" ? "scale(1.08)" : "none", transition: "transform var(--dur-slow) var(--ease-spring)" }}>
          <defs>
            <clipPath id="glass-clip"><path d="M42 30h116l-13 214a12 12 0 0 1-12 11H67a12 12 0 0 1-12-11Z" /></clipPath>
            <linearGradient id="shine" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset=".25" stopColor="#fff" stopOpacity="0" /><stop offset=".85" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".18" /></linearGradient>
          </defs>
          {!iced && (
            <g className="steam" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".45">
              <path d="M80 18c-6-8 6-10 0-18" /><path d="M100 20c-6-8 6-10 0-18" /><path d="M120 18c-6-8 6-10 0-18" />
            </g>
          )}
          <g clipPath="url(#glass-clip)">
            <rect x="0" y="0" width="200" height="270" fill="rgba(255,255,255,.08)" />
            <rect className="layer" x="0" y="0" width="200" height="300" fill={pick.finish === "foam" ? "#f6ecd9" : "#f3e6cf"} style={layerY(foam)} />
            <rect className="layer" x="0" y="0" width="200" height="300" fill={milkColor} style={layerY(milk)} />
            <rect className="layer" x="0" y="0" width="200" height="300" fill={b.color!} style={layerY(base)} />
            <rect className="layer" x="0" y="0" width="200" height="300" fill={s.color ?? "#000"} style={layerY(syrup)} />
            <g className="flakes" opacity={iced ? 1 : 0} fill="rgba(255,255,255,.4)" stroke="rgba(255,255,255,.7)">
              <rect x="64" y="96" width="34" height="34" rx="6" transform="rotate(-12 81 113)" />
              <rect x="104" y="120" width="32" height="32" rx="6" transform="rotate(14 120 136)" />
              <rect x="74" y="150" width="30" height="30" rx="6" transform="rotate(8 89 165)" />
            </g>
            <g className="flakes" opacity={pick.finish === "pistachio" ? 1 : 0} fill="#7fae4a" transform={`translate(0 ${surfaceY})`}>
              {DUST.map((d, i) => <circle key={i} r={d.r} cx={d.x} cy={d.y} />)}
            </g>
            <g className="flakes" opacity={pick.finish === "gold" ? 1 : 0} fill="#e3b454" transform={`translate(0 ${surfaceY})`}>
              {FLAKES.map((f, i) => <polygon key={i} points="0,0 7,2 4,7" transform={`translate(${f.x} ${f.y}) rotate(${f.r})`} />)}
            </g>
            <rect x="0" y="0" width="200" height="270" fill="url(#shine)" />
          </g>
          <path d="M42 30h116l-13 214a12 12 0 0 1-12 11H67a12 12 0 0 1-12-11Z" fill="none" stroke="currentColor" strokeOpacity=".5" strokeWidth="2.5" />
        </svg>
        <div className="cup-name">{title}</div>
        <div className="cup-price">AED {price}</div>
      </div>

      <form className="atelier-opts" onSubmit={add}>
        {(Object.keys(LABELS) as (keyof typeof LABELS)[]).map((g) => (
          <fieldset className="opt-group" key={g} style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="sr-only">{LABELS[g]}</legend>
            <span aria-hidden="true">{LABELS[g]}</span>
            <div className="choice-grid">
              {A[g].map((o) => (
                <label className="choice" key={o.id}>
                  <input type="radio" name={g} value={o.id} checked={pick[g] === o.id} onChange={() => setPick((p) => ({ ...p, [g]: o.id }))} />
                  <span className="choice-card">
                    {o.color ? <i className="swatch" style={{ background: o.color }} /> : null}
                    <b>{o.label}</b><span>{o.sub}{o.price ? ` · +${o.price}` : ""}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <div className="form-grid" style={{ alignItems: "end" }}>
          <div className="field"><label htmlFor="drink-name">Name your creation</label><input className="input" id="drink-name" maxLength={32} placeholder="e.g. Tuesday Gold" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field">
            <span className="label" id="size-l">Size</span>
            <div className="opt-row" role="radiogroup" aria-labelledby="size-l">
              {A.size.map((o) => (
                <button key={o.id} type="button" className="chip" role="radio" aria-checked={pick.size === o.id} onClick={() => setPick((p) => ({ ...p, size: o.id }))}>
                  {o.label}{o.price ? <> <small>+{o.price}</small></> : null}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className="btn" type="submit" style={{ justifySelf: "start" }}>Add to order · AED {price}</button>
      </form>
    </div>
  );
}
