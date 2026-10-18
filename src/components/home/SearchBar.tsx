
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
      className="mt-8 flex max-w-3xl flex-col gap-2 rounded-xl border border-white/10 bg-brand-surface p-2 transition-colors focus-within:border-brand-lime/40 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-3 px-3">
        <Search className="shrink-0 text-brand-lime" size={21} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Trainer, gym or specialty..."
          aria-label="Search trainers and gyms"
          className="w-full bg-transparent py-3 text-base text-white outline-none placeholder:text-white/45"
        />
      </div>

      <div className="hidden items-center gap-2 border-l border-white/10 px-4 text-sm text-gray-400 lg:flex">
        <MapPin size={17} className="text-brand-lime" />
        Sri Lanka
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-lg bg-brand-lime px-6 py-3.5 text-sm font-bold text-brand-charcoal transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
      >
        Discover <ArrowRight size={17} />
      </button>
    </form>
  );
}
