"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/theme-toggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const loginStyle = buttonVariants({
  variant: "outline",
  className:
    "bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white",
});

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // TODO: অথ বসানোর পর এখানে আসল ইউজার চেক হবে
  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-dark text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/">
          <Image
            src="/images/full-logo.png"
            alt="GearNest"
            width={150}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-slate-200"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 lg:flex">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className={loginStyle}>
                  Dashboard
                </Link>
                <Button>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" className={loginStyle}>
                  Login
                </Link>
                <Link href="/register" className={buttonVariants()}>
                  Register
                </Link>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-navy-dark lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex gap-2">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className={buttonVariants({ className: "flex-1" })}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "flex-1 bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white",
                    })}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={buttonVariants({ className: "flex-1" })}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
