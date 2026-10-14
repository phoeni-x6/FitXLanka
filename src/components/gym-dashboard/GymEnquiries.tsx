
"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Check,
  X,
  ClipboardList,
} from "lucide-react";

type EnquiryStatus = "Pending" | "Accepted" | "Declined";

type Enquiry = {
  id: number;
  name: string;
  plan: string;
  date: string;
  time: string;
  location: string;
  status: EnquiryStatus;
};

const initialEnquiries: Enquiry[] = [
  {
    id: 1,
    name: "Amara Silva",
    plan: "Monthly Membership",
    date: "18 Oct 2026",
    time: "08:00 AM",
    location: "Colombo 05",
    status: "Pending",
  },
  {
    id: 2,
    name: "Ravindu Perera",
    plan: "Personal Training Package",
    date: "19 Oct 2026",
    time: "04:30 PM",
    location: "Colombo 05",
    status: "Pending",
  },
  {
    id: 3,
    name: "Nethmi Fernando",
    plan: "Day Pass",
    date: "20 Oct 2026",
    time: "06:00 AM",
    location: "Colombo 05",
    status: "Pending",
  },
  {
    id: 4,
    name: "Tharushi Jayasinghe",
    plan: "Quarterly Membership",
    date: "21 Oct 2026",
    time: "05:30 PM",
    location: "Colombo 05",
    status: "Accepted",
  },
];

const filters = ["All", "Pending", "Accepted", "Declined"] as const;

export default function GymEnquiries() {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All");

  const visibleEnquiries = enquiries.filter(
    (enquiry) => filter === "All" || enquiry.status === filter
  );

  function updateStatus(id: number, status: EnquiryStatus) {
    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status } : enquiry
      )
    );
  }

  const statusStyles: Record<EnquiryStatus, string> = {
    Pending: "bg-amber-400/10 text-amber-300",
    Accepted: "bg-[#C7F36B]/10 text-[#C7F36B]",
    Declined: "bg-red-400/10 text-red-300",
  };

  return (
    <section
      id="enquiries"
      className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-[#C7F36B]" />
            <h2 className="text-lg font-semibold text-white">
              Membership enquiries
            </h2>
          </div>
          <p className="mt-1 text-sm text-white/45">
            Review requests from prospective members.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                filter === item
                  ? "bg-[#C7F36B] text-[#171A18]"
                  : "border border-white/10 text-white/55 hover:bg-white/5"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {visibleEnquiries.map((enquiry) => (
          <div
            key={enquiry.id}
            className="rounded-xl border border-white/10 p-4"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white">
                    {enquiry.name}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[enquiry.status]}`}
                  >
                    {enquiry.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#C7F36B]">
                  {enquiry.plan}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/45">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {enquiry.date}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {enquiry.time}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {enquiry.location}
                  </span>
                </div>
              </div>

              {enquiry.status === "Pending" && (
                <div className="flex shrink-0 gap-2 sm:self-center">
                  <button
                    type="button"
                    onClick={() => updateStatus(enquiry.id, "Accepted")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#C7F36B] px-3 py-2 text-xs font-semibold text-[#171A18] transition hover:bg-[#d6ff84]"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Accept
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus(enquiry.id, "Declined")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/65 transition hover:border-red-400/40 hover:text-red-300"
                  >
                    <X className="h-3.5 w-3.5" />
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {visibleEnquiries.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
            <p className="text-sm text-white/50">
              No {filter.toLowerCase()} enquiries to display.
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs leading-5 text-white/35">
        Prototype only. Enquiries are sample data, and status changes are not saved.
      </p>
    </section>
  );
}
