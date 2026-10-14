
import Link from "next/link";
import {
  Dumbbell,
  Building2,
  ArrowUpRight,
  Clock3,
} from "lucide-react";

const approvals = [
  {
    id: 1,
    name: "Kasun Perera",
    type: "Personal Trainer",
    detail: "Strength & Muscle Building",
    submitted: "2 hours ago",
    category: "trainer",
  },
  {
    id: 2,
    name: "Elevate Fitness Club",
    type: "Gym Listing",
    detail: "Nugegoda, Western Province",
    submitted: "5 hours ago",
    category: "gym",
  },
  {
    id: 3,
    name: "Nethmi Silva",
    type: "Personal Trainer",
    detail: "Weight Loss & Fitness",
    submitted: "Yesterday",
    category: "trainer",
  },
];

export default function PendingApprovals() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-[#C7F36B]" />
            <h2 className="text-lg font-semibold text-white">
              Pending approvals
            </h2>
          </div>

          <p className="mt-1 text-sm text-white/45">
            Review new trainer profiles and gym listings.
          </p>
        </div>

        <span className="w-fit rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
          {approvals.length} awaiting review
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {approvals.map((approval) => {
          const isTrainer = approval.category === "trainer";
          const Icon = isTrainer ? Dumbbell : Building2;
          const reviewHref = isTrainer
            ? "/admin/trainers"
            : "/admin/gyms";

          return (
            <div
              key={approval.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5">
                  <Icon
                    size={20}
                    className={
                      isTrainer
                        ? "text-[#C7F36B]"
                        : "text-violet-400"
                    }
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-white">
                    {approval.name}
                  </h3>

                  <p className="mt-1 text-xs text-[#C7F36B]">
                    {approval.type}
                  </p>

                  <p className="mt-1 break-words text-sm text-white/45">
                    {approval.detail}
                  </p>

                  <p className="mt-2 text-xs text-white/30">
                    Submitted {approval.submitted}
                  </p>
                </div>
              </div>

              <Link
                href={reviewHref}
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/75 transition hover:border-[#C7F36B]/40 hover:text-[#C7F36B]"
              >
                Review listing
                <ArrowUpRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-5 text-white/35">
        Demo records only. No actual applications are being reviewed.
      </p>
    </section>
  );
}
