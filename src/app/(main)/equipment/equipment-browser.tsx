"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import EquipmentCard from "@/components/equipment/equipment-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEquipmentList, type TEquipmentQuery } from "@/lib/api/equipment";
import { authClient } from "@/lib/auth-client";
import { EQUIPMENT_CATEGORIES, RENTAL_TYPES } from "@/lib/equipment-options";
import type { EquipmentResponse } from "@/types";

export const EQUIPMENT_PAGE_SIZE = 9;

// Text inputs write to the URL after a short pause so typing does not fire a
// request per keystroke. Dropdowns apply immediately.
const TYPING_DELAY_MS = 400;

const FILTER_KEYS = [
  "search",
  "category",
  "rentalType",
  "minPrice",
  "maxPrice",
  "availability",
  "sort",
] as const;

type TFilterKey = (typeof FILTER_KEYS)[number];

type TFilters = Record<TFilterKey, string>;

const emptyFilters: TFilters = {
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

// The URL is the single source of truth for the filters, so a shared link, a
// hard reload and the browser back button all restore the same list.
function readFilters(params: URLSearchParams): TFilters {
  const filters = { ...emptyFilters };

  FILTER_KEYS.forEach((key) => {
    filters[key] = params.get(key) ?? "";
  });

  return filters;
}

function readPage(params: URLSearchParams) {
  const page = Number(params.get("page"));

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default function EquipmentBrowser() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // A string that only changes when the query string changes. The request and
  // the input sync below both key off it, which keeps one source of truth.
  const queryKey = searchParams.toString();

  const filters = readFilters(new URLSearchParams(queryKey));
  const page = readPage(new URLSearchParams(queryKey));

  // Text inputs keep a local copy so typing stays instant. The value is written
  // to the URL after the debounce and read back when the URL changes elsewhere
  // (back button, footer category link, reset).
  const [searchText, setSearchText] = useState(filters.search);
  const [minPriceText, setMinPriceText] = useState(filters.minPrice);
  const [maxPriceText, setMaxPriceText] = useState(filters.maxPrice);

  const [data, setData] = useState<EquipmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // The request lives in lib/api, but failures still need to be shown here.
  const [error, setError] = useState("");
  // Changing this key re-runs the effect for the "Try again" button.
  const [reloadKey, setReloadKey] = useState(0);

  // Keep the inputs in step when the filters change from outside this form
  // (back button, footer category link, reset). React supports setting state
  // during render for exactly this case, which avoids the extra render an
  // effect would add. Our own writes already match the drafts, so adopting the
  // URL here is a no-op unless the change came from somewhere else.
  const [syncedQuery, setSyncedQuery] = useState(queryKey);

  if (syncedQuery !== queryKey) {
    setSyncedQuery(queryKey);
    setSearchText(filters.search);
    setMinPriceText(filters.minPrice);
    setMaxPriceText(filters.maxPrice);
  }

  // Filters live in the query string. `replace` is used for typed input so the
  // history does not fill with one entry per pause; discrete actions use
  // `push` so the back button steps through the filters the user chose.
  const writeQuery = useCallback(
    (
      updates: Record<string, string | number | undefined>,
      mode: "push" | "replace",
    ) => {
      const params = new URLSearchParams(queryKey);

      // Fold in text that is still waiting for the debounce. Without this,
      // clicking a dropdown right after typing would drop what was typed.
      const typed: Record<string, string> = {
        search: searchText,
        minPrice: minPriceText,
        maxPrice: maxPriceText,
      };

      Object.entries(typed).forEach(([key, value]) => {
        if (value === (params.get(key) ?? "")) return;

        if (value === "") params.delete(key);
        else params.set(key, value);
      });

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined) return;

        // Page 1 is the default, so it stays out of the URL.
        if (key === "page" && Number(value) <= 1) params.delete(key);
        else if (value === "") params.delete(key);
        else params.set(key, String(value));
      });

      // Any filter change starts over from the first page.
      if (!("page" in updates)) params.delete("page");

      const href = params.toString() ? `${pathname}?${params}` : pathname;

      if (mode === "replace") router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    },
    [pathname, queryKey, router, searchText, minPriceText, maxPriceText],
  );

  useEffect(() => {
    const committed = readFilters(new URLSearchParams(queryKey));

    const typed: Array<[TFilterKey, string]> = [
      ["search", searchText],
      ["minPrice", minPriceText],
      ["maxPrice", maxPriceText],
    ];

    // Only values that differ from the URL are written, so this effect settles
    // instead of looping once the URL catches up with the input.
    const pending = typed.filter(([key, value]) => value !== committed[key]);

    if (pending.length === 0) return;

    const timer = setTimeout(() => {
      writeQuery(Object.fromEntries(pending), "replace");
    }, TYPING_DELAY_MS);

    return () => clearTimeout(timer);
  }, [searchText, minPriceText, maxPriceText, queryKey, writeQuery]);

  // পেজ খুললে URL-এ ?category=... থাকলে সেটা ফিল্টারে বসাবে
  // useEffect(() => {
  //   const category = new URLSearchParams(window.location.search).get("category");
  //   if (category) {
  //     setFilters((prev) => ({ ...prev, category }));
  //   }
  // }, []);

  useEffect(() => {
    // Prevents a slow, older request from overwriting a newer result.
    let isCancelled = false;

    const fetchEquipment = async () => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams(queryKey);

      // The URL and the response checks live in lib/api/equipment.ts; the
      // server does the actual filtering, sorting and pagination.
      const query: TEquipmentQuery = {
        ...readFilters(params),
        page: readPage(params),
        limit: EQUIPMENT_PAGE_SIZE,
      };

      try {
        const result = await getEquipmentList(query);

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

    fetchEquipment();

    return () => {
      isCancelled = true;
    };
  }, [queryKey, reloadKey]);

  const setFilter = (key: TFilterKey, value: string) => {
    writeQuery({ [key]: value }, "push");
  };

  const resetFilters = () => {
    setSearchText("");
    setMinPriceText("");
    setMaxPriceText("");
    router.push(pathname, { scroll: false });
  };

  return (
    <>
      <div className="mt-8 space-y-4 rounded-xl border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by equipment name or location..."
            className="h-11 pl-10"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            className={selectClass}
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
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
            onChange={(e) => setFilter("rentalType", e.target.value)}
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
            onChange={(e) => setFilter("availability", e.target.value)}
          >
            <option value="">Any Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <select
            className={selectClass}
            value={filters.sort}
            onChange={(e) => setFilter("sort", e.target.value)}
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
            value={minPriceText}
            onChange={(e) => setMinPriceText(e.target.value)}
          />
          <Input
            type="number"
            min={0}
            placeholder="Max price"
            className="h-10"
            value={maxPriceText}
            onChange={(e) => setMaxPriceText(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: EQUIPMENT_PAGE_SIZE }).map((_, i) => (
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
                onClick={() => writeQuery({ page: page - 1 }, "push")}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= data.totalPages}
                onClick={() => writeQuery({ page: page + 1 }, "push")}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
