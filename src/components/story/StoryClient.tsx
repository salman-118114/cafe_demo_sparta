"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { img } from "@/lib/data";
import { canAnimate } from "@/lib/motion";
import { useApp } from "../AppProvider";
import Modal from "../Modal";
import { ArrowIcon, ArrowLeftIcon, CloseIcon } from "../icons";

const PHOTOS: [string, string, number, number][] = [
  ["1517248135467-4c7edcad34c4", "The salon at golden hour", 900, 600],
  ["1541167760496-1628856ab772", "Latte art, poured to order", 900, 1100],
  ["1453614512568-c4024d13c247", "The bar and the brew station", 900, 600],
  ["1579372786545-d24232daf58c", "High tea, served from 2 pm", 900, 1100],
  ["1447933601403-0c6688de566e", "This week's roast", 900, 900],
  ["1559339352-11d035aa65de", "The terrace, facing the sea", 900, 1100],
  ["1511920170033-f8396924c348", "Portafilter and fresh grounds", 900, 700],
  ["1555507036-ab1f4038808a", "Croissants, out of the oven at 6 am", 900, 1000],
  ["1518684079-3c830dcef090", "Our neighbour, the Burj Al Arab", 900, 700],
];

export function Gallery() {
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState(0);
  const [dir, setDir] = useState(0);
  const photo = useRef<HTMLImageElement>(null);
  const touchX = useRef<number | null>(null);

  const show = (i: number, d = 0) => { setDir(d); setAt((i + PHOTOS.length) % PHOTOS.length); };
  useEffect(() => {
    if (dir && canAnimate()) photo.current?.animate([{ opacity: 0, transform: `translateX(${dir * 30}px)` }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(0.22,1,0.36,1)" });
  }, [at, dir]);

  const [id, cap] = PHOTOS[at];
  return (
    <>
      <div className="gallery" data-reveal-group>
        {PHOTOS.map(([pid, c, w, h], i) => (
          <button key={pid} type="button" data-reveal aria-label={`Open photo: ${c}`} onClick={() => { show(i); setOpen(true); }}>
            <Image src={img(pid, 700)} alt={c} width={w} height={h} sizes="(max-width: 600px) 100vw, 420px" style={{ aspectRatio: `${w}/${h}`, objectFit: "cover" }} />
          </button>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} className="lightbox" label="Photo viewer"
        onKeyDown={(e) => { if (e.key === "ArrowLeft") show(at - 1, -1); if (e.key === "ArrowRight") show(at + 1, 1); }}>
        <figure
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
            touchX.current = null;
          }}>
          <img ref={photo} src={img(id, 1600)} alt={cap} />
          <figcaption>{cap} · {at + 1} / {PHOTOS.length}</figcaption>
          <button className="icon-btn lb-nav lb-prev" type="button" onClick={() => show(at - 1, -1)} aria-label="Previous photo"><ArrowLeftIcon /></button>
          <button className="icon-btn lb-nav lb-next" type="button" onClick={() => show(at + 1, 1)} aria-label="Next photo"><ArrowIcon /></button>
          <button className="icon-btn modal-close" type="button" data-close aria-label="Close viewer"><CloseIcon /></button>
        </figure>
      </Modal>
    </>
  );
}

const HOURS: [string, string][] = [["Sunday", "07:00 – 00:00"], ["Monday", "07:00 – 00:00"], ["Tuesday", "07:00 – 00:00"], ["Wednesday", "07:00 – 00:00"], ["Thursday", "07:00 – 00:00"], ["Friday", "07:00 – 01:00"], ["Saturday", "07:00 – 01:00"]];

/** Opening hours with today (in Dubai) highlighted after mount. */
export function HoursTable() {
  const [today, setToday] = useState("");
  useEffect(() => setToday(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", weekday: "long" }).format(new Date())), []);
  return (
    <table className="hours-table" aria-label="Opening hours">
      <tbody>
        {HOURS.map(([d, h]) => (
          <tr key={d} className={d === today ? "is-today" : ""}><td>{d}{d === today ? " · today" : ""}</td><td>{h}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

export function ContactForm() {
  const { toast } = useApp();
  const [v, setV] = useState({ name: "", email: "", topic: "Private event", msg: "" });
  const [bad, setBad] = useState({ name: false, email: false, msg: false });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    if (k in bad) setBad((b) => ({ ...b, [k]: false }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const b = { name: v.name.trim().length < 2, email: !/^\S+@\S+\.\S+$/.test(v.email.trim()), msg: v.msg.trim().length < 5 };
    setBad(b);
    const first = (Object.keys(b) as (keyof typeof b)[]).find((k) => b[k]);
    if (first) return document.getElementById(`c-${first}`)?.focus();
    toast({ text: `Thank you, ${v.name.trim().split(" ")[0]}. We'll reply within a day.`, timeout: 5000 });
    setV({ name: "", email: "", topic: "Private event", msg: "" });
  };

  return (
    <form className="form-grid" noValidate onSubmit={submit}>
      <div className={`field${bad.name ? " has-error" : ""}`}>
        <label htmlFor="c-name">Name</label>
        <input className="input" id="c-name" autoComplete="name" value={v.name} onChange={set("name")} aria-invalid={bad.name || undefined} />
        {bad.name && <span className="field-error">Tell us your name.</span>}
      </div>
      <div className={`field${bad.email ? " has-error" : ""}`}>
        <label htmlFor="c-email">Email</label>
        <input className="input" id="c-email" type="email" autoComplete="email" value={v.email} onChange={set("email")} aria-invalid={bad.email || undefined} />
        {bad.email && <span className="field-error">We need a valid email to reply.</span>}
      </div>
      <div className="field full">
        <label htmlFor="c-topic">Topic</label>
        <select className="select" id="c-topic" value={v.topic} onChange={set("topic")}>
          {["Private event", "Corporate gifting", "Wholesale beans", "Press", "Something else"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className={`field full${bad.msg ? " has-error" : ""}`}>
        <label htmlFor="c-msg">Message</label>
        <textarea className="textarea" id="c-msg" value={v.msg} onChange={set("msg")} aria-invalid={bad.msg || undefined} />
        {bad.msg && <span className="field-error">A few words, at least.</span>}
      </div>
      <div className="full"><button className="btn" type="submit">Send message</button></div>
    </form>
  );
}
