import { ArrowDownRight } from "@phosphor-icons/react";
import { onAnchorClick } from "../lib/scroll";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "#object", label: "The object" },
  { href: "#refusals", label: "Refusals" },
  { href: "#finishes", label: "Finishes" },
  { href: "#specs", label: "Specs" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <a
          href="#top"
          onClick={onAnchorClick}
          className="shrink-0 no-underline"
          aria-label="Sidekick, back to top"
        >
          <Wordmark />
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 lg:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onAnchorClick}
              className="text-[0.8125rem] font-medium text-ink-soft no-underline transition-colors duration-150 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#waitlist"
          onClick={onAnchorClick}
          className="btn btn-dark"
          style={{ minHeight: 40, padding: "0.55rem 1.05rem", fontSize: "0.8125rem" }}
        >
          Join the waitlist
          <ArrowDownRight size={15} weight="bold" />
        </a>
      </div>
    </header>
  );
}
