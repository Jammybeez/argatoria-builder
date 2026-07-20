import { PrismaClient, type UnitCategory, type CostType } from "../generated/prisma";

const db = new PrismaClient();

interface SeedUnit {
  name: string;
  category: UnitCategory;
  costType: CostType;
  pointsCost: number;
  isMage?: boolean;
  isGeneral?: boolean;
  ld?: number;
  m?: number;
  ws?: number;
  s?: number;
  t?: number;
  a?: number;
  w?: number;
  specialRules: { name: string; text: string }[];
}

const arox: { name: string; tagline: string; armySpecialRuleName: string; armySpecialRuleText: string; units: SeedUnit[] } = {
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
      costType: "PER_BASE",
      pointsCost: 15,
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
      isMage: true,
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
      isMage: true,
      specialRules: [
        { name: "Mage", text: "May buy magic spells and items of any value." },
      ],
    },
    {
      name: "Sox'Augatir / Leading in the Battle",
      category: "HERO",
      costType: "FLAT",
      pointsCost: 30,
      isGeneral: true,
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

async function main() {
  const faction = await db.faction.upsert({
    where: { name: arox.name },
    update: {
      tagline: arox.tagline,
      armySpecialRuleName: arox.armySpecialRuleName,
      armySpecialRuleText: arox.armySpecialRuleText,
    },
    create: {
      name: arox.name,
      tagline: arox.tagline,
      armySpecialRuleName: arox.armySpecialRuleName,
      armySpecialRuleText: arox.armySpecialRuleText,
    },
  });

  for (const unit of arox.units) {
    const existing = await db.unit.findFirst({
      where: { factionId: faction.id, name: unit.name },
    });

    if (existing) {
      await db.unitSpecialRule.deleteMany({ where: { unitId: existing.id } });
      await db.unit.delete({ where: { id: existing.id } });
    }

    await db.unit.create({
      data: {
        factionId: faction.id,
        name: unit.name,
        category: unit.category,
        costType: unit.costType,
        pointsCost: unit.pointsCost,
        isMage: unit.isMage ?? false,
        isGeneral: unit.isGeneral ?? false,
        ld: unit.ld,
        m: unit.m,
        ws: unit.ws,
        s: unit.s,
        t: unit.t,
        a: unit.a,
        w: unit.w,
        specialRules: {
          create: unit.specialRules,
        },
      },
    });
  }

  console.log(`Seeded faction "${faction.name}" with ${arox.units.length} units.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
