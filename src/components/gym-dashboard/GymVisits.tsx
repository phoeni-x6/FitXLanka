
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const visits = [
  {
    id: 1,
    name: "Amara Silva",
    purpose: "Gym tour",
    date: "18 Oct 2026",
    time: "08:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Ravindu Perera",
    purpose: "Membership consultation",
    date: "19 Oct 2026",
    time: "04:30 PM",
    status: "Confirmed",
  },
  {
    id: 3,
    name: "Nethmi Fernando",
    purpose: "Day pass visit",
    date: "20 Oct 2026",
    time: "06:00 AM",
    status: "Pending",
  },
];

export default function GymVisits() {
  return (
    <section
      id="visits"
      className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-6"
    >
      <div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[#C7F36B]" />
          <h2 className="text-lg font-semibold text-white">
            Upcoming visits
          </h2>
        </div>
        <p className="mt-1 text-sm text-white/45">
          Keep track of planned visits and consultations.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {visits.map((visit) => (
          <div key={visit.id} className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C7F36B]/10">
              <CalendarDays className="h-5 w-5 text-[#C7F36B]" />
            </div>

            <div className="min-w-0 flex-1 border-b border-white/10 pb-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {visit.name}
                  </h3>
                  <p className="mt-1 text-xs text-white/45">
                    {visit.purpose}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                    visit.status === "Confirmed"
                      ? "bg-[#C7F36B]/10 text-[#C7F36B]"
                      : "bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {visit.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-xs text-white/45">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {visit.date}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {visit.time}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Colombo 05
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/bookings"
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#C7F36B] hover:underline"
      >
        View booking experience
        <ArrowUpRight className="h-4 w-4" />
      </Link>

      <p className="mt-3 text-xs text-white/35">
        Sample visits for demonstration. No real appointments are stored.
      </p>
    </section>
  );
}
