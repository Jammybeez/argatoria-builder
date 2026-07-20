import type {
  PrismaClient,
  UnitCategory,
  CostType,
  HeroType,
} from "../generated/prisma";

export interface SeedUnit {
  name: string;
  category: UnitCategory;
  costType: CostType;
  pointsCost: number;
  // Default/min and max bases per unit instance, for PER_BASE units.
  // Falls back to 4 / 16 below when not given explicitly for a unit.
  minBases?: number;
  maxBases?: number;
  heroType?: HeroType; // only meaningful when category is HERO
  // Only addable if a unit with this exact name is already in the roster
  // (not restricted to Generals).
  requiresHeroName?: string;
  // Counts as recategorizeToCategory instead of `category` whenever a
  // GENERAL with this name is in the roster (still normally category
  // otherwise).
  recategorizeGeneralName?: string;
  recategorizeToCategory?: UnitCategory;
  ld?: number;
  m?: number;
  ws?: number;
  s?: number;
  t?: number;
  a?: number;
  w?: number;
  specialRules: { name: string; text: string }[];
}

export interface SeedFaction {
  name: string;
  tagline: string;
  armySpecialRuleName: string;
  armySpecialRuleText: string;
  units: SeedUnit[];
}

const DEFAULT_MIN_BASES = 4;
const DEFAULT_MAX_BASES = 16;

export const arox: SeedFaction = {
  name: "Arox",
  tagline: "Reborn might. Lords of the Sun Cities. Hotbloods.",
  armySpecialRuleName: "Hot Blood",
  armySpecialRuleText: "The Arox army may re-roll an Initiative Test.",
  units: [
    {
      name: "The Chosen (Liagulians)",
      category: "BASIC",
      costType: "PER_BASE",
      pointsCost: 9,
      ld: 7,
      m: 10,
      ws: 2,
      s: 3,
      t: 2,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Spear Storm",
          text: "This unit always attacks also with the second rank.",
        },
        { name: "Faithful", text: "When praying, this unit gets +1 to LD." },
      ],
    },
    {
      name: "The Primaeval (Reptilians)",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 13,
      ld: 6,
      m: 10,
      ws: 3,
      s: 4,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Iron Discipline",
          text: "Orders issued to this unit can be re-rolled, and each score of 1 means a free order.",
        },
        {
          name: "Agile",
          text: "This unit can always re-roll one D6 when moving or charging.",
        },
      ],
    },
    {
      name: "Repsolians",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 15,
      ld: 6,
      m: 10,
      ws: 4,
      s: 4,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Battle Inspiration",
          text: "A hero attached to this unit gives +2 additional attacks to the pool.",
        },
        {
          name: "Will to Fight",
          text: "If this unit destroyed an enemy unit, it can regroup up to 10 cm instead of 5 cm.",
        },
      ],
    },
    {
      name: "The Sanctified",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 16,
      ld: 7,
      m: 10,
      ws: 3,
      s: 3,
      t: 2,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Fierce",
          text: "For each score of 1 in the Wound Test, this unit may roll two additional D6 for wounding. The obtained scores do not generate the new ones.",
        },
        { name: "Faithful", text: "When praying, this unit gets +1 to LD." },
        {
          name: "Gold Armour",
          text: "(Save) Each Wound this unit is dealt can be cancelled by exceptional armour. Roll a D6. A score of 2 or less means a cancelled Wound.",
        },
      ],
    },
    {
      name: "Ropuchons",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 16,
      ld: 7,
      m: 10,
      ws: 3,
      s: 3,
      t: 4,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Poisonous Spit",
          text: "After resolving the Ropuchons' attacks, select an enemy unit that is in base contact with them. Roll a D6 for each base in the Ropuchons unit. The opponent must take a Panic Test for each 1 and 2 you scored.",
        },
      ],
    },
    {
      name: "Trygodrons",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 20,
      ld: 6,
      m: 15,
      ws: 2,
      s: 5,
      t: 4,
      a: 2,
      w: 3,
      specialRules: [
        {
          name: "Immunity",
          text: "When this unit takes a Panic Test, it is failed only on a score of 5 or 6.",
        },
        { name: "Creature", text: "This unit cannot pray." },
        { name: "Tearing", text: "When charging, this unit has WS 4." },
      ],
    },
    {
      name: "Desauros with Sun Monolith",
      category: "RARE",
      costType: "FLAT",
      pointsCost: 68,
      ld: 4,
      m: 10,
      ws: 3,
      s: 6,
      t: 7,
      a: 7,
      w: 7,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Primal Rampage",
          text: "When charging, Desauros must take a D6 test to see if it goes berserk. A score of 2 or less means that Desauros gains +3 Attacks.",
        },
        {
          name: "Sun Monolith",
          text: "Roll a D6 for each Wound Desauros lost in combat. Each score of 2 or less means that target enemy unit within 20 cm is dealt 2 Wounds.",
        },
      ],
    },
    {
      name: "Golden Guards",
      category: "UNIQUE",
      costType: "PER_BASE",
      pointsCost: 19,
      ld: 7,
      m: 10,
      ws: 3,
      s: 4,
      t: 4,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Gold Armour",
          text: "(Save) Each Wound this unit is dealt can be cancelled by exceptional armour. Roll a D6. A score of 2 or less means a cancelled Wound.",
        },
        {
          name: "Poisonous Spit",
          text: "After resolving the Golden Guards' attacks, select an enemy unit that is in base contact with them. Roll a D6 for each base in the Golden Guards unit. The opponent must take a Panic Test for each 1 and 2 you scored.",
        },
      ],
    },
    {
      name: "Forgon",
      category: "UNIQUE",
      costType: "FLAT",
      pointsCost: 40,
      ld: 6,
      m: 10,
      ws: 2,
      s: 5,
      t: 5,
      a: 5,
      w: 5,
      specialRules: [
        {
          name: "Living Catapult",
          text: "During its activation, Forgon can spit at target enemy unit (but not single model) within 30 cm that is not engaged in combat. Roll a D6. A score of 3 or less means the enemy unit must take a Panic Test for 2 of its bases.",
        },
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
      ],
    },
    {
      name: "Command Group",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "COMMAND_GROUP",
      specialRules: [
        {
          name: "Command Group",
          text: "For more rules see Heroes – Command Group.",
        },
      ],
    },
    {
      name: "Champion of Sun",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 11,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Sun",
          text: "When Champion of Sun is attached to a friendly unit engaged in combat, you may roll a D6. A score of 2 or less means that the enemy unit must re-roll all scores of 1 both in its Weapon Skill Test and Wound Test until the end of the cycle.",
        },
      ],
    },
    {
      name: "Champion of Nature",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 10,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Nature",
          text: "When activating any unit within 10 cm of Champion of Nature, you may roll a D6. A score of 4 or less means that the unit may turn with no limits and add 3 cm to its move or charge range.",
        },
      ],
    },
    {
      name: "Champion of Gods",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Gods",
          text: "When Champion of Gods is attached to a friendly unit engaged in combat, you may roll a D6 before the fight. A score of 3 or less means that the unit can re-roll all failed scores during the Weapon Skill Test or the Wound Test.",
        },
      ],
    },
    {
      name: "Mystic of the Reborn",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        {
          name: "Mage",
          text: "May buy magic spells and items worth max. 6 points each.",
        },
        {
          name: "Mystic of the Reborn",
          text: "Each friendly unit within 10 cm of Mystic of the Reborn has a charge range of M + 6 cm + D6 (instead of M + 2D6 cm). A unit can never use the Mystic's ability at the same time it uses a Command Group bonus allowing to roll 3D6 for the charge.",
        },
      ],
    },
    {
      name: "Sun Seer",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        { name: "Mage", text: "May buy magic spells and items of any value." },
      ],
    },
    {
      name: "Sox'Augatir / Leading in the Battle",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 30,
      heroType: "GENERAL",
      ld: 3,
      specialRules: [
        {
          name: "General",
          text: "As long as General is on the battlefield, his army may use the army special rule and add General's LD during Initiative Tests. For more rules see Heroes – General.",
        },
      ],
    },
  ],
};

