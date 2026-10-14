"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { gyms } from "@/data/gyms";
import GymCard from "@/components/gyms/GymCard";
import GymFilters, {
  type GymFiltersState,
} from "@/components/gyms/GymFilters";

export default function GymDirectory() {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<GymFiltersState>({
    location: "",
    category: "",
    maxPrice: "",
    sort: "recommended",
  });

  const locations = useMemo(
    () => [...new Set(gyms.map((gym) => gym.location))].sort(),
    []
  );

  const categories = useMemo(
    () => [...new Set(gyms.map((gym) => gym.category))].sort(),
    []
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
          ...gym.features,
        ].some((value) => value.toLowerCase().includes(searchText));

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
      case "rating":
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        results = [...results].sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "price-high":
        results = [...results].sort((a, b) => b.priceFrom - a.priceFrom);
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
  }, [query, filters]);

  const resetAll = () => {
    setQuery("");
    setFilters({
      location: "",
      category: "",
      maxPrice: "",
      sort: "recommended",
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-white/45">
            Showing {filteredGyms.length} of {gyms.length} gyms
          </p>
          <h2 className="mt-1 text-2xl font-semibold">
            Explore gyms
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#222723] px-4 py-3 sm:w-80">
            <Search size={18} className="shrink-0 text-white/40" />
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

        <div>
          {filteredGyms.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
              {filteredGyms.map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <Search size={21} className="text-white/50" />
              </div>

              <h3 className="text-lg font-semibold">
                No gyms found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/50">
                Try changing your search or filters to find a gym that
                matches your needs.
              </p>

              <button
                type="button"
                onClick={resetAll}
                className="mt-5 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs leading-5 text-white/35">
        Demo listings and membership prices are sample data for the UI
        prototype. Confirm actual facilities, availability, and prices
        with each gym before making a booking.
      </p>
    </section>
  );
}