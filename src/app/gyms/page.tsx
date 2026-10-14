import Link from "next/link";
import { ArrowLeft, Dumbbell, MapPin } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GymDirectory from "@/components/gyms/GymDirectory";

export default function GymsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#171A18] text-[#F4F5F0]">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-[#C7F36B]/[0.07] blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#C7F36B]"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C7F36B]/20 bg-[#C7F36B]/[0.07] px-3 py-2 text-xs font-medium text-[#C7F36B]">
                  <Dumbbell size={14} />
                  FIND YOUR FITNESS SPACE
                </div>

                <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Find a gym.
                  <br />
                  <span className="text-[#C7F36B]">
                    Build your future.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
                  Discover gyms across Sri Lanka, compare membership
                  prices, explore facilities, and find a space that
                  fits your fitness goals.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-[#222723] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
                  <MapPin size={21} />
                </div>

                <div>
                  <p className="text-sm font-medium">Explore nearby areas</p>
                  <p className="mt-1 text-xs text-white/45">
                    Colombo · Nugegoda · Dehiwala
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-2">
              {["Strength training", "Cardio", "Group classes", "Flexible plans"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/55"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        <div className="pt-10">
          <GymDirectory />
        </div>
      </main>

      <Footer />
    </>
  );
}