export const sorgax: SeedFaction = {
  name: "Sorgax",
  tagline:
    "Those Who Feed on Pain. Children of the Dying Stars. Guardians of the Water Temples.",
  armySpecialRuleName: "Heralds of Torment",
  armySpecialRuleText:
    "The Sorgax General may issue one additional free order per cycle if the opponent has suffered certain losses during the battle. Check how many Blood Points (BP) your opponent has lost so far and compare it with the table below to find out what score you need to get to successfully issue the free order. From 6 BP – order on a score of 1. From 12 BP – order on a score of 2 or less. From 24 BP – order on a score of 3 or less.",
  units: [
    {
      name: "Tormentors (Reptilians)",
      category: "BASIC",
      costType: "PER_BASE",
      pointsCost: 13,
      ld: 6,
      m: 10,
      ws: 3,
      s: 4,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Iron Discipline",
          text: "Orders issued to this unit can be re-rolled, and each score of 1 means a free order.",
        },
        {
          name: "Responsive",
          text: "This unit can be issued an order in 40 cm from the General.",
        },
      ],
    },
    {
      name: "Scourges (Liagulians)",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 9,
      ld: 7,
      m: 10,
      ws: 2,
      s: 3,
      t: 2,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Spear Storm",
          text: "This unit always attacks also with the second rank.",
        },
        {
          name: "Sneaky",
          text: "This unit gets +2 attacks for attacking the enemy's flank or rear.",
        },
      ],
    },
    {
      name: "Repsolians",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 15,
      ld: 6,
      m: 10,
      ws: 4,
      s: 4,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Battle Inspiration",
          text: "A hero attached to this unit gives +2 additional attacks to the pool.",
        },
        {
          name: "Will to Fight",
          text: "If this unit destroyed an enemy unit, it can regroup up to 10 cm instead of 5 cm.",
        },
      ],
    },
    {
      name: "The Fallen (Ropuchons)",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 16,
      ld: 7,
      m: 10,
      ws: 3,
      s: 3,
      t: 4,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Poisonous Spit",
          text: "After resolving the Ropuchons' attacks, select an enemy unit that is in base contact with them. Roll a D6 for each base in the Ropuchons unit. The opponent must take a Panic Test for each 1 and 2 you scored.",
        },
      ],
    },
    {
      name: "Martyrs of Voro-dan",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 19,
      ld: 6,
      m: 10,
      ws: 3,
      s: 4,
      t: 5,
      a: 4,
      w: 2,
      specialRules: [
        {
          name: "Vigilant",
          text: "The enemy unit does not receive bonuses for attacking this unit's flank or rear.",
        },
        {
          name: "Enslaved",
          text: "The opponent gains Blood Points for bases from this unit only after destroying the entire unit.",
        },
      ],
    },
    {
      name: "Slagors",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 15,
      ld: 6,
      m: 15,
      ws: 3,
      s: 3,
      t: 5,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Snake Move",
          text: "This unit can move or charge through enemy or friendly units if its move ends outside the unit that it was moving or charging through.",
        },
        { name: "Creature", text: "This unit cannot pray." },
      ],
    },
    {
      name: "Desauros with Tomb Altar",
      category: "UNIQUE",
      costType: "FLAT",
      pointsCost: 68,
      ld: 4,
      m: 10,
      ws: 3,
      s: 6,
      t: 7,
      a: 7,
      w: 7,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Primal Rampage",
          text: "When charging, Desauros must take a D6 test to see if it goes berserk. A score of 2 or less means that Desauros gains +3 Attacks.",
        },
        {
          name: "Tomb Altar",
          text: "Desauros with Tomb Altar gains 1 Wound for each Wound it inflicts upon the enemy unit. Desauros may have a maximum of 12 Wounds.",
        },
      ],
    },
    {
      name: "Crushers on Scalyvars",
      category: "UNIQUE",
      costType: "PER_BASE",
      pointsCost: 23,
      ld: 6,
      m: 15,
      ws: 4,
      s: 4,
      t: 4,
      a: 2,
      w: 3,
      specialRules: [
        {
          name: "Battle Inspiration",
          text: "A hero attached to this unit gives +2 additional attacks to the pool.",
        },
        {
          name: "Hammer Strike",
          text: "For each score of 1 and 2 in the Wound Test, this unit can roll an additional D6 for wounding. The obtained scores do not generate the new ones.",
        },
      ],
    },
    {
      name: "Forgon",
      category: "UNIQUE",
      costType: "FLAT",
      pointsCost: 40,
      ld: 6,
      m: 10,
      ws: 2,
      s: 5,
      t: 5,
      a: 5,
      w: 5,
      specialRules: [
        {
          name: "Living Catapult",
          text: "During its activation, Forgon can spit at target enemy unit (but not single model) within 30 cm that is not engaged in combat. Roll a D6. A score of 3 or less means the enemy unit must take a Panic Test for 2 of its bases.",
        },
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
      ],
    },
    {
      name: "Command Group",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "COMMAND_GROUP",
      specialRules: [
        {
          name: "Command Group",
          text: "For more rules see Heroes – Command Group.",
        },
      ],
    },
    {
      name: "Champion of Night",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 11,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Night",
          text: "When Champion of Night is attached to a friendly unit engaged in combat, roll a D6 before the enemy attacks. A score of 3 or less means that the enemy gets -1 to S until the end of the cycle.",
        },
      ],
    },
    {
      name: "Champion of Death",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Death",
          text: "When Champion of Death is attached to a friendly unit engaged in combat, roll a D6 for each base the enemy unit lost. Each score of 2 or less means the enemy unit loses another base.",
        },
      ],
    },
    {
      name: "Champion of Wrath",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Wrath",
          text: "Choose target friendly unit within 20 cm of Champion of Wrath and roll a D6 before that unit makes a charge. A score of 4 or less means that the chosen unit gains +1 to WS when charging.",
        },
      ],
    },
    {
      name: "Tomb Priest",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        {
          name: "Mage",
          text: "May buy magic spells and items worth max. 6 points each.",
        },
        {
          name: "Tomb Priest",
          text: "Each friendly unit within 10 cm of Tomb Priest may add 3 cm to the charge range.",
        },
      ],
    },
    {
      name: "Guardian of the Underworld",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        { name: "Mage", text: "May buy magic spells and items of any value." },
      ],
    },
    {
      name: "Abazatragon",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 30,
      heroType: "GENERAL",
      ld: 2,
      specialRules: [
        {
          name: "General",
          text: "As long as General is on the battlefield, his army may use the army special rule and add General's LD during Initiative Tests. For more rules see Heroes – General.",
        },
      ],
    },
  ],
};

