import { Check } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";

const specs = [
  {
    label: "Display",
    value: "4.0 in IPS LCD",
    note: "540 × 960. No always-on.",
  },
  {
    label: "Body",
    value: "101 × 63 × 9.0 mm",
    note: "Polycarbonate shell, PMMA window.",
  },
  {
    label: "Weight",
    value: "85 g",
    note: "Target, including the battery.",
  },
  {
    label: "Battery",
    value: "1,200 mAh",
    note: "7-10 days at target usage.",
  },
  {
    label: "Radios",
    value: "BLE 5.3 / Wi-Fi 6",
    note: "No cellular, GPS, or camera.",
  },
  {
    label: "Platform",
    value: "Android companion",
    note: "ESP32-P4 + ESP32-C6.",
  },
];

const promises = [
  "No subscription, ever.",
  "User-replaceable battery.",
  "USB-C charging, 7-10 days of use.",
];

export function PriceSection() {
  return (
    <section
      id="specs"
      className="scroll-mt-20 border-t border-ink/15"
      aria-labelledby="price-title"
    >
      <div className="wrap py-[clamp(5rem,9vw,9rem)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <h2 id="price-title" className="display-sm max-w-[11ch]">
              One price. No subscription.
            </h2>

            <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span
                className="leading-none tracking-[-0.06em] text-ink"
                style={{
                  fontSize: "clamp(4.5rem, 9vw, 7.5rem)",
                  fontWeight: 520,
                  fontStretch: "115%",
                }}
              >
                $149
              </span>
              <span className="mono-label">Target launch price</span>
            </div>

            <p className="body-lg mt-6 max-w-[42ch]">
              Hardware margin only. A device that sells restraint cannot charge
              monthly for engagement.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.08}>
            <div className="border-t border-ink/15 pt-6">
              <ul className="space-y-3">
                {promises.map((promise) => (
                  <li
                    key={promise}
                    className="flex items-start gap-3 text-[0.9375rem] font-medium leading-snug"
                  >
                    <Check
                      size={16}
                      weight="bold"
                      className="mt-0.5 shrink-0 text-orange-deep"
                      aria-hidden="true"
                    />
                    {promise}
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-[38ch] text-[0.75rem] leading-relaxed text-ink-mute">
                Concept 01. Specifications are targets, not production claims.
                The pilot comes before tooling.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 sm:mt-20" delay={0.1}>
          <dl className="grid gap-x-9 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.label} className="spec-cell">
                <dt className="mono-label">{spec.label}</dt>
                <dd className="mt-2">
                  <span className="block text-[1.0625rem] font-medium tracking-[-0.015em]">
                    {spec.value}
                  </span>
                  <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ink-mute">
                    {spec.note}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
