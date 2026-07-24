import { ReactNode } from "react";

interface StoreContactPillProps {
  href: string;
  icon: ReactNode;
  label: string;
  external?: boolean;
}

export function StoreContactPill({
  href,
  icon,
  label,
  external = false,
}: StoreContactPillProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700
      hover:shadow-md"
    >
      <span className="text-teal-600">{icon}</span>

      <span>{label}</span>
    </a>
  );
}
