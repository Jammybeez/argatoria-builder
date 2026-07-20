import type { HeroType, UnitCategory } from "../../generated/prisma";

// Core Argatoria army-composition rules, from the rulebook's general
// "Choosing the units and heroes" section (confirmed again for Rare/Unique
// on individual faction pages).

const POINTS_BREAKPOINT = 1500;
const MAGE_POINTS_PER_SLOT = 500;
const LEGENDARY_HERO_POINTS_PER_SLOT = 1000;

const HERO_MIN = 4;

function lowOrHigh(pointsLimit: number, low: number, high: number) {
  return pointsLimit <= POINTS_BREAKPOINT ? low : high;
}

export function rareMax(pointsLimit: number) {
  return lowOrHigh(pointsLimit, 4, 8);
}

export function uniqueMax(pointsLimit: number) {
  return lowOrHigh(pointsLimit, 3, 6);
}

export function championRange(pointsLimit: number): [number, number] {
  return [lowOrHigh(pointsLimit, 0, 1), lowOrHigh(pointsLimit, 3, 6)];
}

export function commandGroupRange(pointsLimit: number): [number, number] {
  return [lowOrHigh(pointsLimit, 1, 2), lowOrHigh(pointsLimit, 3, 6)];
}

export function mageMax(pointsLimit: number) {
  return Math.floor(pointsLimit / MAGE_POINTS_PER_SLOT);
}

export function legendaryHeroMax(pointsLimit: number) {
  return Math.floor(pointsLimit / LEGENDARY_HERO_POINTS_PER_SLOT);
}

export interface ArmyUnitLike {
  quantity: number;
  unit: {
    name: string;
    category: UnitCategory;
    heroType: HeroType;
    requiresHeroName: string | null;
    recategorizeGeneralName: string | null;
    recategorizeToCategory: UnitCategory | null;
  };
}

export interface CompositionIssue {
  id: string;
  message: string;
}

export function getPresentGeneralNames(armyUnits: ArmyUnitLike[]): Set<string> {
  return new Set(
    armyUnits
      .filter((au) => au.unit.heroType === "GENERAL")
      .map((au) => au.unit.name),
  );
}

export function getPresentUnitNames(armyUnits: ArmyUnitLike[]): Set<string> {
  return new Set(armyUnits.map((au) => au.unit.name));
}

// A unit's category for composition-counting and catalog/roster grouping —
// overridden when its recategorizeGeneralName General is in the roster (see
// Sheol-morg's Horned Warriors / Truhlaks on Fallen Ogars).
export function effectiveCategory(
  unit: ArmyUnitLike["unit"],
  presentGeneralNames: Set<string>,
): UnitCategory {
  if (
    unit.recategorizeGeneralName &&
    unit.recategorizeToCategory &&
    presentGeneralNames.has(unit.recategorizeGeneralName)
  ) {
    return unit.recategorizeToCategory;
  }
  return unit.category;
}

// Whether a unit can be added to (or legally remain in) an army given which
// other units (of any category — General, Mage, etc.) are already in the
// roster, e.g. Er'Sael's Larva of Nalharap requires the Mage "Black
// Shepherd", not a General.
export function isUnitAvailable(
  unit: { requiresHeroName: string | null },
  presentUnitNames: Set<string>,
): boolean {
  return !unit.requiresHeroName || presentUnitNames.has(unit.requiresHeroName);
}

function checkRange(
  issues: CompositionIssue[],
  id: string,
  label: string,
  count: number,
  [min, max]: [number, number],
  pointsLimit: number,
) {
  if (count < min) {
    issues.push({
      id: `${id}-min`,
      message: `Army needs at least ${min} ${label} (currently ${count}).`,
    });
  } else if (count > max) {
    issues.push({
      id: `${id}-max`,
      message: `${label} (${count}) exceed the max of ${max} for a ${pointsLimit}pt army.`,
    });
  }
}

export function getCompositionIssues(
  pointsLimit: number,
  armyUnits: ArmyUnitLike[],
): CompositionIssue[] {
  const issues: CompositionIssue[] = [];
  const presentGeneralNames = getPresentGeneralNames(armyUnits);
  const presentUnitNames = getPresentUnitNames(armyUnits);

  const count = (category: UnitCategory) =>
    armyUnits.filter(
      (au) => effectiveCategory(au.unit, presentGeneralNames) === category,
    ).length;
  const heroCount = (heroType: HeroType) =>
    armyUnits.filter(
      (au) => au.unit.category === "HERO" && au.unit.heroType === heroType,
    ).length;

  const unavailableUnitNames = new Set(
    armyUnits
      .filter((au) => !isUnitAvailable(au.unit, presentUnitNames))
      .map((au) => au.unit.name),
  );
  for (const name of unavailableUnitNames) {
    const unit = armyUnits.find((au) => au.unit.name === name)!.unit;
    issues.push({
      id: `requires-hero-${name}`,
      message: `${name} requires ${unit.requiresHeroName} in the army.`,
    });
  }

  const basicCount = count("BASIC");
  const eliteCount = count("ELITE");
  const rareCount = count("RARE");
  const uniqueCount = count("UNIQUE");
  const heroTotal = count("HERO");
  const generalCount = heroCount("GENERAL");
  const commandGroupCount = heroCount("COMMAND_GROUP");
  const championCount = heroCount("CHAMPION");
  const mageCount = heroCount("MAGE");
  const legendaryHeroCount = heroCount("LEGENDARY_HERO");

  if (eliteCount > basicCount) {
    issues.push({
      id: "elite-over-basic",
      message: `Elite Units (${eliteCount}) cannot outnumber Basic Units (${basicCount}).`,
    });
  }

  checkRange(issues, "rare", "Rare Units", rareCount, [0, rareMax(pointsLimit)], pointsLimit);
  checkRange(
    issues,
    "unique",
    "Unique Units",
    uniqueCount,
    [0, uniqueMax(pointsLimit)],
    pointsLimit,
  );

  if (heroTotal < HERO_MIN) {
    issues.push({
      id: "hero-min",
      message: `Army needs at least ${HERO_MIN} Heroes (currently ${heroTotal}).`,
    });
  }

  if (generalCount !== 1) {
    issues.push({
      id: "general-required",
      message:
        generalCount === 0
          ? "Army needs a General."
          : `Army can only have 1 General (currently ${generalCount}).`,
    });
  }

  checkRange(
    issues,
    "command-group",
    "Command Groups",
    commandGroupCount,
    commandGroupRange(pointsLimit),
    pointsLimit,
  );

  checkRange(
    issues,
    "champion",
    "Champions",
    championCount,
    championRange(pointsLimit),
    pointsLimit,
  );

  const mMax = mageMax(pointsLimit);
  if (mageCount > mMax) {
    issues.push({
      id: "mage-max",
      message: `Mages (${mageCount}) exceed the max of ${mMax} (1 per ${MAGE_POINTS_PER_SLOT}pts) for a ${pointsLimit}pt army.`,
    });
  }

  const lhMax = legendaryHeroMax(pointsLimit);
  if (legendaryHeroCount > lhMax) {
    issues.push({
      id: "legendary-hero-max",
      message: `Legendary Heroes (${legendaryHeroCount}) exceed the max of ${lhMax} (1 per ${LEGENDARY_HERO_POINTS_PER_SLOT}pts) for a ${pointsLimit}pt army.`,
    });
  }

  return issues;
}