export const dirandis: SeedFaction = {
  name: "Dirandis",
  tagline: "Wolves wandering through the Land of Sorrow. Chosen of the Old Gods. Unbending.",
  armySpecialRuleName: "Devoted to Gods",
  armySpecialRuleText:
    "Basic and Elite Units in the Dirandis army may re-roll failed Prayer Tests.",
  units: [
    {
      name: "Brothers of Fire (Barbarians)",
      category: "BASIC",
      costType: "PER_BASE",
      pointsCost: 12,
      ld: 7,
      m: 10,
      ws: 3,
      s: 3,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Focused Attack",
          text: "When charging, this unit gets +1 to WS.",
        },
      ],
    },
    {
      name: "Wolf Maidens (Amazons)",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 8,
      ld: 7,
      m: 10,
      ws: 3,
      s: 2,
      t: 2,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Precise Hit",
          text: "This unit may re-roll all failed scores in the Weapon Skill Test.",
        },
        {
          name: "Light Shield Defence",
          text: "(Save) For each Wound this unit is dealt, roll a D6 for Light Shield Defence. Each score of 1 means a cancelled Wound.",
        },
      ],
    },
    {
      name: "Riders on Gridons",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 21,
      ld: 6,
      m: 15,
      ws: 3,
      s: 4,
      t: 4,
      a: 2,
      w: 3,
      specialRules: [
        {
          name: "Focused Attack",
          text: "When charging, this unit gets +1 to WS.",
        },
        {
          name: "Fierce Assault",
          text: "When charging, this unit gets additional +2 attacks for each full rank.",
        },
        {
          name: "Army Limit",
          text: "Max. 2 units in the army of 1500 pts or less, max. 5 units in the army above 1500 pts (in addition to the normal Elite Unit limits).",
        },
      ],
    },
    {
      name: "Wolf Brothers",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 14,
      ld: 6,
      m: 10,
      ws: 3,
      s: 3,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Focused Attack",
          text: "When charging, this unit gets +1 to WS.",
        },
        {
          name: "Magic Runes",
          text: "A successful Prayer Test of this unit means that the unit can use the rules of two different prayers instead of one. Such additional prayer does not decrease the pool of prayers.",
        },
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
      ],
    },
    {
      name: "The Devoted (Half-Giants)",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 20,
      ld: 7,
      m: 10,
      ws: 2,
      s: 4,
      t: 4,
      a: 3,
      w: 2,
      specialRules: [
        {
          name: "Crushing Blow",
          text: "Each successful score in the Weapon Skill Test made by this unit is considered a Double Hit.",
        },
        {
          name: "Cleaving",
          text: "No saves are permitted against the attacks made by this unit.",
        },
      ],
    },
    {
      name: "Giant",
      category: "RARE",
      costType: "FLAT",
      pointsCost: 43,
      ld: 6,
      m: 10,
      ws: 2,
      s: 6,
      t: 5,
      a: 5,
      w: 6,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Throwing Stones",
          text: "If a friendly unit within 20 cm of the Giant is charged by an enemy unit, the Giant may immediately throw stones at the charging enemy. The enemy unit must subtract D6+2 attacks from its pool. The Giant can use this ability once per cycle.",
        },
      ],
    },
    {
      name: "Sasquatches",
      category: "UNIQUE",
      costType: "PER_BASE",
      pointsCost: 15,
      ld: 5,
      m: 10,
      ws: 2,
      s: 5,
      t: 5,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Ambush",
          text: "This unit can make a free move before the battle. In addition, the enemy unit cannot use charge bonuses and independent bonuses while charging this unit.",
        },
      ],
    },
    {
      name: "Wilhars",
      category: "UNIQUE",
      costType: "PER_BASE",
      pointsCost: 17,
      ld: 6,
      m: 15,
      ws: 2,
      s: 3,
      t: 3,
      a: 2,
      w: 3,
      specialRules: [
        {
          name: "Wild Speed",
          text: "This unit always rolls an additional D6 when moving or charging, regardless of the situation.",
        },
        { name: "Creature", text: "This unit cannot pray." },
      ],
    },
    {
      name: "Elephanton",
      category: "UNIQUE",
      costType: "FLAT",
      pointsCost: 88,
      ld: 4,
      m: 10,
      ws: 3,
      s: 8,
      t: 6,
      a: 6,
      w: 7,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Trample",
          text: "For each successful score in the Weapon Skill Test, roll an additional D6 for hitting. Additional successful scores do not generate the new ones.",
        },
        {
          name: "Monster",
          text: "The enemy engaged in combat with this unit fails a Panic Test on a 2+, ignoring any support coming from heroes.",
        },
      ],
    },
    {
      name: "Command Group",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "COMMAND_GROUP",
      specialRules: [
        {
          name: "Command Group",
          text: "For more rules see Heroes – Command Group.",
        },
      ],
    },
    {
      name: "Champion of Ice",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 13,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Ice",
          text: "When Champion of Ice is attached to a friendly unit engaged in combat, roll a D6 before the enemy attacks. A score of 3 or less means that the enemy gets -1 to WS until the end of the cycle.",
        },
      ],
    },
    {
      name: "Champion of Fire",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 10,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Fire",
          text: "When Champion of Fire is attached to a friendly unit engaged in combat, roll a D6 before the fight. A score of 3 or less means the unit gets 3 additional dice in the Wound Test until the end of the cycle.",
        },
      ],
    },
    {
      name: "Champion of Storm",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Storm",
          text: "After activating Champion of Storm, choose target enemy unit within 30 cm and roll a D6 for each full rank in that unit. Each score of 4 or less means that the chosen unit is dealt 1 Wound with no saves permitted.",
        },
      ],
    },
    {
      name: "Priest of the Old Gods",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        { name: "Mage", text: "May buy magic spells and items of any value." },
        {
          name: "Priest of the Old Gods",
          text: "As long as Priest of the Old Gods is on the battlefield, one more friendly unit can pray during the cycle.",
        },
      ],
    },
    {
      name: "Fortune-teller",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        {
          name: "Mage",
          text: "May buy magic spells and items worth max. 6 points each.",
        },
        {
          name: "Fortune-teller",
          text: "If Fortune-teller is within 10 cm of Great Hunter during the Activation Roll, the player can roll a D6 once per cycle. A score of 3 or less means that the result obtained in the Activation Roll may be modified by +1 or -2. At least one unit must be activated.",
        },
      ],
    },
    {
      name: "Great Hunter",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 30,
      heroType: "GENERAL",
      ld: 3,
      specialRules: [
        {
          name: "General",
          text: "As long as General is on the battlefield, his army may use the army special rule and add General's LD during Initiative Tests. For more rules see Heroes – General.",
        },
      ],
    },
  ],
};

