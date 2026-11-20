import { Suspense } from "react";

import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* The navbar reads the current URL, so it needs a Suspense boundary
          when a dynamic route such as /equipment/[id] is prerendered. */}
      <Suspense
        fallback={
          <header className="h-16 border-b border-white/10 bg-navy-dark" />
        }
      >
        <Navbar />
      </Suspense>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
