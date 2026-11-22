import { Suspense } from "react";

import EquipmentDetailsClient from "./equipment-details-client";

type EquipmentDetailsPageProps = {
  params: Promise<{ id: string }>;
};

async function EquipmentDetailsLoader({ params }: EquipmentDetailsPageProps) {
  const { id } = await params;

  return <EquipmentDetailsClient id={id} />;
}

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