export const gaeldor: SeedFaction = {
  name: "Gaeldor",
  tagline: "Lords of Beasts. Ern's Chosen. Shadow Walkers.",
  armySpecialRuleName: "Wrath of the Forest",
  armySpecialRuleText:
    "Basic and Elite Units in the Gaeldor army may change any 1 rolled when moving or charging to a score of 3.",
  units: [
    {
      name: "Beast Hunters (Barbarians)",
      category: "BASIC",
      costType: "PER_BASE",
      pointsCost: 13,
      ld: 7,
      m: 10,
      ws: 3,
      s: 3,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Momentum",
          text: "When charging, this unit has an A stat increased by 1.",
        },
        {
          name: "Hunter's Instinct",
          text: "When attacking single models and units with Creature, this unit does not subtract dice for the difference between Strength and Toughness.",
        },
      ],
    },
    {
      name: "Oduns",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 18,
      ld: 6,
      m: 10,
      ws: 3,
      s: 4,
      t: 5,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Spear Storm",
          text: "This unit always attacks also with the second rank.",
        },
        {
          name: "Woodiness",
          text: "(Save) Roll a D6 for each Wound this unit is dealt. Each score of 1 means a cancelled Wound.",
        },
      ],
    },
    {
      name: "Amazons on Spiders",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 19,
      ld: 7,
      m: 15,
      ws: 3,
      s: 3,
      t: 4,
      a: 2,
      w: 3,
      specialRules: [
        {
          name: "Venom",
          text: "Once this unit finishes its attacks and there is a base marked with a Wound in the enemy unit, that base is removed. Does not work on single models.",
        },
        {
          name: "Keen Senses",
          text: "This unit can turn in any direction, with no limits, before making a move or charge.",
        },
        {
          name: "Army Limit",
          text: "Max. 3 units in the army of 1500 pts or less, max. 5 units in the army above 1500 pts (in addition to the normal Elite Unit limits).",
        },
      ],
    },
    {
      name: "Voraks",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 12,
      ld: 6,
      m: 10,
      ws: 3,
      s: 3,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Sweeping Slash",
          text: "This unit can re-roll each score of 6 in the Weapon Skill Test.",
        },
        {
          name: "Brutal Trap",
          text: "This unit doubles the bonus for attacking the enemy's flank or rear.",
        },
      ],
    },
    {
      name: "Iron Oaks (Half-Giants)",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 20,
      ld: 7,
      m: 10,
      ws: 2,
      s: 4,
      t: 4,
      a: 3,
      w: 2,
      specialRules: [
        {
          name: "Crushing Blow",
          text: "Each successful score in the Weapon Skill Test made by this unit is considered a Double Hit.",
        },
        {
          name: "Cleaving",
          text: "No saves are permitted against the attacks made by this unit.",
        },
      ],
    },
    {
      name: "Forest Serpents (Slagors)",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 15,
      ld: 6,
      m: 15,
      ws: 3,
      s: 3,
      t: 5,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Snake Move",
          text: "This unit can move or charge through enemy or friendly units if its move ends outside the unit that it was moving or charging through.",
        },
        { name: "Creature", text: "This unit cannot pray." },
      ],
    },
    {
      name: "Trefloq",
      category: "RARE",
      costType: "FLAT",
      pointsCost: 56,
      ld: 6,
      m: 10,
      ws: 2,
      s: 6,
      t: 8,
      a: 5,
      w: 7,
      specialRules: [
        {
          name: "Toxic Spores",
          text: "The enemy unit attacking a Trefloq always has -1 to S.",
        },
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Woodiness",
          text: "(Save) Roll a D6 for each Wound this unit is dealt. Each score of 1 means a cancelled Wound.",
        },
      ],
    },
    {
      name: "Wild Creatures",
      category: "UNIQUE",
      costType: "PER_BASE",
      pointsCost: 18,
      ld: 5,
      m: 15,
      ws: 3,
      s: 4,
      t: 4,
      a: 2,
      w: 3,
      specialRules: [
        {
          name: "Under the Spell",
          text: "This unit can only be deployed if there is Beast Master in the army. If the army loses its last Beast Master, roll a D6 before activating Wild Creatures. On a score of 5 or 6, the unit loses an Action Die. A different score means it can be activated normally.",
        },
        {
          name: "Frenzy",
          text: "When charging, this unit doubles its Attacks (A) stat.",
        },
        { name: "Creature", text: "This unit cannot pray." },
      ],
    },
    {
      name: "Marmydon",
      category: "UNIQUE",
      costType: "FLAT",
      pointsCost: 248,
      ld: 4,
      m: 10,
      ws: 3,
      s: 12,
      t: 9,
      a: 6,
      w: 24,
      specialRules: [
        {
          name: "Roar",
          text: "Once per its turn, Marmydon may roll a D6. On a score of 2 or less, every enemy unit within 20 cm of Marmydon must take a Panic Test for two bases.",
        },
        {
          name: "Crushing Blow",
          text: "Each successful score in the Weapon Skill Test made by this unit is considered a Double Hit.",
        },
        {
          name: "Thick Hide",
          text: "(Save) Roll a D6 for each Wound this unit is dealt. Each score of 1 means a cancelled Wound.",
        },
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Fall of the Leviathan",
          text: "When Marmydon loses its last W point, every unit touching its base must take a 2D6 test. A score lower than the unit's LD means that the unit is dealt D6+2 Wounds with no saves permitted.",
        },
        {
          name: "Monster",
          text: "The enemy engaged in combat with this unit fails a Panic Test on a 2+, ignoring any support coming from heroes.",
        },
        {
          name: "Army Limit",
          text: "Max. 1 model for every full 1000 army points.",
        },
      ],
    },
    {
      name: "Forest Dragon",
      category: "UNIQUE",
      costType: "FLAT",
      pointsCost: 96,
      ld: 4,
      m: 15,
      ws: 4,
      s: 7,
      t: 6,
      a: 8,
      w: 8,
      specialRules: [
        {
          name: "King of the Wild",
          text: "Each enemy unit within 10 cm of Forest Dragon loses the Horde rule if it has one. Each friendly unit within 10 cm has Fearless.",
        },
        {
          name: "Winged Creature",
          text: "When both armies are deployed, Forest Dragon can be deployed up to 20 cm from its deployment zone.",
        },
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
      ],
    },
    {
      name: "Command Group",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "COMMAND_GROUP",
      specialRules: [
        {
          name: "Command Group",
          text: "For more rules see Heroes – Command Group.",
        },
      ],
    },
    {
      name: "Champion of Forest",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 12,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Forest",
          text: "Before the battle, Champion of Forest allows the army to re-roll when rolling for terrain. When Champion of Forest is attached to a friendly unit engaged in combat, roll a D6 before the fight. A score of 3 or less means the unit gets +1 to S in this cycle.",
        },
      ],
    },
    {
      name: "Champion of Beasts",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 13,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Beasts",
          text: "Roll a D6 if General failed to issue an order to Amazons on Spiders, Forest Serpents, or Wild Creatures. A score of 4 or less means that General may re-roll the failed score. Champion of Beasts attached to the listed units grants them further +2 attacks to the pool.",
        },
      ],
    },
    {
      name: "Champion of Hunt",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Hunt",
          text: "When Champion of Hunt is attached to a friendly unit engaged in combat, he may roll a D6 whenever the friendly unit attacks. A score of 2 or less means every score of 6 in the Weapon Skill Test counts as a successful hit.",
        },
      ],
    },
    {
      name: "Druid",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        {
          name: "Mage",
          text: "May buy magic spells and items worth max. 6 points each.",
        },
        {
          name: "Druid",
          text: "Each friendly unit of Oduns and each Trefloq within 10 cm of Druid can re-roll failed scores during the saving throws (Woodiness).",
        },
      ],
    },
    {
      name: "Beast Master",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        { name: "Mage", text: "May buy magic spells and items of any value." },
      ],
    },
    {
      name: "Gaeldaukar",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 30,
      heroType: "GENERAL",
      ld: 2,
      specialRules: [
        {
          name: "General",
          text: "As long as General is on the battlefield, his army may use the army special rule and add General's LD during Initiative Tests. For more rules see Heroes – General.",
        },
      ],
    },
  ],
};

