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

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

// Booking dates arrive as "YYYY-MM-DD" and registration dates as ISO strings.
// Both parse with the Date constructor; anything invalid shows a dash.
export function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

// Inclusive day count, matching the server's pricing rule: a booking that
// starts and ends on the same day still counts as one day.
export function getDurationDays(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;

  return Math.round((end - start) / 86_400_000) + 1;
}
