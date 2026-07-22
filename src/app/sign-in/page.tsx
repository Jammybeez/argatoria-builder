import { SignInForm } from "~/app/_components/sign-in-form";
import { devLoginEnabled } from "~/server/better-auth/config";
import { env } from "~/env";

export default function SignInPage() {
  const enableGoogle = Boolean(
    env.BETTER_AUTH_GOOGLE_CLIENT_ID && env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
  );
  const enableDiscord = Boolean(
    env.BETTER_AUTH_DISCORD_CLIENT_ID && env.BETTER_AUTH_DISCORD_CLIENT_SECRET,
  );

  return (
    <main className="mx-auto flex max-w-3xl justify-center px-4 py-16">
      <SignInForm
        enableGoogle={enableGoogle}
        enableDiscord={enableDiscord}
        devLoginEnabled={devLoginEnabled}
      />
    </main>
  );
}
