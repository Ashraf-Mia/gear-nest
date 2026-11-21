import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, getRentalPeriod } from "@/lib/format";
import { TEquipment } from "@/types";

export default function EquipmentCard({
  item,
  isLoggedIn,
}: {
  item: TEquipment;
  isLoggedIn: boolean;
}) {
  // The add/edit forms save `availableQuantity`, not `quantity`. Reading the
  // old field made every card look "Unavailable".
  const available = item.availableQuantity > 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white ${
            available ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium text-primary">
          {item.category}
        </span>
        <h3 className="mt-1 line-clamp-1 text-lg">{item.name}</h3>

        <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4" /> {item.location}
        </p>

        <p className="mt-3 text-xl font-bold text-navy dark:text-white">
          {formatPrice(item.rentalPrice)}
          <span className="text-sm font-normal capitalize text-muted-foreground">
            {" "}
            / {getRentalPeriod(item.rentalType)}
          </span>
        </p>

        <Link
          href={isLoggedIn ? `/equipment/${item._id}` : "/login"}
          className={buttonVariants({ className: "mt-4 w-full" })}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
