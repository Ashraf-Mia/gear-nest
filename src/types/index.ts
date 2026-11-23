// import { Role } from "@/lib/menus";

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

// Response from GET /equipment/:id/availability. `availableQuantity` is the
// real remaining stock for the requested dates: total minus every booking that
// overlaps those dates.
export type TEquipmentAvailability = {
  equipmentId: string;
  startDate: string;
  endDate: string;
  totalQuantity: number;
  bookedQuantity: number;
  availableQuantity: number;
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

  ownerName?: string;
  equipmentImage?: string;
};

// Shape of one row in the admin "All Users" table. The API only returns these
// fields, so the browser never receives account or session documents.
export type TAdminUser = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: TRole;
  createdAt: string;
};

export type TProfile = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  address?: string;
  role: TRole;
};

export type TProfileInput = {
  name: string;
  image: string;
  phone: string;
  address: string;
};

export type TOwnerAnalytics = {
  totalEquipment: number;
  approvedEquipment: number;
  totalBookings: number;
  completedRentals: number;
  totalEarnings: number;
  monthlyEarnings: { month: string; earnings: number }[];
};

export type TAdminAnalytics = {
  totalUsers: number;
  totalEquipment: number;
  totalBookings: number;
  totalRevenue: number;
  pendingApprovals: number;
  completedRentals: number;
  monthlyStats: { month: string; bookings: number; revenue: number }[];
};

export type TAppUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: TRole;
};
