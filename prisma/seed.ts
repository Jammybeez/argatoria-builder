import { PrismaClient } from "../generated/prisma";
import { factions, seedFaction } from "./seed-factions";
import {
  artefacts,
  banners,
  magicItems,
  seedUpgrades,
  spells,
} from "./seed-upgrades";

const db = new PrismaClient();

async function main() {
  for (const faction of factions) {
    await seedFaction(db, faction);
  }

  await seedUpgrades(db, magicItems);
  console.log(`Seeded ${magicItems.length} magic items.`);

  await seedUpgrades(db, artefacts);
  console.log(`Seeded ${artefacts.length} artefacts.`);

  await seedUpgrades(db, spells);
  console.log(`Seeded ${spells.length} spells.`);

  await seedUpgrades(db, banners);
  console.log(`Seeded ${banners.length} banners.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
