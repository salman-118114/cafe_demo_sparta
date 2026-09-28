/* Small motion helpers shared by client components. */

export const canAnimate = () =>
  typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function bumpCart(btn: HTMLElement) {
  btn.classList.remove("is-bumped");
  void btn.offsetWidth;
  btn.classList.add("is-bumped");
}

/** Arc a thumbnail from the source element into the header bag icon. */
export function flyToCart(source: Element | null | undefined, src: string) {
  const btn = document.getElementById("cart-btn");
  if (!btn) return;
  const from = source && (/^(IMG|svg)$/.test(source.tagName) ? source : source.closest("[data-fly-root], .card, .mini, .qv")?.querySelector("img"));
  if (!from || !canAnimate()) return bumpCart(btn);
  const a = from.getBoundingClientRect(), b = btn.getBoundingClientRect();
  const size = 72;
  const fly = document.createElement("img");
  fly.className = "fly";
  fly.src = src;
  fly.alt = "";
  Object.assign(fly.style, { width: size + "px", height: size + "px", left: a.left + a.width / 2 - size / 2 + "px", top: a.top + a.height / 2 - size / 2 + "px" });
  document.body.append(fly);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  fly.animate([
    { transform: "translate(0,0) scale(1)", opacity: 1 },
    { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 90}px) scale(0.8)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0.4 },
  ], { duration: 820, easing: "cubic-bezier(0.5, 0, 0.3, 1)" }).finished.then(() => { fly.remove(); bumpCart(btn); });
}

export const store = {
  get<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};
