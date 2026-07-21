interface Props {
  children: React.ReactNode;
}

export function StoreBadge({ children }: Props) {
  return (
    <span
      className="inline-flex items-center rounded-full bg-[#009688]
     px-4 py-2 text-sm font-medium text-teal-700 ring-1 ring-teal-100"
    >
      {children}
    </span>
  );
}
