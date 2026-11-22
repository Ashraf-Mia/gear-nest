// import { API_URL, getToken } from "@/lib/api";
// import type { Equipment, EquipmentStatus } from "@/types";

import { TAdminUser, TBooking, TEquipment, TEquipmentStatus, TRole } from "@/types";
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

// Admin "All Users" table. The server projects safe fields only.
export async function getAllUsers(): Promise<TAdminUser[]> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not load users. Please try again.");
  }

  const data = await response.json();

  // Without this guard a changed API shape would crash the table.
  if (!Array.isArray(data)) {
    throw new Error("The server returned an unexpected response.");
  }

  return data;
}

// Promote or demote a user. The server rejects demoting the last admin, so its
// message is passed straight to the toast instead of a generic one.
export async function updateUserRole(
  id: string,
  role: TRole,
): Promise<TAdminUser> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/users/${id}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || "Could not update the role. Please try again.",
    );
  }

  return data;
}

// Admin "All Rentals" table. Every booking, newest first, with the owner name
// and equipment image joined in by the server.
export async function getAllBookings(): Promise<TBooking[]> {
  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Could not load rentals. Please try again.");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("The server returned an unexpected response.");
  }

  return data;
}
