import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const factionRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.faction.findMany({
      orderBy: { name: "asc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const faction = await ctx.db.faction.findUnique({
        where: { id: input.id },
        include: {
          units: {
            include: { specialRules: true },
            orderBy: [{ category: "asc" }, { name: "asc" }],
          },
        },
      });

      if (!faction) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Faction not found" });
      }

      return faction;
    }),
});
