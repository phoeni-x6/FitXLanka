import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
};

export default function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#222723] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60">{label}</p>
          <h3 className="mt-3 text-3xl font-semibold text-[#F4F5F0]">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-[#C7F36B]/10 p-3">
          <Icon className="h-5 w-5 text-[#C7F36B]" />
        </div>
      </div>

      <p className="mt-4 text-sm text-white/50">{description}</p>
    </div>
  );
}