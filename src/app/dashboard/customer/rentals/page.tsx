"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
import { getMyBookings } from "@/lib/api/booking-api";
// import { getMyBookings } from "@/lib/booking-api";
// import type { Booking } from "@/types";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusColor: Record<string, string> = {
  paid: "bg-green-600 text-white",
  pending: "bg-yellow-500 text-white",
  failed: "bg-red-500 text-white",
  confirmed: "bg-blue-600 text-white",
  completed: "bg-green-600 text-white",
  cancelled: "bg-red-500 text-white",
};

export default function MyRentalsPage() {
  const [bookings, setBookings] = useState<TBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // পেজ খুললে একবার booking আনবে
  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">My Rentals</h1>
      <p className="mt-1 text-muted-foreground">
        All the equipment you have booked.
      </p>

      <div className="mt-6 rounded-xl border bg-card">
        {loading ? (
          // লোডিংয়ের সময় ফাঁকা সারি
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          // কোনো booking না থাকলে
          <div className="py-16 text-center">
            <p className="text-muted-foreground">You have no rentals yet.</p>
            <Link
              href="/equipment"
              className={buttonVariants({ className: "mt-4" })}
            >
              Browse Equipment
            </Link>
          </div>
        ) : (
          // মোবাইলে টেবিল ডানে-বামে স্ক্রল হবে
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Booking Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell className="font-medium">
                      {b.equipmentName}
                    </TableCell>
                    <TableCell>{formatDate(b.startDate)}</TableCell>
                    <TableCell>{formatDate(b.endDate)}</TableCell>
                    <TableCell>{formatDate(b.createdAt)}</TableCell>
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
