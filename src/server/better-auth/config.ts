import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env } from "~/env";
import { db } from "~/server/db";

const baseURL = env.BETTER_AUTH_URL ?? "http://localhost:3000";

// Double-guarded so this can never take effect in a real deployment even if
// the env var were somehow set there by mistake: NODE_ENV must also not be
// "production".
export const devLoginEnabled =
  env.NODE_ENV !== "production" && env.ENABLE_DEV_LOGIN === "true";

export const auth = betterAuth({
  baseURL,
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      accentColor: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  ...(devLoginEnabled ? { emailAndPassword: { enabled: true } } : {}),
  socialProviders: {
    ...(env.BETTER_AUTH_GOOGLE_CLIENT_ID && env.BETTER_AUTH_GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.BETTER_AUTH_GOOGLE_CLIENT_ID,
            clientSecret: env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
            redirectURI: `${baseURL}/api/auth/callback/google`,
          },
        }
      : {}),
    ...(env.BETTER_AUTH_DISCORD_CLIENT_ID &&
    env.BETTER_AUTH_DISCORD_CLIENT_SECRET
      ? {
          discord: {
            clientId: env.BETTER_AUTH_DISCORD_CLIENT_ID,
            clientSecret: env.BETTER_AUTH_DISCORD_CLIENT_SECRET,
            redirectURI: `${baseURL}/api/auth/callback/discord`,
            mapProfileToUser: (profile) => ({
              accentColor:
                profile.accent_color != null
                  ? `#${profile.accent_color.toString(16).padStart(6, "0")}`
                  : undefined,
            }),
          },
        }
      : {}),
  },
});

export type Session = typeof auth.$Infer.Session;
