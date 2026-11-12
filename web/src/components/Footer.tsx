import { onAnchorClick } from "../lib/scroll";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "#object", label: "The object" },
  { href: "#refusals", label: "Refusals" },
  { href: "#finishes", label: "Finishes" },
  { href: "#specs", label: "Specs" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/15">
      <div className="wrap py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-6">
            <Wordmark compact />
            <p className="mt-4 max-w-[30ch] text-[0.875rem] leading-relaxed text-ink-soft">
              A companion display, designed to be put down.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={onAnchorClick}
                    className="text-[0.8125rem] text-ink-soft no-underline transition-colors duration-150 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="mono-value text-ink-mute">Concept 01, 2026</p>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-ink-mute">
              Not for production. Rendered in Blender, built for the open web.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
          <p className="mono-value text-ink-mute">Sidekick concept</p>
          <p className="mono-value text-ink-mute">
            No browser. No feed. No store.
          </p>
        </div>
      </div>
    </footer>
  );
}
