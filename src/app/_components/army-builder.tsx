"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CATEGORY_LABELS, CATEGORY_ORDER, formatCost } from "~/lib/unit-format";
import { api } from "~/trpc/react";

function QuantityInput({
  quantity,
  onCommit,
}: {
  quantity: number;
  onCommit: (n: number) => void;
}) {
  const [value, setValue] = useState(String(quantity));

  useEffect(() => setValue(String(quantity)), [quantity]);

  const commit = () => {
    const n = parseInt(value, 10);
    if (Number.isFinite(n) && n > 0 && n !== quantity) {
      onCommit(n);
    } else {
      setValue(String(quantity));
    }
  };

  return (
    <input
      type="number"
      min={1}
      className="w-16 rounded border border-stone-700 bg-stone-950 px-2 py-1 text-center text-sm"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
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

  const invalidateArmy = () => utils.army.getById.invalidate({ id: armyId });

  const armyName = armyQuery.data?.name;
  const [nameValue, setNameValue] = useState("");
  useEffect(() => {
    if (armyName !== undefined) setNameValue(armyName);
  }, [armyName]);

  const renameArmy = api.army.rename.useMutation({ onSuccess: invalidateArmy });
  const addUnit = api.army.addUnit.useMutation({ onSuccess: invalidateArmy });
  const updateQty = api.army.updateUnitQuantity.useMutation({
    onSuccess: invalidateArmy,
  });
  const removeUnit = api.army.removeUnit.useMutation({ onSuccess: invalidateArmy });
  const deleteArmy = api.army.delete.useMutation({
    onSuccess: () => router.push("/armies"),
  });

  if (armyQuery.isLoading) {
    return <p className="text-stone-400">Loading army...</p>;
  }
  if (armyQuery.error || !armyQuery.data) {
    return <p className="text-red-400">Army not found.</p>;
  }

  const army = armyQuery.data;
  const totalPoints = army.units.reduce(
    (sum, au) => sum + au.unit.pointsCost * au.quantity,
    0,
  );
  const overLimit = totalPoints > army.pointsLimit;

  const rosterByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    entries: army.units.filter((au) => au.unit.category === category),
  })).filter((g) => g.entries.length > 0);

  const catalogByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    units: (factionQuery.data?.units ?? []).filter(
      (u) => u.category === category,
    ),
  })).filter((g) => g.units.length > 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-stone-800 bg-stone-900 p-5">
        <div className="flex-1">
          <input
            className="w-full bg-transparent text-2xl font-bold text-stone-100 outline-none focus:border-b focus:border-amber-600"
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
          <p className="mt-1 text-sm text-stone-400">{army.faction.name}</p>
        </div>
        <div className="text-right">
          <p
            className={`text-2xl font-bold ${overLimit ? "text-red-400" : "text-amber-400"}`}
          >
            {totalPoints} / {army.pointsLimit} pts
          </p>
          {overLimit && (
            <p className="text-sm text-red-400">Over the points limit</p>
          )}
        </div>
        <button
          className="rounded-md bg-stone-800 px-3 py-1.5 text-sm text-red-300 hover:bg-red-900/40"
          onClick={() => {
            if (confirm(`Delete "${army.name}"? This can't be undone.`)) {
              deleteArmy.mutate({ armyId: army.id });
            }
          }}
        >
          Delete Army
        </button>
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-stone-100">Roster</h2>
        {rosterByCategory.length === 0 ? (
          <p className="text-stone-400">No units added yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {rosterByCategory.map(({ category, entries }) => (
              <div key={category}>
                <h3 className="mb-2 text-sm font-semibold tracking-wide text-stone-400 uppercase">
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="flex flex-col gap-2">
                  {entries.map((au) => (
                    <div
                      key={au.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-stone-800 bg-stone-900 p-3"
                    >
                      <div>
                        <p className="font-medium text-stone-100">
                          {au.unit.name}
                        </p>
                        <p className="text-xs text-stone-400">
                          {formatCost(au.unit.costType, au.unit.pointsCost)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {au.unit.costType === "PER_BASE" ? (
                          <QuantityInput
                            quantity={au.quantity}
                            onCommit={(n) =>
                              updateQty.mutate({ armyUnitId: au.id, quantity: n })
                            }
                          />
                        ) : (
                          <span className="text-sm text-stone-500">x1</span>
                        )}
                        <span className="w-16 text-right text-sm font-medium text-stone-300">
                          {au.unit.pointsCost * au.quantity} pts
                        </span>
                        <button
                          className="rounded-md bg-stone-800 px-2 py-1 text-sm text-stone-400 hover:bg-red-900/40 hover:text-red-300"
                          onClick={() => removeUnit.mutate({ armyUnitId: au.id })}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-stone-100">
          Add Units
        </h2>
        {factionQuery.isLoading ? (
          <p className="text-stone-400">Loading unit catalog...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {catalogByCategory.map(({ category, units }) => (
              <div key={category}>
                <h3 className="mb-2 text-sm font-semibold tracking-wide text-stone-400 uppercase">
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="flex flex-col gap-2">
                  {units.map((unit) => (
                    <div
                      key={unit.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-stone-800 bg-stone-900/60 p-3"
                    >
                      <div>
                        <p className="font-medium text-stone-100">
                          {unit.name}
                        </p>
                        <p className="text-xs text-stone-400">
                          {formatCost(unit.costType, unit.pointsCost)}
                        </p>
                      </div>
                      <button
                        className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-stone-950 hover:bg-amber-500 disabled:opacity-50"
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
