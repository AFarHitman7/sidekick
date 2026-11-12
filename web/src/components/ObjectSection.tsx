import { useState } from "react";
import { Reveal } from "./Reveal";

const anatomy = [
  {
    id: "display",
    name: "4.0 inch display",
    detail:
      "540 × 960 holds six messages or a page of typeset text, under a matte PMMA window.",
    top: "27%",
    left: "70%",
  },
  {
    id: "focus",
    name: "Focus switch",
    detail:
      "A two-position physical switch. It batches what reaches you. It cannot open a browser.",
    top: "18.5%",
    left: "37.5%",
  },
  {
    id: "wheel",
    name: "Knurled wheel",
    detail:
      "8 mm of anodised aluminium, one detent at a time. Scrolling has a beginning and an end.",
    top: "56.2%",
    left: "19.8%",
  },
  {
    id: "send",
    name: "Orange send key",
    detail:
      "The only high-chroma surface on the front. It marks the one action that leaves the device.",
    top: "83.7%",
    left: "67.5%",
  },
];

export function ObjectSection() {
  const [active, setActive] = useState(0);

  function pick(index: number, scrollToDetail = false) {
    setActive(index);
    if (!scrollToDetail) return;
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    if (!narrow) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById(`anatomy-${anatomy[index].id}`)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }

  return (
    <section id="object" className="scroll-mt-24" aria-labelledby="object-title">
      <div className="wrap py-[clamp(5rem,9vw,9rem)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <Reveal className="lg:col-span-6">
            <figure className="mx-auto max-w-[560px] lg:max-w-none">
              <div className="plate plate-media relative">
                <div className="relative">
                  <img
                    src="/renders/front.webp"
                    alt="Front view of Sidekick showing a message thread, a suggested reply, a scroll wheel, a focus switch, and three chin keys."
                    width={1400}
                    height={1867}
                  />
                  {anatomy.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      className="hotspot"
                      style={{ top: item.top, left: item.left }}
                      data-active={active === index}
                      aria-hidden="true"
                      tabIndex={-1}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => pick(index, true)}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>
              <figcaption className="mono-value mt-4 text-ink-mute">
                Studio finish, front elevation. Concept controls.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.08}>
            <h2 id="object-title" className="display-sm max-w-[13ch]">
              A card, not a watch.
            </h2>
            <p className="body-lg mt-6 max-w-[44ch]">
              A watch can tell you who pinged you. It cannot hold the thread.
              Four inches is the smallest panel that reads like a conversation.
            </p>

            <div className="mt-9">
              {anatomy.map((item, index) => (
                <button
                  key={item.id}
                  id={`anatomy-${item.id}`}
                  type="button"
                  className="anatomy-row scroll-mt-28"
                  data-active={active === index}
                  aria-pressed={active === index}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                >
                  <span className="anatomy-index mono-value pt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[1.0625rem] font-medium leading-snug tracking-[-0.015em]">
                      {item.name}
                    </span>
                    <span className="mt-1.5 block max-w-[42ch] text-[0.875rem] leading-relaxed text-ink-mute">
                      {item.detail}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 max-w-[42ch] text-[0.8125rem] leading-relaxed text-ink-mute">
              Bone polycarbonate, charcoal faceplate, anodised aluminium. The
              only bright metal does structural work.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
