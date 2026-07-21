import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env } from "~/env";
import { db } from "~/server/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(env.BETTER_AUTH_GOOGLE_CLIENT_ID && env.BETTER_AUTH_GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.BETTER_AUTH_GOOGLE_CLIENT_ID,
            clientSecret: env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
            redirectURI: "http://localhost:3000/api/auth/callback/google",
          },
        }
      : {}),
    ...(env.BETTER_AUTH_DISCORD_CLIENT_ID &&
    env.BETTER_AUTH_DISCORD_CLIENT_SECRET
      ? {
          discord: {
            clientId: env.BETTER_AUTH_DISCORD_CLIENT_ID,
            clientSecret: env.BETTER_AUTH_DISCORD_CLIENT_SECRET,
            redirectURI: "http://localhost:3000/api/auth/callback/discord",
          },
        }
      : {}),
  },
});

export type Session = typeof auth.$Infer.Session;
