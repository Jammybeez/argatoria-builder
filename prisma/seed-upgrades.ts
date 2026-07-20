import type { PrismaClient, UpgradeType } from "../generated/prisma";

export interface SeedUpgrade {
  type: UpgradeType;
  name: string;
  pointsCost: number;
  range?: number; // spells only: casting range in cm. Omitted = "battlefield" (unlimited range)
  castingValue?: number; // spells only: Magic Test target (roll <= this)
  factionName?: string; // faction this item is restricted to, if any
  requirementsText?: string; // free-text conditions not otherwise modeled
  effectText: string;
}

// Spellbook and Magical Familiar also modify per-hero upgrade caps; see
// src/lib/upgrade-rules.ts for that logic (kept out of the catalog data).
export const magicItems: SeedUpgrade[] = [
  {
    type: "MAGIC_ITEM",
    name: "Battle Staff",
    pointsCost: 4,
    effectText:
      "Once per battle, during an Activation Roll, it allows a player to re-roll one die result. Additionally, a Mage with the Battle Staff attached to a unit always grants +3 attacks instead of +1.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Enchanted Shoes",
    pointsCost: 1,
    effectText:
      "Move range of the Mage wearing the Enchanted Shoes equals 30 cm instead of 20 cm. Reusable item.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Breastplate from Al-dukbar",
    pointsCost: 2,
    effectText:
      "If the Mage is to be eliminated from the battle by a foe, he may roll a D6. A score of 5 or less means that the breastplate saved the Mage from death. The Mage must then attach to a friendly unit within 30 cm.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Ring of Spells",
    pointsCost: 1,
    effectText:
      "The Mage can use the Ring of Spells to cast any one spell from the ones he did not buy.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Snow Amulet",
    pointsCost: 4,
    effectText:
      "Roll a D6. Move and charge ranges of the enemy units are decreased by the obtained number.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Corpse Brew",
    pointsCost: 5,
    effectText:
      "The Mage who got touched by the enemy unit may immediately roll 6D6. Each score of 4 or less means that the enemy unit is dealt 1 Wound with no saves permitted. The Mage is allowed to touch the enemy unit on purpose during his move, however, if the unit survives, it can still take a test for the Mage's death.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Scroll of Dice Shattering",
    pointsCost: 2,
    effectText:
      "During an enemy Champion's ability test, the Mage can shatter the result obtained by the Champion. The shattered die counts as a failed test.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Spellbook",
    pointsCost: 3,
    effectText: "Before the battle, it allows the Mage to buy a third spell.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Claw from Valhelia",
    pointsCost: 2,
    requirementsText: "Cannot be used by the Sheol-morg army.",
    effectText:
      "Target unit (but not single model) with Creature can be assigned one prayer until the end of the cycle, after taking the successful Prayer Test (LD=8).",
  },
  {
    type: "MAGIC_ITEM",
    name: "Long Staff",
    pointsCost: 5,
    effectText:
      "The ranges of all spells cast by the Mage are 10 cm greater. Reusable item.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Chalice of Woe",
    pointsCost: 7,
    effectText:
      "If the opponent won the Initiative Test, you may use this item. Remove an Action Die from target enemy unit.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Magical Familiar",
    pointsCost: 7,
    effectText:
      "Before the battle, the Mage can buy up to three magic items instead of two thanks to the Magical Familiar. The Magical Familiar does not count to the limit of magic items.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Vengeful Crystal",
    pointsCost: 6,
    effectText:
      "Roll a D6 before target enemy unit's attacks. The enemy unit will have to remove all results obtained in the WS Test and the Wound Test that show the same number as your result. If your result is 5 or 6, the item is treated as not used and can be used (even in this cycle) during another fight of any unit.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Scroll of Daze",
    pointsCost: 6,
    effectText: "Target enemy unit with WS 3 or greater gets -1 to WS.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Ring of Destruction",
    pointsCost: 3,
    effectText: "Target unit gets +1 to S.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Pouchling (Zapazooh)",
    pointsCost: 1,
    effectText: "Modify the result in the Magic Test performed by the owner by 2.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Crown of Damnation",
    pointsCost: 2,
    effectText:
      "If the Mage is attached to a charging unit, he may use the Crown of Damnation before the unit attacks. The charged enemy unit (but not single model) must immediately take Panic Tests for 4 bases. If the enemy unit (but not single model) has Fearless or Immunity, it cannot use these abilities until the end of the cycle, and its Cold Blood Tests are treated as failed.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Talisman from Ragloq",
    pointsCost: 2,
    effectText: "During one of your Activation Rolls, you can re-roll one die.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Elixir",
    pointsCost: 1,
    effectText:
      "The player can re-roll one Initiative Test with a +2 modifier.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Old Scroll",
    pointsCost: 2,
    effectText:
      "The Mage may cast another spell in the cycle, but it cannot be the same as the first spell.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Book of the Dead",
    pointsCost: 8,
    effectText:
      "Every enemy unit within 20 cm of the Mage must take a D6 test. A score of 2 or less means the enemy unit is dealt 2 Wounds with no saves permitted.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Dispel",
    pointsCost: 1,
    effectText:
      "If an enemy Mage used a spell or an item other than Dispel, you may roll a D6. A score of 5 or less means that the spell or item was dispelled and did not work. A score of 1 means that the Dispel did not lose its power and the Mage will be able to use it again.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Ring of Power",
    pointsCost: 2,
    effectText: "The Mage can teleport up to 40 cm during its activation.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Staff",
    pointsCost: 3,
    effectText:
      "Target unit within 20 cm of the Mage must re-roll all failed or successful hits in the Weapon Skill Test.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Diadem of Despair",
    pointsCost: 4,
    effectText:
      "Use this item to support target unit within 20 cm of the Mage. Each score of 1 in the Wound Test performed by the chosen unit deals additional 1 Wound.",
  },
  // Er'Sael elixirs: per the rulebook, only the Alchemist may buy one, and it
  // doesn't count toward the normal 2-magic-item limit. That's narrower than
  // our generic "exempt from cap" mechanism (built for Magical Familiar,
  // which has no such single-pick-of-three restriction), so rather than
  // extend that mechanism for one hero's quirk, these are seeded as normal
  // magic items with the constraint spelled out in requirementsText.
  {
    type: "MAGIC_ITEM",
    name: "Elixir of Audacity",
    pointsCost: 1,
    factionName: "Er'Sael",
    requirementsText:
      "Alchemist only. Does not count toward the magic item limit, but only one elixir may be taken.",
    effectText:
      "The opponent must re-roll both results obtained in the Activation Roll.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Elixir of Foresight",
    pointsCost: 2,
    factionName: "Er'Sael",
    requirementsText:
      "Alchemist only. Does not count toward the magic item limit, but only one elixir may be taken.",
    effectText: "General's LD is increased to 5.",
  },
  {
    type: "MAGIC_ITEM",
    name: "Elixir of Insolence",
    pointsCost: 3,
    factionName: "Er'Sael",
    requirementsText:
      "Alchemist only. Does not count toward the magic item limit, but only one elixir may be taken.",
    effectText:
      "Use this elixir after the enemy General issued the successful order. The order must be re-rolled with a -1 modifier.",
  },
];

