import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 py-16">
      <h1 className="font-display text-4xl tracking-wide text-bronze-light uppercase">
        Argatoria Army Builder
      </h1>
      <p className="text-lg text-parchment-dim">
        Browse factions and units, then build and save your army lists for
        the tabletop.
      </p>
      <div className="flex gap-4">
        <Link
          href="/factions"
          className="rounded-md bg-bronze-dark px-5 py-2.5 font-semibold text-parchment hover:bg-bronze"
        >
          Browse Factions
        </Link>
        <Link
          href="/armies"
          className="rounded-md border border-brass/50 bg-leather px-5 py-2.5 font-semibold text-parchment hover:bg-leather-light"
        >
          My Armies
        </Link>
      </div>
    </main>
  );
}
