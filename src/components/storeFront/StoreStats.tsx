"use client";

import { CalendarBlank, Package, Star } from "@phosphor-icons/react";

interface StoreStatsProps {
  totalProducts?: number;
  rating?: number;
  joinedAt?: string;
}

export function StoreStats({
  totalProducts = 0,
  rating,
  joinedAt,
}: StoreStatsProps) {
  const joined =
    joinedAt &&
    new Date(joinedAt).toLocaleDateString("en-NG", {
      month: "short",
      year: "numeric",
    });

  return (
    <div className="grid grid-cols-3 gap-4 border-t pt-6 mt-8">
      <Stat
        icon={<Package size={22} weight="duotone" />}
        label="Products"
        value={totalProducts.toString()}
      />

      <Stat
        icon={<Star size={22} weight="duotone" />}
        label="Rating"
        value={rating ? rating.toFixed(1) : "New"}
      />

      <Stat
        icon={<CalendarBlank size={22} weight="duotone" />}
        label="Member"
        value={joined ?? "Recently"}
      />
    </div>
  );
}

interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Stat({ icon, label, value }: StatProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2 text-teal-600">{icon}</div>

      <p className="text-xl font-semibold">{value}</p>

      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
