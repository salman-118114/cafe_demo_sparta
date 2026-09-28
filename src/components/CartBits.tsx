"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { money, type CartLine } from "@/lib/data";
import { useApp } from "./AppProvider";
import { CupIcon } from "./icons";

export function LineItem({ line }: { line: CartLine }) {
  const { setQty } = useApp();
  return (
    <div className="line-item">
      <img src={line.img} alt="" width={64} height={64} loading="lazy" />
      <div><h3>{line.name}</h3><p>{line.note ? line.note + " · " : ""}{money(line.unit)}</p></div>
      <div className="li-right">
        <span className="li-price">{money(line.unit * line.qty)}</span>
        <div className="qty" role="group" aria-label={`Quantity for ${line.name}`}>
          <button type="button" onClick={() => setQty(line.key, line.qty - 1)} aria-label="Remove one">−</button>
          <output>{line.qty}</output>
          <button type="button" onClick={() => setQty(line.key, line.qty + 1)} aria-label="Add one">+</button>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title = "Your order is empty", body = "The Saffron Gold Latte is a good place to start.", action }: { title?: string; body?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <CupIcon />
      <h3>{title}</h3>
      <p>{body}</p>
      {action === undefined ? <Link className="btn btn--sm" href="/menu">Browse the menu</Link> : action}
    </div>
  );
}
