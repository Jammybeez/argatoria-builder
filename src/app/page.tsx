import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-amber-400">
        Argatoria Army Builder
      </h1>
      <p className="text-lg text-stone-300">
        Browse factions and units, then build and save your army lists for
        the tabletop.
      </p>
      <div className="flex gap-4">
        <Link
          href="/factions"
          className="rounded-md bg-amber-600 px-5 py-2.5 font-semibold text-stone-950 hover:bg-amber-500"
        >
          Browse Factions
        </Link>
        <Link
          href="/armies"
          className="rounded-md bg-stone-800 px-5 py-2.5 font-semibold text-stone-100 hover:bg-stone-700"
        >
          My Armies
        </Link>
      </div>
    </main>
  );
}
