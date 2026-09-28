"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { categories, items, type Item, type Tag } from "@/lib/data";
import { canAnimate } from "@/lib/motion";
import { EmptyState } from "../CartBits";
import DishCard from "../DishCard";
import { SearchIcon } from "../icons";

type Sort = "default" | "price-asc" | "price-desc" | "kcal";
const FILTERS: [Tag, string][] = [["signature", "Signature"], ["veg", "Vegetarian"], ["vegan", "Vegan"], ["gf", "Gluten-free"]];
const SORTERS: Record<Sort, (a: Item, b: Item) => number> = {
  default: () => 0,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  kcal: (a, b) => a.kcal - b.kcal,
};

export default function MenuBrowser({ intro }: { intro: React.ReactNode }) {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState(""); // debounced
  const [filters, setFilters] = useState<Set<Tag>>(new Set());
  const [sort, setSort] = useState<Sort>("default");
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const bar = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);

  // Animate filter changes with a same-document View Transition where supported
  const morph = (fn: () => void) => {
    if (document.startViewTransition && canAnimate()) document.startViewTransition(() => flushSync(fn));
    else fn();
  };

  useEffect(() => {
    const t = setTimeout(() => morph(() => setQuery(q.trim().toLowerCase())), 160);
    return () => clearTimeout(t);
  }, [q]);

  const sections = useMemo(() => {
    const matches = (it: Item) => {
      if (query && !`${it.name} ${it.desc}`.toLowerCase().includes(query)) return false;
      for (const f of filters) {
        if (f === "veg" ? !(it.tags.includes("veg") || it.tags.includes("vegan")) : !it.tags.includes(f)) return false;
      }
      return true;
    };
    return categories.map((c) => ({ c, list: items.filter((i) => i.cat === c.id && matches(i)).sort(SORTERS[sort]) }));
  }, [query, filters, sort]);
  const total = sections.reduce((n, s) => n + s.list.length, 0);
  const visibleCats = sections.filter((s) => s.list.length).map((s) => s.c.id);

  // Scroll-spy: the chapter in the reading zone drives the sliding indicator
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActiveCat(vis.target.id);
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".menu-section:not([hidden])").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [sections]);

  useEffect(() => {
    const move = () => {
      const cat = visibleCats.includes(activeCat) ? activeCat : visibleCats[0];
      const a = bar.current?.querySelector<HTMLAnchorElement>(`[data-cat="${cat}"]`);
      if (!a || !indicator.current || !bar.current) return;
      indicator.current.style.transform = `translateX(${a.offsetLeft}px) scaleX(${a.offsetWidth / 100})`;
      bar.current.scrollTo({ left: a.offsetLeft - bar.current.clientWidth / 2 + a.offsetWidth / 2, behavior: canAnimate() ? "smooth" : "auto" });
    };
    move();
    addEventListener("resize", move);
    return () => removeEventListener("resize", move);
  }, [activeCat, visibleCats.join()]);

  const toggle = (f: Tag) => morph(() => setFilters((s) => { const n = new Set(s); if (n.has(f)) n.delete(f); else n.add(f); return n; }));
  const reset = () => morph(() => { setQ(""); setQuery(""); setFilters(new Set()); });
  const current = visibleCats.includes(activeCat) ? activeCat : visibleCats[0];

  return (
    <>
      <section className="page-hero" aria-labelledby="menu-title">
        <span className="hero-arabic" aria-hidden="true" lang="ar">قائمة</span>
        <div className="container">
        {intro}
        <div className="menu-tools reveal-load" style={{ "--i": 3 } as React.CSSProperties}>
          <div className="search">
            <SearchIcon />
            <label className="sr-only" htmlFor="menu-search">Search the menu</label>
            <input className="input" id="menu-search" type="search" placeholder="Search saffron, wagyu, matcha…" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="filters" role="group" aria-label="Dietary filters">
            {FILTERS.map(([f, label]) => (
              <button key={f} type="button" className="chip" aria-pressed={filters.has(f)} onClick={() => toggle(f)}>{label}</button>
            ))}
          </div>
          <label className="sr-only" htmlFor="menu-sort">Sort dishes</label>
          <select className="select" id="menu-sort" value={sort} onChange={(e) => morph(() => setSort(e.target.value as Sort))}>
            <option value="default">Chef&apos;s order</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="kcal">Lightest first</option>
          </select>
        </div>
        </div>
      </section>

      <nav className="cat-bar" aria-label="Menu chapters">
        <div className="container cat-scroll" ref={bar}>
          <span className="cat-indicator" ref={indicator} aria-hidden="true" />
          {categories.map((c) => (
            <a key={c.id} href={`#${c.id}`} data-cat={c.id} hidden={!visibleCats.includes(c.id)} aria-current={current === c.id}>{c.name}</a>
          ))}
        </div>
      </nav>

      <div className="container" style={{ paddingBottom: "var(--section)" }}>
        {total === 0 ? (
          <EmptyState title="Nothing matches that, yet" body="Try fewer filters, or search for “saffron”."
            action={<button className="btn btn--sm" type="button" onClick={reset}>Clear search &amp; filters</button>} />
        ) : sections.map(({ c, list }) => (
          <section className="menu-section" id={c.id} key={c.id} aria-labelledby={`h-${c.id}`} hidden={!list.length}>
            <div className="menu-section-head">
              <h2 id={`h-${c.id}`}>{c.name}</h2>
              <span className="arabic" lang="ar" aria-hidden="true">{c.ar}</span>
              <span className="count">{list.length} {list.length === 1 ? "dish" : "dishes"}</span>
            </div>
            <p className="muted" style={{ margin: "-12px 0 24px" }}>{c.blurb}</p>
            <div className="dish-grid">{list.map((it) => <DishCard key={it.id} item={it} />)}</div>
          </section>
        ))}
        <p className="results-note" role="status">{query || filters.size ? `${total} ${total === 1 ? "dish matches" : "dishes match"} your search.` : ""}</p>
      </div>
    </>
  );
}
