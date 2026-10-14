
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import SearchBar from "./SearchBar";

type HeroProps = {
  query: string;
  setQuery: (value: string) => void;
};

export default function Hero({ query, setQuery }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute -right-40 -top-20 h-96 w-96 rounded-full bg-brand-lime/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-lime/20 bg-brand-lime/5 px-4 py-2 text-xs font-semibold tracking-wide text-brand-lime">
            <span className="h-2 w-2 rounded-full bg-brand-lime" />
            YOUR FITNESS. YOUR WAY.
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Find your fit.
            <br />
            <span className="text-brand-lime">Own your</span>
            <br />
            journey.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
            Discover gyms and personal trainers across Sri Lanka.
            Find the right people, the right place, and a fitness
            plan that works for you.
          </p>

          <SearchBar query={query} setQuery={setQuery} />

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-brand-lime" />
              Discover local gyms
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-brand-lime" />
              Compare trainers
            </span>
          </div>

          <div className="mt-9">
            <Link
              href="/trainers"
              className="inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-brand-lime"
            >
              Explore personal trainers <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-4 rounded-[2rem] border border-white/5" />

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-brand-surface p-3">
            <div className="relative h-[400px] overflow-hidden rounded-[1.25rem] sm:h-[470px]">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1100&q=85"
                alt="Modern gym with strength training equipment"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/10" />

              <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                TRAIN SMARTER
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-sm font-medium text-brand-lime">
                  YOUR NEXT CHAPTER
                </p>
                <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                  Strong starts here.
                </h2>
                <p className="mt-2 text-sm text-gray-300">
                  Make every workout count.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -left-4 top-16 hidden rounded-2xl border border-white/10 bg-[#222723] p-4 shadow-xl sm:block">
            <p className="text-xs text-gray-400">Your next goal</p>
            <p className="mt-1 text-lg font-bold text-white">
              Better every day <ArrowDownRight className="inline text-brand-lime" size={18} />
            </p>
          </div>

          <div className="absolute -right-3 bottom-12 rounded-2xl border border-white/10 bg-[#222723] p-4 shadow-xl sm:-right-5">
            <p className="text-xs text-gray-400">Find your fit</p>
            <p className="mt-1 text-sm font-bold text-brand-lime">
              Gyms + Trainers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
