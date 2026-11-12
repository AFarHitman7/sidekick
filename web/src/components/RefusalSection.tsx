import { X } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";

const refused = [
  {
    name: "A browser",
    reason: "A browser is the phone. There is no partial browser.",
  },
  {
    name: "A feed or recommendation",
    reason: "The behaviour this object exists to displace.",
  },
  { name: "Video", reason: "An open loop with no natural end." },
  {
    name: "An app store",
    reason: "Every installable platform eventually becomes the phone.",
  },
  {
    name: "A camera",
    reason: "There is nothing on it to capture or post.",
  },
  {
    name: "Cellular",
    reason: "A cellular radio would turn it into a $250 phone.",
  },
];

const builtIn = [
  {
    name: "Batched notifications",
    reason: "A 20-second coalescing window, grouped by sender.",
  },
  {
    name: "Bounded sessions",
    reason: "Five minutes of triage, then done or back to phone. Reading runs to ten.",
  },
  {
    name: "No subscription",
    reason: "Hardware margin only, because a monthly fee rewards engagement.",
  },
];

function RefusalRow({
  item,
}: {
  item: { name: string; reason: string };
}) {
  return (
    <li className="grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 py-4 sm:grid-cols-[auto_14rem_minmax(0,1fr)] sm:gap-x-5">
      <X
        size={14}
        weight="bold"
        className="mt-[5px] shrink-0 text-orange-deep"
        aria-hidden="true"
      />
      <p className="text-[1.0625rem] font-medium leading-snug tracking-[-0.015em]">
        {item.name}
      </p>
      <p className="col-start-2 text-[0.875rem] leading-relaxed text-ink-mute sm:col-start-3 sm:mt-[2px]">
        {item.reason}
      </p>
    </li>
  );
}

export function RefusalSection() {
  return (
    <section
      id="refusals"
      className="scroll-mt-20 border-y border-ink/15 bg-paper-light"
      aria-labelledby="refusals-title"
    >
      <div className="wrap py-[clamp(5rem,9vw,9rem)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 id="refusals-title" className="display-sm max-w-[11ch]">
                  The absences are the product.
                </h2>
                <p className="body-lg mt-6 max-w-[34ch]">
                  Everything below is left out on purpose. None of it can be
                  switched on later, because none of it is in the hardware or
                  the firmware.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={0.06}>
              <h3 className="text-[0.8125rem] font-medium text-ink">
                Never ships
              </h3>
              <ul className="mt-6 border-t border-ink/15">
                {refused.map((item) => (
                  <RefusalRow key={item.name} item={item} />
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-12 border-t border-ink/15 pt-7">
                <h3 className="text-[0.8125rem] font-medium text-ink">
                  Built in
                </h3>
                <ul className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-3">
                  {builtIn.map((item) => (
                    <li key={item.name} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[7px] block h-[7px] w-[7px] shrink-0 bg-orange"
                        style={{ borderRadius: 1 }}
                      />
                      <div>
                        <p className="text-[0.9375rem] font-medium leading-snug">
                          {item.name}
                        </p>
                        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-mute">
                          {item.reason}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-12 max-w-[46ch] text-[0.8125rem] leading-relaxed text-ink-mute">
                The refusal list is published as a commitment, not hidden in a
                settings screen.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
