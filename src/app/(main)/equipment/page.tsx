import { Suspense } from "react";

import EquipmentBrowser from "./equipment-browser";

function EquipmentBrowserFallback() {
  return (
    <>
      <div className="mt-8 h-39 animate-pulse rounded-xl bg-muted" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </>
  );
}

export default function AllEquipmentPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">All Equipment</h1>
      <p className="mt-2 text-muted-foreground">
        Find the right equipment from verified owners.
      </p>

      <Suspense fallback={<EquipmentBrowserFallback />}>
        <EquipmentBrowser />
      </Suspense>
    </div>
  );
}
