import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const upgradeRouter = createTRPCRouter({
  listForFaction: publicProcedure
    .input(z.object({ factionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const faction = await ctx.db.faction.findUnique({
        where: { id: input.factionId },
      });
      if (!faction) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Faction not found" });
      }

      return ctx.db.upgrade.findMany({
        where: {
          OR: [{ factionName: null }, { factionName: faction.name }],
        },
        orderBy: [{ type: "asc" }, { name: "asc" }],
      });
    }),
});
