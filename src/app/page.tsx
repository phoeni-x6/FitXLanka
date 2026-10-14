
"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedTrainers from "@/components/home/FeaturedTrainers";
import FeaturedGyms from "@/components/home/FeaturedGyms";
import { ArrowRight, Dumbbell, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-screen bg-brand-charcoal text-brand-cream">
      <Navbar />

      <Hero query={query} setQuery={setQuery} />

      <section
        id="discover"
        className="border-y border-white/10 bg-[#1c201d]"
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-brand-lime/10 p-3 text-brand-lime">
              <Dumbbell size={24} />
            </div>
            <div>
              <p className="font-bold">Find your gym</p>
              <p className="mt-1 text-xs text-gray-400">
                Compare local fitness spaces
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-brand-lime/10 p-3 text-brand-lime">
              <Users size={24} />
            </div>
            <div>
              <p className="font-bold">Meet your trainer</p>
              <p className="mt-1 text-xs text-gray-400">
                Find a coach for your goals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-brand-lime/10 p-3 text-brand-lime">
              <MapPin size={24} />
            </div>
            <div>
              <p className="font-bold">Train near you</p>
              <p className="mt-1 text-xs text-gray-400">
                Explore locations in Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <FeaturedTrainers query={query} />
        <FeaturedGyms query={query} />
      </div>

      <section className="px-5 pb-20 pt-8 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-brand-lime p-8 text-brand-charcoal sm:p-12 lg:p-16">
          <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border-[40px] border-black/5" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-black tracking-[0.2em]">
                FOR FITNESS PROFESSIONALS
              </p>
              <h2 className="mt-4 text-3xl font-black sm:text-5xl">
                Ready to grow your fitness business?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-black/70 sm:text-base">
                Connect with potential clients and help more people
                reach their fitness goals.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-charcoal px-6 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-brand-charcoal"
            >
              Join the platform <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
