import { redirect } from "next/navigation";

import { ArmyBuilder } from "~/app/_components/army-builder";
import { getSession } from "~/server/better-auth/server";

export default async function ArmyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect("/armies");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <ArmyBuilder armyId={id} />
    </main>
  );
}
