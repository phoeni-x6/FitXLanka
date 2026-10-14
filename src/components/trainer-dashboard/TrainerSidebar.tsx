"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  UserRound,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

const items = [
  { label: "Overview", href: "/trainer/dashboard", icon: LayoutDashboard },
  { label: "Booking Requests", href: "/trainer/dashboard#requests", icon: ClipboardList },
  { label: "Upcoming Sessions", href: "/trainer/dashboard#sessions", icon: CalendarDays },
];

export default function TrainerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#222723] p-4">
      <div className="mb-8 px-3 pt-3">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C7F36B]">
          FitX Lanka
        </p>
        <h2 className="mt-2 font-semibold text-[#F4F5F0]">
          Trainer workspace
        </h2>
        <p className="mt-1 text-xs text-white/45">Manage your fitness business</p>
      </div>

      <nav className="space-y-2">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/trainer/dashboard"
              ? pathname === "/trainer/dashboard"
              : false;

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
          href="/trainers/1"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 hover:bg-white/5"
        >
          <UserRound className="h-5 w-5" />
          Public profile preview
          <ExternalLink className="ml-auto h-4 w-4" />
        </Link>

        <Link
          href="/trainers"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 hover:bg-white/5"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to marketplace
        </Link>
      </div>
    </aside>
  );
}