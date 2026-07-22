"use client";

import { useState } from "react";

import { authClient } from "~/server/better-auth/client";

export function SignInForm({
  enableGoogle,
  enableDiscord,
}: {
  enableGoogle: boolean;
  enableDiscord: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [socialPending, setSocialPending] = useState<
    "google" | "discord" | null
  >(null);

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

      {error && <p className="text-sm text-blood-light">{error}</p>}
    </div>
  );
}
