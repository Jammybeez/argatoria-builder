"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  effectiveCategory,
  getCompositionIssues,
  getPresentGeneralNames,
  getPresentUnitNames,
  isUnitAvailable,
} from "~/lib/army-rules";
import { getMaraudersEntries } from "~/lib/marauders";
import { armyUnitPoints } from "~/lib/points";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  formatBaseRange,
  formatCost,
  HERO_TYPE_LABELS,
} from "~/lib/unit-format";
import {
  armyMaxForType,
  BANNER_MIN_POINTS,
  countTowardHeroCap,
  isExemptFromHeroCap,
  perHeroMax,
  upgradeTypesForHero,
} from "~/lib/upgrade-rules";
import { api, type RouterOutputs } from "~/trpc/react";

type ArmyData = RouterOutputs["army"]["getById"];
type ArmyUnitData = ArmyData["units"][number];
type UpgradeCatalogItem = RouterOutputs["upgrade"]["listForFaction"][number];
type UpgradeType = UpgradeCatalogItem["type"];

const UPGRADE_TYPE_PLURAL_LABELS: Record<UpgradeType, string> = {
  BANNER: "Banners",
  SPELL: "Spells",
  MAGIC_ITEM: "Magic Items",
  ARTEFACT: "Artefacts",
};

function QuantityInput({
  quantity,
  min,
  max,
  onCommit,
}: {
  quantity: number;
  min: number;
  max: number | undefined;
  onCommit: (n: number) => void;
}) {
  const [value, setValue] = useState(String(quantity));

  useEffect(() => setValue(String(quantity)), [quantity]);

  const commit = () => {
    let n = parseInt(value, 10);
    if (!Number.isFinite(n) || n < 1) {
      setValue(String(quantity));
      return;
    }
    n = Math.max(n, min);
    if (max) n = Math.min(n, max);
    if (n !== quantity) {
      onCommit(n);
    } else {
      setValue(String(n));
    }
  };

  return (
    <input
      type="number"
      min={min}
      max={max}
      className="w-16 rounded border border-brass/50 bg-ink px-2 py-1 text-center text-sm"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
  );
}

function unavailableReason(
  type: UpgradeType,
  armyUnit: ArmyUnitData,
  pointsLimit: number,
  armyMax: number | null,
  countInArmyOfType: number,
): string {
  if (type === "BANNER" && pointsLimit < BANNER_MIN_POINTS) {
    return `Banners require an army of ${BANNER_MIN_POINTS}+ points (this army is ${pointsLimit}).`;
  }
  if (armyMax !== null && countInArmyOfType >= armyMax) {
    return `Army already has the max of ${armyMax} ${UPGRADE_TYPE_PLURAL_LABELS[type].toLowerCase()}.`;
  }
  const cap = perHeroMax(type, armyUnit.upgrades);
  const current = countTowardHeroCap(type, armyUnit.upgrades);
  if (current >= cap) {
    return `${armyUnit.unit.name} already has the max of ${cap}.`;
  }
  return `No ${UPGRADE_TYPE_PLURAL_LABELS[type].toLowerCase()} available.`;
}

