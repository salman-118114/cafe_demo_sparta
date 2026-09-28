"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../AppProvider";
import Modal from "../Modal";
import { CloseIcon } from "../icons";

type Shape = "round" | "square" | "rect" | "stool" | "majlis";
interface Table { id: string; zone: string; x: number; y: number; seats: number; shape: Shape; note: string }

const TABLES: Table[] = [
  { id: "W1", zone: "Window", x: 80, y: 80, seats: 2, shape: "round", note: "Corner window, the best sunset angle on the Burj Al Arab." },
  { id: "W2", zone: "Window", x: 170, y: 80, seats: 2, shape: "round", note: "Window two-top, close to the pastry case." },
  { id: "W3", zone: "Window", x: 260, y: 80, seats: 4, shape: "round", note: "Window four-top, dead centre of the view." },
  { id: "W4", zone: "Window", x: 360, y: 80, seats: 4, shape: "round", note: "Window four-top by the brass lanterns." },
  { id: "S1", zone: "Salon", x: 80, y: 280, seats: 4, shape: "square", note: "Salon table under the arched mirror." },
  { id: "S2", zone: "Salon", x: 360, y: 280, seats: 6, shape: "rect", note: "Long salon table for six, quiet side." },
  { id: "B1", zone: "Bar", x: 170, y: 170, seats: 1, shape: "stool", note: "Bar stool: watch the Giesen roaster at work." },
  { id: "B2", zone: "Bar", x: 230, y: 170, seats: 1, shape: "stool", note: "Bar stool, front row for latte art." },
  { id: "B3", zone: "Bar", x: 290, y: 170, seats: 1, shape: "stool", note: "Bar stool nearest the espresso machine." },
  { id: "M1", zone: "Majlis", x: 120, y: 425, seats: 8, shape: "majlis", note: "Majlis with floor cushions, private for up to eight." },
  { id: "M2", zone: "Majlis", x: 310, y: 425, seats: 6, shape: "majlis", note: "Majlis corner with a low brass table." },
  { id: "T1", zone: "Terrace", x: 530, y: 110, seats: 2, shape: "round", note: "Terrace edge, sea breeze, no roof above." },
  { id: "T2", zone: "Terrace", x: 530, y: 210, seats: 4, shape: "round", note: "Terrace under the pergola, lantern-lit after dark." },
  { id: "T3", zone: "Terrace", x: 530, y: 310, seats: 4, shape: "round", note: "Terrace, closest to the sand." },
  { id: "T4", zone: "Terrace", x: 530, y: 415, seats: 6, shape: "rect", note: "Terrace long table for sunset dinners." },
];
const SLOTS = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00", "21:30", "23:00"];
const OCCASIONS = ["Birthday", "Anniversary", "Business", "Proposal"];
const UAE_MOBILE = /^(\+?971|0)?\s?5\d([\s-]?\d){7}$/;

const hash = (s: string) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dubaiNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" }));

function TableShape({ t }: { t: Table }) {
  const seat = (cx: number, cy: number, k: string | number) => <circle key={k} className="seat" cx={cx} cy={cy} r="7" />;
  if (t.shape === "stool") return <circle className="top" cx="0" cy="0" r="15" />;
  if (t.shape === "round") {
    const r = t.seats > 2 ? 26 : 20;
    return <>{Array.from({ length: t.seats }, (_, i) => { const a = (i / t.seats) * Math.PI * 2 - Math.PI / 2; return seat(Math.cos(a) * (r + 12), Math.sin(a) * (r + 12), i); })}<circle className="top" cx="0" cy="0" r={r} /></>;
  }
  if (t.shape === "square") return <>{[[0, -38], [0, 38], [-38, 0], [38, 0]].map(([x, y], i) => seat(x, y, i))}<rect className="top" x="-26" y="-26" width="52" height="52" rx="8" /></>;
  if (t.shape === "rect") return <>{[-30, 0, 30].flatMap((x) => [seat(x, -32, `${x}a`), seat(x, 32, `${x}b`)])}<rect className="top" x="-45" y="-22" width="90" height="44" rx="10" /></>;
  const w = t.seats > 6 ? 150 : 120; // majlis: U of cushions around a low table
  return <><path className="seat" d={`M${-w / 2} -30h${w}v10h${-w + 12}v40h-12z`} /><rect className="top" x={-w / 2 + 22} y="-8" width={w - 44} height="36" rx="18" /></>;
}