export const artefacts: SeedUpgrade[] = [
  {
    type: "ARTEFACT",
    name: "Blade of Contempt",
    pointsCost: 2,
    effectText:
      "When attached to a unit, the General supports it with 7 attacks instead of 6.",
  },
  {
    type: "ARTEFACT",
    name: "Black Signet from Ugruk-hor",
    pointsCost: 7,
    effectText: "The General's pool of orders is increased by 1.",
  },
  {
    type: "ARTEFACT",
    name: "Mythical Helm of Destiny",
    pointsCost: 1,
    effectText:
      "When touched by an enemy unit, the General dies only on a roll of 1. If the General survives, he must attach to a friendly unit within 30 cm.",
  },
  {
    type: "ARTEFACT",
    name: "Horn of Haburis",
    pointsCost: 5,
    effectText: "The General's range of issuing orders is increased by 10 cm.",
  },
  {
    type: "ARTEFACT",
    name: "Axe of Doom",
    pointsCost: 4,
    effectText:
      "When attached to a unit, the General allows it to re-roll 3 failed results in the Weapon Skill Test.",
  },
  {
    type: "ARTEFACT",
    name: "Poisoned Blade of Katakhanes",
    pointsCost: 4,
    effectText:
      "If an enemy unit (but not a single model) was dealt a Wound by a unit to which the General with this artefact is attached, the wounded enemy base is removed. When attacking a single model, the unit supported by the General with this artefact may re-roll up to 6 results in the Wound Test.",
  },
  {
    type: "ARTEFACT",
    name: "Bracer of Torment",
    pointsCost: 1,
    effectText:
      "An enemy unit attacking a unit to which the General with this artefact is attached loses 2 dice from the pool of attacks, or 4 dice if it has Fearless.",
  },
  {
    type: "ARTEFACT",
    name: "Hammer of Thalion",
    pointsCost: 3,
    effectText:
      "When attached to a unit, the General allows it to re-roll 4 failed results in the Wound Test.",
  },
  {
    type: "ARTEFACT",
    name: "Bastard Blade of Saint Gardon",
    pointsCost: 2,
    effectText:
      "When attached to a unit, the General allows it to re-roll all 6s in the Weapon Skill Test made against the enemy unit that has Fearless or has a General or a Champion attached.",
  },
];

