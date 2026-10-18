
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  LoaderCircle,
  Search,
  Users,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import TrainerFilters, { type TrainerFiltersState } from "./TrainerFilters";
import TrainerCard, { type DirectoryTrainer } from "./TrainerCard";

const initialFilters: TrainerFiltersState = {
  location: "",
  specialty: "",
  maxPrice: "",
  sort: "recommended",
};

export default function TrainerDirectory() {
  const [trainers, setTrainers] = useState<DirectoryTrainer[]>([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] =
    useState<TrainerFiltersState>(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { data, error: queryError } = await supabase
        .from("trainer_profiles")
        .select(
          "id, full_name, specialty, bio, location, experience_years, price_per_session, profile_image_url"
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (queryError) {
        throw queryError;
      }

      const mappedTrainers: DirectoryTrainer[] = (data ?? []).map(
        (trainer) => ({
          id: trainer.id,
          name: trainer.full_name,
          specialty: trainer.specialty || "Personal Training",
          description: trainer.bio ?? "",
          location: trainer.location || "Location not specified",
          experienceYears: Number(trainer.experience_years ?? 0),
          price: Number(trainer.price_per_session ?? 0),
          image: trainer.profile_image_url || null,
        })
      );

      setTrainers(mappedTrainers);
    } catch (err) {
      console.error("Failed to load trainers:", err);
      setError(
        "We couldn't load trainers right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTrainers();
  }, [fetchTrainers]);

  const locations = useMemo(
    () =>
      [...new Set(trainers.map((trainer) => trainer.location))]
        .filter((location) => location !== "Location not specified")
        .sort(),
    [trainers]
  );

  const specialties = useMemo(
    () =>
      [...new Set(trainers.map((trainer) => trainer.specialty))].sort(),
    [trainers]
  );

  const filteredTrainers = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    const results = trainers.filter((trainer) => {
      const searchableText = [
        trainer.name,
        trainer.specialty,
        trainer.location,
        trainer.description,
        `${trainer.experienceYears} years`,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm);
      const matchesLocation =
        !filters.location || trainer.location === filters.location;
      const matchesSpecialty =
        !filters.specialty || trainer.specialty === filters.specialty;
      const matchesPrice =
        !filters.maxPrice ||
        (trainer.price > 0 &&
          trainer.price <= Number(filters.maxPrice));

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSpecialty &&
        matchesPrice
      );
    });

    switch (filters.sort) {
      case "price-low":
        return [...results].sort((a, b) => {
          if (a.price === 0) return 1;
          if (b.price === 0) return -1;
          return a.price - b.price;
        });
      case "price-high":
        return [...results].sort((a, b) => b.price - a.price);
      case "experience":
        return [...results].sort(
          (a, b) => b.experienceYears - a.experienceYears
        );
      default:
        return results;
    }
  }, [trainers, query, filters]);

  const activeFilterCount = [
    filters.location,
    filters.specialty,
    filters.maxPrice,
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
                {loading
                  ? "Loading trainers..."
                  : `${filteredTrainers.length} ${
                      filteredTrainers.length === 1
                        ? "trainer"
                        : "trainers"
                    } found`}
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

          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#222723]/50 p-8 text-center">
              <LoaderCircle
                size={32}
                className="animate-spin text-[#C7F36B]"
              />
              <p className="mt-4 text-sm text-gray-400">
                Finding trainers for you...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#222723]/50 p-8 text-center">
              <AlertCircle size={30} className="text-red-400" />
              <h3 className="mt-4 text-lg font-bold">
                Unable to load trainers
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                {error}
              </p>
              <button
                type="button"
                onClick={() => void fetchTrainers()}
                className="mt-5 rounded-full bg-[#C7F36B] px-5 py-3 text-sm font-bold text-[#171A18] hover:bg-white"
              >
                Try again
              </button>
            </div>
          ) : filteredTrainers.length > 0 ? (
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
                {trainers.length === 0
                  ? "No trainers listed yet"
                  : "No trainers found"}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
                {trainers.length === 0
                  ? "Approved trainers will appear here when their profiles are published."
                  : "Try changing your search or removing a filter to see more trainers."}
              </p>
              {(query || activeFilterCount > 0) && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-5 rounded-full bg-[#C7F36B] px-5 py-3 text-sm font-bold text-[#171A18] hover:bg-white"
                >
                  Clear search and filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
