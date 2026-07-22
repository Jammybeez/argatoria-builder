import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ThemeToggle } from "~/app/_components/theme-toggle";
import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";

export async function Nav() {
  const session = await getSession();

  return (
    <header className="border-b border-brass/40 bg-ink-light print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-display text-lg tracking-widest text-bronze-light uppercase"
        >
          Argatoria
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/factions"
            className="text-parchment-dim hover:text-parchment"
          >
            Factions
          </Link>
          {session && (
            <Link
              href="/armies"
              className="text-parchment-dim hover:text-parchment"
            >
              My Armies
            </Link>
          )}
          {session ? (
            <div className="flex items-center gap-2">
              {session.user.image && (
                // eslint-disable-next-line @next/next/no-img-element -- external OAuth-provider avatar, not worth a next/image remotePatterns allowlist
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-full border-2 border-brass/50"
                  style={
                    session.user.accentColor
                      ? {
                          borderColor: session.user.accentColor,
                          boxShadow: `0 0 6px 1px ${session.user.accentColor}`,
                        }
                      : undefined
                  }
                />
              )}
              <form>
                <button
                  className="rounded-md border border-brass/50 bg-leather px-3 py-1.5 text-parchment hover:bg-leather-light"
                  formAction={async () => {
                    "use server";
                    await auth.api.signOut({ headers: await headers() });
                    redirect("/");
                  }}
                >
                  Sign out ({session.user.name})
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-md bg-bronze-dark px-3 py-1.5 font-medium text-parchment hover:bg-bronze"
            >
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
