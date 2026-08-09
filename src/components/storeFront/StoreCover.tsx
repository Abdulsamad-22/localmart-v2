import { SubaccountPendingBanner } from "../dashboard/SubaccoutPendingBanner";

interface Props {
  image?: string;
}

export function StoreCover({ image }: Props) {
  if (image) {
    return (
      <div className="h-56 w-full overflow-hidden rounded-3xl">
        <img src={image} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#009688]  to-[#00695C]">
      <div className="absolute inset-0  bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.22),transparent_40%)]" />
      <SubaccountPendingBanner />

      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute -top-20 -right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
    </div>
  );
}
