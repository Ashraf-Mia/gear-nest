import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const categories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const socials = [
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
  { label: "GitHub", href: "https://github.com", icon: FaGithub },
];

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/images/white-logo.png"
            alt="GearNest"
            width={150}
            height={40}
            className="h-9 w-auto"
          />
          <p className="mt-4 text-sm text-slate-400">
            Rent the equipment you need from trusted owners, safely and easily.
          </p>
          <div className="mt-4 flex gap-2">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary"
              >
                <item.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-heading font-semibold text-white">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-heading font-semibold text-white">
            Categories
          </h4>
          <ul className="space-y-2 text-sm">
            {categories.map((name) => (
              <li key={name}>
                <Link
                  href={`/equipment?category=${name}`}
                  className="hover:text-primary"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-heading font-semibold text-white">
            Contact
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> +880 1234-567890
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> support@gearnest.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-400">
        © 2026 GearNest. All rights reserved.
      </div>
    </footer>
  );
}
