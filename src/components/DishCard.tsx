"use client";

import Image from "next/image";
import { useState } from "react";
import { img, tagLabels, type Item } from "@/lib/data";
import { useApp } from "./AppProvider";
import { PlusIcon } from "./icons";

interface Props {
  item: Item;
  rank?: number;
  reveal?: boolean;
  /** Returns true when a drag just happened, so the click should not open the dish. */
  wasDragged?: () => boolean;
}

export default function DishCard({ item, rank, reveal, wasDragged }: Props) {
  const { addItem, openQuickView } = useApp();
  const [spin, setSpin] = useState(0);
  const tags = item.tags.filter((t) => t !== "veg" || !item.tags.includes("vegan")).slice(0, 2);

  return (
    <article className={`card dish spotlight${rank ? " sig-card" : ""}`} data-reveal={reveal ? "" : undefined}>
      <div className="dish-media">
        <Image src={img(item.photo)} alt={item.name} width={900} height={rank ? 1125 : 675} sizes="(max-width: 600px) 90vw, 380px" />
        <div className="dish-tags">{tags.map((t) => <span className="tag" key={t}>{tagLabels[t]}</span>)}</div>
        {rank ? <span className="sig-num" aria-hidden="true">0{rank}</span> : null}
      </div>
      <div className="dish-body">
        <h3>
          <button type="button" className="dish-open" aria-haspopup="dialog" onClick={() => { if (!wasDragged?.()) openQuickView(item.id); }}>
            {item.name}
          </button>
        </h3>
        <p>{item.desc}</p>
        <div className="dish-foot">
          <span className="price"><small>AED</small>{item.price}</span>
          <button className={`add-btn${spin % 2 ? " is-added" : ""}`} type="button" aria-label={`Add ${item.name} to order`}
            onClick={(e) => { setSpin((s) => s + 1); addItem(item, e.currentTarget); }}>
            <PlusIcon />Add
          </button>
        </div>
      </div>
    </article>
  );
}
