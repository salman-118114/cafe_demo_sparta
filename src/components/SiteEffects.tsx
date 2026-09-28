"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { canAnimate, canHover } from "@/lib/motion";

/**
 * Page-level motion wired once per route:
 * reveal-on-scroll (once), card spotlight, magnetic CTAs and count-up numbers.
 */
export default function SiteEffects() {
  const pathname = usePathname();

  // Spotlight follows the pointer on any .spotlight card (delegated, set once)
  useEffect(() => {
    if (!canHover()) return;
    const onMove = (e: PointerEvent) => {
      const s = (e.target as Element | null)?.closest?.(".spotlight") as HTMLElement | null;
      if (!s) return;
      const r = s.getBoundingClientRect();
      s.style.setProperty("--mx", e.clientX - r.left + "px");
      s.style.setProperty("--my", e.clientY - r.top + "px");
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const cleanups: (() => void)[] = [];
    const raf = requestAnimationFrame(() => {
      /* Reveal once */
      const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)")];
      if (!("IntersectionObserver" in window) || !canAnimate()) {
        els.forEach((el) => el.classList.add("is-revealed"));
      } else {
        document.querySelectorAll("[data-reveal-group]").forEach((g) =>
          g.querySelectorAll<HTMLElement>(":scope > [data-reveal]").forEach((el, i) => el.style.setProperty("--reveal-index", String(Math.min(i, 7)))));
        const io = new IntersectionObserver((entries) => entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("is-revealed"); io.unobserve(en.target); }
        }), { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
        // Children of a horizontal rail are clipped sideways: reveal them with their rail
        const proxies = new Map<Element, IntersectionObserver>();
        els.forEach((el) => {
          const proxy = el.parentElement?.closest("[data-reveal-proxy]");
          if (!proxy) return io.observe(el);
          if (proxies.has(proxy)) return;
          const pio = new IntersectionObserver((en) => {
            if (!en[0].isIntersecting) return;
            proxy.querySelectorAll("[data-reveal]").forEach((c) => c.classList.add("is-revealed"));
            pio.disconnect();
          }, { threshold: 0.08 });
          pio.observe(proxy);
          proxies.set(proxy, pio);
        });
        cleanups.push(() => { io.disconnect(); proxies.forEach((p) => p.disconnect()); });
      }
      root.classList.add("reveal-live");

      /* Count-up numbers */
      const counters = document.querySelectorAll<HTMLElement>("[data-count]");
      if (counters.length) {
        const run = (el: HTMLElement) => {
          const to = Number(el.dataset.count);
          const out = (v: number) => (el.textContent = Math.round(v) + (el.dataset.suffix ?? ""));
          if (!canAnimate()) return out(to);
          const t0 = performance.now();
          const step = (t: number) => { const p = Math.min(1, (t - t0) / 1400); out(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); };
          requestAnimationFrame(step);
        };
        const cio = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { run(x.target as HTMLElement); cio.unobserve(x.target); } }), { threshold: 0.5 });
        counters.forEach((c) => cio.observe(c));
        cleanups.push(() => cio.disconnect());
      }

      /* Magnetic CTAs */
      if (canHover() && canAnimate()) {
        document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
          };
          const leave = () => {
            el.animate([{ transform: el.style.transform }, { transform: "translate(0,0)" }], { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
            el.style.transform = "";
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
        });
      }
    });
    return () => { cancelAnimationFrame(raf); cleanups.forEach((c) => c()); };
  }, [pathname]);

  return null;
}
