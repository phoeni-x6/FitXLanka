"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  Dumbbell,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/bookings", icon: CalendarDays },
  { label: "Saved Trainers", href: "/trainers", icon: Heart },
  { label: "Explore Gyms", href: "/gyms", icon: Dumbbell },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#222723] p-4">
      <div className="mb-8 px-3 pt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C7F36B]">
          FitX Lanka
        </p>
        <p className="mt-2 text-sm text-white/50">Client workspace</p>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                active
                  ? "bg-[#C7F36B] font-semibold text-[#171A18]"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 pt-8">
        <Link
          href="/register"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 hover:bg-white/5"
        >
          <UserRound className="h-5 w-5" />
          My Profile
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 hover:bg-white/5"
        >
          <Settings className="h-5 w-5" />
          Back to website
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 hover:bg-white/5"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}