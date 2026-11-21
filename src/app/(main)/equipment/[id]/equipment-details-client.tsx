"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import DeleteEquipmentDialog from "@/components/equipment/delete-equipment-dialog";
import EquipmentDetails from "@/components/equipment/equipment-details";
import UpdateEquipmentDialog from "@/components/equipment/update-equipment-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEquipmentById, updateEquipmentStatus } from "@/lib/api/equipment";
import { checkFavorite, toggleFavorite } from "@/lib/api/favorites";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import type { TEquipment, TEquipmentStatus } from "@/types";
import BookingModal from "@/components/equipment/booking-modal";

export default function EquipmentDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [equipment, setEquipment] = useState<TEquipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Favorite state is kept separate from the equipment so the heart button can
  // update instantly without reloading the whole page. The equipment id is
  // stored with the value so a stale result from a previous item cannot make
  // the new item look favorited.
  const [favorite, setFavorite] = useState<{
    equipmentId: string;
    favorited: boolean;
  } | null>(null);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // We only need a token when somebody is logged in.
  const isSignedIn = Boolean(session?.user);
  const isCustomer = session?.user?.role === "customer";

  // Derived values let the favorite-check effect depend on stable primitives.
  const equipmentId = equipment?._id;
  const equipmentStatus = equipment?.status;
  const isFavorite =
    favorite !== null &&
    favorite.equipmentId === equipmentId &&
    favorite.favorited;

  useEffect(() => {
    if (isSessionPending) return;

    let isCancelled = false;

    const loadEquipment = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Logged-in users also send their token. The backend needs it to show
        // pending/rejected equipment to its owner or to an admin.
        const token = isSignedIn ? await getTokenFromClient() : undefined;
        const data = await getEquipmentById(id, token);

        if (!isCancelled) {
          setEquipment(data);
        }
      } catch (cause) {
        if (!isCancelled) {
          setEquipment(null);
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load this equipment.",
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
  }, [id, isSessionPending, isSignedIn, reloadKey]);

  // Keep the heart button accurate after a reload. Only customers can
  // favorite approved equipment.
  useEffect(() => {
    if (
      isSessionPending ||
      isTogglingFavorite ||
      !isCustomer ||
      !equipmentId ||
      equipmentStatus !== "approved"
    ) {
      return;
    }

    let isCancelled = false;

    checkFavorite(equipmentId)
      .then((favorited) => {
        if (!isCancelled) setFavorite({ equipmentId, favorited });
      })
      .catch(() => {
        // A failed check must not break the page or overwrite a value the
        // customer just set. The toggle call surfaces any real error.
      });

    return () => {
      isCancelled = true;
    };
  }, [
    equipmentId,
    equipmentStatus,
    isCustomer,
    isSessionPending,
    isTogglingFavorite,
  ]);

  // Admin only: approve or reject the item.
  const handleStatusChange = async (status: TEquipmentStatus) => {
    if (!equipment) return;

    setIsUpdatingStatus(true);

    try {
      const updated = await updateEquipmentStatus(equipment._id, status);

      setEquipment(updated);
      toast.success(`Equipment ${status}`);
    } catch (cause) {
      toast.error("Status update failed", {
        description:
          cause instanceof Error ? cause.message : "Please try again.",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleBook = () => {
    // The booking and payment flow will be added in a later step.
    toast.info("Booking is coming soon.");
  };

  // Toggle immediately for instant feedback, then sync with the server. If the
  // request fails, put the previous value back and tell the customer.
  const handleToggleFavorite = async () => {
    if (!equipment || isTogglingFavorite) return;

    const previous = isFavorite;
    const next = !previous;

    setFavorite({ equipmentId: equipment._id, favorited: next });
    setIsTogglingFavorite(true);

    try {
      const favorited = await toggleFavorite(equipment._id);
      setFavorite({ equipmentId: equipment._id, favorited });
      toast.success(
        favorited ? "Added to favorites" : "Removed from favorites",
      );
    } catch (cause) {
      setFavorite({ equipmentId: equipment._id, favorited: previous });
      toast.error("Could not update favorites", {
        description:
          cause instanceof Error ? cause.message : "Please try again.",
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 px-4 py-20 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading equipment...
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TriangleAlert className="size-5 text-destructive" />
              Could not load this equipment
            </CardTitle>
            <CardDescription>
              {error || "The equipment could not be found."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link
              href="/equipment"
              className={buttonVariants({ variant: "outline" })}
            >
              <ArrowLeft className="size-4" />
              Back to All Equipment
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner =
    Boolean(session?.user) && session?.user?.id === equipment.ownerId;
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <Link
        href="/equipment"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to All Equipment
      </Link>

      <EquipmentDetails equipment={equipment} />

      {equipment.status !== "approved" && (isOwner || isAdmin) && (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This item is <strong>{equipment.status}</strong> and is only
              visible to its owner and admins.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Buttons change based on the role of the logged-in user. */}
      <Card>
        <CardContent className="flex flex-wrap gap-2">
          {isOwner && (
            <>
              <UpdateEquipmentDialog
                equipment={equipment}
                onUpdated={setEquipment}
                label="Edit"
              />
              <DeleteEquipmentDialog
                equipment={equipment}
                onDeleted={() => router.push("/dashboard/owner/my-equipment")}
              />
            </>
          )}

          {isAdmin && (
            <>
              <Button
                type="button"
                onClick={() => handleStatusChange("approved")}
                disabled={isUpdatingStatus || equipment.status === "approved"}
              >
                Approve
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleStatusChange("rejected")}
                disabled={isUpdatingStatus || equipment.status === "rejected"}
              >
                Reject
              </Button>
            </>
          )}

          {!isOwner && !isAdmin && equipment.status === "approved" && (
            <>
              {session?.user ? (
                isCustomer ? (
                  <>
                    <Button
                      type="button"
                      variant={isFavorite ? "secondary" : "outline"}
                      onClick={handleToggleFavorite}
                      disabled={isTogglingFavorite}
                    >
                      {isTogglingFavorite ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Heart
                          className={
                            isFavorite ? "size-4 fill-current" : "size-4"
                          }
                        />
                      )}
                      {isFavorite
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setBookingOpen(true)}
                      disabled={equipment.quantity < 1}
                    >
                      Book Now
                    </Button>
                  </>
                ) : null
              ) : (
                <Link href="/login" className={buttonVariants()}>
                  Login to Book
                </Link>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <BookingModal
        item={equipment}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
