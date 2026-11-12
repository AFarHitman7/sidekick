import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { Reveal } from "./Reveal";

function clock(seconds: number) {
  const whole = Math.max(0, Math.min(90, Math.round(seconds)));
  const minutes = Math.floor(whole / 60);
  return `${minutes}:${String(whole % 60).padStart(2, "0")}`;
}

export function WindowSection() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const lastLabel = useRef("");
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 0.85", "end 0.45"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
  });
  const scaleX = reduce ? 1 : smooth;
  const dotLeft = useTransform(smooth, (value) => `${value * 100}%`);

  useMotionValueEvent(smooth, "change", (value) => {
    const next = clock(value * 90);
    if (counter.current && lastLabel.current !== next) {
      lastLabel.current = next;
      counter.current.textContent = next;
    }
  });

  return (
    <section
      ref={section}
      className="border-b border-ink/15"
      aria-labelledby="window-title"
    >
      <div className="wrap py-[clamp(5rem,9vw,9rem)]">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-8">
            <div className="border-l-2 border-orange pl-5 sm:pl-7">
              <h2 id="window-title" className="display-sm max-w-[17ch]">
                You put it down. Ninety seconds later, you pick it up again.
              </h2>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:pt-2" delay={0.08}>
            <p className="body-lg max-w-[42ch]">
              Not to do anything. To check. By the time you put it down,
              twenty minutes are gone and you cannot name what you read.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14 sm:mt-20" delay={0.06}>
          <div className="flex items-end justify-between gap-6">
            <span className="mono-label">The ninety-second window</span>
            <span
              ref={counter}
              className="font-mono text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none tracking-tight text-ink"
              aria-label="Ninety seconds"
            >
              {reduce ? "1:30" : "0:00"}
            </span>
          </div>

          <div className="relative mt-6">
            <div className="window-track">
              <motion.div
                className="window-fill"
                style={{ scaleX }}
              />
              {!reduce ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange"
                  style={{ left: dotLeft }}
                />
              ) : null}
            </div>
            <div className="mt-3 flex justify-between">
              <span className="mono-value text-ink-mute">0 sec</span>
              <span className="mono-value text-ink-mute">90 sec</span>
            </div>
          </div>

          <p className="mt-8 max-w-[54ch] text-[0.875rem] leading-relaxed text-ink-mute">
            Median session target: under 45 seconds. A good day is twelve short
            visits, not one long one.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
