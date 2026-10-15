
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  Clock3,
  UserRound,
  Dumbbell,
  Building2,
  Eye,
  X,
  CheckCircle2,
  CircleAlert,
  Ban,
  Wallet,
  MapPin,
} from "lucide-react";

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

type BookingType = "Trainer Session" | "Gym Visit";

type Booking = {
  id: string;
  type: BookingType;
  customer: string;
  customerEmail: string;
  provider: string;
  providerType: "Trainer" | "Gym";
  date: string;
  time: string;
  duration: string;
  location: string;
  amount: number;
  status: BookingStatus;
  createdAt: string;
  notes: string;
};

const initialBookings: Booking[] = [
  {
    id: "FXB-1001",
    type: "Trainer Session",
    customer: "Dilan Perera",
    customerEmail: "dilan.perera@example.com",
    provider: "Kasun Perera",
    providerType: "Trainer",
    date: "2026-10-16",
    time: "08:00",
    duration: "60 minutes",
    location: "Nugegoda, Colombo",
    amount: 3500,
    status: "Confirmed",
    createdAt: "2026-10-12",
    notes: "Personal strength-training session.",
  },
  {
    id: "FXB-1002",
    type: "Gym Visit",
    customer: "Tharushi Silva",
    customerEmail: "tharushi.s@example.com",
    provider: "Iron House Fitness",
    providerType: "Gym",
    date: "2026-10-16",
    time: "10:30",
    duration: "One-day visit",
    location: "Nugegoda, Colombo",
    amount: 1500,
    status: "Pending",
    createdAt: "2026-10-13",
    notes: "First-time gym visit enquiry.",
  },
  {
    id: "FXB-1003",
    type: "Trainer Session",
    customer: "Dinithi Jayawardena",
    customerEmail: "dinithi.j@example.com",
    provider: "Nethmi Silva",
    providerType: "Trainer",
    date: "2026-10-17",
    time: "16:00",
    duration: "45 minutes",
    location: "Rajagiriya, Colombo",
    amount: 3000,
    status: "Pending",
    createdAt: "2026-10-13",
    notes: "Introductory fitness consultation.",
  },
  {
    id: "FXB-1004",
    type: "Gym Visit",
    customer: "Dilan Perera",
    customerEmail: "dilan.perera@example.com",
    provider: "Power Zone Gym",
    providerType: "Gym",
    date: "2026-10-11",
    time: "17:30",
    duration: "One-day visit",
    location: "Maharagama, Colombo",
    amount: 1200,
    status: "Completed",
    createdAt: "2026-10-08",
    notes: "Completed gym visit.",
  },
  {
    id: "FXB-1005",
    type: "Trainer Session",
    customer: "Ravindu Perera",
    customerEmail: "ravindu.p@example.com",
    provider: "Kasun Perera",
    providerType: "Trainer",
    date: "2026-10-15",
    time: "18:00",
    duration: "60 minutes",
    location: "Nugegoda, Colombo",
    amount: 3500,
    status: "Cancelled",
    createdAt: "2026-10-10",
    notes: "Cancelled in the demo booking record.",
  },
  {
    id: "FXB-1006",
    type: "Trainer Session",
    customer: "Nethmi Silva",
    customerEmail: "nethmi.client@example.com",
    provider: "Amal Fernando",
    providerType: "Trainer",
    date: "2026-10-18",
    time: "09:00",
    duration: "60 minutes",
    location: "Colombo",
    amount: 4000,
    status: "Confirmed",
    createdAt: "2026-10-14",
    notes: "General fitness and training assessment.",
  },
  {
    id: "FXB-1007",
    type: "Gym Visit",
    customer: "Dinithi Jayawardena",
    customerEmail: "dinithi.j@example.com",
    provider: "Elevate Fitness Club",
    providerType: "Gym",
    date: "2026-10-19",
    time: "11:00",
    duration: "One-day visit",
    location: "Rajagiriya, Colombo",
    amount: 1800,
    status: "Pending",
    createdAt: "2026-10-14",
    notes: "Gym tour and facilities enquiry.",
  },
  {
    id: "FXB-1008",
    type: "Trainer Session",
    customer: "Tharushi Silva",
    customerEmail: "tharushi.s@example.com",
    provider: "Nethmi Silva",
    providerType: "Trainer",
    date: "2026-10-09",
    time: "15:00",
    duration: "45 minutes",
    location: "Rajagiriya, Colombo",
    amount: 3000,
    status: "Completed",
    createdAt: "2026-10-05",
    notes: "Completed personal training session.",
  },
];

