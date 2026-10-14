import Link from "next/link";
import { ArrowLeft, Dumbbell } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

type Props = {
  searchParams: Promise<{
    role?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams;

  const initialRole =
    params.role === "trainer" || params.role === "gym"
      ? params.role
      : "client";

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

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
            <section className="pt-3 lg:sticky lg:top-28">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C7F36B] text-[#171A18]">
                <Dumbbell size={25} />
              </div>

              <p className="mt-8 text-sm font-medium tracking-[0.18em] text-[#C7F36B]">
                YOUR FITNESS JOURNEY
              </p>

              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Find your fit.
                <br />
                <span className="text-[#C7F36B]">
                  Build your future.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-white/55">
                Join a fitness community connecting clients, personal
                trainers, and gyms in one place.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  "Discover fitness professionals",
                  "Explore gyms and membership options",
                  "Prepare booking requests in one place",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#C7F36B]" />
                    <span className="text-sm text-white/65">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-[#222723] p-5">
                <p className="text-sm font-medium">A marketplace for everyone</p>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  Clients can explore listings. Trainers and gym owners
                  will be able to submit professional profiles for
                  administrator review once the platform is connected.
                </p>
              </div>
            </section>

            <section>
              <RegisterForm initialRole={initialRole} />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}