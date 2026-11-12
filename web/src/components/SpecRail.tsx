const specs = [
  { label: "Body", value: "101 × 63 × 9.0 mm" },
  { label: "Weight", value: "85 g" },
  { label: "Display", value: "4.0 in / 540 × 960" },
  { label: "Battery", value: "7-10 days" },
  { label: "Platform", value: "Android companion" },
];

export function SpecRail() {
  return (
    <section aria-label="Key specifications" className="border-y border-ink/15">
      <dl className="wrap grid grid-cols-2 gap-x-6 gap-y-6 py-7 sm:grid-cols-3 lg:grid-cols-5">
        {specs.map((spec) => (
          <div key={spec.label} className="min-w-0">
            <dt className="mono-label">{spec.label}</dt>
            <dd className="mono-value mt-2 text-ink">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
