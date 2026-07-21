"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "~/server/better-auth/client";

export function SignInForm({
  enableGoogle,
  enableDiscord,
}: {
  enableGoogle: boolean;
  enableDiscord: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialPending, setSocialPending] = useState<
    "google" | "discord" | null
  >(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: authError } =
      mode === "sign-in"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ name, email, password });

    setIsSubmitting(false);

    if (authError) {
      setError(authError.message ?? "Something went wrong");
      return;
    }

    router.push("/");
    router.refresh();
  };

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

  const showSocial = enableGoogle || enableDiscord;

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-brass/40 bg-leather p-6">
      <h1 className="font-display text-xl tracking-wide text-bronze-light uppercase">
        {mode === "sign-in" ? "Sign in" : "Create an account"}
      </h1>

      {showSocial && (
        <>
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
          <div className="flex items-center gap-3 text-xs text-parchment-dim">
            <div className="h-px flex-1 bg-brass/40" />
            or
            <div className="h-px flex-1 bg-brass/40" />
          </div>
        </>
      )}

      <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-4">
        {mode === "sign-up" && (
          <div>
            <label
              className="mb-1 block text-sm text-parchment-dim"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              className="w-full rounded-md border border-brass/50 bg-ink px-3 py-2 text-parchment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label
            className="mb-1 block text-sm text-parchment-dim"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-brass/50 bg-ink px-3 py-2 text-parchment"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm text-parchment-dim"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-brass/50 bg-ink px-3 py-2 text-parchment"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {error && <p className="text-sm text-blood-light">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-bronze-dark px-4 py-2 font-semibold text-parchment hover:bg-bronze disabled:opacity-50"
        >
          {isSubmitting
            ? "Please wait..."
            : mode === "sign-in"
              ? "Sign in"
              : "Sign up"}
        </button>

        <button
          type="button"
          className="text-sm text-parchment-dim hover:text-parchment"
          onClick={() =>
            setMode((m) => (m === "sign-in" ? "sign-up" : "sign-in"))
          }
        >
          {mode === "sign-in"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
