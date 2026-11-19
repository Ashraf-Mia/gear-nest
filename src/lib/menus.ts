import {
  BarChart3,
  CalendarCheck,
  ClipboardList,
  Heart,
  Package,
  PlusCircle,
  User,
  Users,
} from "lucide-react";

export const menus = {
  equipment: [
    {
      label: "My Rentals",
      href: "/dashboard/equipment/rentals",
      icon: ClipboardList,
    },
    { label: "Favorites", href: "/dashboard/equipment/favorites", icon: Heart },
    { label: "Profile", href: "/dashboard/equipment/profile", icon: User },
  ],
  owner: [
    { label: "Analytics", href: "/dashboard/owner/analytics", icon: BarChart3 },
    {
      label: "Add Equipment",
      href: "/dashboard/owner/add-equipment",
      icon: PlusCircle,
    },
    {
      label: "My Equipment",
      href: "/dashboard/owner/my-equipment",
      icon: Package,
    },
    {
      label: "My Equipment Rental",
      href: "/dashboard/owner/rentals",
      icon: CalendarCheck,
    },
    { label: "My Profile", href: "/dashboard/owner/profile", icon: User },
  ],
  admin: [
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { label: "All Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "All Equipment",
      href: "/dashboard/admin/equipment",
      icon: Package,
    },
    {
      label: "All Rentals",
      href: "/dashboard/admin/rentals",
      icon: CalendarCheck,
    },
    { label: "My Profile", href: "/dashboard/admin/profile", icon: User },
  ],
};

export type Role = keyof typeof menus; // "equipment" | "owner" | "admin"
