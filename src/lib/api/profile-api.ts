import { getTokenFromClient } from "../getTokenFromClient";

import { TProfile, TProfileInput } from "@/types";
import { API_URL } from "./config";
export async function getProfile(): Promise<TProfile> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not load your profile. Please try again.");
  }

  return response.json();
}

export async function updateProfile(data: TProfileInput): Promise<TProfile> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Could not update profile.");
  }

  return response.json();
}
