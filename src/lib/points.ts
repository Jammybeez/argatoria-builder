export interface ArmyUnitPointsLike {
  quantity: number;
  unit: { pointsCost: number };
  upgrades: { upgrade: { pointsCost: number } }[];
  isMarauders?: boolean;
}

// Marauders are deployed "without adding to the army cost" — free.
export function armyUnitPoints(au: ArmyUnitPointsLike) {
  if (au.isMarauders) return 0;
  return (
    au.unit.pointsCost * au.quantity +
    au.upgrades.reduce((sum, u) => sum + u.upgrade.pointsCost, 0)
  );
}
