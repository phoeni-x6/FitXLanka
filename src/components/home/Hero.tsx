import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import SearchBar from "./SearchBar";

type HeroProps = {
  query: string;
  setQuery: (value: string) => void;
};

export default function Hero({ query, setQuery }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.88fr] lg:gap-16">
          {/* Hero content */}
          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-brand-lime" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-lime">
                Fitness, on your terms
              </span>
            </div>

            <h1 className="max-w-2xl text-[3.25rem] font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.5rem]">
              Your goals.
              <br />
              Your people.
              <br />
              <span className="text-brand-lime">Your move.</span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
              Find gyms and personal trainers across Sri Lanka.
              Discover the right place to train and the right people
              to help you move forward.
            </p>

            <div className="mt-9 max-w-xl">
              <SearchBar query={query} setQuery={setQuery} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  strokeWidth={1.8}
                  className="text-brand-lime"
                />
                Local gyms
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  strokeWidth={1.8}
                  className="text-brand-lime"
                />
                Personal trainers
              </span>
            </div>

            <div className="mt-9">
              <Link
                href="/trainers"
                className="group inline-flex items-center gap-2 border-b border-brand-lime/50 pb-2 text-sm font-semibold text-white transition-colors hover:border-brand-lime hover:text-brand-lime"
              >
                Explore personal trainers
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Hero image — original image preserved */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="relative">
              <div className="relative h-[360px] overflow-hidden rounded-sm sm:h-[460px] lg:h-[560px]">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1100&q=85"
                  alt="Modern gym with strength training equipment"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px w-7 bg-brand-lime" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-lime">
                      FitX Lanka
                    </span>
                  </div>

                  <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Make room
                    <br />
                    for stronger.
                  </h2>
                </div>
              </div>

              {/* Simple image caption */}
              <div className="flex items-center justify-between border-b border-white/15 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                  Find your place to train
                </p>
                <span className="text-xs font-medium text-brand-lime">
                  Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}