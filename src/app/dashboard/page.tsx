"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { menus, Role } from "@/lib/menus";
// import { menus, Role } from "@/lib/menus";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return; // লোড শেষ না হওয়া পর্যন্ত কিছু করবো না (রিলোডে লগইনে পাঠানো আটকায়)

    if (!session) {
      router.replace("/login");
      return;
    }

    const role = ((session.user as { role?: string }).role ??
      "customer") as Role;
    router.replace((menus[role] ?? menus.equipment)[0].href);
  }, [session, isPending, router]);

  return <p className="text-muted-foreground">Loading dashboard...</p>;
}
