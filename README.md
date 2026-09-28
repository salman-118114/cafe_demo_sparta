# Sparta Café · Dubai

A luxury café showcase site built with **Next.js 16 (App Router)**, React 19 and TypeScript. It's frontend only, with no database or required environment variables. Every page is prerendered, and it ships as a Docker image for Dokploy.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production check:

```bash
npm run build
npm start
```

## Deploy on Dokploy (Docker)

The repo ships a production `Dockerfile`: a multi-stage build of the Next.js standalone server. It runs as a non-root user, the image is small, and it has a built-in health check.

1. Push this repo to GitHub, GitLab, Gitea or Bitbucket.
2. In Dokploy: **Create Project → Create Service → Application**.
3. **Provider:** choose your Git provider (or *Git* with the repo URL), pick the repo and the `main` branch.
4. **Build Type:** `Dockerfile`, with Docker File `Dockerfile`, Docker Context Path `.` and Docker Build Stage left empty.
5. **Build args** (optional, in *Environment → Build-time Arguments*):
   `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
6. **Domains:** add your domain, set **Container Port `3000`**, and enable HTTPS (Let's Encrypt).
7. Press **Deploy**. Turn on *Autodeploy* (or add the webhook) to redeploy on every push.

The container listens on port `3000` and answers health checks at `GET /api/health` → `{"status":"ok"}`. You can use that path for Dokploy's health check or zero-downtime settings. No runtime environment variables are required.

Test the image locally first:

```bash
docker compose up --build     # http://localhost:3000
```

## Deploy elsewhere

**Vercel:** push this folder to a GitHub repo, then import it at vercel.com/new. There's nothing to configure: the framework is detected and the build command is `next build`.

Or use the CLI:

```bash
npx vercel          # preview
npx vercel --prod   # production
```

**Any Node host** (Netlify, Render, Railway, a VPS): run `npm run build`, then `npm start`. Node 20.9+ is required.

Optional: set `NEXT_PUBLIC_SITE_URL` (for example `https://spartacafe.ae`) so social-share metadata uses absolute URLs.

## Routes

| Route | What it shows |
|---|---|
| `/` | Arch-framed hero, signature rail (drag or arrows), "Find your cup" quiz, stacking "A day at Sparta" cards, parallax quote |
| `/menu` | 33 dishes, live search, dietary filters, sort, animated filtering, sticky chapter bar with sliding indicator |
| `/order` | Drink Atelier: an SVG glass that fills live as you choose. Plus pastry quick add, a 3-step validated checkout, promo codes (`SPARTA10`, `GOLD`, `WELCOME`), tips, 5% VAT, a flipping card preview and a live order tracker with confetti |
| `/reserve` | 14-day date strip, time slots, an interactive floor plan to pick the exact table, a booking ticket and a real `.ics` calendar download |
| `/story` | Scroll-drawn timeline, gallery lightbox (keyboard and swipe), map, today's hours in Dubai time, contact form, FAQ |

## Across the whole site

- Light "Desert Day" and dark "Dubai Night" themes with a circular reveal. The choice is remembered, with no flash on load.
- `Ctrl K` / `⌘K` / `/` opens a command palette.
- The cart persists in `localStorage` and syncs across tabs. It has a fly-to-cart animation and undoable toasts.
- A live open/closed status on Dubai time.
- WCAG AA contrast, keyboard accessible, and `prefers-reduced-motion` respected.

## Project structure

```
src/
  app/
    layout.tsx          fonts (next/font), theme boot script, global providers & overlays
    template.tsx        page entrance animation on every navigation
    globals.css         design tokens + all component styles (cascade layers)
    page.tsx            /  (home)
    api/health/         health-check endpoint for Docker/Dokploy
    menu/ order/ reserve/ story/   one folder per route
    not-found.tsx, icon.svg
  components/
    AppProvider.tsx     cart, toasts, dialog state (useApp hook)
    Header, Footer, CartDrawer, QuickView, CommandPalette, Toasts, Modal, DishCard, SiteEffects
    home/ menu/ order/ reserve/ story/   route-specific client components
  lib/
    data.ts             menu, prices, options (edit dishes here)
    motion.ts           animation helpers, fly-to-cart, storage
```

## Notes

- Photos load from Unsplash through `next/image`, which is allowed in `next.config.ts`. For a client build, swap in their own photography under `public/`.
- Checkout and reservations are demos: nothing is charged or sent anywhere.
