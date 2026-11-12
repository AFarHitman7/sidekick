import type { MouseEvent } from "react";

const NAV_OFFSET = 88;

export function scrollToId(
  id: string,
  preferred: ScrollBehavior = "smooth",
) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const behavior: ScrollBehavior = reduce ? "auto" : preferred;
  const top =
    id === "top"
      ? 0
      : target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

  window.scrollTo({ top: Math.max(0, top), behavior });
}

export function onAnchorClick(event: MouseEvent<HTMLAnchorElement>) {
  const href = event.currentTarget.getAttribute("href");
  if (!href || !href.startsWith("#") || href.length < 2) return;
  event.preventDefault();
  const id = href.slice(1);
  // Run after the browser's own anchor handling so the offset wins.
  window.requestAnimationFrame(() => {
    scrollToId(id, "instant");
    window.history.replaceState(null, "", href);
  });
}
