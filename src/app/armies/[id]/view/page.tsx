import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PrintButton } from "~/app/_components/print-button";
import { UnitStatLine } from "~/app/_components/unit-stat-line";
import { effectiveCategory, getPresentGeneralNames } from "~/lib/army-rules";
import { getMaraudersEntries } from "~/lib/marauders";
import { armyUnitPoints } from "~/lib/points";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  formatCost,
  HERO_TYPE_LABELS,
} from "~/lib/unit-format";
import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/server";

export default async function ArmyViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect("/armies");
  }

  const army = await api.army.getById({ id }).catch(() => null);
  if (!army) {
    notFound();
  }

  const totalPoints = army.units.reduce((sum, au) => sum + armyUnitPoints(au), 0);
  const presentGeneralNames = getPresentGeneralNames(army.units);
  const maraudersEntries = getMaraudersEntries(army.units);
  const rosterEntries = [
    ...army.units.map((au) => ({ ...au, isMarauders: false as const })),
    ...maraudersEntries,
  ];

  // Second and later instances of the same unit (e.g. three separate
  // purchases of Wolves, or a unit's own derived Marauders) repeat the exact
  // same stat line and special rules — only the header line (name, badge,
  // bases, points) differs, so only the first instance prints the full
  // block. Upgrades are per-instance data, not invariant, so those always
  // print regardless.
  const seenUnitIds = new Set<string>();
  const rosterEntriesWithDuplicateFlag = rosterEntries.map((entry) => {
    const isDuplicateUnit = seenUnitIds.has(entry.unit.id);
    seenUnitIds.add(entry.unit.id);
    return { ...entry, isDuplicateUnit };
  });

  const rosterByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    entries: rosterEntriesWithDuplicateFlag.filter(
      (au) => effectiveCategory(au.unit, presentGeneralNames) === category,
    ),
  })).filter((g) => g.entries.length > 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link
          href={`/armies/${army.id}`}
          className="text-sm text-parchment-dim hover:text-parchment"
        >
          ← Back to builder
        </Link>
        <PrintButton />
      </div>

      <header className="mb-6 border-b border-brass/40 pb-4 print:border-stone-300">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-3xl tracking-wide text-bronze-light uppercase print:text-stone-900">
            {army.name}
          </h1>
          <p className="text-xl font-semibold text-parchment print:text-stone-900">
            {totalPoints} / {army.pointsLimit} pts
          </p>
        </div>
        <p className="text-parchment-dim print:text-stone-600">
          {army.faction.name}
        </p>
        {/* Sheol-morg's "armySpecialRuleText" is meta-instruction for
            picking a Lord while building ("choose one of these three
            Generals"), not a fixed rule like other factions have — the
            chosen Lord's actual rule already prints under their own stat
            block below, so repeating the generic prompt here is just
            confusing once the army is finished. */}
        {army.faction.armySpecialRuleName &&
          army.faction.name !== "Sheol-morg" && (
            <p className="mt-2 text-sm text-parchment-dim print:text-stone-700">
              <span className="font-semibold text-parchment print:text-stone-900">
                {army.faction.armySpecialRuleName}:
              </span>{" "}
              {army.faction.armySpecialRuleText}
            </p>
          )}
      </header>

      {rosterByCategory.length === 0 ? (
        <p className="text-parchment-dim print:text-stone-600">
          No units in this army yet.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {rosterByCategory.map(({ category, entries }) => (
            <section key={category} className="break-inside-avoid">
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-parchment-dim uppercase print:text-stone-600">
                {CATEGORY_LABELS[category]}
              </h2>
              <div className="flex flex-col gap-3">
                {entries.map((au) => (
                  <div
                    key={au.id}
                    className="break-inside-avoid rounded-lg border border-brass/40 bg-leather p-4 print:border-stone-300 print:bg-white"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-parchment print:text-stone-900">
                        {au.unit.name}
                        {au.isMarauders ? (
                          <span className="ml-2 rounded bg-bronze-dark/40 px-1.5 py-0.5 text-xs font-normal text-bronze-light print:bg-stone-200 print:text-stone-700">
                            Marauders
                          </span>
                        ) : (
                          HERO_TYPE_LABELS[au.unit.heroType] && (
                            <span className="ml-2 rounded bg-leather-light px-1.5 py-0.5 text-xs font-normal text-parchment-dim print:bg-stone-200 print:text-stone-700">
                              {HERO_TYPE_LABELS[au.unit.heroType]}
                            </span>
                          )
                        )}
                        {au.unit.costType === "PER_BASE" && (
                          <span className="ml-2 text-sm font-normal text-parchment-dim print:text-stone-600">
                            x{au.quantity} bases
                          </span>
                        )}
                      </h3>
                      <span className="text-sm font-medium text-bronze-light print:text-stone-900">
                        {au.isMarauders ? "Free" : `${armyUnitPoints(au)} pts`}
                        <span className="ml-1 text-xs text-parchment-dim print:text-stone-500">
                          ({formatCost(au.unit.costType, au.unit.pointsCost)})
                        </span>
                      </span>
                    </div>

                    {!au.isDuplicateUnit && (
                      <div className="mt-2">
                        <UnitStatLine unit={au.unit} />
                      </div>
                    )}

                    {!au.isDuplicateUnit && au.unit.specialRules.length > 0 && (
                      <ul className="mt-3 flex flex-col gap-1">
                        {au.unit.specialRules.map((rule) => (
                          <li
                            key={rule.id}
                            className="text-sm text-parchment-dim print:text-stone-700"
                          >
                            <span className="font-semibold text-parchment print:text-stone-900">
                              {rule.name}.
                            </span>{" "}
                            {rule.text}
                          </li>
                        ))}
                      </ul>
                    )}

                    {au.upgrades.length > 0 && (
                      <div className="mt-3 border-t border-brass/40 pt-2 print:border-stone-300">
                        <ul className="flex flex-col gap-1">
                          {au.upgrades.map((u) => (
                            <li
                              key={u.id}
                              className="text-sm text-parchment-dim print:text-stone-700"
                            >
                              <span className="font-semibold text-bronze-light print:text-stone-900">
                                {u.upgrade.name}
                              </span>{" "}
                              <span className="text-parchment-dim print:text-stone-500">
                                ({u.upgrade.pointsCost} pts)
                              </span>
                              {" — "}
                              {u.upgrade.effectText}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
