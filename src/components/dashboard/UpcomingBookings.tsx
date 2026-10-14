import Link from "next/link";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";

const bookings = [
  {
    id: 1,
    title: "Personal Training",
    provider: "Kasun Perera",
    location: "Colombo",
    date: "18 Oct 2026",
    time: "08:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    title: "Gym Visit",
    provider: "Iron House Fitness",
    location: "Colombo 05",
    date: "20 Oct 2026",
    time: "05:30 PM",
    status: "Pending",
  },
];

export default function UpcomingBookings() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#F4F5F0]">
            Upcoming bookings
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Keep track of your next sessions.
          </p>
        </div>

        <Link
          href="/bookings"
          className="flex shrink-0 items-center gap-2 text-sm text-[#C7F36B] hover:underline"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-xl border border-white/10 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-medium text-white">{booking.title}</h3>
                <p className="mt-1 text-sm text-white/55">
                  {booking.provider}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  booking.status === "Confirmed"
                    ? "bg-[#C7F36B]/10 text-[#C7F36B]"
                    : "bg-amber-400/10 text-amber-300"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/50">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#C7F36B]" />
                {booking.date}
              </span>

              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#C7F36B]" />
                {booking.time}
              </span>

              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C7F36B]" />
                {booking.location}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-white/35">
        Sample bookings for prototype demonstration only.
      </p>
    </section>
  );
}