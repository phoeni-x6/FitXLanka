
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Building2,
  CalendarDays,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Trainer Approvals",
    href: "/admin/trainers",
    icon: Dumbbell,
  },
  {
    label: "Gym Approvals",
    href: "/admin/gyms",
    icon: Building2,
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: CalendarDays,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#222723] p-4">
      <div className="mb-8 px-3 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C7F36B] text-[#171A18]">
            <ShieldCheck size={21} />
          </div>

          <div>
            <p className="text-sm font-black text-white">
              FitX <span className="text-[#C7F36B]">Lanka</span>
            </p>
            <p className="mt-0.5 text-[11px] text-white/45">
              Administration
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-[#171A18] p-3">
          <p className="text-xs text-white/45">Workspace</p>
          <p className="mt-1 text-sm font-semibold text-white">
            Platform Admin
          </p>
          <p className="mt-1 text-xs text-amber-300">
            Demo mode
          </p>
        </div>
      </div>

      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
        Management
      </p>

      <nav className="space-y-1.5">
        {navigation.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                active
                  ? "bg-[#C7F36B] font-semibold text-[#171A18]"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={19} />
          Back to website
        </Link>
      </div>
    </aside>
  );
}
