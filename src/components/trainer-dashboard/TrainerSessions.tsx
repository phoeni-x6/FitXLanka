import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const sessions = [
  {
    id: 1,
    client: "Amara Silva",
    service: "Strength Training",
    date: "18 Oct 2026",
    time: "08:00 AM",
    location: "Colombo",
    status: "Confirmed",
  },
  {
    id: 2,
    client: "Ravindu Perera",
    service: "Muscle Building",
    date: "19 Oct 2026",
    time: "04:30 PM",
    location: "Nugegoda",
    status: "Confirmed",
  },
  {
    id: 3,
    client: "Nethmi Fernando",
    service: "Fitness Assessment",
    date: "21 Oct 2026",
    time: "06:00 AM",
    location: "Maharagama",
    status: "Confirmed",
  },
];

export default function TrainerSessions() {
  return (
    <section
      id="sessions"
      className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#F4F5F0]">
            Upcoming sessions
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Your scheduled client sessions.
          </p>
        </div>

        <Link
          href="/bookings"
          aria-label="View booking page"
          className="rounded-lg p-2 text-[#C7F36B] transition hover:bg-white/5"
        >
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {sessions.map((session) => (
          <article
            key={session.id}
            className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="font-medium text-white">{session.client}</h3>
              <p className="mt-1 text-sm text-white/50">{session.service}</p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/45">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[#C7F36B]" />
                  {session.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#C7F36B]" />
                  {session.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#C7F36B]" />
                  {session.location}
                </span>
              </div>
            </div>

            <span className="w-fit rounded-full bg-[#C7F36B]/10 px-3 py-1 text-xs font-medium text-[#C7F36B]">
              {session.status}
            </span>
          </article>
        ))}
      </div>

      <p className="mt-4 text-xs text-white/35">
        Sample sessions for prototype demonstration only.
      </p>
    </section>
  );
}