// range omitted below = "battlefield" (unlimited range), per each spell's text.
export const spells: SeedUpgrade[] = [
  {
    type: "SPELL",
    name: "Fireball",
    pointsCost: 7,
    range: 20,
    castingValue: 3,
    effectText:
      "Choose target enemy unit (but not single model) within 20 cm and perform a Magic Test. If successful, the opponent must take a Toughness test (D6 roll) for 2 bases from that unit. Each D6 roll equal to or lesser than the unit's Toughness means that nothing happens. Each roll higher than Toughness means that the unit loses 1 base.",
  },
  {
    type: "SPELL",
    name: "Blizzard",
    pointsCost: 6,
    range: 30,
    castingValue: 4,
    effectText:
      "Choose target enemy unit within 30 cm that is not engaged in combat and perform a Magic Test. If successful, move the unit 5 cm forwards or backwards in a straight line.",
  },
  {
    type: "SPELL",
    name: "Terror",
    pointsCost: 2,
    range: 30,
    castingValue: 4,
    effectText:
      "Choose target enemy unit within 30 cm and perform a Magic Test. If successful, the enemy unit must take a Cold Blood Test at the beginning of the next cycle. If the test it failed, the unit loses an Action Die.",
  },
  {
    type: "SPELL",
    name: "Will to Fight",
    pointsCost: 8,
    range: 20,
    castingValue: 3,
    effectText:
      "Choose target friendly unit within 20 cm that is not engaged in combat and perform a Magic Test. If successful, the unit can turn in any direction, with no limits, and move up to 15 cm + D6.",
  },
  {
    type: "SPELL",
    name: "Whispers of the Gods",
    pointsCost: 3,
    range: 30,
    castingValue: 4,
    effectText:
      "Choose target General within 30 cm and perform a Magic Test. If successful, choose a +2 or -2 modifier. The selected General will receive it in the next Initiative Test.",
  },
  {
    type: "SPELL",
    name: "Thunderbolt",
    pointsCost: 7,
    castingValue: 2,
    effectText:
      "Choose target enemy unit on the battlefield that is not engaged in combat and perform a Magic Test. If successful, the chosen unit is dealt 3 Wounds. If the unit has any save, or it is on a base bigger than 20 mm, it is dealt 4 Wounds instead. No saves are permitted against Thunderbolt.",
  },
  {
    type: "SPELL",
    name: "Death Blast",
    pointsCost: 4,
    range: 40,
    castingValue: 4,
    effectText:
      "Choose up to three target enemy units (but not single models) within 40 cm with wounded bases and perform a Magic Test. If successful, the chosen units must remove the wounded bases.",
  },
  {
    type: "SPELL",
    name: "Scream",
    pointsCost: 5,
    range: 20,
    castingValue: 3,
    effectText:
      "Choose target enemy unit within 20 cm that is not engaged in combat and perform a Magic Test. If successful, you can move that unit backwards up to 10 cm in a straight line.",
  },
  {
    type: "SPELL",
    name: "Blackout",
    pointsCost: 3,
    range: 30,
    castingValue: 2,
    effectText:
      "Choose target unit within 30 cm and perform a Magic Test. If successful, in the subsequent cycle, the chosen unit can move or charge only up to D6 cm (move) or 2D6 cm (charge), without adding the M stat. If the unit fails to charge, it remains stationary, but can still be turned up to 90 degrees by the opponent.",
  },
  {
    type: "SPELL",
    name: "Lament",
    pointsCost: 6,
    range: 20,
    castingValue: 2,
    effectText:
      "Choose target enemy unit within 20 cm that is engaged in combat and perform a Magic Test. If successful, move the unit 10 cm backwards in a straight line. If the unit cannot be moved exactly 10 cm backwards, it remains in combat and is dealt 3 Wounds with no saves permitted.",
  },
  {
    type: "SPELL",
    name: "Vengeance",
    pointsCost: 8,
    range: 30,
    castingValue: 4,
    effectText:
      "Choose target friendly unit within 30 cm that is engaged in combat and perform a Magic Test. If successful, the chosen unit can immediately perform 1 attack for each 1 Wound lost in this cycle. These attacks are not affected by prayers or magic in any form, but they are subject to the unit's special abilities.",
  },
  {
    type: "SPELL",
    name: "Shackles of Pain",
    pointsCost: 9,
    range: 30,
    castingValue: 3,
    effectText:
      "Choose target enemy single model within 30 cm and perform a Magic Test. If successful, the model must immediately roll a D6 for each W point it currently has. Each score of 5 or 6 means that the model loses 1 Wound with no saves permitted.",
  },
  {
    type: "SPELL",
    name: "Confusion",
    pointsCost: 7,
    range: 40,
    castingValue: 3,
    effectText:
      "Choose target enemy unit within 40 cm that is not engaged in combat and perform a Magic Test. If successful, turn the chosen unit exactly 90 degrees and move it 2D6 cm forwards. If the unit encounters another unit, hero or terrain on its path, it must stop 2 cm before the obstacle.",
  },
  {
    type: "SPELL",
    name: "War Cry",
    pointsCost: 2,
    range: 10,
    castingValue: 3,
    effectText:
      "Perform a Magic Test. If successful, all friendly units within 10 cm have Fearless.",
  },
  {
    type: "SPELL",
    name: "Blind Panic",
    pointsCost: 6,
    range: 40,
    castingValue: 4,
    effectText:
      "Choose target enemy unit (but not single model) with Fearless within 40 cm and perform a Magic Test. If successful, the chosen unit loses Fearless, even if it gained it as a result of magic. In addition, in the subsequent cycle, the unit must take a 2D6 test. A result higher than the unit's LD means that the unit loses its Action Die.",
  },
  {
    type: "SPELL",
    name: "False Whispers",
    pointsCost: 10,
    castingValue: 3,
    effectText:
      "Perform a Magic Test. If successful, in the subsequent cycle, during the opponent's first Activation Roll, you can choose which units the opponent will activate and in what order.",
  },
  {
    type: "SPELL",
    name: "Rise of the Earth",
    pointsCost: 4,
    castingValue: 4,
    effectText:
      "Choose any point on the battlefield and perform a Magic Test. If successful, place two pieces from the Small Stone Terrains set (or other rocky terrain pieces with a max. size of 5 cm x 5 cm each) on the battlefield in any way, as long as the terrains are touching each other, but min. 10 cm from any unit or terrain, and min. 2 cm from any hero. If the Rise of the Earth spell is cast again, and there is already a terrain piece on the battlefield placed as a result of this spell, it must be removed before another one is placed.",
  },
  {
    type: "SPELL",
    name: "Rockburst",
    pointsCost: 2,
    castingValue: 4,
    effectText:
      "Choose one piece from the Small Stone Terrains set (or other rocky terrain piece with a max. size of 5 cm x 5 cm) that is present on the battlefield. Perform a Magic Test. If successful, the rock is destroyed. Each unit within 10 + D6 cm of the terrain is dealt D6 Wounds with no saves permitted. Remove the destroyed terrain piece from the battlefield. Note that the piece destroyed this way cannot be larger than 5 cm x 5 cm. If there is no rocky terrain piece in a required size on the battlefield, a Mage possessing the Rockburst spell is allowed to cast the Rise of the Earth spell during the game without buying it.",
  },
  {
    type: "SPELL",
    name: "Relentless Rain",
    pointsCost: 3,
    castingValue: 3,
    effectText:
      "Perform a Magic Test. If successful, a heavy, relentless rain begins to fall across the entire battlefield, with the storm focusing its full fury on two enemy units of your choice. Choose two target enemy units (but not single models) on the battlefield. Roll a D6 for each chosen unit. If the result is equal to or lesser than the unit's Strength (S), place a RAIN marker next to that unit. A unit with a RAIN marker cannot benefit from charge bonuses. At the end of the subsequent cycle, before the Heroes actions, the rain ends. Remove all RAIN markers from the battlefield.",
  },
  {
    type: "SPELL",
    name: "Treacherous Thoughts",
    pointsCost: 4,
    castingValue: 3,
    effectText:
      "Choose target enemy hero on the battlefield and perform a Magic Test. If successful, roll another D6 and compare the score with the following table. 1-2: Driven mad by treacherous thoughts, the hero lashes out at his own comrades. The opponent must remove 1 base from the unit which the hero is attached to. 3-4: The hero mocks and belittles his own comrades and is driven away by them in response. The opponent must move the hero exactly 30 cm in any direction without attaching him to another unit. 5-6: The hero sows discord among the troops, spreading confusion throughout the army. In the subsequent cycle, instead of the Initiative Test, you can decide who will begin the cycle.",
  },
  {
    type: "SPELL",
    name: "Binding",
    pointsCost: 8,
    range: 30,
    castingValue: 2,
    effectText:
      "Choose target enemy unit within 30 cm and perform a Magic Test. If successful, place a BINDING marker next to the chosen unit. In the subsequent cycle, if the unit with the BINDING marker is charged and still has an Action Die, it loses the Action Die. If it is charged and it does not have an Action Die, the charging unit is treated as having WS 4. The BINDING marker is removed at the end of the subsequent cycle.",
  },
  {
    type: "SPELL",
    name: "Bloodletting",
    pointsCost: 9,
    range: 30,
    castingValue: 3,
    effectText:
      "Choose target enemy unit within 30 cm and perform a Magic Test. If successful, if the chosen unit has a wounded base, the unit loses further 2 Wounds with no saves permitted. If the chosen unit does not have a wounded base, the opponent must take a D6 test. A score higher than the unit's W stat means that the unit is dealt 3 Wounds with no saves permitted.",
  },
  {
    type: "SPELL",
    name: "Portal",
    pointsCost: 1,
    range: 50,
    castingValue: 3,
    effectText:
      "Choose target friendly hero within 50 cm and perform a Magic Test. If successful, the chosen hero can be placed anywhere on the battlefield, but not attached to a unit.",
  },
  {
    type: "SPELL",
    name: "Language of Beasts",
    pointsCost: 11,
    range: 30,
    castingValue: 3,
    effectText:
      "Choose target friendly or enemy single model within 30 cm and perform a Magic Test. If successful, turn the chosen model up to 90 degrees and move it 2D6 + 3 cm forwards. If, as a result of this move, the model gets in base contact with an enemy unit, it is treated as a charge. In such a case, the attacks follow as per basic rules.",
  },
  {
    type: "SPELL",
    name: "Battle Boost",
    pointsCost: 4,
    range: 30,
    castingValue: 3,
    effectText:
      "Choose target friendly unit within 30 cm and perform a Magic Test. If successful, place any marker next to the chosen unit. In the subsequent cycle, when charging at an enemy unit with a Horde rule, the unit does not lose charge bonuses. Remove the marker at the end of the subsequent cycle.",
  },
  {
    type: "SPELL",
    name: "Fighting Instinct",
    pointsCost: 2,
    range: 50,
    castingValue: 4,
    effectText:
      "Choose target friendly unit within 50 cm and perform a Magic Test. If successful, you can turn the chosen unit in any direction, with no limits.",
  },
  {
    type: "SPELL",
    name: "Humility",
    pointsCost: 5,
    range: 40,
    castingValue: 3,
    effectText:
      "Choose target friendly unit within 40 cm and perform a Magic Test. If successful, in the subsequent cycle, if the chosen unit takes a Prayer Test, it can use Power of Faith (When praying, the unit's LD is increased by 2).",
  },
  {
    type: "SPELL",
    name: "Power of Discipline",
    pointsCost: 8,
    range: 20,
    castingValue: 4,
    effectText:
      "Choose target friendly unit within 20 cm and perform a Magic Test. If successful, if the General attempts to issue an order to the chosen unit and the roll is failed, it can be re-rolled. If the unit fails any Panic Tests, they can be re-rolled.",
  },
  {
    type: "SPELL",
    name: "Forward!",
    pointsCost: 4,
    castingValue: 3,
    effectText:
      "Choose target friendly unit on the battlefield and perform a Magic Test. If successful, you can move the chosen unit up to 2D6 cm forwards, without turning. If the unit encounters another unit, hero or terrain on its path, it must stop 2 cm before the obstacle.",
  },
  {
    type: "SPELL",
    name: "Flame Strike",
    pointsCost: 3,
    range: 40,
    castingValue: 3,
    effectText:
      "Choose other friendly Mage within 40 cm or the one casting this spell and perform a Magic Test. If successful, in the subsequent cycle, the chosen Mage grants the unit he is attached to +D6 attacks to the pool (in addition to his standard +1 attack).",
  },
];

