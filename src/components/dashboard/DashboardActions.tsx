import { ReactNode } from "react";
import Link from "next/link";
import { Package, ShoppingCart, Plus } from "@phosphor-icons/react";

interface StoreActionProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  primary?: boolean;
  showBadge?: number;
}

const primaryActions: StoreActionProps[] = [
  {
    title: "Add Product",
    description: "Create a new product listing",
    icon: <Plus size={16} />,
    href: "/add-product",
    primary: true,
  },

  {
    title: "Manage Products",
    description: "Manage your inventory",
    icon: <Package size={16} />,
    href: "/manage-products",
    // badge: `${stats.products}`,
  },

  {
    title: "Orders",
    description: "Track customer purchases",
    icon: <ShoppingCart size={16} />,
    href: "/orders",
    // badge: `${stats.orders}`,
    showBadge: 2,
  },
];

export function StoreAction() {
  return (
    <div className="flex flex-wrap gap-4">
      {primaryActions.map((action, index) => (
        <Link
          key={action.href}
          href={action.href}
          className={`relative inline-flex items-center gap-2 rounded-[10px] px-[18px] py-[10px] text-[13px] font-medium transition-all duration-150 active:scale-95 ${
            action.primary
              ? "bg-[#009688] text-white hover:bg-[#00796B]"
              : action.showBadge
                ? "border border-purple-200 bg-purple-50 text-purple-700 hover:opacity-85 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-900"
                : "border border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          }`}
        >
          {action.icon}

          {action.title}

          {action.showBadge && (
            <span className="absolute -right-px -top-px flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium leading-none text-white">
              2
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
