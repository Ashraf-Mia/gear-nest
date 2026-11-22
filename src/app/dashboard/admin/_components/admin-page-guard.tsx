"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

// The API already answers non-admins with 403. This keeps the page itself from
// looking broken while that request fails, and stops the request firing at all
// for the wrong role.
export default function AdminPageGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Checking your account...
      </div>
    );
  }

  if (session?.user.role !== "admin") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Admins only</CardTitle>
          <CardDescription>
            This page is only available to administrator accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline" })}
          >
            Go to Dashboard
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
