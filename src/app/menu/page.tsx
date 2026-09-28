import type { Metadata } from "next";
import MenuBrowser from "@/components/menu/MenuBrowser";

export const metadata: Metadata = {
  title: "Menu",
  description: "The Sparta Café menu: signature saffron lattes, single-origin coffee, brunch, wagyu plates, bakery and desserts. Prices in AED.",
};

const idx = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function MenuPage() {
  return (
    <MenuBrowser
      intro={
        <>
          <span className="eyebrow reveal-load" style={idx(0)}>33 dishes · 7 chapters · prices in AED</span>
          <h1 id="menu-title" className="reveal-load" style={idx(1)}>The <em>menu.</em></h1>
          <p className="lede reveal-load" style={idx(2)}>Everything is made here, from the 72-hour sourdough to the gold-leaf glaze. Tap a dish to customise it, or press <kbd>Ctrl K</kbd> to search from anywhere.</p>
        </>
      }
    />
  );
}
