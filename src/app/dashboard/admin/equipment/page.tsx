"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Eye, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TEquipment, TEquipmentStatus } from "@/types";
import {
  getAllEquipmentForAdmin,
  updateEquipmentStatus,
} from "@/lib/api/admin";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, getRentalPeriod } from "@/lib/format";
import DeleteEquipmentDialog from "@/components/equipment/delete-equipment-dialog";
import UpdateEquipmentDialog from "@/components/equipment/update-equipment-dialog";
// import {
//   getAllEquipmentForAdmin,
//   updateEquipmentStatus,
// } from "@/lib/equipment-api";
// import type { Equipment, EquipmentStatus } from "@/types";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500 text-white",
  approved: "bg-green-600 text-white",
  rejected: "bg-red-500 text-white",
};

export default function AdminEquipmentPage() {
  const [items, setItems] = useState<TEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    getAllEquipmentForAdmin()
      .then(setItems)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id: string, status: TEquipmentStatus) => {
    try {
      setUpdatingId(id);
      const updated = await updateEquipmentStatus(id, status);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? updated : item)),
      );
      toast.success(`Equipment ${status}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setUpdatingId("");
    }
  };

  // The update dialog applies an optimistic copy first, then the saved record.
  const handleUpdated = (updated: TEquipment) => {
    setItems((prev) =>
      prev.map((item) => (item._id === updated._id ? updated : item)),
    );
  };

  const handleDeleted = (id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">All Equipment</h1>
      <p className="mt-1 text-muted-foreground">
        Approve equipment to show it on the website.
      </p>

      <div className="mt-6 rounded-xl border bg-card">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No equipment found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.ownerName}</TableCell>
                    <TableCell>
                      {formatPrice(item.rentalPrice)} /{" "}
                      {getRentalPeriod(item.rentalType)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${statusColor[item.status] ?? ""}`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/equipment/${item._id}`}
                          className={buttonVariants({
                            size: "sm",
                            variant: "ghost",
                          })}
                        >
                          <Eye className="size-4" /> Details
                        </Link>
                        <Button
                          size="sm"
                          disabled={
                            item.status === "approved" ||
                            updatingId === item._id
                          }
                          onClick={() => handleStatus(item._id, "approved")}
                        >
                          <Check className="size-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={
                            item.status === "rejected" ||
                            updatingId === item._id
                          }
                          onClick={() => handleStatus(item._id, "rejected")}
                        >
                          <X className="size-4" /> Reject
                        </Button>
                        <UpdateEquipmentDialog
                          equipment={item}
                          onUpdated={handleUpdated}
                        />
                        <DeleteEquipmentDialog
                          equipment={item}
                          onDeleted={handleDeleted}
                        />
                      </div>
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
