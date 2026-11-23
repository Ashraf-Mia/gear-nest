// import { API_URL, getToken } from "@/lib/api";

import { TBooking, TEquipmentAvailability } from "@/types";
import { getTokenFromClient } from "../getTokenFromClient";
import { API_URL } from "./config";

// Calculates the total amount for a booking based on the rental type, dates, and quantity.
export function calculateTotal(
  price: number,
  rentalType: string,
  startDate: string,
  endDate: string,
  quantity: number,
): number {
  if (!startDate || !endDate || endDate < startDate || quantity < 1) return 0;

  const days =
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000,
    ) + 1;

  const type = rentalType.toLowerCase();

  let units = days;
  if (type === "weekly") units = Math.ceil(days / 7);
  if (type === "monthly") units = Math.ceil(days / 30);

  return price * units * quantity;
}

// Real availability for a date range. The equipment details page and the
// booking modal both use this so overlapping bookings reduce the shown stock.
export async function getEquipmentAvailability(
  equipmentId: string,
  startDate: string,
  endDate: string,
): Promise<TEquipmentAvailability> {
  const params = new URLSearchParams({ startDate, endDate });

  const response = await fetch(
    `${API_URL}/equipment/${equipmentId}/availability?${params.toString()}`,
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not check availability.");
  }

  return result as TEquipmentAvailability;
}

type CheckoutData = {
  equipmentId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  contact: string;
  address: string;
  notes: string;
};

export async function createCheckoutSession(
  data: CheckoutData,
): Promise<string> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/bookings/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not start payment");
  }

  return result.url;
}

export async function confirmPayment(sessionId: string) {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/payments/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not confirm payment");
  }

  return result as { success: boolean; transactionId: string; amount: number };
}

export async function getMyBookings(): Promise<TBooking[]> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/bookings/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not load your rentals. Please try again.");
  }

  return response.json();
}

// Fetches bookings for the logged-in owner. This is used in the owner dashboard.
export async function getOwnerBookings(): Promise<TBooking[]> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/bookings/owner`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not load rentals. Please try again.");
  }

  return response.json();
}
