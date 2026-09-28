"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { canAnimate } from "@/lib/motion";

interface Props {
  open: boolean;
  onClose: () => void;
  className?: string;
  labelledBy?: string;
  label?: string;
  children: ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDialogElement>) => void;
}

/** Native <dialog> driven by React state, with enter/exit animation and backdrop close. */
export default function Modal({ open, onClose, className, labelledBy, label, children, onKeyDown }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.body.classList.add("is-locked");
    } else if (!open && d.open) {
      const done = () => {
        d.classList.remove("is-closing");
        d.close();
        if (!document.querySelector("dialog[open]")) document.body.classList.remove("is-locked");
      };
      if (!canAnimate()) return done();
      d.classList.add("is-closing");
      d.addEventListener("animationend", done, { once: true });
      const t = setTimeout(() => d.open && done(), 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Leaving the page with a dialog open must not leave the body scroll-locked
  useEffect(() => () => {
    setTimeout(() => { if (!document.querySelector("dialog[open]")) document.body.classList.remove("is-locked"); }, 0);
  }, []);

  return (
    <dialog
      ref={ref}
      className={className}
      aria-labelledby={labelledBy}
      aria-label={label}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t === ref.current || t.closest("[data-close]")) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
