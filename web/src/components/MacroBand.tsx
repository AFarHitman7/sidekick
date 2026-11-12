import { Reveal } from "./Reveal";

export function MacroBand() {
  return (
    <section aria-label="Close detail of the controls" className="pb-[clamp(4rem,7vw,7rem)]">
      <div className="wrap">
        <Reveal>
          <figure>
            <div className="plate overflow-hidden">
              <img
                src="/renders/detail.webp"
                alt="Macro view of the knurled scroll wheel, orange index ring, chin keys, and exposed fasteners."
                width={1600}
                height={1067}
                loading="lazy"
                className="block h-[clamp(260px,38vw,540px)] w-full object-cover object-[50%_38%]"
              />
            </div>
            <figcaption className="mt-5 grid gap-5 sm:grid-cols-12">
              <p className="body max-w-[42ch] sm:col-span-6">
                The controls you reach for stand proud of the shell. The screen
                is for reading.
              </p>
              <div className="flex flex-wrap gap-x-10 gap-y-3 sm:col-span-6 sm:justify-end">
                <span className="mono-value text-ink-mute">
                  Wheel: 8 mm / 30-tooth knurl
                </span>
                <span className="mono-value text-ink-mute">
                  Chin keys: 1.55 mm proud
                </span>
                <span className="mono-value text-ink-mute">Shell: 9.0 mm</span>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
