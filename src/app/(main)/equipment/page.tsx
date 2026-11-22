import { Suspense } from "react";

import EquipmentBrowser from "./equipment-browser";

// Shown while the browser component waits for the query string during
// prerendering. It mirrors the real layout so the page does not jump.
function EquipmentBrowserFallback() {
  return (
    <>
      <div className="mt-8 h-[9.75rem] animate-pulse rounded-xl bg-muted" />
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

      {/* The filters are read from the URL, so the browser has to sit inside a
          Suspense boundary: the query string is unknown while the shell is
          prerendered. The heading stays outside so it is part of that shell. */}
      <Suspense fallback={<EquipmentBrowserFallback />}>
        <EquipmentBrowser />
      </Suspense>
    </div>
  );
}
