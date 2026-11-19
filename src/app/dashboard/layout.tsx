import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "./_components/app-sidebar";
import ThemeToggle from "@/components/shared/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-navy-dark px-4 text-white">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
            <span className="font-heading font-semibold">Dashboard</span>
          </div>
          <ThemeToggle />
        </header>

        <div className="p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
