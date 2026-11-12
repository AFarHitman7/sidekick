import { Reveal } from "./Reveal";

export function ReadingSection() {
  return (
    <section aria-labelledby="reading-title">
      <div className="wrap py-[clamp(5rem,9vw,9rem)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <Reveal className="lg:col-span-5">
            <h2 id="reading-title" className="display-sm max-w-[13ch]">
              Small enough to read. Too small for a feed.
            </h2>
            <p className="body-lg mt-6 max-w-[42ch]">
              540 × 960 holds a six-message thread or a page of typeset text.
              It is not enough surface for a feed to hide in.
            </p>

            <blockquote className="mt-10 border-l-2 border-orange pl-5 sm:pl-6">
              <p className="max-w-[34ch] text-[clamp(1.25rem,1.8vw,1.5rem)] font-medium leading-[1.3] tracking-[-0.02em]">
                The interface should be smaller than the task, not the task
                smaller than the interface.
              </p>
              <footer className="mono-value mt-4 text-ink-mute">
                Sidekick concept notes
              </footer>
            </blockquote>

            <p className="mt-8 max-w-[40ch] text-[0.8125rem] leading-relaxed text-ink-mute">
              Articles paginate, one page at a time. Books arrive in v1.5. A
              reflective reading variant is one possible v2.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.08}>
            <figure>
              <div className="plate plate-media">
                <img
                  src="/renders/back.webp"
                  alt="Back of Sidekick, printed with the words Designed to be put down and a six-magnet ring."
                  width={1600}
                  height={1257}
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
                <span className="mono-value text-ink-mute">
                  The back is printed with the promise.
                </span>
                <span className="mono-value text-ink-mute">
                  Six magnets / lanyard loop
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
