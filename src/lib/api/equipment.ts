import type { TEquipment } from "@/types";

import { API_URL } from "./config";

export type TNewEquipment = Omit<TEquipment, "_id" | "status" | "createdAt">;

export async function getEquipment(): Promise<TEquipment[]> {
  const response = await fetch(`${API_URL}/equipment`);

  if (!response.ok) {
    throw new Error("Could not load equipment. Please try again.");
  }

  return response.json();
}

export async function getOwnerEquipment(
  ownerId: string,
): Promise<TEquipment[]> {
  const response = await fetch(
    `${API_URL}/equipment?ownerId=${encodeURIComponent(ownerId)}`,
  );

  if (!response.ok) {
    throw new Error("Could not load your equipment. Please try again.");
  }

  return response.json();
}

export async function createEquipment(equipment: TNewEquipment) {
  const response = await fetch(`${API_URL}/equipment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipment),
  });

  if (!response.ok) {
    throw new Error("Could not submit the equipment. Please try again.");
  }

  return response.json();
}
