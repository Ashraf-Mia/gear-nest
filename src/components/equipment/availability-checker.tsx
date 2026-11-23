"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Loader2, PackageX, TriangleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getEquipmentAvailability } from "@/lib/api/booking-api";
import type { TEquipmentAvailability } from "@/types";

type TAvailabilityResult = {
  key: string;
  data?: TEquipmentAvailability;
  error?: string;
};

// The details page only knows the total stock. This checker asks the server
// how many units are left after subtracting bookings that overlap the chosen
// dates, so a fully booked item stops looking available.
export default function AvailabilityChecker({
  equipmentId,
}: {
  equipmentId: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Each response is tied to the dates that produced it, so an older request
  // can never overwrite the result for the dates currently shown.
  const [result, setResult] = useState<TAvailabilityResult | null>(null);

  const requestKey = `${startDate}|${endDate}`;
  const areDatesValid = Boolean(
    startDate && endDate && endDate >= startDate,
  );
  const isCurrent = areDatesValid && result?.key === requestKey;

  const availability = isCurrent ? (result?.data ?? null) : null;
  const dateError =
    startDate && endDate && endDate < startDate
      ? "End date must be after the start date."
      : "";
  const error = dateError || (isCurrent ? (result?.error ?? "") : "");
  const isChecking = areDatesValid && !isCurrent && !dateError;

  useEffect(() => {
    if (!startDate || !endDate || endDate < startDate) return;

    let isCancelled = false;

    getEquipmentAvailability(equipmentId, startDate, endDate)
      .then((data) => {
        if (!isCancelled) setResult({ key: requestKey, data });
      })
      .catch((cause) => {
        if (isCancelled) return;

        setResult({
          key: requestKey,
          error:
            cause instanceof Error
              ? cause.message
              : "Could not check availability.",
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [equipmentId, startDate, endDate, requestKey]);

  const isAvailable =
    availability !== null && availability.availableQuantity > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarCheck className="size-4 text-primary" />
          Check availability
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="availability-start">Start Date</Label>
            <Input
              id="availability-start"
              type="date"
              min={today}
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability-end">End Date</Label>
            <Input
              id="availability-end"
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </div>

        <div
          role="status"
          aria-live="polite"
          className="rounded-lg bg-muted px-4 py-3 text-sm"
        >
          {isChecking ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Checking availability...
            </span>
          ) : error ? (
            <span className="flex items-center gap-2 text-destructive">
              <TriangleAlert className="size-4 shrink-0" />
              {error}
            </span>
          ) : availability ? (
            isAvailable ? (
              <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CalendarCheck className="size-4 shrink-0" />
                <span>
                  <strong>{availability.availableQuantity}</strong> of{" "}
                  {availability.totalQuantity} units available for these dates
                  {availability.bookedQuantity > 0
                    ? ` (${availability.bookedQuantity} already booked)`
                    : ""}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2 text-destructive">
                <PackageX className="size-4 shrink-0" />
                Fully booked for these dates. Try a different date range.
              </span>
            )
          ) : (
            <span className="text-muted-foreground">
              Pick a start and end date to check availability.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
