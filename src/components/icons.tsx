import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const SearchIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} aria-hidden="true" {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const BagIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} aria-hidden="true" {...p}><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>);
export const MenuIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} aria-hidden="true" {...p}><path d="M4 8h16M4 16h10" /></svg>);
export const CloseIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} aria-hidden="true" {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const PlusIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} strokeWidth={2} aria-hidden="true" {...p}><path d="M12 5v14M5 12h14" /></svg>);
export const ArrowIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} aria-hidden="true" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ArrowLeftIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} aria-hidden="true" {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
export const CheckIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} strokeWidth={2.2} aria-hidden="true" {...p}><path d="m5 12 5 5 9-10" /></svg>);
export const StarIcon = (p: P) => (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-2.8Z" /></svg>);
export const PageIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} aria-hidden="true" {...p}><path d="M5 20V9a7 7 0 0 1 14 0v11Z" /></svg>);
export const TrashIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} aria-hidden="true" {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>);
export const InfoIcon = (p: P) => (<svg viewBox="0 0 24 24" {...line} aria-hidden="true" {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></svg>);
export const CupIcon = (p: P) => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" {...p}>
    <path d="M14 30h44v14a20 20 0 0 1-20 20h-4a20 20 0 0 1-20-20Z" /><path d="M58 36h4a8 8 0 0 1 0 16h-5" />
    <path d="M28 12c0 5 5 5 5 10M38 10c0 5 5 5 5 10" strokeLinecap="round" /><path d="M8 70h60" strokeLinecap="round" />
  </svg>
);
export const ThemeIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...line} aria-hidden="true" {...p}>
    <g className="sun"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></g>
    <path className="moon" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);
export const PlusThin = (p: P) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" {...p}><path d="M12 5v14M5 12h14" /></svg>);

export const LogoMark = (p: P) => (
  <svg viewBox="0 0 38 44" fill="none" aria-hidden="true" {...p}>
    <path d="M2 43V19a17 17 0 0 1 34 0v24" stroke="currentColor" strokeWidth={1.6} />
    <path d="M7 43V20a12 12 0 0 1 24 0v23" stroke="currentColor" strokeWidth={0.8} opacity={0.6} />
    <text x="19" y="35" textAnchor="middle" fontFamily="var(--font-bodoni), Georgia, serif" fontSize="20" fontStyle="italic" fill="currentColor">S</text>
  </svg>
);
