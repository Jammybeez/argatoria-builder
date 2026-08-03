import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { armyUnitPoints } from "~/lib/points";
import {
  armyMaxForType,
  countTowardHeroCap,
  isExemptFromHeroCap,
  perHeroMax,
  upgradeTypesForHero,
} from "~/lib/upgrade-rules";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { db as dbClient } from "~/server/db";

const armyUnitInclude = {
  unit: { include: { specialRules: true } },
  upgrades: { include: { upgrade: true } },
};

const armyWithUnitsInclude = {
  faction: true,
  units: {
    include: armyUnitInclude,
    orderBy: [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }],
  },
};

// Appendix units can cost a different amount depending on which faction
// takes them (AppendixEligibility.costOverride, e.g. Bristles costs less in
// the Vaendral army). Overrides each armyUnit's unit.pointsCost so
// armyUnitPoints() and every downstream consumer (roster, print view,
// totals) picks it up without needing to know about eligibility rows at all.
async function withAppendixCostOverrides<
  A extends {
    factionId: string;
    units: { unit: { id: string; pointsCost: number } }[];
  },
>(db: typeof dbClient, army: A): Promise<A> {
  const unitIds = army.units.map((au) => au.unit.id);
  if (unitIds.length === 0) return army;

  const overrides = await db.appendixEligibility.findMany({
    where: {
      factionId: army.factionId,
      unitId: { in: unitIds },
      costOverride: { not: null },
    },
  });
  if (overrides.length === 0) return army;

  const overrideByUnitId = new Map(
    overrides.map((o) => [o.unitId, o.costOverride!]),
  );

  return {
    ...army,
    units: army.units.map((au) => {
      const cost = overrideByUnitId.get(au.unit.id);
      return cost === undefined
        ? au
        : { ...au, unit: { ...au.unit, pointsCost: cost } };
    }),
  };
}

