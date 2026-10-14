import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Wallet,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    label: "Pending requests",
    value: "04",
    note: "Awaiting your response",
    icon: Clock,
    color: "text-amber-300",
  },
  {
    label: "Upcoming sessions",
    value: "06",
    note: "Scheduled sessions",
    icon: CalendarCheck,
    color: "text-[#C7F36B]",
  },
  {
    label: "Completed sessions",
    value: "24",
    note: "Demo total",
    icon: CheckCircle2,
    color: "text-sky-300",
  },
  {
    label: "Demo earnings",
    value: "84,000",
    note: "LKR · Illustrative only",
    icon: Wallet,
    color: "text-[#C7F36B]",
  },
];

export default function TrainerStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map(({ label, value, note, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-2xl border border-white/10 bg-[#222723] p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-white/55">{label}</p>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>

          <p className="mt-4 text-3xl font-semibold tracking-tight text-[#F4F5F0]">
            {value}
            {label === "Demo earnings" && (
              <span className="ml-2 text-sm font-normal text-white/50">LKR</span>
            )}
          </p>

          <p className="mt-2 text-xs text-white/40">{note}</p>
        </div>
      ))}
    </div>
  );
}