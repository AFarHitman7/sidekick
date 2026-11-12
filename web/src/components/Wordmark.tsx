export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="block h-[9px] w-[9px] bg-orange"
        style={{ borderRadius: 1 }}
      />
      <span
        className="font-mono font-medium uppercase text-ink"
        style={{
          fontSize: compact ? "0.8125rem" : "0.9375rem",
          letterSpacing: "0.26em",
          lineHeight: 1,
          paddingTop: "1px",
        }}
      >
        Sidekick
      </span>
    </span>
  );
}
