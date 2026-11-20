import EquipmentStatusBadge from "@/components/equipment/equipment-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice, getRentalPeriod } from "@/lib/format";
import type { TEquipment } from "@/types";

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">
        {value === "" ? "—" : value}
      </p>
    </div>
  );
}

// This component only shows the equipment data. It is reused by the shared
// /equipment/[id] page.
export default function EquipmentDetails({
  equipment,
}: {
  equipment: TEquipment;
}) {
  return (
    <Card>
      {equipment.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={equipment.image}
          alt={equipment.name}
          loading="lazy"
          className="h-64 w-full object-cover sm:h-80"
        />
      )}

      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-xl sm:text-2xl">
              {equipment.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {equipment.category} · {equipment.location || "No location"}
            </CardDescription>
          </div>
          <EquipmentStatusBadge status={equipment.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {equipment.description || "No description."}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Rental Price"
            value={`${formatPrice(equipment.rentalPrice)} / ${getRentalPeriod(
              equipment.rentalType,
            )}`}
          />
          <DetailItem
            label="Available Quantity"
            value={equipment.availableQuantity}
          />
          <DetailItem label="Condition" value={equipment.condition || "—"} />
          <DetailItem label="Brand" value={equipment.brand || "—"} />
          <DetailItem label="Model" value={equipment.model || "—"} />
          <DetailItem label="Location" value={equipment.location || "—"} />
        </div>

        <div>
          <h3 className="font-heading text-base font-medium">
            Rental Terms and Conditions
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {equipment.rentalTerms || "—"}
          </p>
        </div>

        <div>
          <h3 className="font-heading text-base font-medium">
            Owner Information
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {equipment.ownerName || "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            {equipment.ownerEmail || "—"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
