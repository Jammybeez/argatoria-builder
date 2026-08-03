import type { PrismaClient } from "../generated/prisma";
import type { SeedUnit } from "./seed-factions";

const DEFAULT_MIN_BASES = 4;
const DEFAULT_MAX_BASES = 16;

// Dummy Faction row that holds appendix units (Unit.factionId is required
// everywhere else in the schema/app, so appendix units get a home here
// rather than making that column nullable). Excluded from the normal
// army-creation faction picker via Faction.isAppendix.
export const APPENDIX_FACTION_NAME = "Appendix";

export interface AppendixUnitEligibility {
  factionName: string;
  // Omitted/empty = eligible under any General of this faction. Otherwise
  // ALL these exact unit names (e.g. a General and a specific Champion)
  // must be present in the roster.
  requiresGeneralNames?: string[];
  // At least one of these must be present too (in addition to, not instead
  // of, requiresGeneralNames), e.g. Dirandis fielding Sasquatches OR
  // Northern Guard.
  requiresAnyGeneralNames?: string[];
  // Requires this exact upgrade to have been bought somewhere in the army
  // (e.g. Heroes of Avantur need Banner of Avantur purchased).
  requiresUpgradeName?: string;
  // Overrides the unit's own pointsCost specifically for this faction (e.g.
  // Bristles (Knuroses) costs 14pts/base in the Vaendral army instead of
  // its normal 15pts/base). Omitted = use the unit's own pointsCost.
  costOverride?: number;
}

// Same shape as a normal faction's SeedUnit, plus the list of factions (and
// optional required Generals / cost override) that can take it.
// requiresHeroNames / recategorizeGeneralName should not be set here — the
// per-faction requirement is expressed via `eligibility` instead
// (requiresHeroNames gets overridden per-faction when the catalog is built,
// see faction.ts).
export interface AppendixUnit extends SeedUnit {
  eligibility: AppendixUnitEligibility[];
}

