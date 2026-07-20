import type { CostType, UnitCategory } from "../../generated/prisma";

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
