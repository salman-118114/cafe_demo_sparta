"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pages } from "@/lib/data";
import { canAnimate, store } from "@/lib/motion";
import { useApp } from "./AppProvider";
import { BagIcon, CloseIcon, LogoMark, MenuIcon, SearchIcon, ThemeIcon } from "./icons";

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = dark ? "light" : "dark";
    const root = document.documentElement;
    const apply = () => { root.dataset.theme = next; store.set("sparta-theme", next); setDark(next === "dark"); };
    if (!document.startViewTransition || !canAnimate()) return apply();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    root.classList.add("theme-vt");
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => {
      const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.2, 0, 0, 1)", pseudoElement: "::view-transition-new(root)" });
    });
    vt.finished.finally(() => root.classList.remove("theme-vt"));
  };

  return (
    <button className="icon-btn theme-toggle" type="button" id="theme-toggle" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      <ThemeIcon />
    </button>
  );
}

/** Live open/closed pill on Dubai time. */
function StatusPill() {
  const [label, setLabel] = useState("Dubai");
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit", hour12: false });
    const dayFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", weekday: "short" });
    const tick = () => {
      const now = new Date();
      const [h, m] = fmt.format(now).split(":").map(Number);
      const day = dayFmt.format(now);
      const lateNight = h < 1 && (day === "Sat" || day === "Sun"); // Fri & Sat close at 01:00
      const isOpen = h >= 7 || lateNight;
      setOpen(isOpen);
      setLabel(`${isOpen ? "Open now" : "Opens 7:00"} · Dubai ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    };
    tick();
    const t = setInterval(tick, 20000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={`status-pill${open ? "" : " is-closed"}`} role="status">
      <i className="status-dot" /><span>{label}</span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { count, setCartOpen, setPaletteOpen } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const openBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        setScrolled(y > 12);
        const max = document.documentElement.scrollHeight - innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => { setNavOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.classList.toggle("is-locked", navOpen);
    if (navOpen) setTimeout(() => closeBtn.current?.focus(), 50);
  }, [navOpen]);

  const closeNav = () => { setNavOpen(false); openBtn.current?.focus(); };
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="progress" ref={bar} aria-hidden="true" />
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`} id="site-header">
        <div className="container">
          <Link className="logo" href="/" aria-label="Sparta Café home"><LogoMark /><span className="logo-word"><b>Sparta</b><small>CAFÉ · DUBAI</small></span></Link>
          <nav className="nav" aria-label="Main">
            <ul role="list">
              {pages.map((p) => <li key={p.href}><Link href={p.href} aria-current={isCurrent(p.href) ? "page" : undefined}>{p.label}</Link></li>)}
            </ul>
          </nav>
          <div className="header-actions">
            <StatusPill />
            <button className="kbd-btn" type="button" onClick={() => setPaletteOpen(true)} aria-label="Search the menu (Ctrl K)"><SearchIcon /><span>Search</span><kbd>Ctrl K</kbd></button>
            <ThemeToggle />
            <button className="icon-btn cart-btn" type="button" id="cart-btn" onClick={() => setCartOpen(true)} aria-label={`Open your order, ${count} item${count === 1 ? "" : "s"}`}>
              <BagIcon /><span className={`cart-count${count ? " has-items" : ""}`}>{count}</span>
            </button>
            <button className="icon-btn menu-toggle" type="button" ref={openBtn} onClick={() => setNavOpen(true)} aria-expanded={navOpen} aria-controls="mobile-nav" aria-label="Open menu"><MenuIcon /></button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav${navOpen ? " is-open" : ""}`} id="mobile-nav" role="dialog" aria-modal="true" aria-label="Site" onKeyDown={(e) => e.key === "Escape" && closeNav()}>
        <div className="mobile-nav-top">
          <span className="logo" style={{ color: "inherit" }}><LogoMark /><span className="logo-word"><b>Sparta</b></span></span>
          <button className="icon-btn" type="button" ref={closeBtn} onClick={closeNav} aria-label="Close menu"><CloseIcon /></button>
        </div>
        <ul role="list">
          {pages.map((p, i) => (
            <li key={p.href} style={{ "--i": i } as React.CSSProperties}>
              <Link href={p.href} onClick={() => setNavOpen(false)}><small>0{i + 1}</small>{p.label}</Link>
            </li>
          ))}
        </ul>
        <div className="mobile-nav-foot"><span>Jumeirah Beach Rd, Dubai</span><span>Daily 7:00 – 01:00</span></div>
      </div>
    </>
  );
}
