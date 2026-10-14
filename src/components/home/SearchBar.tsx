
"use client";

import { Search, MapPin, ArrowRight } from "lucide-react";

type SearchBarProps = {
  query: string;
  setQuery: (value: string) => void;
};

export default function SearchBar({
  query,
  setQuery,
}: SearchBarProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        document
          .getElementById("discover")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
      className="mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/10 bg-[#222723] p-3 shadow-2xl sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-3 px-3">
        <Search className="shrink-0 text-brand-lime" size={21} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Trainer, gym or specialty..."
          aria-label="Search trainers and gyms"
          className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-500"
        />
      </div>

      <div className="hidden items-center gap-2 border-l border-white/10 px-4 text-sm text-gray-400 lg:flex">
        <MapPin size={17} className="text-brand-lime" />
        Sri Lanka
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-brand-lime px-6 py-3.5 text-sm font-bold text-brand-charcoal transition hover:bg-white"
      >
        Discover <ArrowRight size={17} />
      </button>
    </form>
  );
}
