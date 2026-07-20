import Link from "next/link";

import { api } from "~/trpc/server";

export default async function FactionsPage() {
  const factions = await api.faction.list();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-amber-400">Factions</h1>

      {factions.length === 0 ? (
        <p className="text-stone-400">No factions have been added yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {factions.map((faction) => (
            <Link
              key={faction.id}
              href={`/factions/${faction.id}`}
              className="rounded-lg border border-stone-800 bg-stone-900 p-5 transition hover:border-amber-600"
            >
              <h2 className="text-xl font-semibold text-stone-100">
                {faction.name}
              </h2>
              {faction.tagline && (
                <p className="mt-1 text-sm text-stone-400">{faction.tagline}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
