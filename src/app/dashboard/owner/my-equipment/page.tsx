"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Loader2,
  PackageOpen,
  PackagePlus,
  Plus,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOwnerEquipment } from "@/lib/api/equipment";
import { authClient } from "@/lib/auth-client";
import type { TEquipment, TEquipmentStatus } from "@/types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const RENTAL_PERIODS: Record<string, string> = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
};

const statusStyles: Record<TEquipmentStatus, string> = {
  pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  approved:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "border-destructive/30 bg-destructive/10 text-destructive",
};

function formatPrice(price: number) {
  const amount = Number(price);

  return Number.isFinite(amount) ? currencyFormatter.format(amount) : "—";
}

export default function OwnerMyEquipmentPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const owner = session?.user;

  const [equipment, setEquipment] = useState<TEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!owner?.id) return;

    let isCancelled = false;

    const loadEquipment = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getOwnerEquipment(owner.id);

        if (!isCancelled) {
          setEquipment(data);
        }
      } catch (cause) {
        if (!isCancelled) {
          setEquipment([]);
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load your equipment.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadEquipment();

    return () => {
      isCancelled = true;
    };
  }, [owner?.id, reloadKey]);

  if (isSessionPending) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
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
            You need to be signed in to view your equipment.
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
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl">My Equipment</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the equipment you have listed for rent.
          </p>
        </div>

        <Link
          href="/dashboard/owner/add-equipment"
          className={buttonVariants({ className: "h-10" })}
        >
          <Plus className="size-4" />
          Add Equipment
        </Link>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Loading your equipment...
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlert className="size-5" />
            </span>
            <div>
              <p className="font-medium">Could not load your equipment</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              <RefreshCw className="size-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : equipment.length === 0 ? (
        <Empty className="border border-dashed bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackagePlus />
            </EmptyMedia>
            <EmptyTitle>No equipment listed yet</EmptyTitle>
            <EmptyDescription>
              Add your first item so renters can find it. New listings stay
              pending until an admin approves them.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/dashboard/owner/add-equipment"
              className={buttonVariants({ className: "h-10" })}
            >
              <Plus className="size-4" />
              Add Equipment
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Listed Equipment</CardTitle>
            <CardDescription>
              {equipment.length} {equipment.length === 1 ? "item" : "items"}{" "}
              listed. Pending items are waiting for admin approval.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rental Price</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {equipment.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground">
                              <PackageOpen className="size-5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium">{item.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {[item.brand, item.model]
                              .filter(Boolean)
                              .join(" · ") || "—"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {item.category || "—"}
                    </TableCell>

                    <TableCell>
                      <span className="font-medium">
                        {formatPrice(item.rentalPrice)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        /{" "}
                        {RENTAL_PERIODS[item.rentalType] ??
                          item.rentalType?.toLowerCase()}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      {item.availableQuantity}
                    </TableCell>

                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          statusStyles[item.status] ?? statusStyles.pending
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
