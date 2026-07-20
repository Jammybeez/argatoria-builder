"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "~/server/better-auth/client";

export function SignInForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-stone-800 bg-stone-900 p-6"
    >
      <h1 className="text-xl font-semibold text-stone-100">
        {mode === "sign-in" ? "Sign in" : "Create an account"}
      </h1>

      {mode === "sign-up" && (
        <div>
          <label className="mb-1 block text-sm text-stone-400" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="w-full rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm text-stone-400" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-400" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-amber-600 px-4 py-2 font-semibold text-stone-950 hover:bg-amber-500 disabled:opacity-50"
      >
        {isSubmitting
          ? "Please wait..."
          : mode === "sign-in"
            ? "Sign in"
            : "Sign up"}
      </button>

      <button
        type="button"
        className="text-sm text-stone-400 hover:text-stone-200"
        onClick={() =>
          setMode((m) => (m === "sign-in" ? "sign-up" : "sign-in"))
        }
      >
        {mode === "sign-in"
          ? "Need an account? Sign up"
          : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
