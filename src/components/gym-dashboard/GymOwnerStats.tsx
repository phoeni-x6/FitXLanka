
import {
  ClipboardList,
  CalendarCheck,
  Users,
  Wallet,
} from "lucide-react";

const stats = [
  {
    label: "New enquiries",
    value: "12",
    note: "Awaiting review",
    icon: ClipboardList,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    label: "Upcoming visits",
    value: "08",
    note: "Scheduled visits",
    icon: CalendarCheck,
    color: "text-[#C7F36B]",
    bg: "bg-[#C7F36B]/10",
  },
  {
    label: "Membership plans",
    value: "04",
    note: "Demo plans",
    icon: Users,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
  },
  {
    label: "Demo revenue",
    value: "125,000",
    note: "Illustrative only",
    icon: Wallet,
    color: "text-[#C7F36B]",
    bg: "bg-[#C7F36B]/10",
    currency: true,
  },
];

export default function GymOwnerStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-[#222723] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white/50">{stat.label}</p>

                <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>

                  {stat.currency && (
                    <span className="text-xs text-white/45">LKR</span>
                  )}
                </div>
              </div>

              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>

            <p className="mt-4 text-xs text-white/40">{stat.note}</p>
          </div>
        );
      })}
    </div>
  );
}
