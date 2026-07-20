import Link from "next/link";

import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/server";

export default async function ArmiesPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display mb-4 text-3xl tracking-wide text-bronze-light uppercase">
          My Armies
        </h1>
        <p className="text-parchment-dim">
          Sign in to view and build your armies.
        </p>
      </main>
    );
  }

  const armies = await api.army.listMine();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-wide text-bronze-light uppercase">
          My Armies
        </h1>
        <Link
          href="/factions"
          className="rounded-md bg-bronze-dark px-4 py-2 text-sm font-semibold text-parchment hover:bg-bronze"
        >
          + New Army
        </Link>
      </div>

      {armies.length === 0 ? (
        <p className="text-parchment-dim">
          You haven&apos;t started an army yet. Pick a faction to begin.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {armies.map((army) => (
            <Link
              key={army.id}
              href={`/armies/${army.id}`}
              className="flex items-center justify-between rounded-lg border border-brass/40 bg-leather p-4 transition hover:border-bronze"
            >
              <div>
                <p className="font-semibold text-parchment">{army.name}</p>
                <p className="text-sm text-parchment-dim">
                  {army.faction.name}
                </p>
              </div>
              <p className="text-sm font-medium text-parchment-dim">
                {army.totalPoints} / {army.pointsLimit} pts
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
