import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const armyWithUnitsInclude = {
  faction: true,
  units: {
    include: { unit: { include: { specialRules: true } } },
    orderBy: [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }],
  },
};

export const armyRouter = createTRPCRouter({
  listMine: protectedProcedure.query(async ({ ctx }) => {
    const armies = await ctx.db.army.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        faction: true,
        units: { include: { unit: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return armies.map((army) => ({
      ...army,
      totalPoints: army.units.reduce(
        (sum, au) => sum + au.unit.pointsCost * au.quantity,
        0,
      ),
    }));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const army = await ctx.db.army.findUnique({
        where: { id: input.id },
        include: armyWithUnitsInclude,
      });

      if (army?.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Army not found" });
      }

      return army;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        factionId: z.string(),
        pointsLimit: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const faction = await ctx.db.faction.findUnique({
        where: { id: input.factionId },
      });
      if (!faction) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Faction not found" });
      }

      return ctx.db.army.create({
        data: {
          name: input.name,
          pointsLimit: input.pointsLimit,
          factionId: input.factionId,
          userId: ctx.session.user.id,
        },
      });
    }),

  rename: protectedProcedure
    .input(z.object({ armyId: z.string(), name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const army = await ctx.db.army.findUnique({
        where: { id: input.armyId },
      });
      if (army?.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Army not found" });
      }

      return ctx.db.army.update({
        where: { id: input.armyId },
        data: { name: input.name },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ armyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const army = await ctx.db.army.findUnique({
        where: { id: input.armyId },
      });
      if (army?.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Army not found" });
      }

      await ctx.db.army.delete({ where: { id: input.armyId } });
      return { success: true };
    }),

  addUnit: protectedProcedure
    .input(
      z.object({
        armyId: z.string(),
        unitId: z.string(),
        quantity: z.number().int().positive().default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const army = await ctx.db.army.findUnique({
        where: { id: input.armyId },
      });
      if (army?.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Army not found" });
      }

      const unit = await ctx.db.unit.findUnique({
        where: { id: input.unitId },
      });
      if (unit?.factionId !== army.factionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unit does not belong to this army's faction",
        });
      }

      const quantity = unit.costType === "FLAT" ? 1 : input.quantity;

      if (unit.costType === "PER_BASE") {
        const existing = await ctx.db.armyUnit.findFirst({
          where: { armyId: input.armyId, unitId: input.unitId },
        });
        if (existing) {
          return ctx.db.armyUnit.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + quantity },
          });
        }
      }

      const maxSort = await ctx.db.armyUnit.aggregate({
        where: { armyId: input.armyId },
        _max: { sortOrder: true },
      });

      return ctx.db.armyUnit.create({
        data: {
          armyId: input.armyId,
          unitId: input.unitId,
          quantity,
          sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
        },
      });
    }),

  updateUnitQuantity: protectedProcedure
    .input(
      z.object({
        armyUnitId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const armyUnit = await ctx.db.armyUnit.findUnique({
        where: { id: input.armyUnitId },
        include: { army: true, unit: true },
      });
      if (armyUnit?.army.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Unit entry not found" });
      }

      const quantity =
        armyUnit.unit.costType === "FLAT" ? 1 : input.quantity;

      return ctx.db.armyUnit.update({
        where: { id: input.armyUnitId },
        data: { quantity },
      });
    }),

  removeUnit: protectedProcedure
    .input(z.object({ armyUnitId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const armyUnit = await ctx.db.armyUnit.findUnique({
        where: { id: input.armyUnitId },
        include: { army: true },
      });
      if (armyUnit?.army.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Unit entry not found" });
      }

      await ctx.db.armyUnit.delete({ where: { id: input.armyUnitId } });
      return { success: true };
    }),
});
