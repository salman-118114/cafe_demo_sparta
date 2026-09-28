"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { img, items, pages, type Item } from "@/lib/data";
import { useApp } from "./AppProvider";
import Modal from "./Modal";
import { PageIcon, SearchIcon, StarIcon } from "./icons";

type Result =
  | { type: "dish"; label: string; item: Item }
  | { type: "page" | "action"; label: string; run: () => void };

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setCartOpen, openQuickView } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);

  // Ctrl/⌘K anywhere, or "/" when not typing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement as HTMLElement | null)?.tagName ?? "");
      if ((e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  useEffect(() => {
    if (!paletteOpen) return;
    setQ("");
    setActive(0);
    setTimeout(() => input.current?.focus(), 0);
  }, [paletteOpen]);

  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    const match = (t: string) => !s || t.toLowerCase().includes(s);
    const dishes: Result[] = items.filter((i) => match(`${i.name} ${i.desc} ${i.cat}`)).slice(0, s ? 8 : 4).map((i) => ({ type: "dish", label: i.name, item: i }));
    const pg: Result[] = pages.filter((p) => match(p.label)).map((p) => ({ type: "page", label: p.label, run: () => router.push(p.href) }));
    const ac: Result[] = [
      { type: "action" as const, label: "Toggle dark / light mode", run: () => document.getElementById("theme-toggle")?.click() },
      { type: "action" as const, label: "View my order", run: () => setCartOpen(true) },
      { type: "action" as const, label: "Build a custom drink", run: () => router.push("/order#atelier") },
      { type: "action" as const, label: "Book a table with a Burj view", run: () => router.push("/reserve") },
    ].filter((a) => match(a.label));
    return [
      { title: s ? "Dishes & drinks" : "Popular right now", results: dishes },
      { title: "Pages", results: pg },
      { title: "Actions", results: ac },
    ].filter((g) => g.results.length);
  }, [q, router, setCartOpen]);
  const flat = groups.flatMap((g) => g.results);

  useEffect(() => { list.current?.querySelector(`#pi-${active}`)?.scrollIntoView({ block: "nearest" }); }, [active]);

  const run = (i: number) => {
    const r = flat[i];
    if (!r) return;
    setPaletteOpen(false);
    setTimeout(() => (r.type === "dish" ? openQuickView(r.item.id) : r.run()), 180);
  };

  let idx = 0;
  return (
    <Modal open={paletteOpen} onClose={() => setPaletteOpen(false)} className="palette" label="Search Sparta">
      <div className="palette-search">
        <SearchIcon />
        <input ref={input} type="text" placeholder="Search dishes, drinks, pages…" autoComplete="off" role="combobox" aria-expanded="true"
          aria-controls="palette-list" aria-autocomplete="list" aria-activedescendant={flat.length ? `pi-${active}` : undefined}
          value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(flat.length - 1, a + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
            if (e.key === "Enter") { e.preventDefault(); run(active); }
          }} />
      </div>
      <div className="palette-list" id="palette-list" role="listbox" aria-label="Results" ref={list}>
        {groups.length === 0 && <div className="empty" style={{ padding: 32 }}><p>Nothing called “{q}” yet. Try “saffron”, “wagyu” or “matcha”.</p></div>}
        {groups.map((g) => (
          <div key={g.title}>
            <div className="palette-group" role="presentation">{g.title}</div>
            {g.results.map((r) => {
              const i = idx++;
              return (
                <button key={r.label} type="button" className="palette-item" role="option" id={`pi-${i}`} aria-selected={i === active}
                  onClick={() => run(i)} onPointerMove={() => i !== active && setActive(i)}>
                  {r.type === "dish"
                    ? <img src={img(r.item.photo, 120)} alt="" width={40} height={40} />
                    : <span className="pi-ico">{r.type === "page" ? <PageIcon /> : <StarIcon />}</span>}
                  <span>{r.label}</span>
                  <small>{r.type === "dish" ? `AED ${r.item.price}` : r.type === "page" ? "Go" : "Run"}</small>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> select</span><span><kbd>Esc</kbd> close</span></div>
    </Modal>
  );
}
