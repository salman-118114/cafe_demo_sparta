"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { lineFor, type CartLine, type Item } from "@/lib/data";
import { flyToCart, store } from "@/lib/motion";

export interface ToastData {
  id: number;
  text: ReactNode;
  img?: string;
  icon?: "check" | "info" | "star";
  action?: { label: string; fn: () => void };
  timeout?: number;
}

interface AppState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addLine: (line: CartLine, source?: Element | null, silent?: boolean) => void;
  addItem: (item: Item, source?: Element | null) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  restoreCart: (lines: CartLine[]) => void;
  toasts: ToastData[];
  toast: (t: Omit<ToastData, "id">) => void;
  dismissToast: (id: number) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  quickViewId: string | null;
  openQuickView: (id: string | null) => void;
}

const Ctx = createContext<AppState | null>(null);

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside <AppProvider>");
  return c;
}

const KEY = "sparta-cart";

export default function AppProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [quickViewId, openQuickView] = useState<string | null>(null);
  const nextId = useRef(1);

  // Cart persists in localStorage and syncs across tabs
  useEffect(() => {
    setLines(store.get<CartLine[]>(KEY, []));
    setReady(true);
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) setLines(store.get<CartLine[]>(KEY, [])); };
    addEventListener("storage", onStorage);
    return () => removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => { if (ready) store.set(KEY, lines); }, [lines, ready]);

  const dismissToast = useCallback((id: number) => setToasts((ts) => ts.filter((t) => t.id !== id)), []);
  const toast = useCallback((t: Omit<ToastData, "id">) => {
    const id = nextId.current++;
    setToasts((ts) => [...ts, { ...t, id }].slice(-3));
  }, []);

  const addLine = useCallback((line: CartLine, source?: Element | null, silent?: boolean) => {
    setLines((ls) => {
      const found = ls.find((l) => l.key === line.key);
      return found ? ls.map((l) => (l.key === line.key ? { ...l, qty: l.qty + line.qty } : l)) : [...ls, line];
    });
    flyToCart(source, line.img);
    if (!silent) toast({ img: line.img, text: <><b>{line.name}</b> added to your order</>, action: { label: "View", fn: () => setCartOpen(true) } });
  }, [toast]);

  const addItem = useCallback((item: Item, source?: Element | null) => addLine(lineFor(item), source), [addLine]);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((ls) => {
      const q = Math.max(0, Math.min(20, qty));
      return q ? ls.map((l) => (l.key === key ? { ...l, qty: q } : l)) : ls.filter((l) => l.key !== key);
    });
  }, []);

  const value = useMemo<AppState>(() => ({
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.qty * l.unit, 0),
    addLine, addItem, setQty,
    clearCart: () => setLines([]),
    restoreCart: (ls) => setLines(ls),
    toasts, toast, dismissToast,
    cartOpen, setCartOpen, paletteOpen, setPaletteOpen, quickViewId, openQuickView,
  }), [lines, addLine, addItem, setQty, toasts, toast, dismissToast, cartOpen, paletteOpen, quickViewId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
