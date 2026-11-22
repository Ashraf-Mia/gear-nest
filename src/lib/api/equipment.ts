import type {
  EquipmentResponse,
  TEquipment,
  TEquipmentStatus,
} from "@/types";

import { API_URL } from "./config";

import { getTokenFromClient } from "../getTokenFromClient";

// The create form sends the current fields only. `price` is a legacy field the
// server normalises into `rentalPrice`, so a new equipment payload omits it.
export type TNewEquipment = Omit<
  TEquipment,
  "_id" | "status" | "createdAt" | "price"
>;

// The update form only changes these four fields.
export type TEquipmentUpdate = Pick<
  TNewEquipment,
  "name" | "category" | "rentalPrice" | "availableQuantity"
>;

// The public list only contains approved equipment. The endpoint is
// paginated, so it returns the same object shape as `getEquipmentList`.
export async function getEquipment(): Promise<EquipmentResponse> {
  return getEquipmentList();
}

// Filters the public equipment list accepts. All values are optional; empty
// ones are left out of the request so the server sees no filter at all.
export type TEquipmentQuery = {
  search?: string;
  category?: string;
  rentalType?: string;
  minPrice?: string;
  maxPrice?: string;
  availability?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

// Paginated public list used by the "All Equipment" page. Keeping the request
// here means the page only handles state and rendering, like the other pages.
export async function getEquipmentList(
  query: TEquipmentQuery = {},
): Promise<EquipmentResponse> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const response = await fetch(`${API_URL}/equipment?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Could not load equipment. Please try again.");
  }

  const data = await response.json();

  // Guard against an unexpected payload (for example a bare array from an
  // older API). Without this check the page would crash while reading
  // `equipment.length` on undefined.
  if (!data || !Array.isArray(data.equipment)) {
    throw new Error("The server returned an unexpected response.");
  }

  // Fill in the pagination values so the UI never renders `undefined`.
  return {
    equipment: data.equipment,
    total: Number(data.total) || data.equipment.length,
    page: Number(data.page) || 1,
    totalPages: Number(data.totalPages) || 1,
  };
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
