import Link from "next/link";
import {
  ArrowRight,
  Target,
  Eye,
  Heart,
  Users,
  Dumbbell,
  MapPin,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const values = [
  {
    icon: Heart,
    title: "Health First",
    description:
      "We believe fitness should support a healthier, stronger, and more confident life for everyone.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We bring fitness enthusiasts, trainers, and gym owners together in one connected community.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "We aim to make it easier to compare fitness options and make informed decisions.",
  },
  {
    icon: Sparkles,
    title: "Continuous Growth",
    description:
      "We encourage consistent progress, personal development, and sustainable fitness habits.",
  },
];

const features = [
  "Discover gyms and fitness facilities",
  "Explore personal trainers and their specialties",
  "Compare available fitness options",
  "Find fitness services suited to your goals",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-hidden bg-[#171A18] text-[#F4F5F0]">
        {/* Hero */}
        <section className="relative border-b border-white/10">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C7F36B]/10 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-32 h-80 w-80 rounded-full bg-[#C7F36B]/5 blur-[100px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C7F36B]/20 bg-[#C7F36B]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
                <Dumbbell size={14} />
                About FitX Lanka
              </span>

              <h1 className="mt-7 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Your fitness journey.
                <span className="block text-[#C7F36B]">
                  Your way.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
                FitX Lanka is a fitness platform designed to help people
                across Sri Lanka discover gyms, connect with trainers, and
                explore opportunities to live a healthier, more active life.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">
                Whether you are starting your fitness journey or looking
                to take your training to the next level, we aim to make
                finding the right fitness resources simpler.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/gyms"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C7F36B] px-6 py-3.5 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
                >
                  Explore gyms
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/trainers"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#C7F36B]/50 hover:text-[#C7F36B]"
                >
                  Find a trainer
                </Link>
              </div>
            </div>

            {/* Brand visual */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute inset-5 rounded-[2rem] bg-[#C7F36B]/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#222723] p-7 sm:p-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                      The FitX philosophy
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                      Progress over perfection.
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C7F36B] text-[#171A18]">
                    <Dumbbell size={28} />
                  </div>
                </div>

                <div className="my-8 h-px bg-white/10" />

                <div className="space-y-5">
                  {[
                    {
                      number: "01",
                      title: "Discover",
                      text: "Explore gyms and fitness professionals.",
                    },
                    {
                      number: "02",
                      title: "Connect",
                      text: "Find services that match your needs.",
                    },
                    {
                      number: "03",
                      title: "Progress",
                      text: "Take the next step toward your goals.",
                    },
                  ].map((item) => (
                    <div key={item.number} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C7F36B]/20 bg-[#C7F36B]/10 text-sm font-semibold text-[#C7F36B]">
                        {item.number}
                      </span>

                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-white/45">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-xl border border-[#C7F36B]/15 bg-[#171A18] p-4">
                  <p className="text-sm leading-6 text-white/65">
                    Built around a simple idea:
                    <span className="font-medium text-[#C7F36B]">
                      {" "}fitness should be easier to access.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who we are */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
                Who we are
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Bringing Sri Lanka&apos;s fitness community closer.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-white/55">
              <p>
                Finding the right gym or personal trainer can take time.
                Information may be spread across different websites,
                social media pages, and local recommendations.
              </p>

              <p>
                FitX Lanka aims to bring these fitness opportunities into
                one convenient platform. Our goal is to help users explore
                their options while giving fitness professionals and gym
                owners a place to showcase their services.
              </p>

              <p>
                We want to encourage a fitness culture built on consistency,
                informed choices, and a supportive community, making it
                easier for people with different experience levels to take
                their next step.
              </p>
            </div>
          </div>
        </section>

        {/* Mission and vision */}
        <section className="border-y border-white/10 bg-[#1D211E]">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
            <div className="rounded-2xl border border-white/10 bg-[#222723] p-7 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
                <Target size={24} />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
                Our mission
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Make fitness easier to discover.
              </h2>

              <p className="mt-4 leading-7 text-white/55">
                Our mission is to simplify how people discover gyms,
                connect with fitness trainers, and explore services that
                support their individual health and fitness goals.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#222723] p-7 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
                <Eye size={24} />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
                Our vision
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                A more connected fitness community.
              </h2>

              <p className="mt-4 leading-7 text-white/55">
                We envision a Sri Lanka where discovering fitness
                opportunities is more accessible and where individuals,
                trainers, and gym owners can connect through a trusted
                digital platform.
              </p>
            </div>
          </div>
        </section>

        {/* Core values */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
              What guides us
            </p>

            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              The values behind FitX
            </h2>

            <p className="mt-4 leading-7 text-white/50">
              The principles that shape the experience we want to build
              for Sri Lanka&apos;s fitness community.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-white/10 bg-[#222723] p-6 transition hover:-translate-y-1 hover:border-[#C7F36B]/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B] transition group-hover:bg-[#C7F36B] group-hover:text-[#171A18]">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/50">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Platform features */}
        <section className="border-y border-white/10 bg-[#1D211E]">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
                What you can discover
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Everything starts with finding the right fit.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-white/55">
                We&apos;re building a platform that brings essential fitness
                discovery tools together, helping users spend less time
                searching and more time focusing on their goals.
              </p>
            </div>

            <div className="space-y-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#222723] p-4"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#C7F36B]"
                  />
                  <p className="text-sm leading-6 text-white/75">
                    {feature}
                  </p>
                </div>
              ))}

              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#222723] p-4">
                <MapPin
                  size={20}
                  className="mt-0.5 shrink-0 text-[#C7F36B]"
                />
                <p className="text-sm leading-6 text-white/75">
                  Focused on connecting fitness communities across Sri Lanka.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl border border-[#C7F36B]/20 bg-[#222723] px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-[#C7F36B]/10 blur-[100px]" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
                Your next chapter starts here
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                Ready to take the next step in your fitness journey?
              </h2>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-white/55">
                Explore local gyms, discover trainers, and find fitness
                options that align with your goals.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/gyms"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C7F36B] px-6 py-3.5 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
                >
                  Explore gyms
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/trainers"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#C7F36B]/50 hover:text-[#C7F36B]"
                >
                  Discover trainers
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}