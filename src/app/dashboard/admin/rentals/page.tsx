"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  PackageOpen,
  RefreshCw,
  Search,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllBookings } from "@/lib/api/admin";
import { formatDate, formatPrice, getDurationDays } from "@/lib/format";
import type { TBooking } from "@/types";

import AdminPageGuard from "../_components/admin-page-guard";

// The API can report more states than the type lists, so unknown values still
// get a readable badge instead of an empty one.
const paymentBadge: Record<string, string> = {
  paid: "bg-green-600 text-white",
  unpaid: "bg-amber-500 text-white",
  pending: "bg-amber-500 text-white",
  refunded: "bg-slate-500 text-white",
  failed: "bg-red-500 text-white",
};

const bookingBadge: Record<string, string> = {
  pending: "bg-amber-500 text-white",
  confirmed: "bg-blue-600 text-white",
  active: "bg-emerald-600 text-white",
  completed: "bg-green-700 text-white",
  cancelled: "bg-red-500 text-white",
  rejected: "bg-red-500 text-white",
};

export default function AdminRentalsPage() {
  return (
    <AdminPageGuard>
      <AdminRentalsTable />
    </AdminPageGuard>
  );
}

function AdminRentalsTable() {
  const [bookings, setBookings] = useState<TBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const loadBookings = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getAllBookings();

        if (!isCancelled) {
          setBookings(data);
        }
      } catch (cause) {
        if (!isCancelled) {
          setBookings([]);
          setError(
            cause instanceof Error ? cause.message : "Could not load rentals.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  const term = search.trim().toLowerCase();
  const visibleBookings = term
    ? bookings.filter((booking) =>
        [
          booking.equipmentName,
          booking.customerName,
          booking.customerEmail,
          booking.ownerName,
          booking.ownerEmail,
        ].some((value) => (value ?? "").toLowerCase().includes(term)),
      )
    : bookings;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">All Rentals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every booking made on the platform, newest first.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search equipment, customer or owner..."
            className="h-10 pl-9"
            aria-label="Search rentals"
          />
        </div>

        {!isLoading && !error && (
          <p className="text-sm text-muted-foreground">
            {visibleBookings.length} of {bookings.length}{" "}
            {bookings.length === 1 ? "rental" : "rentals"}
          </p>
        )}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-3 py-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlert className="size-5" />
            </span>
            <div>
              <p className="font-medium">Could not load rentals</p>
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
      ) : bookings.length === 0 ? (
        <Empty className="border border-dashed bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarDays />
            </EmptyMedia>
            <EmptyTitle>No rentals yet</EmptyTitle>
            <EmptyDescription>
              A booking shows up here after a customer completes payment.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : visibleBookings.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No rental matches &ldquo;{search}&rdquo;.
        </p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
            <CardDescription>
              Customer, owner, equipment and payment details for each rental.
            </CardDescription>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Rental Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Booking</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {visibleBookings.map((booking) => {
                  const days = getDurationDays(
                    booking.startDate,
                    booking.endDate,
                  );

                  return (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            {booking.equipmentImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={booking.equipmentImage}
                                alt=""
                                loading="lazy"
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-muted-foreground">
                                <PackageOpen className="size-4" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-48 truncate font-medium">
                              {booking.equipmentName || "Unknown equipment"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty {booking.quantity}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="font-medium">
                          {booking.customerName || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.customerEmail}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="font-medium">
                          {booking.ownerName || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.ownerEmail}
                        </p>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        <p>
                          {formatDate(booking.startDate)} &rarr;{" "}
                          {formatDate(booking.endDate)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {days > 0
                            ? `${days} ${days === 1 ? "day" : "days"}`
                            : "—"}
                        </p>
                      </TableCell>

                      <TableCell className="whitespace-nowrap font-medium">
                        {formatPrice(booking.totalAmount)}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={`capitalize ${
                            paymentBadge[booking.paymentStatus] ?? ""
                          }`}
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={`capitalize ${
                            bookingBadge[booking.bookingStatus] ?? ""
                          }`}
                        >
                          {booking.bookingStatus}
                        </Badge>
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
