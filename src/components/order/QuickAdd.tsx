"use client";

import Image from "next/image";
import { byId, img } from "@/lib/data";
import { useApp } from "../AppProvider";
import { PlusIcon } from "../icons";

const PASTRY_CASE = ["kunafa-croissant", "cookie-trio", "entremet", "brownie", "berry-pie", "truffle-eggs"];

export default function QuickAdd() {
  const { addItem } = useApp();
  return (
    <div className="quick-add">
      {PASTRY_CASE.map((id) => {
        const it = byId[id];
        return (
          <div className="mini" key={id}>
            <Image src={img(it.photo, 200)} alt="" width={56} height={56} />
            <div><b>{it.name}</b><span>AED {it.price}</span></div>
            <button className="icon-btn" type="button" onClick={(e) => addItem(it, e.currentTarget)} aria-label={`Add ${it.name}`}><PlusIcon /></button>
          </div>
        );
      })}
    </div>
  );
}
