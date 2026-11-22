"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TBooking } from "@/types";
import { getOwnerBookings } from "@/lib/api/booking-api";
// import { getOwnerBookings } from "@/lib/booking-api";
// import type { Booking } from "@/types";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const countDays = (start: string, end: string) =>
  Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) +
  1;

const statusColor: Record<string, string> = {
  paid: "bg-green-600 text-white",
  pending: "bg-yellow-500 text-white",
  failed: "bg-red-500 text-white",
  confirmed: "bg-blue-600 text-white",
  completed: "bg-green-600 text-white",
  cancelled: "bg-red-500 text-white",
};

export default function OwnerRentalsPage() {
  const [bookings, setBookings] = useState<TBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnerBookings()
      .then(setBookings)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">My Equipment Rentals</h1>
      <p className="mt-1 text-muted-foreground">
        Customers who have rented your equipment.
      </p>

      <div className="mt-6 rounded-xl border bg-card">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No one has rented your equipment yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Rental Duration</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Booking Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>
                      <p className="font-medium">
                        {b.customerName || "Customer"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.customerEmail}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.contact}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="font-medium">{b.equipmentName}</p>
                      <p className="max-w-48 truncate text-xs text-muted-foreground">
                        {b.address}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="whitespace-nowrap text-sm">
                        {formatDate(b.startDate)} - {formatDate(b.endDate)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {countDays(b.startDate, b.endDate)} days
                      </p>
                    </TableCell>

                    <TableCell>{b.quantity}</TableCell>
                    <TableCell className="font-semibold">
                      ${b.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${statusColor[b.paymentStatus] ?? ""}`}
                      >
                        {b.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${statusColor[b.bookingStatus] ?? ""}`}
                      >
                        {b.bookingStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