export const sheolMorg: SeedFaction = {
  name: "Sheol-morg",
  tagline: "Worshippers of the Dark Gods. The Great Menagerie. Condemned.",
  armySpecialRuleName: "Choose a Lord",
  armySpecialRuleText:
    "A Sheol-morg army must choose a Lord to command it — Lord of the Abyss, Lord Necromancer, or Lord of Sheol-morg — each granting a different army special rule, General LD, and unlocked Basic Unit. See the three General options below for each Lord's specific rule.",
  units: [
    {
      name: "Truhlaks (Skeletons)",
      category: "BASIC",
      costType: "PER_BASE",
      pointsCost: 7,
      requiresHeroName: "Lord Necromancer",
      ld: 4,
      m: 10,
      ws: 3,
      s: 2,
      t: 1,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Fear",
          text: "After a successful charge with this unit, the enemy unit (but not single model) must take a Panic Test for 1 base. If this unit is a Horde, the enemy must take a Panic Test for 2 bases instead.",
        },
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        { name: "Creature", text: "This unit cannot pray." },
        {
          name: "Enslaved",
          text: "The opponent gains Blood Points for bases from this unit only after destroying the entire unit.",
        },
        {
          name: "Corpse Horde",
          text: "Only Lord Necromancer can attach to this unit. After each lost combat, this unit must roll a D6. The score is the number of additional Wounds it is dealt. In the army led by Lord Necromancer, this unit can add a rank of Marauders to the Horde that allowed to deploy them (such a Horde consists of 20 bases).",
        },
      ],
    },
    {
      name: "Ritual Guardians (Kozars)",
      category: "BASIC",
      costType: "PER_BASE",
      pointsCost: 13,
      requiresHeroName: "Lord of Sheol-morg",
      ld: 6,
      m: 10,
      ws: 3,
      s: 3,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Ancient Steel",
          text: "If this unit rolled at least three 1s during the Weapon Skill Test, it gets +1 to S until the end of the cycle.",
        },
        { name: "Baaaaaa!!!", text: "When praying, this unit has LD 9." },
        {
          name: "Fanatical Loyalty",
          text: "In the army led by Lord of Sheol-morg, as long as this unit is a Horde, it may sacrifice one base to re-roll the failed order issued to them by the General.",
        },
      ],
    },
    {
      name: "Dark Fauns",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 21,
      ld: 6,
      m: 10,
      ws: 3,
      s: 4,
      t: 4,
      a: 3,
      w: 2,
      specialRules: [
        {
          name: "Fierce",
          text: "For each score of 1 in the Wound Test, this unit may roll two additional D6 for wounding. The obtained scores do not generate the new ones.",
        },
        {
          name: "Immunity",
          text: "When this unit takes a Panic Test, it is failed only on a score of 5 or 6.",
        },
      ],
    },
    {
      name: "Horned Warriors",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 15,
      recategorizeGeneralName: "Lord of the Abyss",
      recategorizeToCategory: "BASIC",
      ld: 6,
      m: 10,
      ws: 3,
      s: 3,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Terrible Damage",
          text: "Each score of 1 in the Wound Test deals an additional Wound.",
        },
        {
          name: "Heavy Armour",
          text: "(Save) Each Wound this unit is dealt may be cancelled by heavy armour. Roll a D6 for each Wound this unit is dealt. Each score of 2 or less means a cancelled Wound.",
        },
        {
          name: "Too Late for Hope",
          text: "In the army led by Lord of the Abyss, this unit has Unyielding — After a failed charge, this unit can never be turned by the opponent.",
        },
      ],
    },
    {
      name: "Truhlaks on Fallen Ogars",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 19,
      recategorizeGeneralName: "Lord Necromancer",
      recategorizeToCategory: "ELITE",
      ld: 6,
      m: 15,
      ws: 3,
      s: 3,
      t: 3,
      a: 2,
      w: 3,
      specialRules: [
        {
          name: "Wild Speed",
          text: "This unit always rolls an additional D6 when moving or charging, regardless of the situation.",
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
      name: "Minotaur",
      category: "RARE",
      costType: "FLAT",
      pointsCost: 52,
      ld: 6,
      m: 10,
      ws: 2,
      s: 6,
      t: 6,
      a: 5,
      w: 7,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Amok",
          text: "After this unit's attacks, roll a D6 for each Wound inflicted upon the enemy. Each score of 1 or 2 means the enemy is dealt an additional Wound.",
        },
      ],
    },
    {
      name: "Black Knights on Horgars",
      category: "UNIQUE",
      costType: "PER_BASE",
      pointsCost: 27,
      ld: 6,
      m: 15,
      ws: 4,
      s: 4,
      t: 4,
      a: 2,
      w: 3,
      specialRules: [
        {
          name: "Heavy Armour",
          text: "(Save) Each Wound this unit is dealt may be cancelled by heavy armour. Roll a D6 for each Wound this unit is dealt. Each score of 2 or less means a cancelled Wound.",
        },
        {
          name: "Fierce Assault",
          text: "When charging, this unit gets additional +2 attacks for each full rank.",
        },
        {
          name: "Fear",
          text: "After a successful charge with this unit, the enemy unit (but not single model) must take a Panic Test for 1 base. If this unit is a Horde, the enemy must take a Panic Test for 2 bases instead.",
        },
        { name: "Faithful", text: "When praying, this unit gets +1 to LD." },
        {
          name: "Immunity",
          text: "When this unit takes a Panic Test, it is failed only on a score of 5 or 6.",
        },
      ],
    },
    {
      name: "Hybrids",
      category: "UNIQUE",
      costType: "PER_BASE",
      pointsCost: 17,
      ld: 5,
      m: 10,
      ws: 3,
      s: 5,
      t: 5,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Spasms",
          text: "When attacking, this unit gets additional D6+1 attacks. If this unit is a Horde, the number of additional attacks is D6+4.",
        },
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        { name: "Creature", text: "This unit cannot pray." },
      ],
    },
    {
      name: "Hydra",
      category: "UNIQUE",
      costType: "FLAT",
      pointsCost: 83,
      ld: 2,
      m: 10,
      ws: 3,
      s: 7,
      t: 7,
      a: 7,
      w: 8,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Born in the Abyss",
          text: "When attacking a Hydra, the enemy cannot use charge bonuses.",
        },
        {
          name: "Dark Vomit",
          text: "After a successful charge with a Hydra, and after positioning the units, choose target enemy unit within 10 cm of the Hydra. Roll 5D6 – each score of 2 or less means the chosen enemy unit is dealt 1 Wound.",
        },
      ],
    },
    {
      name: "Command Group",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "COMMAND_GROUP",
      specialRules: [
        {
          name: "Command Group",
          text: "For more rules see Heroes – Command Group.",
        },
      ],
    },
    {
      name: "Champion of Gehenna",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Gehenna",
          text: "When Champion of Gehenna is attached to a friendly unit engaged in combat, roll a D6 before the fight. A score of 3 or less means that one stat (except W) of the unit can be increased by 1 until the end of the cycle.",
        },
      ],
    },
    {
      name: "Champion of Hordes",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 13,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Hordes",
          text: "Roll a D6 if the unit with Champion of Hordes attached made a successful charge or has been charged. A score of 3 or less means the unit which has at least 12 bases may re-roll all failed scores in the Weapon Skill Test, and if the unit was not a Horde or it lost the Horde rule, it gains (regains) the Horde rule.",
        },
      ],
    },
    {
      name: "Champion of the Dark Gods",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 16,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of the Dark Gods",
          text: "If Champion of the Dark Gods is attached to a friendly unit engaged in combat, he always adds +5 attacks instead of +4. In addition, you may roll a D6 before the enemy unit's attacks. A score of 3 or less means the enemy must, according to your choice, re-roll all successful scores in the Weapon Skill Test or the Wound Test.",
        },
      ],
    },
    {
      name: "Curser",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        {
          name: "Mage",
          text: "May buy magic spells and items worth max. 6 points each.",
        },
        {
          name: "Curser",
          text: "All enemy units within 30 cm of Curser get -2 cm to the charge range.",
        },
      ],
    },
    {
      name: "Warlock",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        { name: "Mage", text: "May buy magic spells and items of any value." },
        {
          name: "Warlock",
          text: "All friendly units within 20 cm of Warlock may re-roll a failed Prayer Test when praying for Fury.",
        },
      ],
    },
    {
      name: "Lord of the Abyss",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 30,
      heroType: "GENERAL",
      ld: 3,
      specialRules: [
        {
          name: "Darkness is Coming...",
          text: "The player is allowed to activate one unit more or less than shown in the Activation Roll. At least one unit must always be activated.",
        },
        {
          name: "General",
          text: "As long as General is on the battlefield, his army may use the army special rule and add General's LD during Initiative Tests. For more rules see Heroes – General. Unlocks Horned Warriors as this army's Basic Unit.",
        },
      ],
    },
    {
      name: "Lord Necromancer",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 30,
      heroType: "GENERAL",
      ld: 1,
      specialRules: [
        {
          name: "Your Souls Belong to Us!",
          text: "The army fields Truhlaks on Fallen Ogars as Elite Units, not Rare. If Lord Necromancer's opponent rolls a 1 or 2 in an Initiative Test, he loses the test regardless of other rules, magic in any form, modifiers, or re-roll opportunities. In addition, if the opponent's army has lost 5 Blood Points or more, you may roll a D6 once per cycle when activating Lord Necromancer. On a score of 2 or less, you may place a unit of The Damned (LD 3 – M 10 – WS 2 – S 2 – T 2 – A 2 – W 1, Fearless, Creature; 4 bases) within 20 cm of Lord Necromancer, without an Action Die and facing any direction. In the subsequent cycles, the unit receives an Action Die and can be activated normally. It does not count towards lost Blood Points when destroyed.",
        },
        {
          name: "General",
          text: "As long as General is on the battlefield, his army may use the army special rule and add General's LD during Initiative Tests. For more rules see Heroes – General. Unlocks Truhlaks (Skeletons) as this army's Basic Unit.",
        },
      ],
    },
    {
      name: "Lord of Sheol-morg",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 30,
      heroType: "GENERAL",
      ld: 2,
      specialRules: [
        {
          name: "Ab... huul! Daaqul, salib!!!",
          text: "The army always fields Ritual Master (Mage), for free, not counting against the Mage limit, who may buy magic spells and items of any value. Before the battle, he performs a special ritual: roll a D6. On 1-2, Ritual of Beast — Basic and Elite Units in the army have their move and charge ranges increased by 2 cm. On 3-4, Ritual of Pain — Basic and Elite Units in the army that have no save receive one; each such unit may roll a D6 for each Wound it is dealt, and each score of 1 means a cancelled Wound. On 5-6, Ritual of Fear — Basic and Elite Units in the army have Fear (after a successful charge, the enemy unit must take a Panic Test for 1 base, or 2 bases if this unit is a Horde).",
        },
        {
          name: "General",
          text: "As long as General is on the battlefield, his army may use the army special rule and add General's LD during Initiative Tests. For more rules see Heroes – General. Unlocks Ritual Guardians (Kozars) as this army's Basic Unit.",
        },
      ],
    },
  ],
};

