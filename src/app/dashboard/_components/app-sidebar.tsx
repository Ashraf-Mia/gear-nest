"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { menus, Role } from "@/lib/menus";
// import { menus, Role } from "@/lib/menus";

export default function AppSidebar() {
  const pathname = usePathname(); // এখন কোন পেজে আছি
  const router = useRouter();
  const { setOpenMobile } = useSidebar(); // মোবাইলে লিংকে ক্লিক করলে মেনু বন্ধ করার জন্য

  // লগইন করা ইউজারের তথ্য
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // ইউজারের রোল (না পেলে customer ধরা হবে)
  const role = ((user as { role?: string } | undefined)?.role ??
    "customer") as Role;
  const menuItems = menus[role] ?? menus.equipment;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Sidebar>
      {/* ১. ওপরে লোগো */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/">
          <Image
            src="/images/white-logo.png"
            alt="GearNest"
            width={150}
            height={40}
            className="h-9 w-auto"
          />
        </Link>
      </SidebarHeader>

      {/* ২. মাঝখানে মেনু (রোল অনুযায়ী) */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="capitalize text-slate-400">
            {role} Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={
                      <Link
                        href={item.href}
                        onClick={() => setOpenMobile(false)}
                      />
                    }
                    isActive={pathname === item.href}
                    className="h-10 data-[active=true]:bg-primary data-[active=true]:text-white"
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* হোম পেজে ফেরার লিংক */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/" />} className="h-10">
                  <Home className="size-4" />
                  <span>Back to Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ৩. নিচে ইউজারের ছবি, নাম ও Logout */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-1 py-2">
          <Avatar className="size-9">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? "User"}
            />
            <AvatarFallback className="bg-primary text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.name ?? "Loading..."}
            </p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-10 text-red-400 hover:text-red-300"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
