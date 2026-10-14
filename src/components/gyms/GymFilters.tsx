"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";

export type GymFiltersState = {
  location: string;
  category: string;
  maxPrice: string;
  sort: string;
};

type GymFiltersProps = {
  filters: GymFiltersState;
  onChange: (filters: GymFiltersState) => void;
  locations: string[];
  categories: string[];
};

export default function GymFilters({
  filters,
  onChange,
  locations,
  categories,
}: GymFiltersProps) {
  const update = (key: keyof GymFiltersState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const reset = () => {
    onChange({
      location: "",
      category: "",
      maxPrice: "",
      sort: "recommended",
    });
  };

  const selectClass =
    "w-full rounded-xl border border-white/10 bg-[#171A18] px-3 py-3 text-sm text-[#F4F5F0] outline-none transition focus:border-[#C7F36B]";

  return (
    <aside className="rounded-2xl border border-white/10 bg-[#222723] p-5">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[#C7F36B]" />
          <h2 className="font-semibold">Filters</h2>
        </div>

        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-white/50 transition hover:text-[#C7F36B]"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/65">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => update("location", e.target.value)}
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
          <label className="mb-2 block text-sm text-white/65">
            Gym type
          </label>
          <select
            value={filters.category}
            onChange={(e) => update("category", e.target.value)}
            className={selectClass}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/65">
            Monthly membership
          </label>
          <select
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className={selectClass}
          >
            <option value="">Any price</option>
            <option value="5000">Up to LKR 5,000</option>
            <option value="7500">Up to LKR 7,500</option>
            <option value="10000">Up to LKR 10,000</option>
            <option value="15000">Up to LKR 15,000</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/65">
            Sort by
          </label>
          <select
            value={filters.sort}
            onChange={(e) => update("sort", e.target.value)}
            className={selectClass}
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Highest rated</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
