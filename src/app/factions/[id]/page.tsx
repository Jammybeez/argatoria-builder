import { notFound } from "next/navigation";

import { NewArmyForm } from "~/app/_components/new-army-form";
import { UnitStatLine } from "~/app/_components/unit-stat-line";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  formatBaseRange,
  formatCost,
  HERO_TYPE_LABELS,
} from "~/lib/unit-format";
import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/server";

export default async function FactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [faction, session] = await Promise.all([
    api.faction.getById({ id }).catch(() => null),
    getSession(),
  ]);

  if (!faction) {
    notFound();
  }

  const unitsByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    units: faction.units.filter((u) => u.category === category),
  })).filter((group) => group.units.length > 0);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-4xl tracking-wide text-bronze-light uppercase">
        {faction.name}
      </h1>
      {faction.tagline && (
        <p className="mt-1 text-parchment-dim italic">{faction.tagline}</p>
      )}

      {faction.armySpecialRuleName && (
        <div className="mt-4 rounded-lg border border-bronze-dark/50 bg-rust/10 p-4">
          <p className="font-semibold text-bronze-light">
            Army Special Rule: {faction.armySpecialRuleName}
          </p>
          <p className="mt-1 text-sm text-parchment-dim">
            {faction.armySpecialRuleText}
          </p>
        </div>
      )}

      <div className="mt-6">
        {session ? (
          <NewArmyForm factionId={faction.id} />
        ) : (
          <p className="rounded-lg border border-brass/40 bg-leather p-4 text-sm text-parchment-dim">
            Sign in to start building an army with this faction.
          </p>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {unitsByCategory.map(({ category, units }) => (
          <section key={category}>
            <h2 className="font-display mb-3 text-2xl tracking-wide text-parchment uppercase">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="flex flex-col gap-4">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="rounded-lg border border-brass/40 bg-leather p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-parchment">
                      {unit.name}
                      {HERO_TYPE_LABELS[unit.heroType] && (
                        <span className="ml-2 rounded bg-leather-light px-1.5 py-0.5 text-xs font-normal text-parchment-dim">
                          {HERO_TYPE_LABELS[unit.heroType]}
                        </span>
                      )}
                    </h3>
                    <span className="text-right text-sm font-medium text-bronze-light">
                      {formatCost(unit.costType, unit.pointsCost)}
                      {(() => {
                        const range = formatBaseRange(
                          unit.costType,
                          unit.minBases,
                          unit.maxBases,
                        );
                        return range ? (
                          <span className="block text-xs text-parchment-dim">
                            {range}
                          </span>
                        ) : null;
                      })()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <UnitStatLine unit={unit} />
                  </div>
                  {unit.specialRules.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {unit.specialRules.map((rule) => (
                        <li key={rule.id} className="text-sm text-parchment-dim">
                          <span className="font-semibold text-parchment">
                            {rule.name}.
                          </span>{" "}
                          {rule.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
