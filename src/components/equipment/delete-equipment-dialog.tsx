"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
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
import { deleteEquipment } from "@/lib/api/equipment";
import type { TEquipment } from "@/types";

type DeleteEquipmentDialogProps = {
  equipment: TEquipment;
  onDeleted?: (id: string) => void;
  label?: string;
};

// A reusable "Delete" button with a confirmation dialog.
// Because each row has its own component, only the clicked row shows loading.
export default function DeleteEquipmentDialog({
  equipment,
  onDeleted,
  label = "Delete",
}: DeleteEquipmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Show the loading state on this button straight away.
    setIsDeleting(true);

    try {
      await deleteEquipment(equipment._id);

      // Remove the row from the table immediately (no full page reload).
      onDeleted?.(equipment._id);

      setOpen(false);
      toast.success("Equipment deleted");
    } catch (cause) {
      toast.error("Delete failed", {
        description:
          cause instanceof Error ? cause.message : "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-3.5" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Equipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{equipment.name}&quot;? This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