export const appendixUnits: AppendixUnit[] = [
  {
    name: "Rotgant",
    category: "RARE",
    costType: "FLAT",
    pointsCost: 47,
    maxPerPoints: 1000,
    ld: 5,
    m: 10,
    ws: 2,
    s: 5,
    t: 6,
    a: 5,
    w: 5,
    eligibility: [
      {
        factionName: "Sheol-morg",
        requiresGeneralNames: ["Lord Necromancer"],
      },
    ],
    specialRules: [
      {
        name: "Sower of Graves",
        text: "When charging, Rotgant may roll a D6. The result determines the number of additional attacks it gains. However, on a roll of 6, Rotgant does not make any attacks. Instead, it stumbles and crashes directly into the enemy. Roll 2D6 – both the enemy and the Rotgant suffer that many Wounds. No saves are permitted against the Wounds caused by the Rotgant's fall.",
      },
      {
        name: "Mage Hunter",
        text: "When Rotgant comes into contact with an enemy Mage, it eliminates them from play on a roll of 4 or less, instead of the usual 2 or less.",
      },
      {
        name: "Fearless",
        text: "This unit always passes a Cold Blood Test and a Panic Test.",
      },
      {
        name: "Captured Artefacts",
        text: "Once per battle, Rotgant can use a magic item, but must roll a D6 to see which item he has grabbed. On a 1-2, Scroll of Daze: target enemy unit with WS 3 or greater gets -1 to WS. On a 3-4, Ring of Destruction: target unit gets +1 to S. On a 5-6, Sack of Stuff: unfortunately, upon examining the contents, Rotgant loses interest in the artefacts it has acquired — if Rotgant has an Action Die, it loses it.",
      },
    ],
  },
  {
    name: "Ghosts",
    category: "BASIC",
    costType: "PER_BASE",
    pointsCost: 14, // 224 points for a fixed 16-base unit
    minBases: 16,
    maxBases: 16,
    maxCount: 1,
    disableMarauders: true,
    ld: 0,
    m: 10,
    ws: 2,
    s: 0,
    t: 0,
    a: 2,
    w: 2,
    eligibility: [
      {
        factionName: "Sheol-morg",
        requiresGeneralNames: ["Lord Necromancer", "Champion of Ghosts"],
      },
    ],
    specialRules: [
      {
        name: "Aura of Destruction",
        text: "The Ghosts' aura grants their weapons extraordinary properties. Ghosts do not make Wound Tests. Instead, each successful hit in the Weapon Skill Test automatically inflicts 1 Wound, and any roll of 1 on the Weapon Skill Test inflicts 2 Wounds. No saves are permitted against these attacks.",
      },
      {
        name: "Ethereal",
        text: "An enemy unit may only perform a Wound Test against Ghosts if it either has a Mage attached or has successfully performed a prayer before making its attack.",
      },
      {
        name: "Keen Senses",
        text: "This unit can turn in any direction, with no limits, before making a move or charge.",
      },
      {
        name: "Fearless",
        text: "This unit always passes a Cold Blood Test and a Panic Test.",
      },
      { name: "Creature", text: "This unit cannot pray." },
    ],
  },
  {
    name: "Gnils",
    category: "ELITE",
    costType: "PER_BASE",
    pointsCost: 12,
    ld: 4,
    m: 10,
    ws: 3,
    s: 3,
    t: 2,
    a: 2,
    w: 2,
    eligibility: [
      {
        factionName: "Sheol-morg",
        requiresGeneralNames: ["Lord Necromancer", "Champion of Graves"],
      },
    ],
    specialRules: [
      {
        name: "Rot",
        text: "The enemy unit (but not single model) with WS better than 2 gains -1 to WS when attacking Gnils.",
      },
      {
        name: "Bloodthirst",
        text: "The unit has +1 to A when charging an enemy unit or +2 to A when charging an enemy unit that has a Horde rule.",
      },
      {
        name: "Fearless",
        text: "This unit always passes a Cold Blood Test and a Panic Test.",
      },
      { name: "Creature", text: "This unit cannot pray." },
    ],
  },
  {
    name: "Mementors",
    category: "RARE",
    costType: "PER_BASE",
    pointsCost: 19,
    ld: 6,
    m: 10,
    ws: 4,
    s: 4,
    t: 2,
    a: 3,
    w: 2,
    eligibility: [
      {
        factionName: "Sheol-morg",
        requiresGeneralNames: ["Lord Necromancer", "Champion of Catacombs"],
      },
    ],
    specialRules: [
      {
        name: "The Eternal Generals",
        text: "If there is at least one unit of Mementors fielded in the army, the pool of General's orders in the army is increased by 1.",
      },
      {
        name: "Memento Ultionis",
        text: "Mementors add D6 attacks to the pool when fighting an enemy unit that has a Champion attached, or 2D6 attacks if it's a General or a Legendary Hero.",
      },
      {
        name: "Self-reliant",
        text: "No heroes can attach to this unit.",
      },
      {
        name: "Fear",
        text: "After a successful charge with this unit, the enemy unit (but not single model) must take a Panic Test for 1 base. If this unit is a Horde, the enemy must take a Panic Test for 2 bases instead.",
      },
      {
        name: "Fearless",
        text: "This unit always passes a Cold Blood Test and a Panic Test.",
      },
      { name: "Creature", text: "This unit cannot pray." },
    ],
  },
  {
    name: "The Wicked (Peasants)",
    category: "BASIC",
    costType: "PER_BASE",
    pointsCost: 10,
    ld: 8,
    m: 10,
    ws: 3,
    s: 2,
    t: 2,
    a: 2,
    w: 2,
    eligibility: [
      { factionName: "Sheol-morg", requiresGeneralNames: ["Lord of the Abyss"] },
    ],
    specialRules: [
      {
        name: "Pack",
        text: "When charging, this unit attacks the enemy with two ranks instead of one.",
      },
      {
        name: "Beating the Weak",
        text: "If a unit of The Wicked has more bases than the enemy unit (but not single model) it is fighting, their Strength (S) is increased by 1.",
      },
      {
        name: "Primitive Ritual",
        text: "If a unit of The Wicked completely destroys an enemy unit and is no longer engaged in combat, it may voluntarily remove one of its own bases. That base counts as a lost Blood Point for the enemy, not for the friendly army. (Place the voluntarily removed base of The Wicked in a separate area from your casualties, so it doesn't get mixed with other lost bases.)",
      },
    ],
  },
  {
    name: "Naulen",
    category: "UNIQUE",
    costType: "FLAT",
    pointsCost: 102,
    ld: 7,
    m: 15,
    ws: 4,
    s: 5,
    t: 6,
    a: 4,
    w: 6,
    eligibility: [{ factionName: "Arox" }],
    specialRules: [
      {
        name: "Smash",
        text: "When charging, instead of gaining a +1 bonus to Strength (S), the unit's Strength (S) is doubled.",
      },
      {
        name: "Forced Advance",
        text: "A Naulen cannot regroup after defeating an enemy. Instead, it must roll 3D6 and move forward a distance equal to the result. If it encounters an enemy unit, it is treated as charging, and attacks must be resolved immediately. If it encounters a friendly unit, the Naulen stops 1 cm away from it. The friendly unit in the path takes 2 Wounds. If it reaches terrain or the edge of the table, it stops 5 cm away. If the Naulen does not encounter any units, it may turn to face any direction after completing its forced move.",
      },
      {
        name: "Devotee",
        text: "Naulen is a single model, but it is allowed to pray.",
      },
      {
        name: "Fearless",
        text: "This unit always passes a Cold Blood Test and a Panic Test.",
      },
    ],
  },
  {
    name: "Vorgulians",
    category: "UNIQUE",
    costType: "PER_BASE",
    pointsCost: 12,
    ld: 6,
    m: 30,
    ws: 3,
    s: 3,
    t: 2,
    a: 2,
    w: 2,
    eligibility: [{ factionName: "Sorgax" }],
    specialRules: [
      {
        name: "Agile Flight",
        text: "This unit can move or charge over any obstacles, including terrain or other units. The unit may turn after completing its movement instead of before moving. The unit can get into base contact with an enemy hero only after completing its movement and any turning. It cannot roll a D6 for the hero's death; an enemy hero dies only if it cannot attach to a friendly unit or use its special rules.",
      },
      {
        name: "Extremely Keen Hearing",
        text: "This unit can be issued orders from any place on the battlefield. Additionally, if charged from the flank or rear (and not engaged in combat), it may immediately turn to face the attacker.",
      },
      {
        name: "Self-reliant",
        text: "No heroes can attach to this unit.",
      },
    ],
  },
  {
    name: "Skaals",
    category: "MERCENARY",
    costType: "PER_BASE",
    pointsCost: 12,
    ld: 7,
    m: 10,
    ws: 3,
    s: 3,
    t: 3,
    a: 2,
    w: 2,
    eligibility: [{ factionName: "Dirandis" }, { factionName: "Gaeldor" }],
    specialRules: [
      {
        name: "Mercenaries",
        text: "This unit can be hired only by the chosen armies. In the case of Skaals, these armies are Dirandis and Gaeldor.",
      },
      {
        name: "Snares",
        text: "If the enemy unit successfully charges this unit, before the enemy's attacks, take a D6 test for using the snares. A score of 4 or less means the enemy is dealt D6 Wounds with no saves permitted. If the Skaals unit is a Horde, it can re-roll the test for using the snares and a successful test means the enemy is dealt D6+2 Wounds instead, with no saves permitted.",
      },
      {
        name: "Tracking",
        text: "If the opponent has a Creature unit or a single model on the table after their entire army has been deployed, Skaals may be repositioned to be in 30 cm of that unit or single model but at least 30 cm away from other enemy units (even in the enemy's deployment zone).",
      },
      {
        name: "Vigilant",
        text: "The enemy unit does not receive bonuses for attacking this unit's flank or rear.",
      },
    ],
  },
  {
    name: "Krakkars",
    category: "UNIQUE",
    costType: "FLAT",
    pointsCost: 38,
    ld: 4,
    m: 30,
    ws: 2,
    s: 2,
    t: 2,
    a: 10,
    w: 8,
    eligibility: [{ factionName: "Vaendral" }],
    specialRules: [
      {
        name: "Bonus Unit",
        text: "For each Old Hag model in the army, you may additionally field one Krakkars unit, which does not count toward the Unique Units limit. (Not enforced by the app — track this yourself when deciding how many Krakkars to add.)",
      },
      {
        name: "Agile Flight",
        text: "This unit can move or charge over any obstacles, including terrain or other units. The unit may turn after completing its movement instead of before moving. The unit can get into base contact with an enemy hero only after completing its movement and any turning. It cannot roll a D6 for the hero's death; an enemy hero dies only if it cannot attach to a friendly unit or use its special rules.",
      },
      {
        name: "Predator",
        text: "When this unit is attacking an enemy's flank, its WS and S are increased by 1, and if attacking an enemy's rear, its WS and S are increased by 2.",
      },
      {
        name: "Fearless",
        text: "This unit always passes a Cold Blood Test and a Panic Test.",
      },
    ],
  },
  {
    name: "Gladiators of the Black Sun",
    category: "RARE",
    costType: "PER_BASE",
    pointsCost: 13,
    ld: 6,
    m: 10,
    ws: 3,
    s: 3,
    t: 3,
    a: 2,
    w: 2,
    eligibility: [{ factionName: "Vaendral" }],
    specialRules: [
      {
        name: "Fierce",
        text: "For each score of 1 in the Wound Test, this unit may roll two additional D6 for wounding. The obtained scores do not generate the new ones.",
      },
      {
        name: "Rapid Strike",
        text: "If the Gladiators unit attacks an enemy unit that has an Action Die, the Gladiators' WS is increased to 4.",
      },
      {
        name: "Enslaved",
        text: "The opponent gains Blood Points for bases from this unit only after destroying the entire unit.",
      },
    ],
  },
  {
    name: "Bristles (Knuroses)",
    category: "MERCENARY",
    costType: "PER_BASE",
    pointsCost: 15,
    ld: 7,
    m: 10,
    ws: 3,
    s: 4,
    t: 4,
    a: 2,
    w: 2,
    eligibility: [
      { factionName: "Vaendral", costOverride: 14 },
      { factionName: "Arox" },
    ],
    specialRules: [
      {
        name: "Mercenaries",
        text: "This unit can be hired only by the chosen armies. In the case of Knuroses, these armies are Vaendral and Arox.",
      },
      {
        name: "Envy",
        text: "When performing a Wound Test against an enemy unit whose cost per base is larger than the Knuroses', the Knuroses gain +3 dice to the Wound Test.",
      },
      {
        name: "Sneaky",
        text: "This unit gets +2 attacks for attacking the enemy's flank or rear.",
      },
      {
        name: "Reckless",
        text: "This unit can never be issued orders. Instead, during the Heroes actions, you may choose a friendly unit of Knuroses that is not engaged in combat and has enemy unit within 15 cm. Roll a D6. A score of 2 or less means that the Knuroses may immediately charge at the indicated enemy unit. This rule can be used only once per cycle and only by one unit of Knuroses in the army.",
      },
    ],
  },
  {
    name: "Northern Guard",
    category: "RARE",
    costType: "PER_BASE",
    pointsCost: 18,
    ld: 6,
    m: 10,
    ws: 3,
    s: 3,
    t: 4,
    a: 2,
    w: 2,
    eligibility: [{ factionName: "Dirandis" }],
    specialRules: [
      {
        name: "Counter",
        text: "If an enemy unit charged the Northern Guard unit, the Northern Guard unit will benefit from charge bonuses during its next activation in this cycle.",
      },
      {
        name: "Perfect Shield Defence",
        text: "(Save) For each Wound this unit is dealt, roll a D6 for Perfect Shield Defence. Each score of 2 or 1 means a cancelled Wound.",
      },
      {
        name: "Master Ambush",
        text: "The enemy unit cannot use charge bonuses and independent bonuses while charging this unit. If this unit consists of 8 bases or less, when both armies are deployed and the opponent finishes making any free moves they are allowed to make before the battle, you may deploy this unit anywhere on the battlefield, but not closer than 20 cm from the enemy. If this unit consists of more than 8 bases, it must be deployed in a standard way, but can make a free move before the battle.",
      },
    ],
  },
  {
    name: "Half-Giants Command Group",
    category: "HERO",
    costType: "PER_BASE",
    pointsCost: 20,
    heroType: "COMMAND_GROUP",
    eligibility: [
      {
        factionName: "Dirandis",
        requiresGeneralNames: ["The Devoted (Half-Giants)"],
      },
      {
        factionName: "Gaeldor",
        requiresGeneralNames: ["Iron Oaks (Half-Giants)"],
      },
      {
        factionName: "Vaendral",
        requiresGeneralNames: ["The Reapers (Half-Giants)"],
      },
    ],
    specialRules: [
      {
        name: "Half-Giants Command Group",
        text: "An army of Vaendral, Dirandis or Gaeldor gains access to the Half-Giants Command Group if it fields at least one unit of Half-Giants. As long as this Command Group is attached to a friendly Half-Giants unit or a Basic Unit in the army, any orders issued to the unit by the General can be re-rolled. For more rules see Heroes – Command Group.",
      },
      {
        name: "Banner of Avantur",
        text: "One Half-Giants Command Group may buy a special magic banner (Banner of Avantur) that is not counted to the limit of magic banners in an army.",
      },
    ],
  },
  {
    name: "Pakun",
    category: "HERO",
    costType: "FLAT",
    pointsCost: 42,
    heroType: "LEGENDARY_HERO",
    eligibility: [
      { factionName: "Dirandis" },
      { factionName: "Gaeldor" },
      { factionName: "Vaendral" },
    ],
    specialRules: [
      {
        name: "Half-Giants' Ally",
        text: "Pakun is a Legendary Hero who can be fielded in every army that may deploy the units of Half-Giants.",
      },
      {
        name: "Crusher",
        text: "Thanks to this mysterious artefact hammer, Pakun grants the unit he is attached to additional D6+6 attacks. In addition, the unit Pakun is attached to changes its Strength (S) to 4 if it has lesser.",
      },
      {
        name: "Oklar",
        text: "An enemy unit attacking a unit that Pakun is attached to must subtract 3 dice from the pool.",
      },
      {
        name: "Dark Humour",
        text: "If Pakun is attached to a friendly Half-Giants unit, the unit may add or subtract 1 from its LD during any test.",
      },
    ],
  },
  {
    name: "Champion of Arena",
    category: "HERO",
    costType: "FLAT",
    pointsCost: 12,
    heroType: "CHAMPION",
    eligibility: [
      { factionName: "Dirandis", requiresUpgradeName: "Banner of Avantur" },
      { factionName: "Gaeldor", requiresUpgradeName: "Banner of Avantur" },
      { factionName: "Vaendral", requiresUpgradeName: "Banner of Avantur" },
    ],
    specialRules: [
      {
        name: "Heroes of Avantur",
        text: "The army with Banner of Avantur gains access to the Heroes of Avantur.",
      },
      {
        name: "Arena Champion",
        text: "When attached to a friendly unit, Champion of Arena grants +5 attacks instead of +4. In addition, before the enemy unit's attacks, Champion of Arena may roll 2D6. The higher result of the two dice determines the number of attacks the enemy unit loses from its pool.",
      },
    ],
  },
  {
    name: "Champion of the Boundless",
    category: "HERO",
    costType: "FLAT",
    pointsCost: 23,
    heroType: "CHAMPION",
    eligibility: [
      { factionName: "Dirandis", requiresUpgradeName: "Banner of Avantur" },
      { factionName: "Gaeldor", requiresUpgradeName: "Banner of Avantur" },
      { factionName: "Vaendral", requiresUpgradeName: "Banner of Avantur" },
    ],
    specialRules: [
      {
        name: "Heroes of Avantur",
        text: "The army with Banner of Avantur gains access to the Heroes of Avantur.",
      },
      {
        name: "Boundless Fury",
        text: "When attached to a friendly unit, Champion of the Boundless grants +5 attacks instead of +4. In addition, in his own activation, when attached to a friendly unit that was not issued an order in this cycle, he may roll a D6. A score of 2 or less means the unit regains an Action Die and must be activated immediately.",
      },
    ],
  },
  {
    name: "Spellweaver",
    category: "HERO",
    costType: "FLAT",
    pointsCost: 16,
    heroType: "MAGE",
    eligibility: [
      { factionName: "Dirandis", requiresUpgradeName: "Banner of Avantur" },
      { factionName: "Gaeldor", requiresUpgradeName: "Banner of Avantur" },
      { factionName: "Vaendral", requiresUpgradeName: "Banner of Avantur" },
    ],
    specialRules: [
      {
        name: "Heroes of Avantur",
        text: "The army with Banner of Avantur gains access to the Heroes of Avantur.",
      },
      {
        name: "Spellweaver",
        text: "May buy magic spells and items of any value. When attached to a friendly unit, Spellweaver grants +4 attacks instead of +1. A friendly Half-Giants unit to which Spellweaver is attached may roll 3D6 for a Prayer Test and choose any two results.",
      },
      {
        name: "Exclusive Spells",
        text: "Spellweaver has access to additional magic spells (Toughening, Drowsiness) not available to any other Mage.",
      },
    ],
  },
];

