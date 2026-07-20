import Link from "next/link";

import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/server";

export default async function ArmiesPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-4 text-3xl font-bold text-amber-400">My Armies</h1>
        <p className="text-stone-400">Sign in to view and build your armies.</p>
      </main>
    );
  }

  const armies = await api.army.listMine();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-amber-400">My Armies</h1>
        <Link
          href="/factions"
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-500"
        >
          + New Army
        </Link>
      </div>

      {armies.length === 0 ? (
        <p className="text-stone-400">
          You haven&apos;t started an army yet. Pick a faction to begin.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {armies.map((army) => (
            <Link
              key={army.id}
              href={`/armies/${army.id}`}
              className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-900 p-4 transition hover:border-amber-600"
            >
              <div>
                <p className="font-semibold text-stone-100">{army.name}</p>
                <p className="text-sm text-stone-400">{army.faction.name}</p>
              </div>
              <p className="text-sm font-medium text-stone-300">
                {army.totalPoints} / {army.pointsLimit} pts
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