const statusStyles: Record<BookingStatus, string> = {
  Pending: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  Confirmed: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  Completed: "border-[#C7F36B]/20 bg-[#C7F36B]/10 text-[#C7F36B]",
  Cancelled: "border-red-400/20 bg-red-400/10 text-red-300",
};

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLKR(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: typeof CalendarDays;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#222723] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/50">{label}</p>
        <div className={`rounded-xl bg-white/[0.04] p-2 ${accent}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-[#F4F5F0]">
        {value}
      </p>
      <p className="mt-2 text-xs text-white/35">Demo booking data</p>
    </div>
  );
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    booking: Booking;
    status: BookingStatus;
  } | null>(null);

  const stats = useMemo(() => {
    const revenue = bookings
      .filter((booking) => booking.status === "Completed")
      .reduce((sum, booking) => sum + booking.amount, 0);

    return {
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === "Pending")
        .length,
      confirmed: bookings.filter((booking) => booking.status === "Confirmed")
        .length,
      completed: bookings.filter((booking) => booking.status === "Completed")
        .length,
      revenue,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.id.toLowerCase().includes(query) ||
        booking.customer.toLowerCase().includes(query) ||
        booking.customerEmail.toLowerCase().includes(query) ||
        booking.provider.toLowerCase().includes(query) ||
        booking.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      const matchesType = typeFilter === "All" || booking.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [bookings, search, statusFilter, typeFilter]);

  function confirmAction() {
    if (!pendingAction) return;

    setBookings((current) =>
      current.map((booking) =>
        booking.id === pendingAction.booking.id
          ? { ...booking, status: pendingAction.status }
          : booking
      )
    );

    if (selectedBooking?.id === pendingAction.booking.id) {
      setSelectedBooking({
        ...pendingAction.booking,
        status: pendingAction.status,
      });
    }

    setPendingAction(null);
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={stats.total}
          icon={CalendarDays}
          accent="text-white/70"
        />
        <StatCard
          label="Pending requests"
          value={stats.pending}
          icon={Clock3}
          accent="text-amber-300"
        />
        <StatCard
          label="Confirmed bookings"
          value={stats.confirmed}
          icon={CheckCircle2}
          accent="text-sky-300"
        />
        <StatCard
          label="Completed revenue"
          value={formatLKR(stats.revenue)}
          icon={Wallet}
          accent="text-[#C7F36B]"
        />
      </div>

      {/* Booking table */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#222723]">
        <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#F4F5F0]">
              All bookings
            </h2>
            <p className="mt-1 text-sm text-white/45">
              Review trainer sessions and gym visit requests.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:flex">
            <div className="relative sm:col-span-2 xl:min-w-[250px]">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ID, customer, provider..."
                className="w-full rounded-xl border border-white/10 bg-[#171A18] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#C7F36B]/50"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by booking status"
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#171A18] py-2.5 pl-9 pr-8 text-sm text-white outline-none focus:border-[#C7F36B]/50"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by booking type"
              className="w-full rounded-xl border border-white/10 bg-[#171A18] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C7F36B]/50"
            >
              <option value="All">All booking types</option>
              <option value="Trainer Session">Trainer sessions</option>
              <option value="Gym Visit">Gym visits</option>
            </select>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-white/40">
              <tr>
                <th className="px-5 py-4 font-medium">Booking</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Provider</th>
                <th className="px-5 py-4 font-medium">Session date</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06]">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#F4F5F0]">
                      {booking.id}
                    </p>
                    <p className="mt-1 text-xs text-white/40">{booking.type}</p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-white/80">{booking.customer}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {booking.customerEmail}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-white/80">{booking.provider}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {booking.providerType}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-white/75">
                      {formatDate(booking.date)}
                    </p>
                    <p className="mt-1 text-xs text-white/40">{booking.time}</p>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-white/80">
                    {formatLKR(booking.amount)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition hover:border-white/20 hover:text-white"
                      >
                        <Eye size={14} />
                        View
                      </button>

                      {booking.status === "Pending" && (
                        <button
                          onClick={() =>
                            setPendingAction({
                              booking,
                              status: "Confirmed",
                            })
                          }
                          className="rounded-lg bg-[#C7F36B] p-2 text-[#171A18] transition hover:bg-[#d5ff84]"
                          aria-label={`Confirm ${booking.id}`}
                          title="Confirm booking"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}

                      {(booking.status === "Pending" ||
                        booking.status === "Confirmed") && (
                        <button
                          onClick={() =>
                            setPendingAction({
                              booking,
                              status: "Cancelled",
                            })
                          }
                          className="rounded-lg border border-red-400/20 bg-red-400/5 p-2 text-red-300 transition hover:bg-red-400/10"
                          aria-label={`Cancel ${booking.id}`}
                          title="Cancel booking"
                        >
                          <Ban size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="px-5 py-16 text-center">
              <CalendarDays className="mx-auto text-white/20" size={30} />
              <p className="mt-3 text-sm text-white/60">
                No bookings match your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setTypeFilter("All");
                }}
                className="mt-3 text-xs font-medium text-[#C7F36B] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 p-4 md:hidden">
          {filteredBookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[#222723] p-2.5 text-[#C7F36B]">
                    {booking.providerType === "Trainer" ? (
                      <Dumbbell size={19} />
                    ) : (
                      <Building2 size={19} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#F4F5F0]">
                      {booking.id}
                    </p>
                    <p className="mt-1 text-xs text-white/45">{booking.type}</p>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-2 py-1 text-xs ${statusStyles[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-white/70">
                  <UserRound size={15} className="shrink-0 text-white/35" />
                  {booking.customer}
                </p>
                <p className="flex items-center gap-2 text-white/70">
                  {booking.providerType === "Trainer" ? (
                    <Dumbbell size={15} className="shrink-0 text-white/35" />
                  ) : (
                    <Building2 size={15} className="shrink-0 text-white/35" />
                  )}
                  {booking.provider}
                </p>
                <p className="flex items-center gap-2 text-white/55">
                  <CalendarDays size={15} className="shrink-0 text-white/35" />
                  {formatDate(booking.date)} · {booking.time}
                </p>
                <p className="font-semibold text-[#C7F36B]">
                  {formatLKR(booking.amount)}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.08] pt-3">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70"
                >
                  <Eye size={14} />
                  View details
                </button>

                {booking.status === "Pending" && (
                  <button
                    onClick={() =>
                      setPendingAction({ booking, status: "Confirmed" })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#C7F36B] px-3 py-2 text-xs font-semibold text-[#171A18]"
                  >
                    <CheckCircle2 size={14} />
                    Confirm
                  </button>
                )}

                {(booking.status === "Pending" ||
                  booking.status === "Confirmed") && (
                  <button
                    onClick={() =>
                      setPendingAction({ booking, status: "Cancelled" })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300"
                  >
                    <Ban size={14} />
                    Cancel
                  </button>
                )}
              </div>
            </article>
          ))}

          {filteredBookings.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm text-white/45">
                No bookings match your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setTypeFilter("All");
                }}
                className="mt-3 text-xs font-medium text-[#C7F36B] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.08] px-5 py-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredBookings.length} of {bookings.length} demo bookings
          </span>
          <span>Completed revenue includes completed demo bookings only.</span>
        </div>
      </section>

      {/* Booking details modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBooking(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-details-title"
            className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#222723] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C7F36B]">
                  Booking details
                </p>
                <h3
                  id="booking-details-title"
                  className="mt-2 text-2xl font-bold text-[#F4F5F0]"
                >
                  {selectedBooking.id}
                </h3>
                <p className="mt-1 text-sm text-white/45">
                  {selectedBooking.type}
                </p>
                <span
                  className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs ${statusStyles[selectedBooking.status]}`}
                >
                  {selectedBooking.status}
                </span>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                aria-label="Close booking details"
                className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/40">
                    <UserRound size={15} />
                    Customer
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/85">
                    {selectedBooking.customer}
                  </p>
                  <p className="mt-1 break-all text-xs text-white/40">
                    {selectedBooking.customerEmail}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/40">
                    {selectedBooking.providerType === "Trainer" ? (
                      <Dumbbell size={15} />
                    ) : (
                      <Building2 size={15} />
                    )}
                    Provider
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/85">
                    {selectedBooking.provider}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    {selectedBooking.providerType}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/40">
                    <CalendarDays size={15} />
                    Session date
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/85">
                    {formatDate(selectedBooking.date)}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    {selectedBooking.time} · {selectedBooking.duration}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/40">
                    <Wallet size={15} />
                    Booking amount
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#C7F36B]">
                    {formatLKR(selectedBooking.amount)}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Demo amount, not a verified payment
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#F4F5F0]">
                  Additional information
                </h4>
                <div className="mt-3 space-y-3 text-sm text-white/60">
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-white/35" />
                    {selectedBooking.location}
                  </p>
                  <p className="flex items-start gap-2">
                    <CalendarDays
                      size={16}
                      className="mt-0.5 shrink-0 text-white/35"
                    />
                    Booking created {formatDate(selectedBooking.createdAt)}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#171A18] p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                    Notes
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {selectedBooking.notes}
                  </p>
                </div>
              </div>

              {(selectedBooking.status === "Pending" ||
                selectedBooking.status === "Confirmed") && (
                <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row">
                  {selectedBooking.status === "Pending" && (
                    <button
                      onClick={() =>
                        setPendingAction({
                          booking: selectedBooking,
                          status: "Confirmed",
                        })
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5ff84]"
                    >
                      <CheckCircle2 size={16} />
                      Confirm booking
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setPendingAction({
                        booking: selectedBooking,
                        status: "Cancelled",
                      })
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                  >
                    <Ban size={16} />
                    Cancel booking
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Status confirmation modal */}
      {pendingAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-confirm-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#222723] p-6 shadow-2xl"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                pendingAction.status === "Confirmed"
                  ? "bg-[#C7F36B]/10 text-[#C7F36B]"
                  : "bg-red-400/10 text-red-300"
              }`}
            >
              {pendingAction.status === "Confirmed" ? (
                <CheckCircle2 size={24} />
              ) : (
                <CircleAlert size={24} />
              )}
            </div>

            <h3
              id="booking-confirm-title"
              className="mt-4 text-xl font-bold text-[#F4F5F0]"
            >
              {pendingAction.status === "Confirmed"
                ? "Confirm this booking?"
                : "Cancel this booking?"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Booking{" "}
              <span className="font-semibold text-white/85">
                {pendingAction.booking.id}
              </span>{" "}
              will be marked as{" "}
              <span
                className={
                  pendingAction.status === "Confirmed"
                    ? "font-semibold text-[#C7F36B]"
                    : "font-semibold text-red-300"
                }
              >
                {pendingAction.status.toLowerCase()}
              </span>
              . This action only changes the demo interface.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setPendingAction(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5"
              >
                Go back
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  pendingAction.status === "Confirmed"
                    ? "bg-[#C7F36B] text-[#171A18] hover:bg-[#d5ff84]"
                    : "bg-red-400 text-[#171A18] hover:bg-red-300"
                }`}
              >
                Confirm action
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
