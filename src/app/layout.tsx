import type { Metadata, Viewport } from "next";
import { Amiri, Bodoni_Moda, Manrope } from "next/font/google";
import AppProvider from "@/components/AppProvider";
import CartDrawer from "@/components/CartDrawer";
import CommandPalette from "@/components/CommandPalette";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import QuickView from "@/components/QuickView";
import SiteEffects from "@/components/SiteEffects";
import Toasts from "@/components/Toasts";
import "./globals.css";

const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-bodoni", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: "700", variable: "--font-amiri", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Sparta Café · Coffee, gilded · Jumeirah, Dubai", template: "%s · Sparta Café Dubai" },
  description: "Sparta Café, Jumeirah Beach Road, Dubai. Single-origin coffee, saffron gold lattes, pastry and slow brunch facing the Burj Al Arab.",
  openGraph: { title: "Sparta Café · Coffee, gilded", description: "Luxury café on Jumeirah Beach Road, Dubai.", type: "website", locale: "en_AE" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6efe3" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1712" },
  ],
};

// Runs before paint: applies the saved/system theme (no flash) and gates scroll reveals
const bootScript = `(function(d){var t;try{t=JSON.parse(localStorage.getItem('sparta-theme'))}catch(e){}d.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('reveal-ready');setTimeout(function(){if(!d.classList.contains('reveal-live'))d.classList.remove('reveal-ready')},2500)})(document.documentElement)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${manrope.variable} ${amiri.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        <AppProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <QuickView />
          <CommandPalette />
          <Toasts />
          <SiteEffects />
        </AppProvider>
      </body>
    </html>
  );
}
