// import { API_URL, getToken } from "@/lib/api";

import { getTokenFromClient } from "../getTokenFromClient";
import { API_URL } from "./config";

// শুধু ফর্মে দাম দেখানোর জন্য (আসল হিসাব সার্ভারে হয়)
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

  let units = days;
  if (rentalType === "weekly") units = Math.ceil(days / 7);
  if (rentalType === "monthly") units = Math.ceil(days / 30);

  return price * units * quantity;
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

// সার্ভার থেকে Stripe পেমেন্ট পেজের লিংক আনে
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
    // সার্ভারের মেসেজ (যেমন "Only 2 available") সরাসরি দেখাবো
    throw new Error(result.message || "Could not start payment");
  }

  return result.url;
}

// পেমেন্ট সফল হওয়ার পর সার্ভারকে জানায়
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
