"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Eye,
  Heart,
  Loader2,
  PackageOpen,
  RefreshCw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

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
import { getFavorites, removeFavorite } from "@/lib/api/favorites";
import { authClient } from "@/lib/auth-client";
import { formatPrice, getRentalPeriod } from "@/lib/format";
import type { TEquipment } from "@/types";

export default function CustomerFavoritesPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const customer = session?.user;
  const isCustomer = customer?.role === "customer";

  const [favorites, setFavorites] = useState<TEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [removingId, setRemovingId] = useState("");

  useEffect(() => {
    if (isSessionPending) return;

    if (!isCustomer) {
      return;
    }

    let isCancelled = false;

    const loadFavorites = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getFavorites();

        if (!isCancelled) {
          setFavorites(data);
        }
      } catch (cause) {
        if (!isCancelled) {
          setFavorites([]);
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load your favorites.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      isCancelled = true;
    };
  }, [isCustomer, isSessionPending, reloadKey]);

  const handleRemove = async (equipment: TEquipment) => {
    setRemovingId(equipment._id);

    try {
      await removeFavorite(equipment._id);

      setFavorites((items) =>
        items.filter((item) => item._id !== equipment._id),
      );

      toast.success("Removed from favorites", {
        description: `${equipment.name} is no longer in your favorites.`,
      });
    } catch (cause) {
      toast.error("Could not remove favorite", {
        description:
          cause instanceof Error ? cause.message : "Please try again.",
      });
    } finally {
      setRemovingId("");
    }
  };

  if (isSessionPending) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading your account...
      </div>
    );
  }

  if (!customer) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Please log in</CardTitle>
          <CardDescription>
            You need to be signed in to view your favorites.
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

  if (!isCustomer) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Customer page</CardTitle>
          <CardDescription>
            Favorites are only available for customer accounts.
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

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">My Favorites</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Equipment you saved for later. Prices and availability may change.
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Loading your favorites...
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlert className="size-5" />
            </span>
            <div>
              <p className="font-medium">Could not load your favorites</p>
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
      ) : favorites.length === 0 ? (
        <Empty className="border border-dashed bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Heart />
            </EmptyMedia>
            <EmptyTitle>No favorites yet</EmptyTitle>
            <EmptyDescription>
              Browse the catalog and tap the heart on an equipment details page
              to save it here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/equipment"
              className={buttonVariants({ className: "h-10" })}
            >
              Browse Equipment
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Saved Equipment</CardTitle>
            <CardDescription>
              {favorites.length} {favorites.length === 1 ? "item" : "items"}{" "}
              saved.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Rental Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {favorites.map((item) => {
                  const isAvailable = item.availableQuantity > 0;

                  return (
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
                              {item.category || "Uncategorized"}
                            </p>
                          </div>
                        </div>
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

                      <TableCell className="text-muted-foreground">
                        {item.location || "—"}
                      </TableCell>

                      <TableCell>
                        <span
                          className={
                            isAvailable
                              ? "text-green-600 dark:text-green-400"
                              : "text-destructive"
                          }
                        >
                          {isAvailable
                            ? `${item.availableQuantity} available`
                            : "Unavailable"}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
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

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemove(item)}
                            disabled={removingId === item._id}
                          >
                            {removingId === item._id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
