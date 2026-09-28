"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { byId, categories, img, lineFor, money, options, tagLabels } from "@/lib/data";
import { useApp } from "./AppProvider";
import Modal from "./Modal";
import { CloseIcon } from "./icons";

export default function QuickView() {
  const { quickViewId, openQuickView, addLine } = useApp();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const media = useRef<HTMLDivElement>(null);

  // Keep the last item rendered while the dialog animates closed
  useEffect(() => {
    if (!quickViewId) return setOpen(false);
    const item = byId[quickViewId];
    setId(quickViewId);
    setChosen(Object.fromEntries(options[item.kind].map((g) => [g.id, g.choices[0].id])));
    setQty(1);
    setOpen(true);
  }, [quickViewId]);

  const close = () => openQuickView(null);
  const item = id ? byId[id] : null;
  const line = item ? lineFor(item, chosen, qty) : null;

  return (
    <Modal open={open} onClose={close} className="modal" label={item ? `${item.name} details` : "Dish details"}>
      {item && line && (
        <div className="qv">
          <button className="icon-btn modal-close" type="button" data-close aria-label="Close"><CloseIcon /></button>
          <div className="qv-media" ref={media}>
            <Image src={img(item.photo, 1200)} alt={item.name} fill sizes="(max-width: 720px) 100vw, 480px" style={{ objectFit: "cover" }} />
          </div>
          <div className="qv-body">
            <span className="eyebrow">{categories.find((c) => c.id === item.cat)?.name}</span>
            <h2>{item.name}</h2>
            <p className="muted">{item.desc}</p>
            <div className="opt-row">
              {item.tags.map((t) => <span className="tag" key={t}>{tagLabels[t]}</span>)}
              <span className="tag">{item.kcal} kcal</span>
            </div>
            {options[item.kind].map((g) => (
              <div className="opt-group" role="radiogroup" aria-label={g.label} key={g.id}>
                <span>{g.label}</span>
                <div className="opt-row">
                  {g.choices.map((c) => (
                    <button key={c.id} type="button" className="chip" role="radio" aria-checked={chosen[g.id] === c.id}
                      onClick={() => setChosen((s) => ({ ...s, [g.id]: c.id }))}>
                      {c.label}{c.add ? <> <small>+{c.add}</small></> : null}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="qv-foot">
              <div className="qty" role="group" aria-label="Quantity">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                <output>{qty}</output>
                <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase">+</button>
              </div>
              <button className="btn" type="button" onClick={() => { addLine(line, media.current?.querySelector("img")); close(); }}>
                Add · {money(line.unit * qty)}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
