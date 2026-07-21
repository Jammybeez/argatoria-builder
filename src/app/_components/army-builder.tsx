"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  onLiveChange,
}: {
  quantity: number;
  min: number;
  max: number | undefined;
  onCommit: (n: number, onSettled: () => void) => void;
  onLiveChange: (n: number) => void;
}) {
  const [value, setValue] = useState(String(quantity));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  // True from the moment a commit is scheduled until its mutation settles.
  // Guards the sync-from-server effect below: without this, a refetch
  // landing from an *earlier* edit (while a newer, still-in-flight edit is
  // pending) would overwrite the input with that now-stale server value —
  // visible as the number "rolling back" mid-mash.
  const pendingRef = useRef(false);

  useEffect(() => {
    if (!pendingRef.current) setValue(String(quantity));
  }, [quantity]);
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min, n));

  // The points total and Marauders check update on every keystroke/spinner
  // click via onLiveChange (no debounce — it's pure client-side math, no
  // network round trip). Persisting to the server is debounced separately,
  // and generously so: since the UI no longer waits on this for its
  // responsiveness, a longer window just means fewer requests and less
  // chance of two in-flight commits landing out of order.
  const handleChange = (raw: string) => {
    setValue(raw);

    const n = parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 1) {
      onLiveChange(clamp(n));
    }

    clearTimeout(debounceRef.current);
    pendingRef.current = true;
    debounceRef.current = setTimeout(() => {
      if (!Number.isFinite(n) || n < 1) {
        pendingRef.current = false;
        return;
      }
      const clamped = clamp(n);
      if (clamped !== quantity) {
        onCommit(clamped, () => {
          pendingRef.current = false;
        });
      } else {
        pendingRef.current = false;
      }
    }, 700);
  };

  return (
    <input
      type="number"
      min={min}
      max={max}
      className="border-brass/50 bg-ink w-16 rounded border px-2 py-1 text-center text-sm"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={() => {
        const n = parseInt(value, 10);
        if (!Number.isFinite(n) || n < 1) setValue(String(quantity));
      }}
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
    <div className="border-brass/40 mt-3 flex flex-col gap-3 border-t pt-3">
      {equipped.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {equipped.map((au) => (
            <div
              key={au.id}
              className="bg-ink flex items-center justify-between gap-3 rounded px-3 py-2"
            >
              <div>
                <p className="text-parchment text-sm">{au.upgrade.name}</p>
                {au.upgrade.requirementsText && (
                  <p className="text-bronze-light text-xs">
                    {au.upgrade.requirementsText}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-parchment-dim text-sm">
                  {au.upgrade.pointsCost} pts
                </span>
                <button
                  className="bg-leather-light text-parchment-dim hover:bg-blood/20 hover:text-blood-light rounded-md px-2 py-1 text-xs"
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
        <p className="text-parchment-dim text-xs">
          {unavailableReason(type, armyUnit, pointsLimit, armyMax, countInArmy)}
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {available.map((upgrade) => (
            <div
              key={upgrade.id}
              className="bg-ink/60 flex items-center justify-between gap-3 rounded px-3 py-2"
            >
              <div>
                <p className="text-parchment text-sm">{upgrade.name}</p>
                <p className="text-parchment-dim text-xs">
                  {upgrade.effectText}
                  {upgrade.castingValue != null
                    ? ` (Range ${upgrade.range != null ? `${upgrade.range}cm` : "battlefield"}, Test ≤${upgrade.castingValue})`
                    : ""}
                </p>
                {upgrade.requirementsText && (
                  <p className="text-bronze-light text-xs">
                    {upgrade.requirementsText}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-parchment-dim text-sm">
                  {upgrade.pointsCost} pts
                </span>
                <button
                  className="bg-bronze-dark text-ink hover:bg-bronze rounded-md px-2 py-1 text-xs font-semibold disabled:opacity-50"
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

  // In-progress base counts, keyed by armyUnit id, that haven't been
  // persisted to the server yet. Used only for instant point/Marauders
  // display — the QuantityInput's own value stays bound to the real
  // server-confirmed quantity so the debounced commit logic isn't fooled
  // by its own optimistic display value.
  const [liveQuantities, setLiveQuantities] = useState<Record<string, number>>(
    {},
  );
  const clearLiveQuantity = (armyUnitId: string) =>
    setLiveQuantities((cur) => {
      if (!(armyUnitId in cur)) return cur;
      const next = { ...cur };
      delete next[armyUnitId];
      return next;
    });

  const renameArmy = api.army.rename.useMutation({ onSuccess: invalidateArmy });

  // Optimistic: the new unit appears in the roster the instant "Add" is
  // clicked, using the already-loaded catalog data, rather than waiting on
  // the mutation + refetch round trip. Rolled back on error; reconciled
  // with the real server row (real id, sortOrder, etc.) via the refetch
  // that onSettled always triggers.
  const addUnit = api.army.addUnit.useMutation({
    onMutate: async (input) => {
      await utils.army.getById.cancel({ id: armyId });
      const previous = utils.army.getById.getData({ id: armyId });
      const unit = factionQuery.data?.units.find((u) => u.id === input.unitId);

      if (previous && unit) {
        const quantity = unit.costType === "FLAT" ? 1 : (unit.minBases ?? 4);
        const maxSort = previous.units.reduce(
          (max, au) => Math.max(max, au.sortOrder),
          0,
        );
        utils.army.getById.setData(
          { id: armyId },
          {
            ...previous,
            units: [
              ...previous.units,
              {
                id: `optimistic-${Date.now()}`,
                armyId,
                unitId: input.unitId,
                quantity,
                sortOrder: maxSort + 1,
                createdAt: new Date(),
                unit,
                upgrades: [],
              },
            ],
          },
        );
      }

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        utils.army.getById.setData({ id: armyId }, context.previous);
      }
    },
    onSettled: invalidateArmy,
  });
  const updateQty = api.army.updateUnitQuantity.useMutation({
    onSuccess: invalidateArmy,
  });
  const removeUnit = api.army.removeUnit.useMutation({
    onSuccess: invalidateArmy,
  });
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
  const getEffectiveQuantity = (au: { id: string; quantity: number }) =>
    liveQuantities[au.id] ?? au.quantity;
  // Same units, but with any in-progress (not-yet-persisted) base counts
  // applied — used for the points total and Marauders check so both react
  // instantly instead of waiting on the debounced server round trip.
  const liveArmyUnits = army.units.map((au) => ({
    ...au,
    quantity: getEffectiveQuantity(au),
  }));

  const totalPoints = liveArmyUnits.reduce(
    (sum, au) => sum + armyUnitPoints(au),
    0,
  );
  const overLimit = totalPoints > army.pointsLimit;
  const compositionIssues = getCompositionIssues(army.pointsLimit, army.units);
  const presentGeneralNames = getPresentGeneralNames(army.units);
  const presentUnitNames = getPresentUnitNames(army.units);

  const maraudersEntries = getMaraudersEntries(liveArmyUnits);
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
      <div className="border-brass/40 bg-leather flex flex-wrap items-center justify-between gap-4 rounded-lg border p-5">
        <div className="flex-1">
          <input
            className="font-display text-parchment focus:border-bronze w-full bg-transparent text-2xl outline-none focus:border-b"
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
          <p className="text-parchment-dim mt-1 text-sm">{army.faction.name}</p>
        </div>
        <div className="text-right">
          <p
            className={`text-2xl font-bold ${overLimit ? "text-blood-light" : "text-bronze-light"}`}
          >
            {totalPoints} / {army.pointsLimit} pts
          </p>
          {overLimit && (
            <p className="text-blood-light text-sm">Over the points limit</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/armies/${army.id}/view`}
            className="bg-leather-light text-parchment hover:bg-brass/40 rounded-md px-3 py-1.5 text-sm"
          >
            View / Print
          </Link>
          <button
            className="bg-leather-light text-blood-light hover:bg-blood/20 rounded-md px-3 py-1.5 text-sm"
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
        <div className="border-bronze-dark/50 bg-rust/10 rounded-lg border p-4">
          <p className="text-bronze-light font-semibold">
            Army composition ({compositionIssues.length} issue
            {compositionIssues.length === 1 ? "" : "s"})
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {compositionIssues.map((issue) => (
              <li key={issue.id} className="text-parchment-dim text-sm">
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section>
        <h2 className="font-display border-bronze-dark/60 text-bronze-light mb-3 border-b-2 pb-1 text-xl tracking-wide uppercase">
          Roster
        </h2>
        <div className="border-bronze-dark/40 bg-ink/40 rounded-lg border-2 p-4">
          {rosterByCategory.length === 0 ? (
            <p className="text-parchment-dim">No units added yet.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {rosterByCategory.map(({ category, entries }) => (
                <div key={category}>
                  <h3 className="text-parchment-dim mb-2 text-sm font-semibold tracking-wide uppercase">
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
                          className="border-brass/40 border-l-bronze bg-leather rounded-lg border border-l-4 p-3 shadow-sm shadow-black/30"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-parchment font-medium">
                                {au.unit.name}
                                {au.isMarauders ? (
                                  <span className="bg-bronze-dark/40 text-bronze-light ml-2 rounded px-1.5 py-0.5 text-xs font-normal">
                                    Marauders
                                  </span>
                                ) : (
                                  HERO_TYPE_LABELS[au.unit.heroType] && (
                                    <span className="bg-leather-light text-parchment-dim ml-2 rounded px-1.5 py-0.5 text-xs font-normal">
                                      {HERO_TYPE_LABELS[au.unit.heroType]}
                                    </span>
                                  )
                                )}
                              </p>
                              <p className="text-parchment-dim text-xs">
                                {au.isMarauders
                                  ? "Free unit from a 16-base unit of the same type"
                                  : formatCost(
                                      au.unit.costType,
                                      au.unit.pointsCost,
                                    )}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {au.isMarauders ? (
                                <span className="text-parchment-dim text-sm">
                                  x4
                                </span>
                              ) : au.unit.costType === "PER_BASE" ? (
                                <QuantityInput
                                  quantity={au.quantity}
                                  min={au.unit.minBases ?? 1}
                                  max={au.unit.maxBases ?? undefined}
                                  onLiveChange={(n) =>
                                    setLiveQuantities((cur) => ({
                                      ...cur,
                                      [au.id]: n,
                                    }))
                                  }
                                  onCommit={(n, onSettled) =>
                                    updateQty.mutate(
                                      { armyUnitId: au.id, quantity: n },
                                      {
                                        onSettled: () => {
                                          clearLiveQuantity(au.id);
                                          onSettled();
                                        },
                                      },
                                    )
                                  }
                                />
                              ) : (
                                <span className="text-parchment-dim text-sm">
                                  x1
                                </span>
                              )}
                              <span className="text-parchment-dim w-16 text-right text-sm font-medium">
                                {au.isMarauders
                                  ? "Free"
                                  : `${armyUnitPoints({ ...au, quantity: getEffectiveQuantity(au) })} pts`}
                              </span>
                              {upgradeTypes.map((type) => {
                                const count = au.upgrades.filter(
                                  (u) => u.upgrade.type === type,
                                ).length;
                                return (
                                  <button
                                    key={type}
                                    className="bg-leather-light text-parchment-dim hover:bg-brass/40 rounded-md px-2 py-1 text-sm"
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
                                  className="bg-leather-light text-parchment-dim hover:bg-blood/20 hover:text-blood-light rounded-md px-2 py-1 text-sm"
                                  onClick={() =>
                                    removeUnit.mutate({ armyUnitId: au.id })
                                  }
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                          {!au.isMarauders &&
                            expandedPanel?.armyUnitId === au.id && (
                              <UpgradesPanel
                                armyUnit={au}
                                allArmyUnits={army.units}
                                type={expandedPanel.type}
                                catalog={upgradeCatalogQuery.data ?? []}
                                pointsLimit={army.pointsLimit}
                                isAdding={addUpgrade.isPending}
                                onAdd={(upgradeId) =>
                                  addUpgrade.mutate({
                                    armyUnitId: au.id,
                                    upgradeId,
                                  })
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
        </div>
      </section>

      <section>
        <h2 className="text-parchment-dim mb-3 text-sm font-semibold tracking-wide uppercase">
          Add Units
        </h2>
        {factionQuery.isLoading ? (
          <p className="text-parchment-dim">Loading unit catalog...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {catalogByCategory.map(({ category, units }) => (
              <div key={category}>
                <h3 className="text-parchment-dim/70 mb-2 text-sm font-semibold tracking-wide uppercase">
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="flex flex-col gap-2">
                  {units.map((unit) => (
                    <div
                      key={unit.id}
                      className="border-brass/30 flex items-center justify-between gap-3 rounded-lg border border-dashed bg-transparent p-3"
                    >
                      <div>
                        <p className="text-parchment-dim">
                          {unit.name}
                          {HERO_TYPE_LABELS[unit.heroType] && (
                            <span className="bg-leather-light text-parchment-dim ml-2 rounded px-1.5 py-0.5 text-xs font-normal">
                              {HERO_TYPE_LABELS[unit.heroType]}
                            </span>
                          )}
                        </p>
                        <p className="text-parchment-dim/70 text-xs">
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
                        className="bg-bronze-dark text-ink hover:bg-bronze rounded-md px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
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
