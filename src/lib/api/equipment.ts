import type { TEquipment, TEquipmentStatus } from "@/types";

import { API_URL } from "./config";

import { getTokenFromClient } from "../getTokenFromClient";

export type TNewEquipment = Omit<TEquipment, "_id" | "status" | "createdAt">;

// The update form only changes these four fields.
export type TEquipmentUpdate = Pick<
  TNewEquipment,
  "name" | "category" | "rentalPrice" | "availableQuantity"
>;

// The public list only contains approved equipment.
export async function getEquipment(): Promise<TEquipment[]> {
  const response = await fetch(`${API_URL}/equipment`);

  if (!response.ok) {
    throw new Error("Could not load equipment. Please try again.");
  }

  return response.json();
}

// One shared details endpoint. A token is optional: we only need it to see
// pending/rejected equipment (owner or admin).
export async function getEquipmentById(id: string, token?: string) {
  const response = await fetch(`${API_URL}/equipment/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (response.status === 404) {
    throw new Error("Equipment not found.");
  }

  if (!response.ok) {
    throw new Error("Could not load the equipment. Please try again.");
  }

  return response.json() as Promise<TEquipment>;
}

// The backend only returns the equipment that belongs to the logged-in owner.
export async function getOwnerEquipment(): Promise<TEquipment[]> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/equipment/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

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

export async function updateEquipment(
  id: string,
  equipment: TEquipmentUpdate,
) {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/equipment/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(equipment),
  });

  if (!response.ok) {
    throw new Error("Could not update the equipment. Please try again.");
  }

  return response.json() as Promise<TEquipment>;
}

export async function deleteEquipment(id: string) {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/equipment/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not delete the equipment. Please try again.");
  }

  return response.json();
}

// Admins use this to approve or reject equipment.
export async function updateEquipmentStatus(
  id: string,
  status: TEquipmentStatus,
) {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/equipment/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Could not update the status. Please try again.");
  }

  return response.json() as Promise<TEquipment>;
}
