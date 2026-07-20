import type { HeroType, UpgradeType } from "../../generated/prisma";

// Which upgrade type(s) a hero sub-type is allowed to buy.
export const HERO_TYPE_UPGRADE_TYPES: Partial<
  Record<HeroType, UpgradeType[]>
> = {
  COMMAND_GROUP: ["BANNER"],
  MAGE: ["SPELL", "MAGIC_ITEM"],
  GENERAL: ["ARTEFACT"],
};

export function upgradeTypesForHero(heroType: HeroType): UpgradeType[] {
  return HERO_TYPE_UPGRADE_TYPES[heroType] ?? [];
}

// Base max of a given upgrade type a single hero instance can carry, before
// any item-driven modifiers (see perHeroMax below).
const BASE_PER_HERO_MAX: Record<UpgradeType, number> = {
  BANNER: 1,
  SPELL: 2,
  MAGIC_ITEM: 2,
  ARTEFACT: 1,
};

// Two magic items change the caps themselves rather than just doing
// something in-game, so they're special-cased here rather than as plain
// catalog flavor text:
// - Spellbook: "allows the Mage to buy a third spell" -> +1 to spell cap.
// - Magical Familiar: "the Mage can buy up to three magic items instead of
//   two... The Magical Familiar does not count to the limit" -> +1 to item
//   cap, and the Familiar itself is exempt from that cap.
export const SPELLBOOK_NAME = "Spellbook";
export const MAGICAL_FAMILIAR_NAME = "Magical Familiar";

interface HeroUpgradeLike {
  upgrade: { name: string; type: UpgradeType };
}

export function isExemptFromHeroCap(name: string, type: UpgradeType) {
  return type === "MAGIC_ITEM" && name === MAGICAL_FAMILIAR_NAME;
}

export function perHeroMax(
  type: UpgradeType,
  existingHeroUpgrades: HeroUpgradeLike[],
): number {
  let max = BASE_PER_HERO_MAX[type];
  if (
    type === "SPELL" &&
    existingHeroUpgrades.some((u) => u.upgrade.name === SPELLBOOK_NAME)
  ) {
    max += 1;
  }
  if (
    type === "MAGIC_ITEM" &&
    existingHeroUpgrades.some((u) => u.upgrade.name === MAGICAL_FAMILIAR_NAME)
  ) {
    max += 1;
  }
  return max;
}

// How many of a hero's existing upgrades of this type count toward the cap
// (excludes cap-exempt items like the Magical Familiar).
export function countTowardHeroCap(
  type: UpgradeType,
  existingHeroUpgrades: HeroUpgradeLike[],
): number {
  return existingHeroUpgrades.filter(
    (u) =>
      u.upgrade.type === type &&
      !isExemptFromHeroCap(u.upgrade.name, u.upgrade.type),
  ).length;
}

export const BANNER_MIN_POINTS = 1000;

// Max of a given upgrade type across the whole army, regardless of how many
// eligible heroes are in it. Only Banners have an army-wide cap; Spells and
// Magic Items are capped per-hero only (Magic Items are further restricted
// by the no-duplicate-item rule, checked separately since it's about a
// specific upgradeId repeating, not a raw count).
export function armyMaxForType(
  type: UpgradeType,
  pointsLimit: number,
): number | null {
  if (type === "BANNER") {
    return pointsLimit >= BANNER_MIN_POINTS ? 1 : 0;
  }
  return null;
}
