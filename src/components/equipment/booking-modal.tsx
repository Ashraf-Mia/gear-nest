"use client";

import { useState } from "react";
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
// import { calculateTotal, createCheckoutSession } from "@/lib/booking-api";
import { TEquipment } from "@/types";
import { calculateTotal, createCheckoutSession } from "@/lib/api/booking-api";
// import type { Equipment } from "@/types";

type Props = {
  item: TEquipment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function BookingModal({ item, open, onOpenChange }: Props) {
  // এই তিনটা ঘরের মান লাগবে লাইভ দাম দেখানোর জন্য
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  // ফর্মে দেখানো মোট দাম
  const total = calculateTotal(
    item.price,
    item.rentalType,
    startDate,
    endDate,
    Number(quantity),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // বাকি তিন ঘরের ডেটা FormData থেকে
    const formData = new FormData(e.currentTarget);
    const extra = Object.fromEntries(formData.entries()) as {
      contact: string;
      address: string;
      notes: string;
    };

    const qty = Number(quantity);

    if (endDate < startDate) {
      return toast.error("End date must be after start date");
    }
    if (qty < 1 || qty > item.quantity) {
      return toast.error(`Quantity must be between 1 and ${item.quantity}`);
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

      // Stripe-এর পেমেন্ট পেজে পাঠানো
      window.location.href = url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book {item.name}</DialogTitle>
          <DialogDescription>
            ${item.price} / {item.rentalType}. Fill in the details to continue
            to payment.
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Required Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={item.quantity}
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

          {/* মোট দাম */}
          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-xl font-bold text-navy dark:text-white">
              ${total}
            </span>
          </div>

          <Button
            type="submit"
            className="h-11 w-full"
            disabled={loading || total === 0}
          >
            {loading ? "Redirecting to payment..." : "Confirm & Pay"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
