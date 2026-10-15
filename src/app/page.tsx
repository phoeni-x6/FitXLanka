
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Dumbbell,
  MapPin,
  Users,
  BadgeCheck,
  Building2,
  Sparkles,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedTrainers from "@/components/home/FeaturedTrainers";
import FeaturedGyms from "@/components/home/FeaturedGyms";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [showApplicationSection, setShowApplicationSection] =
    useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function checkClientRole() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (active) setShowApplicationSection(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (active) {
        setShowApplicationSection(!error && profile?.role === "client");
      }
    }

    checkClientRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkClientRole();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="min-h-screen bg-brand-charcoal text-brand-cream">
      <Navbar />

      <Hero query={query} setQuery={setQuery} />

      {/* Discover features */}
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

      {/* Featured content */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <FeaturedTrainers query={query} />
        <FeaturedGyms query={query} />
      </div>

      {/* Client-only application section */}
      {showApplicationSection && (
        <section className="px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#1c201d]">
            <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-12">
              {/* Section introduction */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-lime/20 bg-brand-lime/10 px-3 py-1.5 text-xs font-semibold text-brand-lime">
                  <Sparkles size={14} />
                  Grow with FitX Lanka
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                  Turn your fitness passion into an opportunity.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                  Are you a personal trainer or gym owner? Apply to join
                  FitX Lanka, showcase your services, and connect with
                  people looking for fitness solutions across Sri Lanka.
                </p>
              </div>

              {/* Application cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Trainer application */}
                <Link
                  href="/trainers/apply"
                  className="group flex flex-col rounded-2xl border border-white/10 bg-[#222723] p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-lime/40 hover:bg-[#272d27]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-lime/10 text-brand-lime transition group-hover:bg-brand-lime group-hover:text-brand-charcoal">
                    <BadgeCheck size={25} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Become a Trainer
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-6 text-white/50">
                    Share your expertise, showcase your specialties,
                    and help clients achieve their fitness goals.
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-lime">
                    Apply as a trainer
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>

                {/* Gym application */}
                <Link
                  href="/gyms/apply"
                  className="group flex flex-col rounded-2xl border border-white/10 bg-[#222723] p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-lime/40 hover:bg-[#272d27]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-lime/10 text-brand-lime transition group-hover:bg-brand-lime group-hover:text-brand-charcoal">
                    <Building2 size={25} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Register Your Gym
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-6 text-white/50">
                    List your fitness facility, introduce your equipment
                    and services, and reach potential members.
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-lime">
                    Apply as a gym owner
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* General call to action */}
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
              Join the platform
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
