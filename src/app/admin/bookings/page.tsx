
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import BookingManagement from "@/components/admin/BookingManagement";

export default function AdminBookingsPage() {
  return (
    <main className="min-h-screen bg-[#171A18] px-4 py-6 text-[#F4F5F0] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#C7F36B]"
          >
            <ArrowLeft size={16} />
            Back to overview
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
                <CalendarDays size={17} />
                Administration
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Bookings management
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
                Monitor trainer sessions and gym visits, review booking
                details, and manage booking statuses from one place.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#222723] px-4 py-3 text-xs font-medium text-white/60">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              Demo mode
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <AdminSidebar />
          </div>

          <div className="min-w-0">
            <BookingManagement />

            <div className="mt-6 rounded-xl border border-amber-400/15 bg-amber-400/5 px-4 py-3">
              <p className="text-xs leading-5 text-amber-200/75">
                <strong>Prototype notice:</strong> Booking records and amounts
                are sample data. Status changes exist only in browser state
                and reset on reload. Revenue figures are illustrative, not
                verified payments or actual platform earnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
