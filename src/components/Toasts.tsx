"use client";

import { useEffect, useRef, useState } from "react";
import { canAnimate } from "@/lib/motion";
import { useApp, type ToastData } from "./AppProvider";
import { CheckIcon, InfoIcon, StarIcon } from "./icons";

function Toast({ t, onDone }: { t: ToastData; onDone: (id: number) => void }) {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const leave = () => (canAnimate() ? setLeaving(true) : onDone(t.id));

  useEffect(() => {
    timer.current = setTimeout(leave, t.timeout ?? 3600);
    return () => clearTimeout(timer.current);
  }, []);

  const Icon = t.icon === "info" ? InfoIcon : t.icon === "star" ? StarIcon : CheckIcon;
  return (
    <div className={`toast${leaving ? " is-leaving" : ""}`}
      onAnimationEnd={() => leaving && onDone(t.id)}
      onPointerEnter={() => clearTimeout(timer.current)}
      onPointerLeave={() => { timer.current = setTimeout(leave, 1500); }}>
      {t.img ? <img src={t.img} alt="" /> : <span className="t-ico"><Icon /></span>}
      <p>{t.text}</p>
      {t.action && <button type="button" onClick={() => { t.action!.fn(); leave(); }}>{t.action.label}</button>}
    </div>
  );
}

/** Toast stack lives in the top layer (popover) so it shows above open dialogs. */
export default function Toasts() {
  const { toasts, dismissToast } = useApp();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el?.showPopover) return;
    try {
      if (el.matches(":popover-open")) el.hidePopover();
      if (toasts.length) el.showPopover();
    } catch { /* popover unsupported */ }
  }, [toasts]);

  return (
    <div className="toasts" ref={wrap} aria-live="polite" popover="manual">
      {toasts.map((t) => <Toast key={t.id} t={t} onDone={dismissToast} />)}
    </div>
  );
}
