import type { MetadataRoute } from "next";

import { env } from "~/env";

const siteUrl = env.BETTER_AUTH_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/factions"],
      // Army pages are private (redirect without a session) and the
      // sign-in page has no content worth indexing.
      disallow: ["/armies", "/sign-in"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
