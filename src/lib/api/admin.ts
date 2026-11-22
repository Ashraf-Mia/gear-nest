// import { API_URL, getToken } from "@/lib/api";
// import type { Equipment, EquipmentStatus } from "@/types";

import { TEquipment, TEquipmentStatus } from "@/types";
import { getTokenFromClient } from "../getTokenFromClient";
import { API_URL } from "./config";

export async function getAllEquipmentForAdmin(): Promise<TEquipment[]> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/admin/equipment`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not load equipment. Please try again.");
  }

  return response.json();
}

// approve / reject / pending
export async function updateEquipmentStatus(
  id: string,
  status: TEquipmentStatus,
): Promise<TEquipment> {
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
    throw new Error("Could not update status. Please try again.");
  }

  return response.json();
}
