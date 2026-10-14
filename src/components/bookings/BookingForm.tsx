"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";

type BookingFormProps = {
  listingType: "trainer" | "gym";
  listingId: number;
  listingName: string;
  location: string;
  price: number;
};

export default function BookingForm({
  listingType,
  listingId,
  listingName,
  location,
  price,
}: BookingFormProps) {
  const isTrainer = listingType === "trainer";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sessionType, setSessionType] = useState(
    isTrainer ? "Personal training session" : "Gym visit"
  );
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const today = new Date();
  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const formattedDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("en-LK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#171A18] px-4 py-3 text-sm text-[#F4F5F0] outline-none transition placeholder:text-white/30 focus:border-[#C7F36B]";

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#C7F36B]/20 bg-[#222723] p-6 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C7F36B]/10">
          <CheckCircle2 size={32} className="text-[#C7F36B]" />
        </div>

        <p className="mt-6 text-sm font-medium text-[#C7F36B]">
          DEMO BOOKING REQUEST
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Your form is complete!
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
          This is a prototype confirmation for {listingName}. Your request
          has not been sent to the listing owner or saved to a database.
        </p>

        <div className="mt-7 rounded-xl border border-white/10 bg-[#171A18] p-5 text-left">
          <p className="font-semibold">{listingName}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/50">
            <MapPin size={15} />
            {location}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/50">
            <CalendarDays size={15} />
            {formattedDate}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/50">
            <Clock size={15} />
            {time}
          </p>

          <div className="my-4 border-t border-white/10" />

          <p className="text-sm text-white/50">Contact</p>
          <p className="mt-1 text-sm">{fullName}</p>
          <p className="mt-1 text-sm text-white/60">{email}</p>
          <p className="mt-1 text-sm text-white/60">{phone}</p>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium transition hover:border-[#C7F36B]/50"
          >
            Edit request
          </button>

          <Link
            href={isTrainer ? "/trainers" : "/gyms"}
            className="rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
          >
            Explore {isTrainer ? "trainers" : "gyms"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-8"
    >
      <div className="mb-7">
        <p className="text-sm font-medium text-[#C7F36B]">
          {isTrainer ? "TRAINING SESSION" : "GYM VISIT"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold">
          Your booking details
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/50">
          Enter your details and preferred time to prepare your request.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-sm text-white/70">Full name</label>
          <input
            required
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Enter your full name"
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm text-white/70">Email address</label>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Phone number</label>
            <input
              required
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="07X XXX XXXX"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-white/70">
            {isTrainer ? "Session type" : "What would you like to arrange?"}
          </label>
          <select
            value={sessionType}
            onChange={(event) => setSessionType(event.target.value)}
            className={inputClass}
          >
            {isTrainer ? (
              <>
                <option>Personal training session</option>
                <option>Strength training</option>
                <option>Muscle building consultation</option>
                <option>Weight loss consultation</option>
                <option>Online coaching enquiry</option>
              </>
            ) : (
              <>
                <option>Gym visit</option>
                <option>Membership enquiry</option>
                <option>Facility tour</option>
                <option>Personal training enquiry</option>
              </>
            )}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm text-white/70">
              Preferred date
            </label>
            <input
              required
              type="date"
              min={minimumDate}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-white/70">
              Preferred time
            </label>
            <select
              required
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className={inputClass}
            >
              <option value="">Choose a time</option>
              <option value="07:00 AM">07:00 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="07:00 PM">07:00 PM</option>
            </select>
            <p className="mt-2 text-xs text-white/35">
              Requested times are not checked against live availability.
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm text-white/70">
            Additional notes <span className="text-white/35">(optional)</span>
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Tell us about your goals or any questions..."
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-7 rounded-xl border border-white/10 bg-[#171A18] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">{listingName}</p>
            <p className="mt-1 text-sm text-white/45">{location}</p>
            <p className="mt-2 text-xs text-white/35">
              {isTrainer
                ? "Indicative starting rate per session"
                : "Indicative starting monthly membership"}
            </p>
          </div>

          <p className="shrink-0 text-right font-semibold text-[#C7F36B]">
            LKR {price.toLocaleString("en-LK")}
            <span className="mt-1 block text-xs font-normal text-white/40">
              {isTrainer ? "/ session" : "/ month"}
            </span>
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-[#C7F36B] px-5 py-4 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
      >
        Preview booking request
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-white/35">
        Prototype only. This does not create a confirmed reservation,
        charge you, or send your personal information anywhere.
      </p>

      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="sessionType" value={sessionType} />
      <input type="hidden" name="notes" value={notes} />
    </form>
  );
}