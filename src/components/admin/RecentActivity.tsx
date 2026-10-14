
import {
  UserPlus,
  CalendarCheck,
  Building2,
  ShieldCheck,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "New client registered",
    description: "A new client joined the platform.",
    time: "10 minutes ago",
    icon: UserPlus,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
  },
  {
    id: 2,
    title: "Booking request received",
    description: "A client requested a training session.",
    time: "35 minutes ago",
    icon: CalendarCheck,
    color: "text-[#C7F36B]",
    bg: "bg-[#C7F36B]/10",
  },
  {
    id: 3,
    title: "Gym listing submitted",
    description: "A gym owner submitted a new listing.",
    time: "2 hours ago",
    icon: Building2,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    id: 4,
    title: "Trainer profile awaiting review",
    description: "A trainer profile requires administrator approval.",
    time: "3 hours ago",
    icon: ShieldCheck,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
];

export default function RecentActivity() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Recent activity
        </h2>
        <p className="mt-1 text-sm text-white/45">
          A sample overview of platform events.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div key={activity.id} className="flex gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.bg}`}
              >
                <Icon size={18} className={activity.color} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-white">
                  {activity.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-white/45">
                  {activity.description}
                </p>

                <p className="mt-2 text-[11px] text-white/30">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 border-t border-white/10 pt-4 text-xs text-white/35">
        Activity shown here is static demonstration data.
      </p>
    </section>
  );
}
