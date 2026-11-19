"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/theme-toggle";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

import { toast } from "sonner";

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

function AccountMenu({
  user,
  onLogout,
  triggerClassName,
  children,
}: {
  user: { name: string; email: string; image?: string | null };
  onLogout: () => void;
  triggerClassName: string;
  children: ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerClassName}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-64"
      >
        <div className="flex items-center gap-3 p-1.5">
          <Avatar className="size-10">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/#" />}>
          <UserRound className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutDashboard className="size-4" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={onLogout}>
          <LogOut className="size-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("Log out failed", {
        description: error.message || "Something went wrong. Try again.",
      });
      return;
    }

    setMenuOpen(false);

    toast.success("Logged out", {
      description: "You have been logged out successfully.",
    });

    router.push("/");
    router.refresh();
  };

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
            {isPending ? null : user ? (
              <>
                <AccountMenu
                  user={user}
                  onLogout={handleLogout}
                  triggerClassName="cursor-pointer rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Avatar className="size-9 border border-white/20">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </AccountMenu>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="size-4" />
                  Log Out
                </Button>
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
              {isPending ? null : user ? (
                <>
                  <AccountMenu
                    user={user}
                    onLogout={handleLogout}
                    triggerClassName="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-left"
                  >
                    <Avatar className="size-8 border border-white/20">
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {user.name}
                      </span>
                      <span className="block truncate text-xs text-slate-400">
                        {user.email}
                      </span>
                    </span>
                  </AccountMenu>
                  <Button
                    variant="destructive"
                    className="shrink-0"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" />
                    Log Out
                  </Button>
                </>
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
