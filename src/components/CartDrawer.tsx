"use client";

import Link from "next/link";
import { money } from "@/lib/data";
import { useApp } from "./AppProvider";
import { EmptyState, LineItem } from "./CartBits";
import Modal from "./Modal";
import { ArrowIcon, CloseIcon, StarIcon, TrashIcon } from "./icons";

export default function CartDrawer() {
  const { lines, subtotal, cartOpen, setCartOpen, clearCart, restoreCart, toast } = useApp();
  const close = () => setCartOpen(false);

  const clear = () => {
    const snapshot = lines;
    clearCart();
    toast({ text: "Order cleared", action: { label: "Undo", fn: () => restoreCart(snapshot) } });
  };

  return (
    <Modal open={cartOpen} onClose={close} className="drawer" labelledBy="cart-title">
      <div className="drawer-inner">
        <div className="drawer-head">
          <h2 id="cart-title">Your order</h2>
          <button className="icon-btn" type="button" data-close aria-label="Close order"><CloseIcon /></button>
        </div>
        <div className="drawer-body">
          {lines.length ? lines.map((l) => <LineItem key={l.key} line={l} />) : <EmptyState action={<Link className="btn btn--sm" href="/menu" onClick={close}>Browse the menu</Link>} />}
        </div>
        {lines.length > 0 && (
          <div className="drawer-foot">
            <div className="points"><StarIcon /><span>You&apos;ll earn <b>{Math.floor(subtotal * 10)} Sparta Gold</b> points with this order.</span></div>
            <div className="totals">
              <div><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="muted"><span>VAT (5%) and delivery</span><span>at checkout</span></div>
            </div>
            <Link className="btn btn--block" href="/order#checkout" onClick={close}>Checkout · {money(subtotal)} <ArrowIcon /></Link>
            <button className="btn btn--ghost btn--sm" type="button" onClick={clear}><TrashIcon /> Clear order</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
