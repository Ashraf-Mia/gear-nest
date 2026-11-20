import { Suspense } from "react";

import EquipmentDetailsClient from "./equipment-details-client";

type EquipmentDetailsPageProps = {
  params: Promise<{ id: string }>;
};

// The params promise is runtime data, so it is awaited inside a Suspense
// boundary. This keeps the rest of the page able to prerender.
async function EquipmentDetailsLoader({ params }: EquipmentDetailsPageProps) {
  const { id } = await params;

  return <EquipmentDetailsClient id={id} />;
}

// One details page for everybody. The client component below decides which
// buttons to show based on the logged-in user's role.
export default function EquipmentDetailsPage({
  params,
}: EquipmentDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-muted-foreground">
          Loading equipment...
        </div>
      }
    >
      <EquipmentDetailsLoader params={params} />
    </Suspense>
  );
}
