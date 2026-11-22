// import { API_URL, getToken } from "@/lib/api";
// import type { OwnerAnalytics } from "@/types";

import { TAdminAnalytics, TOwnerAnalytics } from "@/types";
import { getTokenFromClient } from "../getTokenFromClient";
import { API_URL } from "./config";

export async function getOwnerAnalytics(): Promise<TOwnerAnalytics> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/analytics/owner`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not load analytics. Please try again.");
  }

  return response.json();
}

// admin analytics
export async function getAdminAnalytics(): Promise<TAdminAnalytics> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/analytics/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not load analytics. Please try again.");
  }

  return response.json();
}
