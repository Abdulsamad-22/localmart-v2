"use client";

import { CheckCircle, WarningCircle } from "@phosphor-icons/react";

interface Props {
  active: boolean;
}

export function StoreStatusBadge({ active }: Props) {
  if (active) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 font-medium text-emerald-700 mb-2">
        <CheckCircle size={18} weight="fill" />
        Active Store
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 mb-2">
      <WarningCircle size={18} weight="fill" />
      Needs Attention
    </div>
  );
}
