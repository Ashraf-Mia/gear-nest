import {
  BadgeCheck,
  Camera,
  CalendarCheck,
  CalendarClock,
  Cpu,
  CreditCard,
  HardHat,
  PackageCheck,
  PartyPopper,
  Search,
  Tractor,
  Truck,
  Wallet,
} from "lucide-react";

export const homeCategories = [
  { name: "Construction Equipment", icon: HardHat },
  { name: "Photography Equipment", icon: Camera },
  { name: "Vehicles & Transportation", icon: Truck },
  { name: "Agriculture Equipment", icon: Tractor },
  { name: "Electronics", icon: Cpu },
  { name: "Event Equipment", icon: PartyPopper },
];

export const steps = [
  {
    title: "Search",
    text: "Find the equipment you need by category, location or price.",
    icon: Search,
  },
  {
    title: "Book",
    text: "Pick your rental dates and the quantity you need.",
    icon: CalendarCheck,
  },
  {
    title: "Pay Securely",
    text: "Complete the payment safely through Stripe.",
    icon: CreditCard,
  },
  {
    title: "Receive & Use",
    text: "Get the equipment delivered and start your work.",
    icon: PackageCheck,
  },
];

export const benefits = [
  {
    title: "Affordable Prices",
    text: "Rent only for the days you need and skip the cost of buying.",
    icon: Wallet,
  },
  {
    title: "Verified Owners",
    text: "Every listing is reviewed and approved by our admin team.",
    icon: BadgeCheck,
  },
  {
    title: "Flexible Periods",
    text: "Choose daily, weekly or monthly rental to fit your project.",
    icon: CalendarClock,
  },
  {
    title: "Secure Payments",
    text: "All payments are processed safely through Stripe Checkout.",
    icon: CreditCard,
  },
];

export const reviews = [
  {
    name: "Rahim Uddin",
    role: "Construction Contractor",
    rating: 5,
    comment:
      "I rented an excavator for two weeks. Booking was quick and the owner delivered on time.",
  },
  {
    name: "Nusrat Jahan",
    role: "Wedding Photographer",
    rating: 5,
    comment:
      "Got a high-end camera for my shoot at a fraction of the price. Highly recommended.",
  },
  {
    name: "Tanvir Ahmed",
    role: "Event Organizer",
    rating: 4,
    comment:
      "Sound system and lights were in great condition. The payment process felt very safe.",
  },
  {
    name: "Sadia Islam",
    role: "Farm Owner",
    rating: 5,
    comment:
      "Renting a power tiller monthly saved me a lot of money. Easy to find and book.",
  },
];
