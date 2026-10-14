
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Building2,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

const items = [
  {
    label: "Overview",
    href: "/gym/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Membership Enquiries",
    href: "/gym/dashboard#enquiries",
    icon: ClipboardList,
  },
  {
    label: "Upcoming Visits",
    href: "/gym/dashboard#visits",
    icon: CalendarDays,
  },
];

export default function GymOwnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#222723] p-4">
      <div className="mb-8 px-3 pt-3">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C7F36B]">
          FitX Lanka
        </p>
        <h2 className="mt-2 font-semibold text-[#F4F5F0]">
          Gym owner workspace
        </h2>
        <p className="mt-1 text-xs text-white/45">
          Manage your fitness facility
        </p>
      </div>

      <nav className="space-y-2">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/gym/dashboard" &&
            pathname === "/gym/dashboard";

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
          href="/gyms/1"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 hover:bg-white/5"
        >
          <Building2 className="h-5 w-5" />
          Preview gym listing
          <ExternalLink className="ml-auto h-4 w-4" />
        </Link>

        <Link
          href="/gyms"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 hover:bg-white/5"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to marketplace
        </Link>
      </div>
    </aside>
  );
}
