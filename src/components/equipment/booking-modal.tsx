"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateTotal,
  createCheckoutSession,
  getEquipmentAvailability,
} from "@/lib/api/booking-api";
import type { TEquipment, TEquipmentAvailability } from "@/types";

type Props = {
  item: TEquipment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TAvailabilityResult = {
  key: string;
  data?: TEquipmentAvailability;
  error?: string;
};

export default function BookingModal({ item, open, onOpenChange }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);

  // Total stock is not enough: bookings for the same dates may already have
  // taken some units, so the server returns the real remaining quantity.
  const [availabilityResult, setAvailabilityResult] =
    useState<TAvailabilityResult | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const total = calculateTotal(
    item.rentalPrice,
    item.rentalType,
    startDate,
    endDate,
    Number(quantity),
  );

  const requestKey = `${item._id}|${startDate}|${endDate}`;
  const areDatesValid = Boolean(
    open && startDate && endDate && endDate >= startDate,
  );
  const isCurrent = areDatesValid && availabilityResult?.key === requestKey;

  const availability = isCurrent ? (availabilityResult?.data ?? null) : null;
  const availabilityError = isCurrent
    ? (availabilityResult?.error ?? "")
    : "";
  const isCheckingAvailability = areDatesValid && !isCurrent;

  useEffect(() => {
    if (!open || !startDate || !endDate || endDate < startDate) return;

    let isCancelled = false;

    getEquipmentAvailability(item._id, startDate, endDate)
      .then((data) => {
        if (!isCancelled) setAvailabilityResult({ key: requestKey, data });
      })
      .catch((cause) => {
        if (isCancelled) return;

        setAvailabilityResult({
          key: requestKey,
          error:
            cause instanceof Error
              ? cause.message
              : "Could not check availability for these dates.",
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [open, item._id, startDate, endDate, requestKey]);

  const maxQuantity = availability
    ? availability.availableQuantity
    : item.availableQuantity;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const extra = Object.fromEntries(formData.entries()) as {
      contact: string;
      address: string;
      notes: string;
    };

    const qty = Number(quantity);

    if (!startDate || !endDate) {
      return toast.error("Please select the rental dates");
    }

    if (endDate < startDate) {
      return toast.error("End date must be after start date");
    }

    if (isCheckingAvailability) {
      return toast.info("Checking availability, please wait");
    }

    if (!availability) {
      return toast.error(availabilityError || "Could not check availability");
    }

    if (qty < 1 || qty > availability.availableQuantity) {
      return toast.error(
        availability.availableQuantity < 1
          ? "Fully booked for these dates. Please choose other dates."
          : `Only ${availability.availableQuantity} unit(s) available for these dates`,
      );
    }

    if (!/^[0-9+\-\s]{7,15}$/.test(extra.contact)) {
      return toast.error("Enter a valid contact number");
    }

    try {
      setLoading(true);

      const url = await createCheckoutSession({
        equipmentId: item._id,
        startDate,
        endDate,
        quantity: qty,
        contact: extra.contact,
        address: extra.address,
        notes: extra.notes,
      });

      window.location.href = url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
      setLoading(false);
    }
  };

  const isFullyBooked = availability !== null && availability.availableQuantity < 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book {item.name}</DialogTitle>
          <DialogDescription>
            ${item.rentalPrice} / {item.rentalType}. Fill in the details to
            continue to payment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {startDate && endDate && endDate >= startDate && (
            <p
              role="status"
              aria-live="polite"
              className={
                isFullyBooked || availabilityError
                  ? "text-sm text-destructive"
                  : "text-sm text-muted-foreground"
              }
            >
              {isCheckingAvailability
                ? "Checking availability for these dates..."
                : availabilityError
                  ? availabilityError
                  : availability
                    ? isFullyBooked
                      ? "Fully booked for these dates. Please choose other dates."
                      : `${availability.availableQuantity} of ${availability.totalQuantity} units available for these dates.`
                    : ""}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Required Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={Math.max(maxQuantity, 1)}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                placeholder="01XXXXXXXXX"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="House, road, area, city"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Any special instructions"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-xl font-bold text-navy dark:text-white">
              ${total}
            </span>
          </div>

          <Button
            type="submit"
            className="h-11 w-full"
            disabled={
              loading ||
              total === 0 ||
              isCheckingAvailability ||
              !availability ||
              isFullyBooked
            }
          >
            {loading ? "Redirecting to payment..." : "Confirm & Pay"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
