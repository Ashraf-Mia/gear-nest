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
export type RentalType = "daily" | "weekly" | "monthly";
export type PaymentStatus = "pending" | "paid" | "failed";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

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
  price: number;
};

// Shape of the paginated response from GET /equipment.
export type EquipmentResponse = {
  equipment: TEquipment[];
  total: number;
  page: number;
  totalPages: number;
};

export type TBooking = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  customerEmail: string;
  ownerEmail: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalAmount: number;
  contact: string;
  address: string;
  notes?: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
  customerName?: string;
};
