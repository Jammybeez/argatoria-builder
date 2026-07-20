"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function NewArmyForm({ factionId }: { factionId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pointsLimit, setPointsLimit] = useState(1000);

  const createArmy = api.army.create.useMutation({
    onSuccess: (army) => {
      router.push(`/armies/${army.id}`);
    },
  });

  return (
    <form
      className="flex flex-col gap-3 rounded-lg border border-stone-800 bg-stone-900 p-5 sm:flex-row sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        createArmy.mutate({ factionId, name: name.trim(), pointsLimit });
      }}
    >
      <div className="flex-1">
        <label className="mb-1 block text-sm text-stone-400" htmlFor="army-name">
          Army name
        </label>
        <input
          id="army-name"
          className="w-full rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
          placeholder="e.g. Sun Cities Vanguard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-stone-400" htmlFor="points-limit">
          Points limit
        </label>
        <input
          id="points-limit"
          type="number"
          min={1}
          className="w-32 rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
          value={pointsLimit}
          onChange={(e) => setPointsLimit(Number(e.target.value))}
        />
      </div>
      <button
        type="submit"
        disabled={createArmy.isPending || !name.trim()}
        className="rounded-md bg-amber-600 px-5 py-2 font-semibold text-stone-950 hover:bg-amber-500 disabled:opacity-50"
      >
        {createArmy.isPending ? "Creating..." : "Start Army"}
      </button>
      {createArmy.error && (
        <p className="text-sm text-red-400">{createArmy.error.message}</p>
      )}
    </form>
  );
}
