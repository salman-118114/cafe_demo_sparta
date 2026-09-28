import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import Atelier from "@/components/order/Atelier";
import OrderFlow from "@/components/order/OrderFlow";
import QuickAdd from "@/components/order/QuickAdd";

export const metadata: Metadata = {
  title: "Order",
  description: "Order Sparta Café for delivery across Dubai, pickup, or straight to your table. Build a custom drink in the Atelier.",
};

const idx = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function OrderPage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="order-title">
        <span className="hero-arabic" aria-hidden="true" lang="ar">اطلب</span>
        <div className="container">
          <span className="eyebrow reveal-load" style={idx(0)}>Delivery · Pickup · Dine-in</span>
          <h1 id="order-title" className="reveal-load" style={idx(1)}>Order, <em>beautifully.</em></h1>
          <p className="lede reveal-load" style={idx(2)}>Build a drink in the Atelier, add something from the pastry case, and choose how it reaches you. Delivered across Dubai in about 35 minutes.</p>
        </div>
      </section>

      <OrderFlow>
        <section className="panel" id="atelier" aria-labelledby="atelier-title">
          <div className="panel-head">
            <h2 id="atelier-title"><span className="num-badge">01</span>The Drink Atelier</h2>
            <p className="muted" style={{ maxWidth: "34ch" }}>Compose your own cup. The glass fills as you choose.</p>
          </div>
          <Atelier />
        </section>

        <section className="panel" aria-labelledby="qa-title">
          <div className="panel-head">
            <h2 id="qa-title"><span className="num-badge">02</span>From the pastry case</h2>
            <Link className="link-arrow" href="/menu">Full menu <ArrowIcon /></Link>
          </div>
          <QuickAdd />
        </section>
      </OrderFlow>
    </>
  );
}
