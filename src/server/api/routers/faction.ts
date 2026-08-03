import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const factionRouter = createTRPCRouter({
  // Excludes the dummy "Appendix" faction used to hold appendix units — it's
  // never a real army's own faction, only a source of cross-faction units.
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.faction.findMany({
      where: { isAppendix: false },
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

      // Appendix units eligible for this faction, merged into the same
      // catalog shape as normal units. Each one's per-faction General/
      // Champion requirement is mapped onto requiresHeroNames, and its
      // pointsCost is overridden if this faction pays a different cost —
      // reusing the exact mechanisms (and all their existing client-side
      // handling) that same-faction conditional units already use.
      const appendixEligibilities = await ctx.db.appendixEligibility.findMany({
        where: { factionId: input.id },
        include: { unit: { include: { specialRules: true } } },
      });

      const appendixUnits = appendixEligibilities.map((elig) => ({
        ...elig.unit,
        requiresHeroNames: elig.requiresGeneralNames,
        requiresAnyHeroNames: elig.requiresAnyGeneralNames,
        requiresUpgradeName: elig.requiresUpgradeName,
        pointsCost: elig.costOverride ?? elig.unit.pointsCost,
        isAppendixUnit: true as const,
      }));

      return {
        ...faction,
        units: [
          // appendixOnly covers same-faction heroes restricted to "a
          // certain army" (e.g. Xan'toag, Gnat) — hidden behind the
          // catalog toggle same as genuinely cross-faction units, even
          // though they live directly on this faction's own roster.
          ...faction.units.map((u) => ({
            ...u,
            isAppendixUnit: u.appendixOnly,
          })),
          ...appendixUnits,
        ],
      };
    }),
});
