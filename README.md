# argatoria-builder

Army builder for Argatoria — browse factions and units, then build and save army lists for the tabletop.

Built with the [T3 Stack](https://create.t3.gg/): Next.js (App Router), tRPC, Prisma/SQLite, better-auth, Tailwind CSS.

## Getting started

```bash
npm install
npm run db:push    # sync the Prisma schema to your local SQLite db
npm run db:seed    # load faction/unit data
npm run dev
```

Copy `.env.example` to `.env` and fill in `BETTER_AUTH_SECRET` (and, optionally, GitHub OAuth credentials — email/password sign-in works without them).

## Learn More

To learn more about the T3 Stack, take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available)
