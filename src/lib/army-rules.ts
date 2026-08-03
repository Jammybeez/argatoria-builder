import type { HeroType, UnitCategory } from "../../generated/prisma";

// Core Argatoria army-composition rules, from the rulebook's general
// "Choosing the units and heroes" section (confirmed again for Rare/Unique
// on individual faction pages).

const POINTS_BREAKPOINT = 1500;
const MAGE_POINTS_PER_SLOT = 500;
const LEGENDARY_HERO_POINTS_PER_SLOT = 1000;
// Shared pool across all Mercenary-category units combined (e.g. Skaals +
// Bristles together), not per specific unit. Flat regardless of points —
// only one data point so far, unlike Rare/Unique which scale.
const MERCENARY_MAX = 3;

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

export function mercenaryMax() {
  return MERCENARY_MAX;
}

export interface ArmyUnitLike {
  quantity: number;
  unit: {
    name: string;
    category: UnitCategory;
    heroType: HeroType;
    requiresHeroNames: string[];
    // At least one of these must be present, in addition to (not instead
    // of) requiresHeroNames, e.g. Northern Guard Heroes need Dirandis
    // fielding Sasquatches OR Northern Guard (either is enough).
    requiresAnyHeroNames: string[];
    // Requires this exact upgrade to have been bought somewhere in the
    // army (e.g. Heroes of Avantur need Banner of Avantur purchased) —
    // gated on a purchase, not a unit's presence.
    requiresUpgradeName: string | null;
    recategorizeGeneralName: string | null;
    recategorizeToCategory: UnitCategory | null;
    maxPerPoints: number | null;
    maxCount: number | null;
    // Grants Mage upgrade access (and counts toward the Mage cap) on top
    // of whatever this unit's own heroType already grants, e.g. Kor'quixos
    // is a Legendary Hero who is also explicitly a Mage.
    grantsMageUpgrades: boolean;
  };
  upgrades: { upgrade: { name: string } }[];
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

export function getPresentUpgradeNames(armyUnits: ArmyUnitLike[]): Set<string> {
  return new Set(
    armyUnits.flatMap((au) => au.upgrades.map((u) => u.upgrade.name)),
  );
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
// other units (of any category — General, Mage, etc.) and upgrades are
// already present, e.g. Er'Sael's Larva of Nalharap requires the Mage
// "Black Shepherd", not a General. All names in requiresHeroNames must be
// present (e.g. Ghosts requires both the General "Lord Necromancer" and the
// Champion "Champion of Ghosts"); at least one of requiresAnyHeroNames must
// be present if it's non-empty; requiresUpgradeName, if set, must have been
// bought somewhere in the army.
export function isUnitAvailable(
  unit: {
    requiresHeroNames: string[];
    requiresAnyHeroNames: string[];
    requiresUpgradeName: string | null;
  },
  presentUnitNames: Set<string>,
  presentUpgradeNames: Set<string>,
): boolean {
  const allRequiredPresent = unit.requiresHeroNames.every((name) =>
    presentUnitNames.has(name),
  );
  const anyRequiredPresent =
    unit.requiresAnyHeroNames.length === 0 ||
    unit.requiresAnyHeroNames.some((name) => presentUnitNames.has(name));
  const upgradePresent =
    !unit.requiresUpgradeName ||
    presentUpgradeNames.has(unit.requiresUpgradeName);
  return allRequiredPresent && anyRequiredPresent && upgradePresent;
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
  const presentUpgradeNames = getPresentUpgradeNames(armyUnits);

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
      .filter(
        (au) =>
          !isUnitAvailable(au.unit, presentUnitNames, presentUpgradeNames),
      )
      .map((au) => au.unit.name),
  );
  for (const name of unavailableUnitNames) {
    const unit = armyUnits.find((au) => au.unit.name === name)!.unit;
    const reasons: string[] = [];
    const missingAll = unit.requiresHeroNames.filter(
      (n) => !presentUnitNames.has(n),
    );
    if (missingAll.length > 0) reasons.push(missingAll.join(" and "));
    if (
      unit.requiresAnyHeroNames.length > 0 &&
      !unit.requiresAnyHeroNames.some((n) => presentUnitNames.has(n))
    ) {
      reasons.push(`one of ${unit.requiresAnyHeroNames.join(" or ")}`);
    }
    if (
      unit.requiresUpgradeName &&
      !presentUpgradeNames.has(unit.requiresUpgradeName)
    ) {
      reasons.push(`the upgrade "${unit.requiresUpgradeName}"`);
    }
    issues.push({
      id: `requires-hero-${name}`,
      message: `${name} requires ${reasons.join(" and ")} in the army.`,
    });
  }

  // Per-unit caps (e.g. Rotgant: max 1 per full 1000 army points; Ghosts:
  // max 1 flat), one row per model for FLAT-cost units, distinct from the
  // hero-type caps below. If both a scaling and a flat cap are set, the
  // more restrictive of the two applies.
  const cappedUnitNames = new Set(
    armyUnits
      .filter((au) => au.unit.maxPerPoints ?? au.unit.maxCount)
      .map((au) => au.unit.name),
  );
  for (const name of cappedUnitNames) {
    const unit = armyUnits.find((au) => au.unit.name === name)!.unit;
    const scalingMax = unit.maxPerPoints
      ? Math.floor(pointsLimit / unit.maxPerPoints)
      : Infinity;
    const max = Math.min(scalingMax, unit.maxCount ?? Infinity);
    const unitCount = armyUnits.filter((au) => au.unit.name === name).length;
    if (unitCount > max) {
      const capDescription = unit.maxCount
        ? `max ${unit.maxCount}`
        : `1 per ${unit.maxPerPoints} points`;
      issues.push({
        id: `unit-cap-${name}`,
        message: `${name} (${unitCount}) exceeds the max of ${max} for a ${pointsLimit}pt army (${capDescription}).`,
      });
    }
  }

  const basicCount = count("BASIC");
  const eliteCount = count("ELITE");
  const rareCount = count("RARE");
  const uniqueCount = count("UNIQUE");
  const mercenaryCount = count("MERCENARY");
  const heroTotal = count("HERO");
  const generalCount = heroCount("GENERAL");
  const commandGroupCount = heroCount("COMMAND_GROUP");
  const championCount = heroCount("CHAMPION");
  // Includes heroes whose primary type isn't Mage but who are explicitly
  // also a Mage (e.g. Kor'quixos, a Legendary Hero) — they count toward
  // both their own type's cap and the Mage cap.
  const mageCount =
    heroCount("MAGE") +
    armyUnits.filter(
      (au) => au.unit.heroType !== "MAGE" && au.unit.grantsMageUpgrades,
    ).length;
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

  checkRange(
    issues,
    "mercenary",
    "Mercenary Units",
    mercenaryCount,
    [0, mercenaryMax()],
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
