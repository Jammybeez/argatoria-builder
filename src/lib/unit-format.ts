import type { CostType, HeroType, UnitCategory } from "../../generated/prisma";

export const CATEGORY_LABELS: Record<UnitCategory, string> = {
  BASIC: "Basic Units",
  ELITE: "Elite Units",
  RARE: "Rare Units",
  UNIQUE: "Unique Units",
  HERO: "Heroes",
};

export const CATEGORY_ORDER: UnitCategory[] = [
  "BASIC",
  "ELITE",
  "RARE",
  "UNIQUE",
  "HERO",
];

export function formatCost(costType: CostType, pointsCost: number) {
  return costType === "PER_BASE"
    ? `${pointsCost} pts/base`
    : `${pointsCost} pts/model`;
}

export const HERO_TYPE_LABELS: Partial<Record<HeroType, string>> = {
  GENERAL: "General",
  COMMAND_GROUP: "Command Group",
  CHAMPION: "Champion",
  MAGE: "Mage",
  LEGENDARY_HERO: "Legendary Hero",
};

export function formatBaseRange(
  costType: CostType,
  minBases: number | null,
  maxBases: number | null,
) {
  if (costType !== "PER_BASE" || !minBases) return null;
  return maxBases && maxBases !== minBases
    ? `${minBases}-${maxBases} bases`
    : `${minBases} bases`;
}
