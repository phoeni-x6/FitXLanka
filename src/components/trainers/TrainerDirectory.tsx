
"use client";

import { useMemo, useState } from "react";
import { Search, Users, X } from "lucide-react";
import { trainers } from "@/data/trainers";
import TrainerFilters, {
  type TrainerFiltersState,
} from "./TrainerFilters";
import TrainerCard from "./TrainerCard";

const initialFilters: TrainerFiltersState = {
  location: "",
  specialty: "",
  maxPrice: "",
  availability: "",
  sort: "recommended",
};

export default function TrainerDirectory() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] =
    useState<TrainerFiltersState>(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const locations = useMemo(
    () => [...new Set(trainers.map((trainer) => trainer.location))].sort(),
    []
  );

  const specialties = useMemo(
    () => [...new Set(trainers.map((trainer) => trainer.specialty))].sort(),
    []
  );

  const filteredTrainers = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    const results = trainers.filter((trainer) => {
      const matchesSearch = [
        trainer.name,
        trainer.specialty,
        trainer.location,
        trainer.experience,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm);

      const matchesLocation =
        !filters.location || trainer.location === filters.location;

      const matchesSpecialty =
        !filters.specialty || trainer.specialty === filters.specialty;

      const matchesPrice =
        !filters.maxPrice || trainer.price <= Number(filters.maxPrice);

      const matchesAvailability =
        filters.availability !== "available" || trainer.available;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSpecialty &&
        matchesPrice &&
        matchesAvailability
      );
    });

    switch (filters.sort) {
      case "rating":
        return results.sort((a, b) => b.rating - a.rating);
      case "price-low":
        return results.sort((a, b) => a.price - b.price);
      case "price-high":
        return results.sort((a, b) => b.price - a.price);
      default:
        return results;
    }
  }, [query, filters]);

  const activeFilterCount = [
    filters.location,
    filters.specialty,
    filters.maxPrice,
    filters.availability,
  ].filter(Boolean).length;

  function clearAll() {
    setQuery("");
    setFilters(initialFilters);
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#222723] px-4">
          <Search size={19} className="shrink-0 text-[#C7F36B]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, specialty or location..."
            aria-label="Search trainers"
            className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-gray-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-gray-400 hover:text-white"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold transition hover:border-[#C7F36B] lg:hidden"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-[#C7F36B] px-2 py-0.5 text-xs text-[#171A18]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <TrainerFilters
            filters={filters}
            onChange={setFilters}
            locations={locations}
            specialties={specialties}
          />
        </div>

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">
                Personal trainers
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                {filteredTrainers.length}{" "}
                {filteredTrainers.length === 1 ? "trainer" : "trainers"} found
              </p>
            </div>

            {(query || activeFilterCount > 0) && (
              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-medium text-[#C7F36B] hover:text-white"
              >
                Clear all
              </button>
            )}
          </div>

          {filteredTrainers.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTrainers.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#222723]/50 p-8 text-center">
              <div className="rounded-2xl bg-white/5 p-4">
                <Users size={28} className="text-[#C7F36B]" />
              </div>
              <h3 className="mt-4 text-lg font-bold">
                No trainers found
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
                Try changing your search or removing a filter to see more trainers.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 rounded-full bg-[#C7F36B] px-5 py-3 text-sm font-bold text-[#171A18] hover:bg-white"
              >
                Clear search and filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
