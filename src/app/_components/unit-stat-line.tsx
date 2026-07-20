const STATS = [
  ["LD", "ld"],
  ["M", "m"],
  ["WS", "ws"],
  ["S", "s"],
  ["T", "t"],
  ["A", "a"],
  ["W", "w"],
] as const;

export function UnitStatLine({
  unit,
}: {
  unit: Record<(typeof STATS)[number][1], number | null>;
}) {
  const hasStats = STATS.some(([, key]) => unit[key] !== null);
  if (!hasStats) return null;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-parchment-dim print:text-stone-800">
      {STATS.map(([label, key]) =>
        unit[key] === null ? null : (
          <span key={key}>
            <span className="text-bronze print:text-stone-600">{label}</span>{" "}
            {unit[key]}
          </span>
        ),
      )}
    </div>
  );
}
