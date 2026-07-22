"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "~/server/better-auth/client";

// Fixed local-only account, auto-provisioned on first use. Only reachable
// when devLoginEnabled is true, which is itself gated to non-production.
const DEV_EMAIL = "dev@localhost.test";
const DEV_PASSWORD = "dev-local-password-123";

export function SignInForm({
  enableGoogle,
  enableDiscord,
  devLoginEnabled,
}: {
  enableGoogle: boolean;
  enableDiscord: boolean;
  devLoginEnabled: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [socialPending, setSocialPending] = useState<
    "google" | "discord" | null
  >(null);
  const [devPending, setDevPending] = useState(false);

  const signInWithSocial = async (provider: "google" | "discord") => {
    setError(null);
    setSocialPending(provider);
    const { error: authError } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
    setSocialPending(null);
    if (authError) {
      setError(authError.message ?? "Something went wrong");
    }
  };

  const signInAsDevUser = async () => {
    setError(null);
    setDevPending(true);
    let { error: authError } = await authClient.signIn.email({
      email: DEV_EMAIL,
      password: DEV_PASSWORD,
    });
    if (authError) {
      ({ error: authError } = await authClient.signUp.email({
        name: "Dev User",
        email: DEV_EMAIL,
        password: DEV_PASSWORD,
      }));
    }
    setDevPending(false);
    if (authError) {
      setError(authError.message ?? "Dev sign-in failed");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-brass/40 bg-leather p-6">
      <h1 className="font-display text-xl tracking-wide text-bronze-light uppercase">
        Sign in
      </h1>

      {enableGoogle || enableDiscord ? (
        <div className="flex flex-col gap-2">
          {enableGoogle && (
            <button
              type="button"
              disabled={socialPending !== null}
              onClick={() => void signInWithSocial("google")}
              className="rounded-md border border-brass/50 bg-ink px-4 py-2 font-semibold text-parchment hover:bg-ink-light disabled:opacity-50"
            >
              {socialPending === "google"
                ? "Redirecting..."
                : "Continue with Google"}
            </button>
          )}
          {enableDiscord && (
            <button
              type="button"
              disabled={socialPending !== null}
              onClick={() => void signInWithSocial("discord")}
              className="rounded-md border border-brass/50 bg-ink px-4 py-2 font-semibold text-parchment hover:bg-ink-light disabled:opacity-50"
            >
              {socialPending === "discord"
                ? "Redirecting..."
                : "Continue with Discord"}
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-parchment-dim">
          No sign-in providers are configured.
        </p>
      )}

      {devLoginEnabled && (
        <div className="rounded-md border border-dashed border-blood-light/60 p-3">
          <p className="mb-2 text-xs text-blood-light">
            Dev login (local only, never available in production)
          </p>
          <button
            type="button"
            disabled={devPending}
            onClick={() => void signInAsDevUser()}
            className="w-full rounded-md border border-blood-light/60 bg-ink px-4 py-2 text-sm text-parchment hover:bg-ink-light disabled:opacity-50"
          >
            {devPending ? "Signing in..." : "Continue as dev user"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-blood-light">{error}</p>}
    </div>
  );
}