export const erSael: SeedFaction = {
  name: "Er'Sael",
  tagline:
    "Orc Clan of Ugruk-hor. Shrouded in Dark Aura. Renegades. The Great Reavers of Sael.",
  armySpecialRuleName: "Arcane Knowledge",
  armySpecialRuleText:
    "Mages in the Er'Sael army may re-roll a failed Magic Test.",
  units: [
    {
      name: "Fangs of Sael (Orcs Warriors)",
      category: "BASIC",
      costType: "PER_BASE",
      pointsCost: 12,
      ld: 5,
      m: 10,
      ws: 3,
      s: 4,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Brutality",
          text: "After a successful charge and Wound Test made with this unit, the enemy unit (but not single model) is dealt additional 1 Wound for each full rank of this unit.",
        },
      ],
    },
    {
      name: "Rogues (Orcs Mercenaries)",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 13,
      ld: 5,
      m: 10,
      ws: 3,
      s: 4,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Brawl",
          text: "During the enemy unit's Weapon Skill Test, before any re-rolls, seize all dice showing a score of 6. Perform attacks with the seized dice immediately (without bonuses) before the enemy makes further rolls. The seized dice are not returned.",
        },
        {
          name: "Sweeping Slash",
          text: "This unit can re-roll each score of 6 in the Weapon Skill Test.",
        },
      ],
    },
    {
      name: "Zadukats (Knuroses)",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 13,
      ld: 7,
      m: 10,
      ws: 3,
      s: 4,
      t: 4,
      a: 2,
      w: 2,
      specialRules: [
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
      name: "Riders of Daaran",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 22,
      ld: 5,
      m: 15,
      ws: 3,
      s: 5,
      t: 5,
      a: 2,
      w: 3,
      specialRules: [
        {
          name: "Ambush",
          text: "This unit can make a free move before the battle. In addition, the enemy unit cannot use charge bonuses and independent bonuses while charging this unit.",
        },
        {
          name: "Will to Fight",
          text: "If this unit destroyed an enemy unit, it can regroup up to 10 cm instead of 5 cm.",
        },
        {
          name: "Army Limit",
          text: "Max. 2 units in the army of 1500 pts or less, max. 5 units in the army above 1500 pts (in addition to the normal Elite Unit limits).",
        },
      ],
    },
    {
      name: "Nerh (Black Orcs)",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 15,
      ld: 4,
      m: 10,
      ws: 2,
      s: 5,
      t: 4,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Tearing",
          text: "When charging, this unit has WS 4.",
        },
        {
          name: "Rage",
          text: "During combat result, if the enemy unit or units lost more bases in total than the unit with Rage they are engaged in combat with, if the combat continues in the subsequent cycle, the unit with Rage is treated as if charging.",
        },
      ],
    },
    {
      name: "Monks of the Shadow Temple",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 17,
      ld: 5,
      m: 10,
      ws: 3,
      s: 4,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Precise Hit",
          text: "This unit may re-roll all failed scores in the Weapon Skill Test.",
        },
        {
          name: "Master Ambush",
          text: "The enemy unit cannot use charge bonuses and independent bonuses while charging this unit. If this unit consists of 8 bases or less, when both armies are deployed and the opponent finishes making any free moves they are allowed to make before the battle, you may deploy this unit anywhere on the battlefield, but not closer than 20 cm from the enemy. If this unit consists of more than 8 bases, it must be deployed in a standard way, but can make a free move before the battle.",
        },
      ],
    },
    {
      name: "Larva of Nalharap",
      category: "RARE",
      costType: "FLAT",
      pointsCost: 62,
      requiresHeroName: "Black Shepherd",
      ld: 4,
      m: 10,
      ws: 5,
      s: 6,
      t: 10,
      a: 2,
      w: 7,
      specialRules: [
        {
          name: "Acid Spit",
          text: "When the enemy unit declares a charge against Larva of Nalharap, roll a D6 for the acid spit. A score of 3 or less means that the enemy unit is hit by the acid and loses 2 Wounds with no saves permitted. In addition, the charge is automatically failed and the enemy must follow the rules of a failed charge.",
        },
        {
          name: "Slowness",
          text: "Due to its sluggishness and bulk, Larva can never roll more than one D6 when rolling for the charge range.",
        },
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
      ],
    },
    {
      name: "Prophet on Varanor",
      category: "UNIQUE",
      costType: "FLAT",
      pointsCost: 105,
      ld: 4,
      m: 10,
      ws: 3,
      s: 7,
      t: 8,
      a: 7,
      w: 9,
      specialRules: [
        {
          name: "Curse of Blood",
          text: "If the enemy unit (but not single model) has suffered any losses as a result of combat with the Prophet, roll a D6 for each base the enemy unit lost. Each score of 4 or less means that other target enemy unit within 40 cm of the Prophet is dealt 1 Wound with no saves permitted.",
        },
        {
          name: "Dark Aura",
          text: "Once per battle, in any cycle, after the Initiative Test, regardless of the number of friendly Prophets, you may decide that your army becomes shrouded in Dark Aura. The opponent's army cannot use magic items, spells and prayers until the end of the cycle.",
        },
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Monster",
          text: "The enemy engaged in combat with this unit fails a Panic Test on a 2+, ignoring any support coming from heroes.",
        },
        {
          name: "Army Limit",
          text: "Max. 1 model in the army of 1500 pts or less.",
        },
      ],
    },
    {
      name: "Priests of Sael",
      category: "UNIQUE",
      costType: "PER_BASE",
      pointsCost: 18,
      ld: 5,
      m: 10,
      ws: 4,
      s: 4,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "The God of Slaughter Blessing",
          text: "When praying, this unit has LD 10.",
        },
        {
          name: "Hammer Strike",
          text: "For each score of 1 and 2 in the Wound Test this unit can roll an additional D6 for wounding. The obtained scores do not generate the new ones.",
        },
      ],
    },
    {
      name: "Command Group",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "COMMAND_GROUP",
      specialRules: [
        {
          name: "Command Group",
          text: "For more rules see Heroes – Command Group.",
        },
      ],
    },
    {
      name: "Champion of Shadow",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 12,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Shadow",
          text: "Roll a D6 if an enemy unit charged a unit and is within 20 cm of Champion of Shadow. A score of 3 or less means that each 6 the enemy unit obtains in the Wound Test will inflict 1 Wound upon it.",
        },
      ],
    },
    {
      name: "Champion of Sael",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 13,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Sael",
          text: "At any point in the cycle, Champion of Sael attached to a unit of Fangs of Sael may roll a D6. A score of 3 or less means that the unit is allowed to use one chosen prayer. This ability is not treated as praying by any means.",
        },
      ],
    },
    {
      name: "Champion of Slaughter",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Slaughter",
          text: "If Champion of Slaughter is attached to a friendly unit that inflicted Wounds upon the enemy unit, roll a D6. A score of 2 or less allows the friendly unit to immediately perform as many new attacks as the number of Wounds it inflicted upon the enemy. The new Wounds dealt this way do not generate further attacks.",
        },
      ],
    },
    {
      name: "Black Shepherd",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        { name: "Mage", text: "May buy magic spells and items of any value." },
        {
          name: "Black Shepherd",
          text: "Black Shepherd attached to a friendly unit adds +3 attacks instead of +1 and the unit has LD 7 when praying.",
        },
      ],
    },
    {
      name: "Alchemist",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        {
          name: "Mage",
          text: "May buy magic spells and items worth max. 6 points each.",
        },
        {
          name: "Alchemist",
          text: "May buy one elixir (magic item) that does not count to the limit of magic items. Elixirs cannot repeat in the army.",
        },
      ],
    },
    {
      name: "Clanlord of Er'Sael",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 30,
      heroType: "GENERAL",
      ld: 2,
      specialRules: [
        {
          name: "General",
          text: "As long as General is on the battlefield, his army may use the army special rule and add General's LD during Initiative Tests. For more rules see Heroes – General.",
        },
      ],
    },
  ],
};