export const armyRouter = createTRPCRouter({
  listMine: protectedProcedure.query(async ({ ctx }) => {
    const armies = await ctx.db.army.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        faction: true,
        units: { include: armyUnitInclude },
      },
      orderBy: { updatedAt: "desc" },
    });

    const armiesWithOverrides = await Promise.all(
      armies.map((army) => withAppendixCostOverrides(ctx.db, army)),
    );

    return armiesWithOverrides.map((army) => ({
      ...army,
      totalPoints: army.units.reduce(
        (sum, au) => sum + armyUnitPoints(au),
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

      return withAppendixCostOverrides(ctx.db, army);
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

  // Each call adds a new, independent unit instance to the roster (e.g.
  // clicking "Add" on Chosen twice gives two separate Chosen units, not one
  // unit of doubled size).
  addUnit: protectedProcedure
    .input(
      z.object({
        armyId: z.string(),
        unitId: z.string(),
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
      if (!unit) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Unit not found" });
      }

      // Either a normal unit of this army's faction, or an appendix unit
      // explicitly eligible for it (see AppendixEligibility).
      let requiredHeroNames = unit.requiresHeroNames;
      let requiredAnyHeroNames = unit.requiresAnyHeroNames;
      let requiredUpgradeName = unit.requiresUpgradeName;
      if (unit.factionId !== army.factionId) {
        const eligibility = await ctx.db.appendixEligibility.findFirst({
          where: { unitId: unit.id, factionId: army.factionId },
        });
        if (!eligibility) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Unit does not belong to this army's faction",
          });
        }
        requiredHeroNames = eligibility.requiresGeneralNames;
        requiredAnyHeroNames = eligibility.requiresAnyGeneralNames;
        requiredUpgradeName = eligibility.requiresUpgradeName;
      }

      for (const requiredName of requiredHeroNames) {
        const hasRequiredHero = await ctx.db.armyUnit.findFirst({
          where: {
            armyId: input.armyId,
            unit: { name: requiredName },
          },
        });
        if (!hasRequiredHero) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${unit.name} requires ${requiredName} in the army`,
          });
        }
      }

      if (requiredAnyHeroNames.length > 0) {
        const hasAnyRequiredHero = await ctx.db.armyUnit.findFirst({
          where: {
            armyId: input.armyId,
            unit: { name: { in: requiredAnyHeroNames } },
          },
        });
        if (!hasAnyRequiredHero) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${unit.name} requires one of ${requiredAnyHeroNames.join(", ")} in the army`,
          });
        }
      }

      if (requiredUpgradeName) {
        const hasRequiredUpgrade = await ctx.db.armyUnitUpgrade.findFirst({
          where: {
            armyUnit: { armyId: input.armyId },
            upgrade: { name: requiredUpgradeName },
          },
        });
        if (!hasRequiredUpgrade) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${unit.name} requires the "${requiredUpgradeName}" upgrade in the army`,
          });
        }
      }

      const quantity =
        unit.costType === "FLAT" ? 1 : (unit.minBases ?? 4);

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

      let quantity = armyUnit.unit.costType === "FLAT" ? 1 : input.quantity;
      if (armyUnit.unit.minBases) {
        quantity = Math.max(quantity, armyUnit.unit.minBases);
      }
      if (armyUnit.unit.maxBases) {
        quantity = Math.min(quantity, armyUnit.unit.maxBases);
      }

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

  addUpgrade: protectedProcedure
    .input(z.object({ armyUnitId: z.string(), upgradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const armyUnit = await ctx.db.armyUnit.findUnique({
        where: { id: input.armyUnitId },
        include: { army: true, unit: true },
      });
      if (armyUnit?.army.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Unit entry not found" });
      }

      const upgrade = await ctx.db.upgrade.findUnique({
        where: { id: input.upgradeId },
      });
      if (!upgrade) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Upgrade not found" });
      }

      if (
        !upgradeTypesForHero(
          armyUnit.unit.heroType,
          armyUnit.unit.grantsMageUpgrades,
        ).includes(upgrade.type)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${armyUnit.unit.name} cannot take a ${upgrade.type.toLowerCase()}`,
        });
      }

      if (upgrade.factionNames.length > 0) {
        const faction = await ctx.db.faction.findUnique({
          where: { id: armyUnit.army.factionId },
        });
        if (!faction || !upgrade.factionNames.includes(faction.name)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${upgrade.name} is restricted to ${upgrade.factionNames.join(", ")}`,
          });
        }
      }

      if (
        upgrade.restrictedToUnitName &&
        upgrade.restrictedToUnitName !== armyUnit.unit.name
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${upgrade.name} can only be taken by ${upgrade.restrictedToUnitName}`,
        });
      }

      // All upgrades currently attached anywhere in this army, to check
      // per-hero caps and the magic-item no-duplicates rule.
      const armyUpgrades = await ctx.db.armyUnitUpgrade.findMany({
        where: { armyUnit: { armyId: armyUnit.armyId } },
        include: { upgrade: true },
      });

      const onThisHero = armyUpgrades.filter(
        (au) => au.armyUnitId === armyUnit.id,
      );
      if (!isExemptFromHeroCap(upgrade.name, upgrade.type)) {
        const cap = perHeroMax(upgrade.type, onThisHero);
        const current = countTowardHeroCap(upgrade.type, onThisHero);
        if (current >= cap) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${armyUnit.unit.name} already has the max of ${cap} for ${upgrade.type.toLowerCase()}s`,
          });
        }
      }

      const armyMax = armyMaxForType(upgrade.type, armyUnit.army.pointsLimit);
      if (armyMax !== null) {
        const armyCountOfType = armyUpgrades.filter(
          (au) => au.upgrade.type === upgrade.type,
        ).length;
        if (armyCountOfType >= armyMax) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Army already has the max of ${armyMax} for ${upgrade.type.toLowerCase()}s`,
          });
        }
      }

      if (upgrade.type === "MAGIC_ITEM") {
        const alreadyTaken = armyUpgrades.some(
          (au) => au.upgradeId === upgrade.id,
        );
        if (alreadyTaken) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${upgrade.name} is already in use elsewhere in this army`,
          });
        }
      }

      return ctx.db.armyUnitUpgrade.create({
        data: { armyUnitId: input.armyUnitId, upgradeId: input.upgradeId },
      });
    }),

  removeUpgrade: protectedProcedure
    .input(z.object({ armyUnitUpgradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const armyUnitUpgrade = await ctx.db.armyUnitUpgrade.findUnique({
        where: { id: input.armyUnitUpgradeId },
        include: { armyUnit: { include: { army: true } } },
      });
      if (armyUnitUpgrade?.armyUnit.army.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Upgrade entry not found",
        });
      }

      await ctx.db.armyUnitUpgrade.delete({
        where: { id: input.armyUnitUpgradeId },
      });
      return { success: true };
    }),
});
