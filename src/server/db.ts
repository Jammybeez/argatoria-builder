import { withAccelerate } from "@prisma/extension-accelerate";

import { env } from "~/env";
import { PrismaClient } from "../../generated/prisma";

// Accelerate (prisma+postgres:// / prisma://) needs the extension to work at
// all; a plain postgresql:// URL (e.g. local Docker dev) does not use it.
const usesAccelerate =
  env.DATABASE_URL.startsWith("prisma://") ||
  env.DATABASE_URL.startsWith("prisma+postgres://");

// Cast back to the plain PrismaClient type: the extended client only differs
// in Accelerate-specific extras (withAccelerateInfo, $accelerate.invalidate)
// that nothing here uses, so every caller can keep treating `db` as a single
// stable type regardless of which branch actually ran.
const createPrismaClient = (): PrismaClient => {
  const client = new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  return (
    usesAccelerate ? client.$extends(withAccelerate()) : client
  ) as PrismaClient;
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
