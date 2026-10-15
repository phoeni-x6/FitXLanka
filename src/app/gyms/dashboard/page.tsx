
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CircleHelp,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GymOwnerSidebar from "@/components/gym-dashboard/GymOwnerSidebar";
import GymOwnerStats from "@/components/gym-dashboard/GymOwnerStats";
import GymEnquiries from "@/components/gym-dashboard/GymEnquiries";
import GymVisits from "@/components/gym-dashboard/GymVisits";
import { requireRole } from "@/lib/auth/require-role";

export default async function GymOwnerDashboardPage() {
  // Verify the user's session and gym owner role on the server.
  await requireRole("gym_owner");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#171A18] px-4 py-8 text-[#F4F5F0] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
                Gym owner workspace
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Grow your fitness business.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
                Review membership enquiries, coordinate gym visits, and
                manage your presence on the FitX Lanka marketplace.
              </p>
            </div>

            <Link
              href="/gyms"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d6ff84]"
            >
              View marketplace
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Dashboard layout */}
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <GymOwnerSidebar />
            </div>

            <div className="min-w-0 space-y-6">
              {/* Gym listing reminder */}
              <div className="flex flex-col gap-3 rounded-2xl border border-[#C7F36B]/20 bg-[#222723] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[#C7F36B]/10 p-2.5">
                    <BadgeCheck className="h-5 w-5 text-[#C7F36B]" />
                  </div>

                  <div>
                    <h2 className="font-medium text-white">
                      Complete your gym listing
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-white/50">
                      Keep your location, facilities, pricing, and membership
                      information up to date.
                    </p>
                  </div>
                </div>

                <Link
                  href="/gyms/1"
                  className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-medium text-[#C7F36B] hover:underline"
                >
                  Preview listing
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Statistics */}
              <GymOwnerStats />

              {/* Enquiries and visits */}
              <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
                <GymEnquiries />
                <GymVisits />
              </div>

              {/* Quick links and prototype information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/gyms/1"
                  className="group rounded-2xl border border-white/10 bg-[#222723] p-5 transition hover:border-[#C7F36B]/40"
                >
                  <Building2 className="h-6 w-6 text-[#C7F36B]" />

                  <h3 className="mt-4 font-semibold text-white">
                    Public gym listing
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Preview how a gym appears to clients browsing the
                    marketplace.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-[#C7F36B]">
                    View listing
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>

                <div className="rounded-2xl border border-white/10 bg-[#222723] p-5">
                  <CircleHelp className="h-6 w-6 text-[#C7F36B]" />

                  <h3 className="mt-4 font-semibold text-white">
                    Prototype notice
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Authentication and role checks are connected. Enquiries,
                    visits, statistics, and gym information are still sample
                    data and are not persisted to Supabase.
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
