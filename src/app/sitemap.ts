import type { MetadataRoute } from "next";

import { env } from "~/env";
import { api } from "~/trpc/server";

const siteUrl = env.BETTER_AUTH_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const factions = await api.faction.list();

  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/factions`, changeFrequency: "monthly", priority: 0.8 },
    ...factions.map((faction) => ({
      url: `${siteUrl}/factions/${faction.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
