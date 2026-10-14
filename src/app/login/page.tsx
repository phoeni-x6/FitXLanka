import Link from "next/link";
import { ArrowLeft, Dumbbell } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#171A18] px-4 py-10 text-[#F4F5F0] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#C7F36B]"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <section className="py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C7F36B] text-[#171A18]">
                <Dumbbell size={25} />
              </div>

              <p className="mt-8 text-sm font-medium tracking-[0.18em] text-[#C7F36B]">
                YOUR FITNESS COMMUNITY
              </p>

              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Good to have
                <br />
                <span className="text-[#C7F36B]">you back.</span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-white/55">
                Sign in to continue exploring trainers, discovering gyms,
                and managing your fitness journey.
              </p>

              <div className="mt-9 rounded-2xl border border-white/10 bg-[#222723] p-5">
                <p className="font-medium">One platform. Three roles.</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["Clients", "Personal trainers", "Gym owners"].map(
                    (role) => (
                      <span
                        key={role}
                        className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/60"
                      >
                        {role}
                      </span>
                    )
                  )}
                </div>

                <p className="mt-4 text-sm leading-6 text-white/45">
                  Trainer and gym owner listings will require administrator
                  approval before becoming publicly visible.
                </p>
              </div>
            </section>

            <section>
              <LoginForm />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}   