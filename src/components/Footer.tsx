"use client";

import Link from "next/link";
import { useState } from "react";
import { pages } from "@/lib/data";
import { useApp } from "./AppProvider";
import { LogoMark } from "./icons";

export default function Footer() {
  const { toast } = useApp();
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (!email || !input.checkValidity()) {
      setInvalid(true);
      input.focus();
      return toast({ text: "That email doesn't look right. Try again?", icon: "info" });
    }
    setInvalid(false);
    setEmail("");
    toast({ text: <>Welcome to <b>The Sparta Letter</b>. Your first issue lands Thursday.</> });
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="logo" href="/" aria-label="Sparta Café home"><LogoMark /><span className="logo-word"><b>Sparta</b><small>CAFÉ · DUBAI</small></span></Link>
            <p className="muted mt-4" style={{ maxWidth: "36ch" }}>Single-origin coffee, gilded pastry and slow brunch, facing the Burj Al Arab since 2019.</p>
            <form className="newsletter" onSubmit={submit} noValidate>
              <label className="sr-only" htmlFor="nl-email">Email address</label>
              <input className="input" id="nl-email" name="email" type="email" placeholder="you@email.com" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={invalid || undefined} />
              <button className="btn btn--sm" type="submit">Join</button>
            </form>
            <p className="muted mt-2" style={{ fontSize: ".8rem" }}>The Sparta Letter: new roasts and private tastings, twice a month.</p>
          </div>
          <div><h3>Visit</h3><ul role="list">{pages.map((p) => <li key={p.href}><Link href={p.href}>{p.label}</Link></li>)}</ul></div>
          <div>
            <h3>Hours</h3>
            <div className="hours-mini">
              <div><span>Sun – Thu</span><span>7:00 – 00:00</span></div>
              <div><span>Fri – Sat</span><span>7:00 – 01:00</span></div>
              <div><span>High tea</span><span>14:00 – 18:00</span></div>
            </div>
          </div>
          <div>
            <h3>Find us</h3>
            <ul role="list">
              <li>Jumeirah Beach Road,<br />Umm Suqeim 3, Dubai</li>
              <li><a href="tel:+97140000000">+971 4 000 0000</a></li>
              <li><a href="mailto:hello@spartacafe.ae">hello@spartacafe.ae</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-word" aria-hidden="true">Sparta</div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sparta Café, Dubai. Concept site, frontend demo.</span>
          <span>Press <kbd>Ctrl K</kbd> to search anything</span>
        </div>
      </div>
    </footer>
  );
}