// Several banners are restricted to a specific faction (factionName) and,
// for a few Sheol-morg ones, further to a specific General via
// requirementsText (shown as a caveat, not enforced — see the General
// exclusion note on Banner of God Seth). A handful also reference bonus
// units from factions not seeded yet (Sheol-morg, Gaeldor) — those unit
// stat blocks are NOT seeded here; only the banner's own rules text is.
export const banners: SeedUpgrade[] = [
  {
    type: "BANNER",
    name: "Banner of Glory",
    pointsCost: 10,
    effectText:
      "The army with this banner always wins ties during Initiative Tests. If the opponent also has this rule, ties must be re-rolled.",
  },
  {
    type: "BANNER",
    name: "Battle Banner",
    pointsCost: 2,
    effectText:
      "The range of abilities of the Command Group with this banner is 10 cm.",
  },
  {
    type: "BANNER",
    name: "Blessed Banner",
    pointsCost: 8,
    effectText: "The army has one more prayer per cycle.",
  },
  {
    type: "BANNER",
    name: "Banner of Courage",
    pointsCost: 1,
    effectText:
      "The unit with this Command Group attached has Fearless.",
  },
  {
    type: "BANNER",
    name: "Banner of Persistence",
    pointsCost: 2,
    effectText:
      "The unit with this Command Group attached can never lose charge or fight bonuses when it charges at a Horde or a unit that cancels these bonuses.",
  },
  {
    type: "BANNER",
    name: "Banner of Prudence",
    pointsCost: 1,
    effectText:
      "After a failed charge, the unit with this Command Group attached does not move towards the foe and cannot be turned by the opponent.",
  },
  {
    type: "BANNER",
    name: "Banner of Destruction",
    pointsCost: 3,
    effectText:
      "During combat, the unit with this Command Group attached does not allow the enemy unit to take any armour tests or other protection tests. In addition, the unit gets +4 attacks for attacking the foe from the side or the rear to the bonuses it already has.",
  },
  {
    type: "BANNER",
    name: "Banner of Command",
    pointsCost: 6,
    effectText:
      "After deploying the armies and terrain, it allows you to change the deployment of up to three units in your army, within your deployment zone.",
  },
  {
    type: "BANNER",
    name: "Banner of Power",
    pointsCost: 4,
    effectText:
      "It allows target friendly Mage within 10 cm to re-roll a failed Magic Test. If the result of the re-roll is 6, the banner loses its power for the rest of the battle.",
  },
  {
    type: "BANNER",
    name: "Banner of Resolve",
    pointsCost: 7,
    effectText:
      "If you may activate only one unit in your turn, you may activate one additional (this means you can activate two units instead of one).",
  },
  {
    type: "BANNER",
    name: "Banner of the Bathed in Blood",
    pointsCost: 14,
    factionName: "Vaendral",
    effectText:
      "The unit with this Command Group attached has Bloodshed (This unit may re-roll all failed scores in the Wound Test). If the unit with this Command Group attached has Bloodshed by default, it gets +2 to S.",
  },
  {
    type: "BANNER",
    name: "Banner of the Gods' Slayers",
    pointsCost: 10,
    factionName: "Vaendral",
    effectText:
      "The unit with this Command Group attached has Terrible Damage (Each score of 1 in the Wound Test deals an additional Wound). If the unit with this Command Group attached has Terrible Damage by default, it gets +3 to M.",
  },
  {
    type: "BANNER",
    name: "Banner of the Lords of Beasts",
    pointsCost: 12,
    factionName: "Gaeldor",
    effectText:
      "The unit with this Command Group attached has Momentum (When charging, this unit has an A stat increased by 1). If the unit with this Command Group attached has Momentum by default, it gets +1 to WS.",
  },
  {
    type: "BANNER",
    name: "Banner of the Ancient Forest",
    pointsCost: 10,
    factionName: "Gaeldor",
    effectText:
      "In the army with this banner, Trefloqs must choose their species – Elm or Oak. Oak Trefloq gains Trample (For each successful score in the Weapon Skill Test, roll an additional D6 for hitting. Additional successful scores do not generate the new ones). Elm Trefloq gains Wild Speed (This unit always rolls an additional D6 when moving or charging, regardless of the situation). In addition, the army is allowed to field 1 unit of Old Ones (Oduns) – 19 pts/base. Old Ones possess the same characteristics and abilities as Oduns, but they can also cast a Language of Beasts spell during their activation, following the general rules and conditions.",
  },
  {
    type: "BANNER",
    name: "Banner of the Wolf Brotherhood",
    pointsCost: 20,
    factionName: "Dirandis",
    effectText:
      "The army with this banner fields Wolf Brothers as Basic Units instead of the Elite. Wilhars are fielded as Elite Units instead of the Unique and they have Frenzy (When charging, this unit doubles its Attacks (A) stat).",
  },
  {
    type: "BANNER",
    name: "Banner of the Unbending",
    pointsCost: 12,
    factionName: "Dirandis",
    effectText:
      "The unit with this Command Group attached has Fearless. In addition, if the unit with this Command Group attached has Focused Attack (When charging, this unit gets +1 to WS), it works at all times, not only when charging.",
  },
  {
    type: "BANNER",
    name: "Banner of Conquest",
    pointsCost: 12,
    factionName: "Er'Sael",
    effectText:
      "A friendly unit that is activated as first in the cycle always receives a bonus of +5 cm to move or charge.",
  },
  {
    type: "BANNER",
    name: "Banner of Ugruk-hor",
    pointsCost: 10,
    factionName: "Er'Sael",
    effectText:
      "Units in the army can add a rank of Marauders to the Horde that allowed to deploy them (such a Horde consists of 20 bases). Hordes consisting of exactly 20 bases may have orders issued to them by the General re-rolled.",
  },
  {
    type: "BANNER",
    name: "Banner of the Heralds of Torment",
    pointsCost: 14,
    factionName: "Sorgax",
    effectText:
      "The unit with this Command Group attached has Iron Discipline (Orders issued to this unit can be re-rolled, and each score of 1 means a free order). If the unit with this Command Group attached has Iron Discipline by default, it gets Sneaky (This unit gets +2 attacks for attacking the enemy's flank or rear).",
  },
  {
    type: "BANNER",
    name: "Banner of the Serpent",
    pointsCost: 14,
    factionName: "Sorgax",
    effectText:
      "The army carrying this banner fields Slagors as Basic Units instead of Rare Units. Additionally, empowered by the banner's magic, Slagors enter a battle trance that allows them to re-roll their WS Test when charging.",
  },
  {
    type: "BANNER",
    name: "Banner of the Hotbloods",
    pointsCost: 10,
    factionName: "Arox",
    effectText:
      "The unit with this Command Group attached has Agile (This unit can always re-roll one D6 when moving or charging). If the unit with this Command Group attached has Agile by default, it can always re-roll one D6 when moving and up to two D6 when charging.",
  },
  {
    type: "BANNER",
    name: "Banner of Advance",
    pointsCost: 8,
    factionName: "Arox",
    effectText:
      "Ability range of this banner is 20 cm. All friendly units within this range do not lose charge bonuses when charging at an enemy Horde. In addition, each friendly unit within this range gains a bonus of +D6 cm when regrouping.",
  },
  {
    type: "BANNER",
    name: "Banner of the Great Menagerie",
    pointsCost: 6,
    factionName: "Sheol-morg",
    effectText:
      "If a Command Group with this banner is attached to a friendly unit, it supports the unit with +5 attacks instead of +1.",
  },
  {
    type: "BANNER",
    name: "Banner of Goddess Ehidne",
    pointsCost: 11,
    factionName: "Sheol-morg",
    requirementsText: "Sheol-morg, led by Lord of the Abyss only.",
    effectText:
      "The army has one more prayer per cycle. In addition, the army is allowed to field 1 unit of Priestesses of Enslavement (Basic Unit).",
  },
  {
    type: "BANNER",
    name: "Banner of God Nathel",
    pointsCost: 15,
    factionName: "Sheol-morg",
    effectText:
      "Before the battle, place three D6 dice (in a different colour than the ones you normally use) in your deployment zone. Once per cycle, you can use one of the dice to re-roll one D6 result – obtained by your opponent or yourself. You and your opponent must accept the result of the re-roll (the Nathel's will). In addition, the army is allowed to field 1 unit of the Deceived: you may field 1 Basic Unit or 1 Elite Unit (paying its standard cost per base) from any army other than Sheol-morg, taking into account the standard limits and requirements for Basic and Elite Units in an army. The Marauders rule applies as normal.",
  },
  {
    type: "BANNER",
    name: "Banner of God Duur",
    pointsCost: 8,
    factionName: "Sheol-morg",
    effectText:
      "When the enemy unit is making a Wound Test against the unit with this Command Group attached, it may be dealt Wounds itself. For each 6 the enemy unit obtains in such Wound Test (after any re-rolls), it is dealt 1 Wound. In addition, if the enemy unit has any save, it must re-roll successful saving throws when fighting against the unit with this Command Group attached.",
  },
  {
    type: "BANNER",
    name: "Banner of God Seth",
    pointsCost: 12,
    factionName: "Sheol-morg",
    requirementsText: "Sheol-morg, led by General other than Lord Necromancer only.",
    effectText:
      "Enemy units within 30 cm of a Command Group with this banner must re-roll a successful Cold Blood Test. If a Command Group with this banner is attached to a friendly unit, it supports the unit with +3 attacks instead of +1. In addition, your army is allowed to field 1 unit of Ahsids (Basic Unit).",
  },
  {
    type: "BANNER",
    name: "Banner of Death",
    pointsCost: 9,
    factionName: "Sheol-morg",
    requirementsText: "Sheol-morg, led by Lord Necromancer only.",
    effectText:
      "The range of abilities of the Command Group with this banner is 10 cm. In addition, all enemy units within 20 cm of this Command Group must re-roll successful Panic Tests.",
  },
];

export async function seedUpgrades(db: PrismaClient, upgrades: SeedUpgrade[]) {
  for (const item of upgrades) {
    const existing = await db.upgrade.findFirst({
      where: { name: item.name, type: item.type },
    });

    const data = {
      type: item.type,
      name: item.name,
      pointsCost: item.pointsCost,
      range: item.range ?? null,
      castingValue: item.castingValue ?? null,
      factionName: item.factionName ?? null,
      requirementsText: item.requirementsText ?? null,
      effectText: item.effectText,
    };

    // Update in place (not delete + recreate) so the upgrade's id stays
    // stable and doesn't orphan ArmyUnitUpgrade rows in saved armies.
    if (existing) {
      await db.upgrade.update({ where: { id: existing.id }, data });
    } else {
      await db.upgrade.create({ data });
    }
  }
}