export const vaendral: SeedFaction = {
  name: "Vaendral",
  tagline:
    "Sons and Daughters of The Great Harlot. Bathed in Blood. Gods' Slayers.",
  armySpecialRuleName: "Born Warriors",
  armySpecialRuleText:
    "The Vaendral army may re-roll any score of 1 or 6 obtained during Activation Roll.",
  units: [
    {
      name: "Blood Priestesses (Amazons)",
      category: "BASIC",
      costType: "PER_BASE",
      pointsCost: 8,
      ld: 7,
      m: 10,
      ws: 3,
      s: 2,
      t: 2,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Bloodshed",
          text: "This unit may re-roll all failed scores in the Wound Test.",
        },
        {
          name: "Light Shield Defence",
          text: "(Save) For each Wound this unit is dealt, roll a D6 for Light Shield Defence. Each score of 1 means a cancelled Wound.",
        },
      ],
    },
    {
      name: "The Firstborn (Barbarians)",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 13,
      ld: 7,
      m: 10,
      ws: 3,
      s: 3,
      t: 3,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Wild Charge",
          text: "When charging, this unit gets +1 to S.",
        },
        {
          name: "Fury",
          text: "When charging, this unit gets +2 additional attacks to the pool for each full rank of the charged enemy unit or +1 additional attack for each W point of the charged enemy single model. The bonus from Fury can never exceed 10 attacks.",
        },
      ],
    },
    {
      name: "Ravagers on Sungals",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 20,
      ld: 6,
      m: 15,
      ws: 3,
      s: 4,
      t: 5,
      a: 2,
      w: 3,
      specialRules: [
        {
          name: "Terrible Damage",
          text: "Each score of 1 in the Wound Test deals an additional Wound.",
        },
        {
          name: "Fury",
          text: "When charging, this unit gets +2 additional attacks to the pool for each full rank of the charged enemy unit or +1 additional attack for each W point of the charged enemy single model. The bonus from Fury can never exceed 10 attacks.",
        },
        {
          name: "Army Limit",
          text: "Max. 2 units in the army of 1500 pts or less, max. 5 units in the army above 1500 pts (in addition to the normal Elite Unit limits).",
        },
      ],
    },
    {
      name: "Sozruits",
      category: "ELITE",
      costType: "PER_BASE",
      pointsCost: 11,
      ld: 5,
      m: 10,
      ws: 3,
      s: 2,
      t: 2,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Scare",
          text: "The enemy unit that is in base contact with this unit must take a Panic Test at the end of the cycle for each base lost earlier in the same cycle.",
        },
        {
          name: "Cult",
          text: "The enemy gains 1 Blood Point after destroying two bases instead of one in this unit.",
        },
        {
          name: "The God of Slaughter Blessing",
          text: "When praying, this unit has LD 10.",
        },
        {
          name: "Army Limit",
          text: "Max. 2 units in the army, regardless of points (in addition to the normal Elite Unit limits).",
        },
      ],
    },
    {
      name: "The Reapers (Half-Giants)",
      category: "RARE",
      costType: "PER_BASE",
      pointsCost: 20,
      ld: 7,
      m: 10,
      ws: 2,
      s: 4,
      t: 4,
      a: 3,
      w: 2,
      specialRules: [
        {
          name: "Crushing Blow",
          text: "Each successful score in the Weapon Skill Test made by this unit is considered a Double Hit.",
        },
        {
          name: "Cleaving",
          text: "No saves are permitted against the attacks made by this unit.",
        },
      ],
    },
    {
      name: "Giant",
      category: "RARE",
      costType: "FLAT",
      pointsCost: 43,
      ld: 6,
      m: 10,
      ws: 2,
      s: 6,
      t: 5,
      a: 5,
      w: 6,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Throwing Stones",
          text: "If a friendly unit within 20 cm of the Giant is charged by an enemy unit, the Giant may immediately throw stones at the charging enemy. The enemy unit must subtract D6+2 attacks from its pool. The Giant can use this ability once per cycle.",
        },
      ],
    },
    {
      name: "Voutars",
      category: "UNIQUE",
      costType: "PER_BASE",
      pointsCost: 16,
      ld: 4,
      m: 10,
      ws: 3,
      s: 4,
      t: 4,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Keen Senses",
          text: "This unit can turn in any direction, with no limits, before making a move or charge.",
        },
        {
          name: "Brutal Trap",
          text: "This unit doubles the bonus for attacking the enemy's flank or rear.",
        },
      ],
    },
    {
      name: "White Witches",
      category: "UNIQUE",
      costType: "PER_BASE",
      pointsCost: 12,
      ld: 7,
      m: 10,
      ws: 3,
      s: 2,
      t: 2,
      a: 2,
      w: 2,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Curse of the Witch",
          text: "A Cold Blood Test taken by an enemy unit engaged in combat with this unit is always considered failed.",
        },
        {
          name: "Bloodshed",
          text: "This unit may re-roll all failed scores in the Wound Test.",
        },
        {
          name: "Terrible Damage",
          text: "Each score of 1 in the Wound Test deals an additional Wound.",
        },
        {
          name: "Light Shield Defence",
          text: "(Save) For each Wound this unit is dealt, roll a D6 for Light Shield Defence. Each score of 1 means a cancelled Wound.",
        },
      ],
    },
    {
      name: "Elephanton",
      category: "UNIQUE",
      costType: "FLAT",
      pointsCost: 88,
      ld: 4,
      m: 10,
      ws: 3,
      s: 8,
      t: 6,
      a: 6,
      w: 7,
      specialRules: [
        {
          name: "Fearless",
          text: "This unit always passes a Cold Blood Test and a Panic Test.",
        },
        {
          name: "Trample",
          text: "For each successful score in the Weapon Skill Test, roll an additional D6 for hitting. Additional successful scores do not generate the new ones.",
        },
        {
          name: "Monster",
          text: "The enemy engaged in combat with this unit fails a Panic Test on a 2+, ignoring any support coming from heroes.",
        },
      ],
    },
    {
      name: "Command Group",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "COMMAND_GROUP",
      specialRules: [
        {
          name: "Command Group",
          text: "For more rules see Heroes – Command Group.",
        },
      ],
    },
    {
      name: "Champion of Blood",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Blood",
          text: "At any point during the cycle, Champion of Blood may take a D6 test. A score of 3 or less means that all friendly units within 20 cm of Champion of Blood are granted +2 attacks to the pool if they do not have Bloodshed. If they have Bloodshed, they are granted a +1 to S bonus instead. These bonuses last until the end of the cycle.",
        },
      ],
    },
    {
      name: "Champion of Earth",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 13,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Earth",
          text: "Choose target enemy unit within 30 cm that is not engaged in combat and roll a D6. A score of 3 or less means the chosen unit can be moved by 10 cm in any direction, without turning.",
        },
      ],
    },
    {
      name: "Champion of Darkness",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 15,
      heroType: "CHAMPION",
      specialRules: [
        {
          name: "Champion of Darkness",
          text: "When Champion of Darkness is attached to a friendly unit engaged in combat, he can roll a D6 each time the enemy unit loses its bases in this cycle. A score of 3 or less means the enemy unit must immediately take a Panic Test for as many bases as it lost in this cycle.",
        },
      ],
    },
    {
      name: "Priestess of Lust",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        {
          name: "Mage",
          text: "May buy magic spells and items worth max. 6 points each.",
        },
        {
          name: "Priestess of Lust",
          text: "All friendly units within 10 cm of Priestess of Lust may re-roll a move range, or a failed Cold Blood Test.",
        },
      ],
    },
    {
      name: "Old Hag",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 14,
      heroType: "MAGE",
      specialRules: [
        { name: "Mage", text: "May buy magic spells and items of any value." },
      ],
    },
    {
      name: "Bloody Chieftain",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 30,
      heroType: "GENERAL",
      ld: 2,
      specialRules: [
        {
          name: "General",
          text: "As long as General is on the battlefield, his army may use the army special rule and add General's LD during Initiative Tests. For more rules see Heroes – General.",
        },
      ],
    },
  ],
};

