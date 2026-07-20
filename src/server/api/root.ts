import { armyRouter } from "~/server/api/routers/army";
import { factionRouter } from "~/server/api/routers/faction";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  faction: factionRouter,
  army: armyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.faction.list();
 *       ^? Faction[]
 */
export const createCaller = createCallerFactory(appRouter);
