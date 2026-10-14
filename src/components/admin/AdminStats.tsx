
import {
  Users,
  Dumbbell,
  Building2,
  CalendarCheck,
} from "lucide-react";

const stats = [
  {
    label: "Total Users",
    value: "1,284",
    note: "Across all account types",
    icon: Users,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
  },
  {
    label: "Trainer Profiles",
    value: "86",
    note: "Sample platform total",
    icon: Dumbbell,
    color: "text-[#C7F36B]",
    bg: "bg-[#C7F36B]/10",
  },
  {
    label: "Gym Listings",
    value: "42",
    note: "Sample platform total",
    icon: Building2,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    label: "Total Bookings",
    value: "356",
    note: "Sample booking count",
    icon: CalendarCheck,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
];

export default function AdminStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-[#222723] p-5 transition hover:border-white/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white/50">
                  {stat.label}
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </p>
              </div>

              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>

            <p className="mt-4 text-xs text-white/40">
              {stat.note}
            </p>
          </div>
        );
      })}
    </div>
  );
}
