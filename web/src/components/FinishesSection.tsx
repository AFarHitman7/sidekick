import { FINISHES } from "../lib/palettes";
import { Reveal } from "./Reveal";

export function FinishesSection() {
  return (
    <section
      id="finishes"
      className="scroll-mt-20 border-t border-ink/15"
      aria-labelledby="finishes-title"
    >
      <div className="wrap py-[clamp(5rem,9vw,9rem)]">
        <Reveal>
          <h2 id="finishes-title" className="display-sm max-w-[18ch]">
            One geometry. Four material stories.
          </h2>
          <p className="body-lg mt-6 max-w-[58ch]">
            The accent is more than a cap colour. It drives the send key, the
            focus switch, the wheel ring, and the reply chip. A finish is a
            system, not a recoloured shell.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {FINISHES.map((finish, index) => (
            <Reveal key={finish.id} delay={index * 0.05}>
              <figure>
                <div className="plate plate-media plate-hover">
                  <img
                    src={finish.image}
                    alt={`Sidekick in the ${finish.name} finish, three-quarter view`}
                    width={660}
                    height={1100}
                    loading="lazy"
                    className="aspect-[3/5] object-cover"
                  />
                </div>
                <figcaption className="mt-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[1.0625rem] font-medium tracking-[-0.02em]">
                      {finish.name}
                    </h3>
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      {[finish.shell, finish.frame, finish.accent].map(
                        (colour) => (
                          <span
                            key={colour}
                            className="block h-2.5 w-2.5"
                            style={{
                              background: colour,
                              borderRadius: 1,
                              boxShadow: "inset 0 0 0 1px rgb(25 26 23 / 0.16)",
                            }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                  <p className="mono-value mt-1 text-ink-mute">{finish.material}</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-mute">
                    {finish.character}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
