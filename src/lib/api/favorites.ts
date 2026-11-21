import type { TEquipment } from "@/types";

import { API_URL } from "./config";

import { getTokenFromClient } from "../getTokenFromClient";

// The server returns { message } on errors. Prefer that message so the UI can
// explain what went wrong instead of showing a generic string.
async function readErrorMessage(response: Response, fallback: string) {
  try {
    const data = await response.json();
    if (typeof data?.message === "string") return data.message;
  } catch {
    // The body was empty or not JSON; fall back to the generic message.
  }

  return fallback;
}

// The customer's saved equipment, newest favorite first.
export async function getFavorites(): Promise<TEquipment[]> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Could not load your favorites."),
    );
  }

  const data = await response.json();

  // Keep the page from crashing if the API ever returns an unexpected shape.
  if (!Array.isArray(data)) {
    throw new Error("The server returned an unexpected response.");
  }

  return data as TEquipment[];
}

// Used when the details page loads so the heart button is accurate after a
// hard refresh.
export async function checkFavorite(equipmentId: string): Promise<boolean> {
  const token = await getTokenFromClient();

  const response = await fetch(
    `${API_URL}/favorites/check?equipmentId=${encodeURIComponent(equipmentId)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Could not check your favorites."),
    );
  }

  const data = await response.json();
  return Boolean(data?.favorited);
}

// Adds the item if it is not saved and removes it if it is. Returns the new
// state so the button can stay in sync with the database.
export async function toggleFavorite(equipmentId: string): Promise<boolean> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/favorites/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ equipmentId }),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Could not update your favorites."),
    );
  }

  const data = await response.json();
  return Boolean(data?.favorited);
}

// Explicit remove used by the favorites dashboard. It is idempotent on the
// server, so removing an item twice is harmless.
export async function removeFavorite(equipmentId: string): Promise<void> {
  const token = await getTokenFromClient();

  const response = await fetch(
    `${API_URL}/favorites/${encodeURIComponent(equipmentId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Could not remove this favorite."),
    );
  }
}
