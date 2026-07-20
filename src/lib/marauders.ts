// Marauders rule: any deployed unit consisting of the maximum number of
// bases grants one free additional unit of the same type, fixed at 4 bases,
// deployed at no cost and excluded from category min/max and Elite-vs-Basic
// counting. It's derived here rather than stored — deriving it means it
// disappears automatically the moment its parent unit drops below max
// bases, with no cleanup logic needed.
export function getMaraudersEntries<
  T extends {
    id: string;
    quantity: number;
    unit: { costType: string; maxBases: number | null };
  },
>(armyUnits: T[]) {
  return armyUnits
    .filter(
      (au) =>
        au.unit.costType === "PER_BASE" &&
        au.unit.maxBases != null &&
        au.quantity === au.unit.maxBases,
    )
    .map((au) => ({
      ...au,
      id: `${au.id}-marauders`,
      quantity: 4,
      isMarauders: true as const,
    }));
}