function UpgradesPanel({
  armyUnit,
  allArmyUnits,
  type,
  catalog,
  pointsLimit,
  onAdd,
  onRemove,
  isAdding,
}: {
  armyUnit: ArmyUnitData;
  allArmyUnits: ArmyUnitData[];
  type: UpgradeType;
  catalog: UpgradeCatalogItem[];
  pointsLimit: number;
  onAdd: (upgradeId: string) => void;
  onRemove: (armyUnitUpgradeId: string) => void;
  isAdding: boolean;
}) {
  const allArmyUpgrades = allArmyUnits.flatMap((au) =>
    au.upgrades.map((u) => ({ ...u, armyUnitId: au.id })),
  );

  const equipped = armyUnit.upgrades.filter((au) => au.upgrade.type === type);
  const countInArmy = allArmyUpgrades.filter(
    (u) => u.upgrade.type === type,
  ).length;
  const armyMax = armyMaxForType(type, pointsLimit);

  const available = catalog.filter((upgrade) => {
    if (upgrade.type !== type) return false;
    if (!isExemptFromHeroCap(upgrade.name, upgrade.type)) {
      const cap = perHeroMax(type, armyUnit.upgrades);
      const current = countTowardHeroCap(type, armyUnit.upgrades);
      if (current >= cap) return false;
    }
    if (armyMax !== null && countInArmy >= armyMax) return false;
    if (
      type === "MAGIC_ITEM" &&
      allArmyUpgrades.some((u) => u.upgradeId === upgrade.id)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="mt-3 flex flex-col gap-3 border-t border-brass/40 pt-3">
      {equipped.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {equipped.map((au) => (
            <div
              key={au.id}
              className="flex items-center justify-between gap-3 rounded bg-ink px-3 py-2"
            >
              <div>
                <p className="text-sm text-parchment">{au.upgrade.name}</p>
                {au.upgrade.requirementsText && (
                  <p className="text-xs text-bronze-light">
                    {au.upgrade.requirementsText}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-parchment-dim">
                  {au.upgrade.pointsCost} pts
                </span>
                <button
                  className="rounded-md bg-leather-light px-2 py-1 text-xs text-parchment-dim hover:bg-blood/20 hover:text-blood-light"
                  onClick={() => onRemove(au.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {available.length === 0 ? (
        <p className="text-xs text-parchment-dim">
          {unavailableReason(type, armyUnit, pointsLimit, armyMax, countInArmy)}
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {available.map((upgrade) => (
            <div
              key={upgrade.id}
              className="flex items-center justify-between gap-3 rounded bg-ink/60 px-3 py-2"
            >
              <div>
                <p className="text-sm text-parchment">{upgrade.name}</p>
                <p className="text-xs text-parchment-dim">
                  {upgrade.effectText}
                  {upgrade.castingValue != null
                    ? ` (Range ${upgrade.range != null ? `${upgrade.range}cm` : "battlefield"}, Test ≤${upgrade.castingValue})`
                    : ""}
                </p>
                {upgrade.requirementsText && (
                  <p className="text-xs text-bronze-light">
                    {upgrade.requirementsText}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-parchment-dim">
                  {upgrade.pointsCost} pts
                </span>
                <button
                  className="rounded-md bg-bronze-dark px-2 py-1 text-xs font-semibold text-ink hover:bg-bronze disabled:opacity-50"
                  disabled={isAdding}
                  onClick={() => onAdd(upgrade.id)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ArmyBuilder({ armyId }: { armyId: string }) {
  const router = useRouter();
  const utils = api.useUtils();

  const armyQuery = api.army.getById.useQuery({ id: armyId });
  const factionId = armyQuery.data?.factionId;
  const factionQuery = api.faction.getById.useQuery(
    { id: factionId ?? "" },
    { enabled: !!factionId },
  );
  const upgradeCatalogQuery = api.upgrade.listForFaction.useQuery(
    { factionId: factionId ?? "" },
    { enabled: !!factionId },
  );

  const invalidateArmy = () => utils.army.getById.invalidate({ id: armyId });

  const armyName = armyQuery.data?.name;
  const [nameValue, setNameValue] = useState("");
  useEffect(() => {
    if (armyName !== undefined) setNameValue(armyName);
  }, [armyName]);

  const [expandedPanel, setExpandedPanel] = useState<{
    armyUnitId: string;
    type: UpgradeType;
  } | null>(null);

  const renameArmy = api.army.rename.useMutation({ onSuccess: invalidateArmy });
  const addUnit = api.army.addUnit.useMutation({ onSuccess: invalidateArmy });
  const updateQty = api.army.updateUnitQuantity.useMutation({
    onSuccess: invalidateArmy,
  });
  const removeUnit = api.army.removeUnit.useMutation({ onSuccess: invalidateArmy });
  const addUpgrade = api.army.addUpgrade.useMutation({
    onSuccess: invalidateArmy,
  });
  const removeUpgrade = api.army.removeUpgrade.useMutation({
    onSuccess: invalidateArmy,
  });
  const deleteArmy = api.army.delete.useMutation({
    onSuccess: () => router.push("/armies"),
  });

  if (armyQuery.isLoading) {
    return <p className="text-parchment-dim">Loading army...</p>;
  }
  if (armyQuery.error || !armyQuery.data) {
    return <p className="text-blood-light">Army not found.</p>;
  }

  const army = armyQuery.data;
  const totalPoints = army.units.reduce((sum, au) => sum + armyUnitPoints(au), 0);
  const overLimit = totalPoints > army.pointsLimit;
  const compositionIssues = getCompositionIssues(army.pointsLimit, army.units);
  const presentGeneralNames = getPresentGeneralNames(army.units);
  const presentUnitNames = getPresentUnitNames(army.units);

  const maraudersEntries = getMaraudersEntries(army.units);
  const rosterEntries = [
    ...army.units.map((au) => ({ ...au, isMarauders: false as const })),
    ...maraudersEntries,
  ];

  const rosterByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    entries: rosterEntries.filter(
      (au) => effectiveCategory(au.unit, presentGeneralNames) === category,
    ),
  })).filter((g) => g.entries.length > 0);

  const catalogByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    units: (factionQuery.data?.units ?? [])
      .filter((u) => isUnitAvailable(u, presentUnitNames))
      .filter((u) => effectiveCategory(u, presentGeneralNames) === category),
  })).filter((g) => g.units.length > 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-brass/40 bg-leather p-5">
        <div className="flex-1">
          <input
            className="font-display w-full bg-transparent text-2xl text-parchment outline-none focus:border-b focus:border-bronze"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={() => {
              if (nameValue.trim() && nameValue.trim() !== army.name) {
                renameArmy.mutate({ armyId: army.id, name: nameValue.trim() });
              } else {
                setNameValue(army.name);
              }
            }}
          />
          <p className="mt-1 text-sm text-parchment-dim">{army.faction.name}</p>
        </div>
        <div className="text-right">
          <p
            className={`text-2xl font-bold ${overLimit ? "text-blood-light" : "text-bronze-light"}`}
          >
            {totalPoints} / {army.pointsLimit} pts
          </p>
          {overLimit && (
            <p className="text-sm text-blood-light">Over the points limit</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/armies/${army.id}/view`}
            className="rounded-md bg-leather-light px-3 py-1.5 text-sm text-parchment hover:bg-brass/40"
          >
            View / Print
          </Link>
          <button
            className="rounded-md bg-leather-light px-3 py-1.5 text-sm text-blood-light hover:bg-blood/20"
            onClick={() => {
              if (confirm(`Delete "${army.name}"? This can't be undone.`)) {
                deleteArmy.mutate({ armyId: army.id });
              }
            }}
          >
            Delete Army
          </button>
        </div>
      </div>

      {compositionIssues.length > 0 && (
        <div className="rounded-lg border border-bronze-dark/50 bg-rust/10 p-4">
          <p className="font-semibold text-bronze-light">
            Army composition ({compositionIssues.length} issue
            {compositionIssues.length === 1 ? "" : "s"})
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {compositionIssues.map((issue) => (
              <li key={issue.id} className="text-sm text-parchment-dim">
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section>
        <h2 className="font-display mb-3 text-xl tracking-wide text-parchment uppercase">Roster</h2>
        {rosterByCategory.length === 0 ? (
          <p className="text-parchment-dim">No units added yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {rosterByCategory.map(({ category, entries }) => (
              <div key={category}>
                <h3 className="mb-2 text-sm font-semibold tracking-wide text-parchment-dim uppercase">
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="flex flex-col gap-2">
                  {entries.map((au) => {
                    const upgradeTypes = au.isMarauders
                      ? []
                      : upgradeTypesForHero(au.unit.heroType);
                    return (
                      <div
                        key={au.id}
                        className="rounded-lg border border-brass/40 bg-leather p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-parchment">
                              {au.unit.name}
                              {au.isMarauders ? (
                                <span className="ml-2 rounded bg-bronze-dark/40 px-1.5 py-0.5 text-xs font-normal text-bronze-light">
                                  Marauders
                                </span>
                              ) : (
                                HERO_TYPE_LABELS[au.unit.heroType] && (
                                  <span className="ml-2 rounded bg-leather-light px-1.5 py-0.5 text-xs font-normal text-parchment-dim">
                                    {HERO_TYPE_LABELS[au.unit.heroType]}
                                  </span>
                                )
                              )}
                            </p>
                            <p className="text-xs text-parchment-dim">
                              {au.isMarauders
                                ? "Free unit from a 16-base unit of the same type"
                                : formatCost(au.unit.costType, au.unit.pointsCost)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {au.isMarauders ? (
                              <span className="text-sm text-parchment-dim">x4</span>
                            ) : au.unit.costType === "PER_BASE" ? (
                              <QuantityInput
                                quantity={au.quantity}
                                min={au.unit.minBases ?? 1}
                                max={au.unit.maxBases ?? undefined}
                                onCommit={(n) =>
                                  updateQty.mutate({
                                    armyUnitId: au.id,
                                    quantity: n,
                                  })
                                }
                              />
                            ) : (
                              <span className="text-sm text-parchment-dim">x1</span>
                            )}
                            <span className="w-16 text-right text-sm font-medium text-parchment-dim">
                              {au.isMarauders ? "Free" : `${armyUnitPoints(au)} pts`}
                            </span>
                            {upgradeTypes.map((type) => {
                              const count = au.upgrades.filter(
                                (u) => u.upgrade.type === type,
                              ).length;
                              return (
                                <button
                                  key={type}
                                  className="rounded-md bg-leather-light px-2 py-1 text-sm text-parchment-dim hover:bg-brass/40"
                                  onClick={() =>
                                    setExpandedPanel((cur) =>
                                      cur?.armyUnitId === au.id &&
                                      cur.type === type
                                        ? null
                                        : { armyUnitId: au.id, type },
                                    )
                                  }
                                >
                                  {UPGRADE_TYPE_PLURAL_LABELS[type]}
                                  {count > 0 ? ` (${count})` : ""}
                                </button>
                              );
                            })}
                            {!au.isMarauders && (
                              <button
                                className="rounded-md bg-leather-light px-2 py-1 text-sm text-parchment-dim hover:bg-blood/20 hover:text-blood-light"
                                onClick={() =>
                                  removeUnit.mutate({ armyUnitId: au.id })
                                }
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        {!au.isMarauders && expandedPanel?.armyUnitId === au.id && (
                          <UpgradesPanel
                            armyUnit={au}
                            allArmyUnits={army.units}
                            type={expandedPanel.type}
                            catalog={upgradeCatalogQuery.data ?? []}
                            pointsLimit={army.pointsLimit}
                            isAdding={addUpgrade.isPending}
                            onAdd={(upgradeId) =>
                              addUpgrade.mutate({ armyUnitId: au.id, upgradeId })
                            }
                            onRemove={(armyUnitUpgradeId) =>
                              removeUpgrade.mutate({ armyUnitUpgradeId })
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display mb-3 text-xl tracking-wide text-parchment uppercase">
          Add Units
        </h2>
        {factionQuery.isLoading ? (
          <p className="text-parchment-dim">Loading unit catalog...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {catalogByCategory.map(({ category, units }) => (
              <div key={category}>
                <h3 className="mb-2 text-sm font-semibold tracking-wide text-parchment-dim uppercase">
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="flex flex-col gap-2">
                  {units.map((unit) => (
                    <div
                      key={unit.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-brass/40 bg-leather/60 p-3"
                    >
                      <div>
                        <p className="font-medium text-parchment">
                          {unit.name}
                          {HERO_TYPE_LABELS[unit.heroType] && (
                            <span className="ml-2 rounded bg-leather-light px-1.5 py-0.5 text-xs font-normal text-parchment-dim">
                              {HERO_TYPE_LABELS[unit.heroType]}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-parchment-dim">
                          {formatCost(unit.costType, unit.pointsCost)}
                          {(() => {
                            const range = formatBaseRange(
                              unit.costType,
                              unit.minBases,
                              unit.maxBases,
                            );
                            return range ? ` · ${range}` : null;
                          })()}
                        </p>
                      </div>
                      <button
                        className="rounded-md bg-bronze-dark px-3 py-1.5 text-sm font-semibold text-ink hover:bg-bronze disabled:opacity-50"
                        disabled={addUnit.isPending}
                        onClick={() =>
                          addUnit.mutate({ armyId: army.id, unitId: unit.id })
                        }
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
