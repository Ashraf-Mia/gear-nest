"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Eye,
  Loader2,
  PackageOpen,
  PackagePlus,
  Plus,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

import DeleteEquipmentDialog from "@/components/equipment/delete-equipment-dialog";
import EquipmentStatusBadge from "@/components/equipment/equipment-status-badge";
import UpdateEquipmentDialog from "@/components/equipment/update-equipment-dialog";
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
import { formatPrice, getRentalPeriod } from "@/lib/format";
import type { TEquipment } from "@/types";

export default function OwnerMyEquipmentPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
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
        // One request for the owner's list. The token is cached, so this is
        // not fetched again on every action.
        const data = await getOwnerEquipment();

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

  // Put the updated item into the list directly. No full re-fetch.
  const handleUpdated = (updated: TEquipment) => {
    setEquipment((items) =>
      items.map((item) => (item._id === updated._id ? updated : item)),
    );
  };

  // Remove the deleted item from the list directly. No full re-fetch.
  const handleDeleted = (id: string) => {
    setEquipment((items) => items.filter((item) => item._id !== id));
  };

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
                  <TableHead>Equipment Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rental Price</TableHead>
                  <TableHead className="text-center">
                    Available Quantity
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                        / {getRentalPeriod(item.rentalType)}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      {item.availableQuantity}
                    </TableCell>

                    <TableCell>
                      <EquipmentStatusBadge status={item.status} />
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {/* View uses the one shared details page. */}
                        <Link
                          href={`/equipment/${item._id}`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          <Eye className="size-3.5" />
                          View
                        </Link>

                        <UpdateEquipmentDialog
                          equipment={item}
                          onUpdated={handleUpdated}
                        />

                        <DeleteEquipmentDialog
                          equipment={item}
                          onDeleted={handleDeleted}
                        />
                      </div>
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
