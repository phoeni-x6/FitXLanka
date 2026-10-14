import Link from "next/link";
import {
  CalendarCheck,
  Dumbbell,
  Heart,
  Search,
  ArrowUpRight,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import StatCard from "@/components/dashboard/StatCard";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import SavedTrainers from "@/components/dashboard/SavedTrainers";

export default function DashboardPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#171A18] px-4 py-8 text-[#F4F5F0] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-[#C7F36B]">
              CLIENT WORKSPACE
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Your fitness journey.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
              Manage your sessions, discover local gyms, and find trainers
              who can help you reach your goals.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <DashboardSidebar />
            </div>

            <div className="min-w-0 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                  label="Total bookings"
                  value="08"
                  description="Sample lifetime bookings"
                  icon={CalendarCheck}
                />

                <StatCard
                  label="Upcoming sessions"
                  value="02"
                  description="Sample upcoming appointments"
                  icon={Dumbbell}
                />

                <StatCard
                  label="Saved trainers"
                  value="02"
                  description="Example recommendations"
                  icon={Heart}
                />
              </div>

              <div className="rounded-2xl bg-[#C7F36B] p-6 text-[#171A18] sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider">
                      Ready for your next session?
                    </p>

                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                      Find your next fit.
                    </h2>

                    <p className="mt-2 max-w-lg text-sm text-[#171A18]/70">
                      Explore trainers and gyms across Sri Lanka.
                    </p>
                  </div>

                  <Link
                    href="/trainers"
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#171A18] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#303630] sm:self-auto"
                  >
                    Explore trainers
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <UpcomingBookings />
                <SavedTrainers />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/gyms"
                  className="group rounded-2xl border border-white/10 bg-[#222723] p-5 transition hover:border-[#C7F36B]/40"
                >
                  <Dumbbell className="h-6 w-6 text-[#C7F36B]" />

                  <h3 className="mt-4 font-semibold">Discover gyms</h3>

                  <p className="mt-2 text-sm text-white/50">
                    Compare facilities, locations, and membership options.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-[#C7F36B]">
                    Browse gyms
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>

                <Link
                  href="/trainers"
                  className="group rounded-2xl border border-white/10 bg-[#222723] p-5 transition hover:border-[#C7F36B]/40"
                >
                  <Search className="h-6 w-6 text-[#C7F36B]" />

                  <h3 className="mt-4 font-semibold">Find a trainer</h3>

                  <p className="mt-2 text-sm text-white/50">
                    Explore coaching specialties and session prices.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-[#C7F36B]">
                    Browse trainers
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              </div>

              <p className="text-center text-xs text-white/35">
                Prototype dashboard · All dashboard statistics and bookings
                are sample data. Sign-in and access control are not connected.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}