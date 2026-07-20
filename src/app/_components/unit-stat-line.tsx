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
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-stone-300">
      {STATS.map(([label, key]) =>
        unit[key] === null ? null : (
          <span key={key}>
            <span className="text-stone-500">{label}</span> {unit[key]}
          </span>
        ),
      )}
    </div>
  );
}
