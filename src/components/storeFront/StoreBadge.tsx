interface Props {
  children: React.ReactNode;
}

export function StoreBadge({ children }: Props) {
  return (
    <span
      className=" inline-flex items-center rounded-full bg-teal-50 px-4 py-2
       text-sm ont-medium text-teal-700 ring-1 ring-teal-100"
    >
      {children}
    </span>
  );
}
