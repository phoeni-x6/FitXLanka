
"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";

export type TrainerFiltersState = {
  location: string;
  specialty: string;
  maxPrice: string;
  sort: string;
};

type Props = {
  filters: TrainerFiltersState;
  onChange: (filters: TrainerFiltersState) => void;
  locations: string[];
  specialties: string[];
};

const selectClass =
  "w-full rounded-xl border border-white/10 bg-[#171A18] px-3 py-3 text-sm text-white outline-none transition focus:border-[#C7F36B]";

export default function TrainerFilters({
  filters,
  onChange,
  locations,
  specialties,
}: Props) {
  function update<K extends keyof TrainerFiltersState>(
    key: K,
    value: TrainerFiltersState[K]
  ) {
    onChange({ ...filters, [key]: value });
  }

  function reset() {
    onChange({
      location: "",
      specialty: "",
      maxPrice: "",
      sort: "recommended",
    });
  }

  return (
    <aside className="h-fit rounded-2xl border border-white/10 bg-[#222723] p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold">
          <SlidersHorizontal size={18} className="text-[#C7F36B]" />
          Filters
        </h2>

        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-[#C7F36B]"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="trainer-location"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Location
          </label>

          <select
            id="trainer-location"
            value={filters.location}
            onChange={(event) =>
              update("location", event.target.value)
            }
            className={selectClass}
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="trainer-specialty"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Training specialty
          </label>

          <select
            id="trainer-specialty"
            value={filters.specialty}
            onChange={(event) =>
              update("specialty", event.target.value)
            }
            className={selectClass}
          >
            <option value="">All specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="trainer-price"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Maximum price per session
          </label>

          <select
            id="trainer-price"
            value={filters.maxPrice}
            onChange={(event) =>
              update("maxPrice", event.target.value)
            }
            className={selectClass}
          >
            <option value="">Any price</option>
            <option value="2500">Up to LKR 2,500</option>
            <option value="3000">Up to LKR 3,000</option>
            <option value="3500">Up to LKR 3,500</option>
            <option value="4000">Up to LKR 4,000</option>
            <option value="5000">Up to LKR 5,000</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="trainer-sort"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Sort by
          </label>

          <select
            id="trainer-sort"
            value={filters.sort}
            onChange={(event) => update("sort", event.target.value)}
            className={selectClass}
          >
            <option value="recommended">Recommended</option>
            <option value="experience">Most experienced</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