export async function seedAppendixUnits(
  db: PrismaClient,
  units: AppendixUnit[],
) {
  const appendixFaction = await db.faction.upsert({
    where: { name: APPENDIX_FACTION_NAME },
    update: { isAppendix: true },
    create: { name: APPENDIX_FACTION_NAME, isAppendix: true },
  });

  for (const unit of units) {
    const existing = await db.unit.findFirst({
      where: { factionId: appendixFaction.id, name: unit.name },
    });

    const data = {
      factionId: appendixFaction.id,
      name: unit.name,
      category: unit.category,
      costType: unit.costType,
      pointsCost: unit.pointsCost,
      minBases:
        unit.costType === "PER_BASE"
          ? (unit.minBases ?? DEFAULT_MIN_BASES)
          : null,
      maxBases:
        unit.costType === "PER_BASE"
          ? (unit.maxBases ?? DEFAULT_MAX_BASES)
          : null,
      heroType: unit.heroType ?? "OTHER",
      requiresHeroNames: unit.requiresHeroNames ?? [],
      requiresAnyHeroNames: unit.requiresAnyHeroNames ?? [],
      requiresUpgradeName: unit.requiresUpgradeName ?? null,
      recategorizeGeneralName: unit.recategorizeGeneralName ?? null,
      recategorizeToCategory: unit.recategorizeToCategory ?? null,
      maxPerPoints: unit.maxPerPoints ?? null,
      maxCount: unit.maxCount ?? null,
      disableMarauders: unit.disableMarauders ?? false,
      grantsMageUpgrades: unit.grantsMageUpgrades ?? false,
      ld: unit.ld,
      m: unit.m,
      ws: unit.ws,
      s: unit.s,
      t: unit.t,
      a: unit.a,
      w: unit.w,
    };

    // Update in place (rather than delete + recreate) so the unit's id is
    // stable and doesn't orphan ArmyUnit rows in saved armies.
    let unitId: string;
    if (existing) {
      unitId = existing.id;
      await db.unitSpecialRule.deleteMany({ where: { unitId: existing.id } });
      await db.unit.update({
        where: { id: existing.id },
        data: { ...data, specialRules: { create: unit.specialRules } },
      });
    } else {
      const created = await db.unit.create({
        data: { ...data, specialRules: { create: unit.specialRules } },
      });
      unitId = created.id;
    }

    // Nothing references AppendixEligibility.id as a foreign key, so
    // delete-and-recreate is safe (unlike Unit rows above).
    await db.appendixEligibility.deleteMany({ where: { unitId } });
    for (const elig of unit.eligibility) {
      const faction = await db.faction.findUnique({
        where: { name: elig.factionName },
      });
      if (!faction) {
        throw new Error(
          `Appendix unit "${unit.name}" references unknown faction "${elig.factionName}"`,
        );
      }
      await db.appendixEligibility.create({
        data: {
          unitId,
          factionId: faction.id,
          requiresGeneralNames: elig.requiresGeneralNames ?? [],
          requiresAnyGeneralNames: elig.requiresAnyGeneralNames ?? [],
          requiresUpgradeName: elig.requiresUpgradeName ?? null,
          costOverride: elig.costOverride ?? null,
        },
      });
    }
  }

  console.log(`Seeded ${units.length} appendix units.`);
}