export default function ReservePlanner() {
  const { toast } = useApp();
  const [today, setToday] = useState<Date | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [party, setParty] = useState(2);
  const [table, setTable] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errs, setErrs] = useState({ name: false, phone: false, slot: false });
  const [ticket, setTicket] = useState<null | { code: string; t: Table; nice: string; name: string }>(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const floor = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = dubaiNow(); setToday(t); setDate(iso(t)); }, []);

  const days = today ? Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i); return d; }) : [];
  const isToday = today && date === iso(today);
  const nowMin = today ? today.getHours() * 60 + today.getMinutes() : 0;
  const slotState = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const past = !!isToday && h * 60 + m < nowMin + 30;
    const full = hash(date + t) % 7 === 0;
    return { past, full, disabled: past || full };
  };
  const tableState = (t: Table) => {
    const taken = time ? hash(date + time + t.id) % 10 < 3 : hash(date + t.id) % 5 === 0;
    const small = t.seats < party;
    return { taken, small, disabled: taken || small };
  };

  // Drop selections that became unavailable
  useEffect(() => { if (time && slotState(time).disabled) setTime(null); }, [date]);
  useEffect(() => {
    const t = TABLES.find((x) => x.id === table);
    if (t && tableState(t).disabled) setTable(null);
  }, [date, time, party]);

  const choose = (t: Table) => {
    const st = tableState(t);
    if (st.disabled) return toast({ icon: "info", text: st.small && !st.taken ? `${t.id} seats ${t.seats}. For ${party} guests try a larger table.` : `${t.id} is booked at that time. Try another slot.` });
    setTable(t.id);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) { setErrs((x) => ({ ...x, slot: true })); document.querySelector<HTMLButtonElement>(".slot:not(:disabled)")?.focus(); return; }
    if (!table) { toast({ icon: "info", text: "Choose a table on the floor plan to finish." }); floor.current?.scrollIntoView({ block: "center" }); return; }
    const bad = { name: name.trim().length < 2, phone: !UAE_MOBILE.test(phone.trim()), slot: false };
    setErrs(bad);
    if (bad.name) return document.getElementById("r-name")?.focus();
    if (bad.phone) return document.getElementById("r-phone")?.focus();
    const t = TABLES.find((x) => x.id === table)!;
    const nice = new Date(date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    setTicket({ code: "SPR-" + (hash(date + time + table + name) % 90000 + 10000), t, nice, name: name.trim() });
    setTicketOpen(true);
  };

  const downloadIcs = () => {
    if (!ticket || !time) return;
    const [h, m] = time.split(":").map(Number);
    const ymd = date.replace(/-/g, "");
    const pad = (n: number) => String(n).padStart(2, "0");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sparta Cafe//Reservations//EN", "BEGIN:VEVENT",
      `UID:${ticket.code}@spartacafe.ae`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
      `DTSTART;TZID=Asia/Dubai:${ymd}T${pad(h)}${pad(m)}00`, `DTEND;TZID=Asia/Dubai:${ymd}T${pad(Math.min(h + 2, 23))}${pad(m)}00`,
      `SUMMARY:Sparta Café · Table ${ticket.t.id} (${party} guests)`, "LOCATION:Sparta Café\\, Jumeirah Beach Road\\, Umm Suqeim 3\\, Dubai",
      `DESCRIPTION:Booking ${ticket.code}. ${ticket.t.note}`, "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `sparta-${ticket.code}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast({ text: "Calendar invite downloaded. See you there." });
  };

  // QR-style pattern: three finder squares + deterministic modules
  const qr = (code: string) => {
    const cells: React.ReactNode[] = [];
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      const finder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (!finder && hash(`${code}${x},${y}`) % 2) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />);
    }
    const finderAt = (x: number, y: number) => (
      <g key={`f${x}${y}`}><rect x={x} y={y} width="7" height="7" fill="currentColor" /><rect x={x + 1} y={y + 1} width="5" height="5" fill="var(--bg-raised)" /><rect x={x + 2} y={y + 2} width="3" height="3" fill="currentColor" /></g>
    );
    return [finderAt(0, 0), finderAt(14, 0), finderAt(0, 14), ...cells];
  };

  const sel = TABLES.find((x) => x.id === table);
  const whenLabel = date ? new Date(date + "T00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) + (time ? ` · ${time}` : " · choose a time") : "";

  return (
    <div className="container reserve-layout" style={{ paddingBottom: "var(--section)" }}>
      <form className="stack" style={{ "--flow": "32px" } as React.CSSProperties} noValidate onSubmit={submit}>
        <div className="field">
          <span className="label" id="date-l">Date</span>
          <div className="date-strip" role="group" aria-labelledby="date-l">
            {today ? days.map((d, i) => (
              <button key={iso(d)} type="button" className="date-chip" aria-pressed={date === iso(d)} onClick={() => setDate(iso(d))}
                aria-label={d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}>
                <small>{i === 0 ? "Today" : d.toLocaleDateString("en-GB", { weekday: "short" })}</small>
                <b>{d.getDate()}</b>
                <small>{d.toLocaleDateString("en-GB", { month: "short" })}</small>
              </button>
            )) : Array.from({ length: 8 }, (_, i) => <span key={i} className="date-chip" aria-hidden="true" style={{ opacity: 0.4 }}><small>&nbsp;</small><b>&nbsp;</b><small>&nbsp;</small></span>)}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "end" }}>
          <div className="field">
            <span className="label" id="party-l">Guests</span>
            <div className="qty" role="group" aria-labelledby="party-l" style={{ height: 48 }}>
              <button type="button" onClick={() => setParty((p) => Math.max(1, p - 1))} aria-label="Fewer guests">−</button>
              <output aria-live="polite">{party}</output>
              <button type="button" onClick={() => setParty((p) => Math.min(10, p + 1))} aria-label="More guests">+</button>
            </div>
          </div>
          <div className="field" style={{ flex: 1, minWidth: 240 }}>
            <span className="label" id="occ-l">Occasion</span>
            <div className="opt-row" role="group" aria-labelledby="occ-l">
              {OCCASIONS.map((o) => (
                <button key={o} type="button" className="chip" aria-pressed={occasion === o} onClick={() => {
                  const on = occasion !== o;
                  setOccasion(on ? o : null);
                  if (on && o === "Proposal") toast({ icon: "star", text: "Proposal noted. We'll hold the corner window, dim the lanterns and keep it quiet." });
                }}>{o === "Proposal" ? "Proposal ✦" : o}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="field">
          <span className="label" id="time-l">Time</span>
          <div className="slots" role="group" aria-labelledby="time-l">
            {SLOTS.map((t) => {
              const st = today ? slotState(t) : { disabled: true, full: false, past: false };
              return (
                <button key={t} type="button" className="slot" aria-pressed={time === t} disabled={st.disabled}
                  aria-label={`${t}${st.full ? ", fully booked" : st.past ? ", passed" : ""}`}
                  onClick={() => { setTime(t); setErrs((x) => ({ ...x, slot: false })); }}>{t}</button>
              );
            })}
          </div>
          {errs.slot && <span className="field-error" style={{ display: "block" }}>Pick a time first.</span>}
        </div>

        <div className="form-grid">
          <div className={`field${errs.name ? " has-error" : ""}`}>
            <label htmlFor="r-name">Name</label>
            <input className="input" id="r-name" autoComplete="name" placeholder="Omar Haddad" value={name} aria-invalid={errs.name || undefined}
              onChange={(e) => { setName(e.target.value); setErrs((x) => ({ ...x, name: false })); }} />
            {errs.name && <span className="field-error">Who is the booking for?</span>}
          </div>
          <div className={`field${errs.phone ? " has-error" : ""}`}>
            <label htmlFor="r-phone">Mobile</label>
            <input className="input" id="r-phone" type="tel" autoComplete="tel" placeholder="+971 55 987 6543" value={phone} aria-invalid={errs.phone || undefined}
              onChange={(e) => { setPhone(e.target.value); setErrs((x) => ({ ...x, phone: false })); }} />
            {errs.phone && <span className="field-error">Enter a UAE mobile, like +971 55 987 6543.</span>}
          </div>
          <div className="field full">
            <label htmlFor="r-notes">Special requests</label>
            <textarea className="textarea" id="r-notes" placeholder="High chair, a candle on the dessert, a quiet corner…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <button className="btn" type="submit" style={{ justifySelf: "start" }}>Confirm reservation</button>
      </form>

      <div className="floor" aria-labelledby="floor-title" ref={floor}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
          <h2 id="floor-title" style={{ fontSize: "var(--step-2)" }}>The floor</h2>
          <span className="muted" style={{ fontSize: ".85rem", fontWeight: 700 }}>{whenLabel}</span>
        </div>
        <div className="floor-scroll" tabIndex={0} aria-label="Floor plan, scroll sideways on small screens">
          <svg viewBox="0 0 640 500" role="group" aria-label="Floor plan. Choose a table.">
            <rect className="zone" x="20" y="30" width="400" height="300" rx="18" />
            <line className="window" x1="40" y1="30" x2="400" y2="30" />
            <text className="zone-label" x="220" y="20" textAnchor="middle">Burj Al Arab view ↑</text>
            <text className="zone-label" x="40" y="160">Salon</text>
            <rect className="zone" x="20" y="350" width="400" height="130" rx="18" />
            <text className="zone-label" x="40" y="376">Majlis lounge</text>
            <rect className="zone" x="440" y="30" width="180" height="450" rx="18" style={{ strokeDasharray: "6 6" }} />
            <text className="zone-label" x="530" y="56" textAnchor="middle">Terrace · sea</text>
            <rect x="150" y="200" width="160" height="26" rx="13" fill="none" stroke="currentColor" strokeOpacity=".3" />
            <text className="zone-label" x="230" y="248" textAnchor="middle">Bar</text>
            <g>
              {TABLES.map((t) => {
                const st = today ? tableState(t) : { taken: false, small: false, disabled: true };
                const cls = ["tbl", st.taken ? "is-taken" : "", st.small && !st.taken ? "is-small" : "", table === t.id ? "is-selected" : ""].join(" ");
                return (
                  <g key={t.id} className={cls} transform={`translate(${t.x} ${t.y})`} role="button" tabIndex={st.disabled ? -1 : 0}
                    aria-label={`Table ${t.id}, ${t.zone}, ${t.seats} seat${t.seats > 1 ? "s" : ""}, ${st.taken ? "booked" : st.small ? "too small for your party" : "available"}`}
                    aria-pressed={table === t.id} aria-disabled={st.disabled}
                    onClick={() => choose(t)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(t); } }}>
                    <TableShape t={t} />
                    <text textAnchor="middle" dy="4">{t.id}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        <div className="legend"><span><i />Available</span><span><i className="l-sel" />Your table</span><span><i className="l-taken" />Booked</span><span><i style={{ opacity: 0.45 }} />Too small for party</span></div>
        <div className="table-info" aria-live="polite">
          {sel ? <><b>{sel.zone} · Table {sel.id} · {sel.seats} seat{sel.seats > 1 ? "s" : ""}</b>{sel.note}</>
            : <><b>No table chosen yet</b>{time ? "Tap an available table on the plan." : "Pick a time to see live availability. Window seats go first at sunset."}</>}
        </div>
      </div>

      <Modal open={ticketOpen} onClose={() => setTicketOpen(false)} className="ticket" labelledBy="t-title">
        {ticket && (
          <div className="ticket-card">
            <button className="icon-btn modal-close" type="button" data-close aria-label="Close" style={{ background: "transparent", color: "var(--on-brand)", borderColor: "currentColor" }}><CloseIcon /></button>
            <div className="ticket-top">
              <span className="eyebrow" style={{ color: "inherit", opacity: 0.85 }}>Booking {ticket.code}</span>
              <h2 id="t-title">See you soon.</h2>
              <p style={{ opacity: 0.9 }}>{ticket.name.split(" ")[0]}, your {ticket.t.zone.toLowerCase()} table is held for 15 minutes past arrival.</p>
            </div>
            <div className="ticket-tear" aria-hidden="true" />
            <div className="ticket-body">
              <dl>
                {([["Date", ticket.nice], ["Time", time], ["Guests", party], ["Table", `${ticket.t.id} · ${ticket.t.zone}`], ...(occasion ? [["Occasion", occasion]] : [])] as [string, string | number][]).map(([k, v]) => (
                  <div key={k} style={{ display: "contents" }}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
              <svg className="qr" viewBox="0 0 21 21" role="img" aria-label={`Booking code ${ticket.code}`}>{qr(ticket.code)}</svg>
            </div>
            <div className="ticket-actions">
              <button className="btn btn--sm" type="button" onClick={downloadIcs}>Add to calendar</button>
              <Link className="btn btn--ghost btn--sm" href="/order">Pre-order drinks</Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
