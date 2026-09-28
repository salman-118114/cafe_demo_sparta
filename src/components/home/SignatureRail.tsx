"use client";

import { useEffect, useRef } from "react";
import { byId } from "@/lib/data";
import { canAnimate } from "@/lib/motion";
import DishCard from "../DishCard";
import { ArrowIcon, ArrowLeftIcon } from "../icons";

const SIGNATURES = ["saffron-latte", "kunafa-croissant", "opera-cake", "date-cold-brew", "brulee-toast", "high-tea"];

export function RailControls() {
  const by = (dir: number) => {
    const rail = document.getElementById("sig-rail");
    const first = rail?.firstElementChild as HTMLElement | null;
    if (rail && first) rail.scrollBy({ left: dir * (first.offsetWidth + 24), behavior: canAnimate() ? "smooth" : "auto" });
  };
  return (
    <>
      <button className="icon-btn" type="button" onClick={() => by(-1)} aria-label="Previous signatures"><ArrowLeftIcon /></button>
      <button className="icon-btn" type="button" onClick={() => by(1)} aria-label="Next signatures"><ArrowIcon /></button>
    </>
  );
}

/** Horizontal rail: native touch scrolling, mouse drag-to-scroll, snap. */
export default function SignatureRail() {
  const rail = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let down = false, startX = 0, startLeft = 0;
    const onDown = (e: PointerEvent) => { if (e.pointerType !== "mouse") return; down = true; dragged.current = false; startX = e.clientX; startLeft = el.scrollLeft; };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) { el.classList.add("is-dragging"); dragged.current = true; }
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => { if (!down) return; down = false; el.classList.remove("is-dragging"); setTimeout(() => (dragged.current = false), 0); };
    el.addEventListener("pointerdown", onDown);
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    return () => { el.removeEventListener("pointerdown", onDown); removeEventListener("pointermove", onMove); removeEventListener("pointerup", onUp); };
  }, []);

  return (
    <div className="rail" id="sig-rail" ref={rail} data-reveal-group data-reveal-proxy tabIndex={0} aria-label="Signature dishes, scrollable">
      {SIGNATURES.map((id, i) => <DishCard key={id} item={byId[id]} rank={i + 1} reveal wasDragged={() => dragged.current} />)}
    </div>
  );
}
