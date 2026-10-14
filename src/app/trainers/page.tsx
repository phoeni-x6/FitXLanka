
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrainerDirectory from "@/components/trainers/TrainerDirectory";
import { ArrowLeft, Dumbbell } from "lucide-react";
import Link from "next/link";

export default function TrainersPage() {
  return (
    <main className="min-h-screen bg-[#171A18] text-[#F4F5F0]">
      <Navbar />

      <section className="relative overflow-hidden border-b border-white/10 bg-[#1C201D]">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#C7F36B]/5 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#C7F36B]"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="flex items-start gap-4">
            <div className="hidden rounded-2xl bg-[#C7F36B]/10 p-4 text-[#C7F36B] sm:block">
              <Dumbbell size={30} />
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#C7F36B]">
                FIND YOUR COACH
              </p>

              <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Meet your next
                <span className="text-[#C7F36B]"> trainer.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Discover personal trainers across Sri Lanka.
                Compare specialties, experience, ratings and session
                prices to find a coach who fits your goals.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "Strength training",
              "Muscle building",
              "Weight loss",
              "Functional fitness",
            ].map((specialty) => (
              <span
                key={specialty}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-300"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-14 lg:px-8">
        <TrainerDirectory />
      </section>

      <Footer />
    </main>
  );
}
