"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EquipmentCard from "@/components/equipment/equipment-card";
import { authClient } from "@/lib/auth-client";
import { getEquipmentList } from "@/lib/api/equipment";
import type { EquipmentResponse } from "@/types";
import { EQUIPMENT_CATEGORIES, RENTAL_TYPES } from "@/lib/equipment-options";

const emptyFilters = {
  search: "",
  category: "",
  rentalType: "",
  minPrice: "",
  maxPrice: "",
  availability: "",
  sort: "",
};

const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export default function AllEquipmentPage() {
  const { data: session } = authClient.useSession();

  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<EquipmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // The request lives in lib/api, but failures still need to be shown here.
  const [error, setError] = useState("");
  // Changing this key re-runs the effect for the "Try again" button.
  const [reloadKey, setReloadKey] = useState(0);

  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  useEffect(() => {
    // Prevents a slow, older request from overwriting a newer result.
    let isCancelled = false;

    const fetchEquipment = async () => {
      setLoading(true);
      setError("");

      try {
        // The URL and the response checks live in lib/api/equipment.ts.
        const result = await getEquipmentList({ ...filters, page, limit: 9 });

        if (!isCancelled) {
          setData(result);
        }
      } catch (cause) {
        if (!isCancelled) {
          setData(null);
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load equipment.",
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchEquipment, 400);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [filters, page, reloadKey]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">All Equipment</h1>
      <p className="mt-2 text-muted-foreground">
        Find the right equipment from verified owners.
      </p>

      <div className="mt-8 space-y-4 rounded-xl border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by equipment name or location..."
            className="h-11 pl-10"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            className={selectClass}
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {EQUIPMENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={filters.rentalType}
            onChange={(e) => updateFilter("rentalType", e.target.value)}
          >
            <option value="">All Rental Types</option>
            {/* The form stores "Daily"/"Weekly"/"Monthly", so reuse the same
                values here instead of lowercase ones the server cannot match. */}
            {RENTAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={filters.availability}
            onChange={(e) => updateFilter("availability", e.target.value)}
          >
            <option value="">Any Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <select
            className={selectClass}
            value={filters.sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
          >
            <option value="">Recently Added</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            type="number"
            min={0}
            placeholder="Min price"
            className="h-10"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
          />
          <Input
            type="number"
            min={0}
            placeholder="Max price"
            className="h-10"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => {
              setFilters(emptyFilters);
              setPage(1);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        // A failed request is different from "no results", so show it instead
        // of the empty state and let the user retry.
        <div className="py-20 text-center">
          <p className="font-medium">Could not load equipment</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            Try again
          </Button>
        </div>
      ) : !data || data.equipment.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No equipment found. Try changing your filters.
        </p>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            Showing {data.equipment.length} of {data.total} items
          </p>

          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.equipment.map((item) => (
              <EquipmentCard
                key={item._id}
                item={item}
                isLoggedIn={!!session}
              />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === data.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
