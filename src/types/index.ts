export type TRole = "customer" | "owner" | "admin";

export type TRegisterRole = Exclude<TRole, "admin">;

export type TRegisterForm = {
  name: string;
  email: string;
  image: string;
  role: TRegisterRole;
  password: string;
  confirmPassword: string;
};

export type TEquipmentStatus = "pending" | "approved" | "rejected";

export type TEquipment = {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  brand: string;
  model: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  condition: string;
  image: string;
  rentalTerms: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  status: TEquipmentStatus;
  createdAt: string;
  price: number; // Added price field for calculateTotal function
  quantity: number; // Added quantity field for validation in booking modal
};

// Shape of the paginated response from GET /equipment.
export type EquipmentResponse = {
  equipment: TEquipment[];
  total: number;
  page: number;
  totalPages: number;
};
