// Small helpers used by the equipment table and the details page.

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(price: number) {
  const amount = Number(price);

  return Number.isFinite(amount) ? currencyFormatter.format(amount) : "—";
}

const RENTAL_PERIODS: Record<string, string> = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
};

export function getRentalPeriod(rentalType: string) {
  return RENTAL_PERIODS[rentalType] ?? rentalType.toLowerCase();
}
