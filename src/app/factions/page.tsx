import Link from "next/link";

import { api } from "~/trpc/server";

export default async function FactionsPage() {
  const factions = await api.faction.list();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display mb-6 text-3xl tracking-wide text-bronze-light uppercase">
        Factions
      </h1>

      {factions.length === 0 ? (
        <p className="text-parchment-dim">No factions have been added yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {factions.map((faction) => (
            <Link
              key={faction.id}
              href={`/factions/${faction.id}`}
              className="rounded-lg border border-brass/40 bg-leather p-5 transition hover:border-bronze"
            >
              <h2 className="font-display text-xl text-parchment uppercase">
                {faction.name}
              </h2>
              {faction.tagline && (
                <p className="mt-1 text-sm text-parchment-dim">
                  {faction.tagline}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
