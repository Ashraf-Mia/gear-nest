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
import AddEquipmentForm from "./add-equipment-form";

export default function OwnerAddEquipmentPage() {
  const { data: session, isPending } = authClient.useSession();
  const owner = session?.user;

  if (isPending) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading your account...
      </div>
    );
  }

  if (!owner) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Please log in</CardTitle>
          <CardDescription>
            You need to be signed in to add equipment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className={buttonVariants({ className: "h-11" })}>
            Go to Login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">Add Equipment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Owners can add new equipment for rent.
        </p>
      </div>

      <AddEquipmentForm
        owner={{
          id: owner.id,
          name: owner.name,
          email: owner.email,
        }}
      />
    </div>
  );
}
