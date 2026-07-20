import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";

export async function Nav() {
  const session = await getSession();

  return (
    <header className="border-b border-stone-800 bg-stone-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-wide text-amber-400">
          Argatoria Builder
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/factions" className="text-stone-300 hover:text-white">
            Factions
          </Link>
          {session && (
            <Link href="/armies" className="text-stone-300 hover:text-white">
              My Armies
            </Link>
          )}
          {session ? (
            <form>
              <button
                className="rounded-md bg-stone-800 px-3 py-1.5 text-stone-200 hover:bg-stone-700"
                formAction={async () => {
                  "use server";
                  await auth.api.signOut({ headers: await headers() });
                  redirect("/");
                }}
              >
                Sign out ({session.user.name})
              </button>
            </form>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-md bg-amber-600 px-3 py-1.5 font-medium text-stone-950 hover:bg-amber-500"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
