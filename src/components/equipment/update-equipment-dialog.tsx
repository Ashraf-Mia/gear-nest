"use client";

import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateEquipment } from "@/lib/api/equipment";
import { EQUIPMENT_CATEGORIES } from "@/lib/equipment-options";
import type { TEquipment } from "@/types";

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type UpdateEquipmentDialogProps = {
  equipment: TEquipment;
  onUpdated?: (equipment: TEquipment) => void;
  label?: string;
};

export default function UpdateEquipmentDialog({
  equipment,
  onUpdated,
  label = "Update",
}: UpdateEquipmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const values = {
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? ""),
      rentalPrice: Number(formData.get("rentalPrice")),
      availableQuantity: Number(formData.get("availableQuantity")),
    };

    onUpdated?.({ ...equipment, ...values });
    setIsSaving(true);

    try {
      const updated = await updateEquipment(equipment._id, values);

      onUpdated?.(updated);
      setOpen(false);
      toast.success("Equipment updated");
    } catch (cause) {
      onUpdated?.(equipment);

      toast.error("Update failed", {
        description:
          cause instanceof Error ? cause.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Pencil className="size-3.5" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Equipment</DialogTitle>
            <DialogDescription>
              Change the details below and save your changes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`update-name-${equipment._id}`}>
                Equipment Name
              </Label>
              <Input
                id={`update-name-${equipment._id}`}
                name="name"
                defaultValue={equipment.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`update-category-${equipment._id}`}>
                Category
              </Label>
              <select
                id={`update-category-${equipment._id}`}
                name="category"
                defaultValue={equipment.category}
                className={selectClass}
                required
              >
                {EQUIPMENT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`update-price-${equipment._id}`}>
                  Rental Price
                </Label>
                <Input
                  id={`update-price-${equipment._id}`}
                  name="rentalPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  defaultValue={equipment.rentalPrice}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`update-quantity-${equipment._id}`}>
                  Available Quantity
                </Label>
                <Input
                  id={`update-quantity-${equipment._id}`}
                  name="availableQuantity"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue={equipment.availableQuantity}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
