
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  LoaderCircle,
  AlertCircle,
  Dumbbell,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import GymCard, {
  type DirectoryGym,
} from "@/components/gyms/GymCard";
import GymFilters, {
  type GymFiltersState,
} from "@/components/gyms/GymFilters";

type GymProfileRow = {
  id: string;
  gym_name: string;
  description: string | null;
  location: string;
  category: string | null;
  price_from: number | string;
  features: string[] | null;
  main_image_url: string | null;
  gallery_images: string[] | null;
};

export default function GymDirectory() {
  const [gyms, setGyms] = useState<DirectoryGym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<GymFiltersState>({
    location: "",
    category: "",
    maxPrice: "",
    sort: "recommended",
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchGyms() {
      setLoading(true);
      setError("");

      try {
        const supabase = createClient();

        const { data, error: queryError } = await supabase
          .from("gym_profiles")
          .select(
            "id, gym_name, description, location, category, price_from, features, main_image_url, gallery_images"
          )
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (queryError) {
          throw queryError;
        }

        const rows = (data ?? []) as GymProfileRow[];

        const mappedGyms: DirectoryGym[] = rows.map((gym) => ({
          id: gym.id,
          name: gym.gym_name,
          description: gym.description ?? "",
          location: gym.location,
          category: gym.category || "General",
          priceFrom: Number(gym.price_from ?? 0),
          features: gym.features ?? [],
          image:
            gym.main_image_url ||
            gym.gallery_images?.[0] ||
            null,
          galleryImages: gym.gallery_images ?? [],
        }));

        if (!cancelled) {
          setGyms(mappedGyms);
        }
      } catch (err) {
        console.error("Failed to fetch gym directory:", err);

        if (!cancelled) {
          setError(
            "We couldn't load the gym directory. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchGyms();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  const locations = useMemo(
    () =>
      [...new Set(gyms.map((gym) => gym.location))]
        .filter(Boolean)
        .sort(),
    [gyms]
  );

  const categories = useMemo(
    () =>
      [...new Set(gyms.map((gym) => gym.category))]
        .filter(Boolean)
        .sort(),
    [gyms]
  );

  const filteredGyms = useMemo(() => {
    let results = gyms.filter((gym) => {
      const searchText = query.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        [
          gym.name,
          gym.location,
          gym.category,
          gym.description,
          ...gym.features,
        ].some((value) =>
          value.toLowerCase().includes(searchText)
        );

      const matchesLocation =
        !filters.location || gym.location === filters.location;

      const matchesCategory =
        !filters.category || gym.category === filters.category;

      const matchesPrice =
        !filters.maxPrice ||
        gym.priceFrom <= Number(filters.maxPrice);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory &&
        matchesPrice
      );
    });

    switch (filters.sort) {
      case "price-low":
        results = [...results].sort(
          (a, b) => a.priceFrom - b.priceFrom
        );
        break;

      case "price-high":
        results = [...results].sort(
          (a, b) => b.priceFrom - a.priceFrom
        );
        break;

      case "name":
        results = [...results].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      default:
        break;
    }

    return results;
  }, [gyms, query, filters]);

  const resetAll = () => {
    setQuery("");
    setFilters({
      location: "",
      category: "",
      maxPrice: "",
      sort: "recommended",
    });
  };

  const hasActiveFilters =
    query.trim() !== "" ||
    filters.location !== "" ||
    filters.category !== "" ||
    filters.maxPrice !== "" ||
    filters.sort !== "recommended";

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-white/45">
            {loading
              ? "Loading available gyms..."
              : `Showing ${filteredGyms.length} of ${gyms.length} gyms`}
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            Explore gyms
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#222723] px-4 py-3 sm:w-80">
            <Search
              size={18}
              className="shrink-0 text-white/40"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gyms, areas, facilities..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
              aria-label="Search gyms"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm transition hover:border-[#C7F36B]/50 lg:hidden"
          >
            <SlidersHorizontal size={17} />
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <GymFilters
            filters={filters}
            onChange={setFilters}
            locations={locations}
            categories={categories}
          />
        </div>

        <div className="min-w-0">
          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#222723]/50">
              <LoaderCircle
                size={32}
                className="animate-spin text-[#C7F36B]"
              />
              <p className="mt-4 text-sm text-white/55">
                Finding gyms for you...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-14 text-center">
              <AlertCircle
                size={30}
                className="mx-auto text-red-300"
              />

              <h3 className="mt-4 text-lg font-semibold">
                Unable to load gyms
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/50">
                {error}
              </p>

              <button
                type="button"
                onClick={() => setRetryKey((key) => key + 1)}
                className="mt-5 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
              >
                Try again
              </button>
            </div>
          ) : gyms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
              <Dumbbell
                size={32}
                className="mx-auto text-[#C7F36B]"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No gyms listed yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/50">
                Approved gyms will appear here once their profiles
                are published. Please check back soon.
              </p>
            </div>
          ) : filteredGyms.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
              {filteredGyms.map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
              <Search
                size={28}
                className="mx-auto text-white/50"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No gyms found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/50">
                Try changing your search or filters to find a gym
                that matches your needs.
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-5 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
