import { useEffect } from "react";
import { FinishesSection } from "./components/FinishesSection";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { MacroBand } from "./components/MacroBand";
import { Nav } from "./components/Nav";
import { ObjectSection } from "./components/ObjectSection";
import { PriceSection } from "./components/PriceSection";
import { ReadingSection } from "./components/ReadingSection";
import { RefusalSection } from "./components/RefusalSection";
import { SpecRail } from "./components/SpecRail";
import { WaitlistSection } from "./components/WaitlistSection";
import { WindowSection } from "./components/WindowSection";

export default function App() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    const scroll = () => {
      target.scrollIntoView({ behavior: "instant", block: "start" });
    };
    const frame = window.requestAnimationFrame(scroll);
    // Re-align after webfonts and the lazy 3D chunk settle the layout.
    const timer = window.setTimeout(scroll, 350);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-[0.875rem] focus:text-cream"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <SpecRail />
        <WindowSection />
        <ObjectSection />
        <MacroBand />
        <RefusalSection />
        <ReadingSection />
        <FinishesSection />
        <PriceSection />
        <WaitlistSection />
      </main>

      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
