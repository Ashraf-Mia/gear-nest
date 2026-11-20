import { Badge } from "@/components/ui/badge";
import type { TEquipmentStatus } from "@/types";

const statusStyles: Record<TEquipmentStatus, string> = {
  pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  approved:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "border-destructive/30 bg-destructive/10 text-destructive",
};

export default function EquipmentStatusBadge({
  status,
}: {
  status: TEquipmentStatus;
}) {
  return (
    <Badge
      variant="outline"
      className={`capitalize ${statusStyles[status] ?? statusStyles.pending}`}
    >
      {status}
    </Badge>
  );
}
