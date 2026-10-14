
import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  Dumbbell,
  Building2,
  Users,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStats from "@/components/admin/AdminStats";
import PendingApprovals from "@/components/admin/PendingApprovals";
import RecentActivity from "@/components/admin/RecentActivity";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#171A18] px-4 py-6 text-[#F4F5F0] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
              <ShieldCheck size={17} />
              Administration
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Platform overview
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
              Monitor FitX Lanka, review new listings, and manage
              the fitness marketplace from one place.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#222723] px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-[#C7F36B]" />
            <span className="text-sm text-white/65">
              UI prototype
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <AdminSidebar />
          </div>

          {/* Dashboard content */}
          <div className="min-w-0 space-y-6">
            {/* Welcome panel */}
            <section className="relative overflow-hidden rounded-2xl border border-[#C7F36B]/20 bg-[#222723] p-5 sm:p-7">
              <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#C7F36B]/5 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-medium text-[#C7F36B]">
                    Admin workspace
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                    Welcome to FitX Lanka
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
                    Your central workspace for managing clients,
                    trainer applications, gym listings, and bookings.
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C7F36B]/10">
                  <ShieldCheck
                    size={29}
                    className="text-[#C7F36B]"
                  />
                </div>
              </div>
            </section>

            {/* Statistics */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Platform statistics
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  Illustrative figures for the dashboard prototype.
                </p>
              </div>

              <AdminStats />
            </div>

            {/* Approvals and activity */}
            <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
              <PendingApprovals />
              <RecentActivity />
            </div>

            {/* Quick actions */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Quick access
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  Jump to the main management areas.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Link
                  href="/admin/trainers"
                  className="group rounded-2xl border border-white/10 bg-[#222723] p-5 transition hover:border-[#C7F36B]/40"
                >
                  <Dumbbell className="h-6 w-6 text-[#C7F36B]" />

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">
                      Trainer approvals
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-white/35 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#C7F36B]" />
                  </div>

                  <p className="mt-2 text-sm leading-5 text-white/45">
                    Review trainer applications before publication.
                  </p>
                </Link>

                <Link
                  href="/admin/gyms"
                  className="group rounded-2xl border border-white/10 bg-[#222723] p-5 transition hover:border-[#C7F36B]/40"
                >
                  <Building2 className="h-6 w-6 text-violet-400" />

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">
                      Gym approvals
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-white/35 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#C7F36B]" />
                  </div>

                  <p className="mt-2 text-sm leading-5 text-white/45">
                    Verify gym details and submitted listings.
                  </p>
                </Link>

                <Link
                  href="/admin/users"
                  className="group rounded-2xl border border-white/10 bg-[#222723] p-5 transition hover:border-[#C7F36B]/40"
                >
                  <Users className="h-6 w-6 text-sky-400" />

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">
                      User management
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-white/35 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#C7F36B]" />
                  </div>

                  <p className="mt-2 text-sm leading-5 text-white/45">
                    View and manage marketplace account types.
                  </p>
                </Link>
              </div>
            </section>

            {/* Prototype disclaimer */}
            <div className="rounded-xl border border-amber-400/15 bg-amber-400/5 px-4 py-3">
              <p className="text-xs leading-5 text-amber-200/75">
                <strong>Prototype notice:</strong> All statistics,
                approval requests, and activity events are sample data.
                This page does not provide authentication, real account
                management, or persistent changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
