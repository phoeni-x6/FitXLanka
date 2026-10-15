
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarPlus,
  CircleHelp,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrainerSidebar from "@/components/trainer-dashboard/TrainerSidebar";
import TrainerStats from "@/components/trainer-dashboard/TrainerStats";
import BookingRequests from "@/components/trainer-dashboard/BookingRequests";
import TrainerSessions from "@/components/trainer-dashboard/TrainerSessions";
import { requireRole } from "@/lib/auth/require-role";

export default async function TrainerDashboardPage() {
  // Verify the user's session and trainer role on the server.
  await requireRole("trainer");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#171A18] px-4 py-8 text-[#F4F5F0] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
                Trainer workspace
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Manage your training business.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
                Review client requests, prepare for upcoming sessions, and
                keep your coaching activity organized.
              </p>
            </div>

            <Link
              href="/trainers"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d6ff84]"
            >
              View marketplace
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Dashboard layout */}
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <TrainerSidebar />
            </div>

            <div className="min-w-0 space-y-6">
              {/* Profile reminder */}
              <div className="flex flex-col gap-3 rounded-2xl border border-[#C7F36B]/20 bg-[#222723] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[#C7F36B]/10 p-2.5">
                    <BadgeCheck className="h-5 w-5 text-[#C7F36B]" />
                  </div>

                  <div>
                    <h2 className="font-medium text-white">
                      Build your trainer profile
                    </h2>

                    <p className="mt-1 text-sm text-white/50">
                      Keep your specialties, pricing, and availability up to date.
                    </p>
                  </div>
                </div>

                <Link
                  href="/trainers/1"
                  className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-medium text-[#C7F36B] hover:underline"
                >
                  Preview profile
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Statistics */}
              <TrainerStats />

              {/* Requests and sessions */}
              <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
                <BookingRequests />
                <TrainerSessions />
              </div>

              {/* Quick links and prototype information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/bookings"
                  className="group rounded-2xl border border-white/10 bg-[#222723] p-5 transition hover:border-[#C7F36B]/40"
                >
                  <CalendarPlus className="h-6 w-6 text-[#C7F36B]" />

                  <h3 className="mt-4 font-semibold">
                    Booking experience
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Preview the booking flow clients use to request sessions.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-[#C7F36B]">
                    View booking page
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>

                <div className="rounded-2xl border border-white/10 bg-[#222723] p-5">
                  <CircleHelp className="h-6 w-6 text-[#C7F36B]" />

                  <h3 className="mt-4 font-semibold">
                    Prototype notice
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Dashboard requests, sessions, and earnings are sample data.
                    Authentication is connected, but trainer-specific records
                    and dashboard changes are not yet connected to Supabase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
