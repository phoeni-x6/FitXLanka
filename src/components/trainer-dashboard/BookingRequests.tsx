"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Check,
  X,
} from "lucide-react";

type RequestStatus = "Pending" | "Accepted" | "Declined";

type BookingRequest = {
  id: number;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: RequestStatus;
};

const initialRequests: BookingRequest[] = [
  {
    id: 1,
    client: "Amara Silva",
    service: "Strength Training",
    date: "18 Oct 2026",
    time: "08:00 AM",
    location: "Colombo",
    status: "Pending",
  },
  {
    id: 2,
    client: "Ravindu Perera",
    service: "Muscle Building",
    date: "19 Oct 2026",
    time: "04:30 PM",
    location: "Nugegoda",
    status: "Pending",
  },
  {
    id: 3,
    client: "Nethmi Fernando",
    service: "Personal Training",
    date: "20 Oct 2026",
    time: "06:00 AM",
    location: "Maharagama",
    status: "Pending",
  },
];

export default function BookingRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<"All" | RequestStatus>("All");

  function updateStatus(id: number, status: RequestStatus) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  }

  const filteredRequests = requests.filter(
    (request) => filter === "All" || request.status === filter
  );

  return (
    <section
      id="requests"
      className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#F4F5F0]">
            Booking requests
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Review requests from potential clients.
          </p>
        </div>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as "All" | RequestStatus)
          }
          className="rounded-xl border border-white/10 bg-[#171A18] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C7F36B]"
          aria-label="Filter booking requests"
        >
          <option value="All">All requests</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      <div className="mt-5 space-y-4">
        {filteredRequests.map((request) => (
          <article
            key={request.id}
            className="rounded-xl border border-white/10 p-4"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C7F36B]/10 font-semibold text-[#C7F36B]">
                  {request.client
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>

                <div>
                  <h3 className="font-medium text-white">{request.client}</h3>
                  <p className="mt-1 text-sm text-white/55">
                    {request.service}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/45">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {request.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {request.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {request.location}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  request.status === "Pending"
                    ? "bg-amber-300/10 text-amber-300"
                    : request.status === "Accepted"
                      ? "bg-[#C7F36B]/10 text-[#C7F36B]"
                      : "bg-red-400/10 text-red-300"
                }`}
              >
                {request.status}
              </span>
            </div>

            {request.status === "Pending" && (
              <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => updateStatus(request.id, "Accepted")}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#C7F36B] px-4 py-2 text-sm font-semibold text-[#171A18] transition hover:bg-[#d6ff84]"
                >
                  <Check className="h-4 w-4" />
                  Accept
                </button>

                <button
                  type="button"
                  onClick={() => updateStatus(request.id, "Declined")}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                  Decline
                </button>
              </div>
            )}
          </article>
        ))}

        {filteredRequests.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/15 py-10 text-center">
            <p className="text-sm text-white/55">No requests in this category.</p>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-white/35">
        Demo requests only. Accepting or declining does not contact clients or save changes.
      </p>
    </section>
  );
}