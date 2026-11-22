"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TAdminAnalytics } from "@/types";
import { getAdminAnalytics } from "@/lib/api/analytics-api";
// import { getAdminAnalytics } from "@/lib/analytics-api";
// import type { AdminAnalytics } from "@/types";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<TAdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then(setData)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-muted-foreground">Could not load analytics.</p>;
  }

  const stats = [
    { label: "Total Users", value: data.totalUsers, icon: Users },
    { label: "Total Equipment", value: data.totalEquipment, icon: Package },
    { label: "Total Bookings", value: data.totalBookings, icon: CalendarCheck },
    {
      label: "Total Revenue",
      value: `$${data.totalRevenue}`,
      icon: DollarSign,
    },
    { label: "Pending Approvals", value: data.pendingApprovals, icon: Clock },
    {
      label: "Completed Rentals",
      value: data.completedRentals,
      icon: CheckCircle2,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Analytics</h1>
      <p className="mt-1 text-muted-foreground">
        Overall performance of the GearNest platform.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border bg-card p-5"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <stat.icon className="size-6" />
            </span>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Monthly Bookings</h2>
          <p className="text-sm text-muted-foreground">Last 6 months</p>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyStats}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#94a3b8"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [value, "Bookings"]} />
                <Bar dataKey="bookings" fill="#1e3a5f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Monthly Revenue</h2>
          <p className="text-sm text-muted-foreground">Last 6 months</p>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyStats}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#94a3b8"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
