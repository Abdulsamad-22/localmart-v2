import { Vendor } from "@/types/vendor";

interface Props {
  vendor: Vendor;
}

export function StoreAvatar({ vendor }: Props) {
  const name = vendor.business_name || vendor.full_name;

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (vendor.logo_url) {
    return (
      <img
        src={vendor.logo_url}
        alt={name}
        className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
      />
    );
  }

  return (
    <div
      className="flex h-28 w-28 items-center
     justify-center rounded-full border-4 border-white bg-gradient-to-r from-[#009688]
       to-[#00695C] text-3xl font-bold text-white shadow-xl"
    >
      {initials}
    </div>
  );
}