export const factions: SeedFaction[] = [
  arox,
  sorgax,
  dirandis,
  gaeldor,
  sheolMorg,
  erSael,
  vaendral,
];

export async function seedFaction(db: PrismaClient, factionData: SeedFaction) {
  const faction = await db.faction.upsert({
    where: { name: factionData.name },
    update: {
      tagline: factionData.tagline,
      armySpecialRuleName: factionData.armySpecialRuleName,
      armySpecialRuleText: factionData.armySpecialRuleText,
    },
    create: {
      name: factionData.name,
      tagline: factionData.tagline,
      armySpecialRuleName: factionData.armySpecialRuleName,
      armySpecialRuleText: factionData.armySpecialRuleText,
    },
  });

  for (const unit of factionData.units) {
    const existing = await db.unit.findFirst({
      where: { factionId: faction.id, name: unit.name },
    });

    const data = {
      factionId: faction.id,
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
      requiresHeroName: unit.requiresHeroName ?? null,
      recategorizeGeneralName: unit.recategorizeGeneralName ?? null,
      recategorizeToCategory: unit.recategorizeToCategory ?? null,
      ld: unit.ld,
      m: unit.m,
      ws: unit.ws,
      s: unit.s,
      t: unit.t,
      a: unit.a,
      w: unit.w,
    };

    // Update in place (rather than delete + recreate) so that the unit's id
    // is stable and doesn't orphan ArmyUnit rows in saved armies.
    if (existing) {
      await db.unitSpecialRule.deleteMany({ where: { unitId: existing.id } });
      await db.unit.update({
        where: { id: existing.id },
        data: { ...data, specialRules: { create: unit.specialRules } },
      });
    } else {
      await db.unit.create({
        data: { ...data, specialRules: { create: unit.specialRules } },
      });
    }
  }

  console.log(`Seeded faction "${faction.name}" with ${factionData.units.length} units.`);
}
