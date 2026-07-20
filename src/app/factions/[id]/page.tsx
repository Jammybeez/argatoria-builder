import { notFound } from "next/navigation";

import { NewArmyForm } from "~/app/_components/new-army-form";
import { UnitStatLine } from "~/app/_components/unit-stat-line";
import { CATEGORY_LABELS, CATEGORY_ORDER, formatCost } from "~/lib/unit-format";
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
      <h1 className="text-4xl font-bold text-amber-400">{faction.name}</h1>
      {faction.tagline && (
        <p className="mt-1 text-stone-400 italic">{faction.tagline}</p>
      )}

      {faction.armySpecialRuleName && (
        <div className="mt-4 rounded-lg border border-amber-800/50 bg-amber-950/20 p-4">
          <p className="font-semibold text-amber-400">
            Army Special Rule: {faction.armySpecialRuleName}
          </p>
          <p className="mt-1 text-sm text-stone-300">
            {faction.armySpecialRuleText}
          </p>
        </div>
      )}

      <div className="mt-6">
        {session ? (
          <NewArmyForm factionId={faction.id} />
        ) : (
          <p className="rounded-lg border border-stone-800 bg-stone-900 p-4 text-sm text-stone-400">
            Sign in to start building an army with this faction.
          </p>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {unitsByCategory.map(({ category, units }) => (
          <section key={category}>
            <h2 className="mb-3 text-2xl font-semibold text-stone-100">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="flex flex-col gap-4">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="rounded-lg border border-stone-800 bg-stone-900 p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-stone-100">
                      {unit.name}
                    </h3>
                    <span className="text-sm font-medium text-amber-400">
                      {formatCost(unit.costType, unit.pointsCost)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <UnitStatLine unit={unit} />
                  </div>
                  {unit.specialRules.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {unit.specialRules.map((rule) => (
                        <li key={rule.id} className="text-sm text-stone-300">
                          <span className="font-semibold text-stone-100">
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
