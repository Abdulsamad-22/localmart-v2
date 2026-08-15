"use client";

import useAuthStore from "@/state-store/authStore";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  UserCircle,
  Heart,
  ShoppingCart,
  List,
  X,
  SignOut,
  Package,
  CaretDown,
  Storefront,
} from "@phosphor-icons/react";
import Link from "next/link";
import useCartStore from "@/state-store/cartStore";
import { toast } from "sonner";
import { CartBadge } from "../ui/CartBadge";

type NavLinks = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  redirectTo?: string;
  isButton?: boolean;
};
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { loading, vendorData, session, user, logout } = useAuthStore();
  const { cartItems } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleUserButton = () => {
    router.push(`/signup?redirectTo=${pathname}`);
  };

  const handleVendorRedirection = () => {
    if (!session) {
      router.push(`/signup?redirectTo=${pathname}`);
      return;
    }

    const isSessionExpired =
      session.expires_at && session.expires_at * 1000 < Date.now();

    if (isSessionExpired) {
      router.push(`/login?redirectTo=${pathname}`);
      return;
    }

    if (!vendorData) {
      router.push(`/registration?redirectTo=${pathname}`);
      return;
    }

    router.push("/my-shop");
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Signed out successfully.");
      setTimeout(() => router.replace("/"), 500);
    } else {
      toast.error(result.error ?? "Logout failed.");
    }
    setIsUserMenuOpen(false);
  };

  const navLinks: NavLinks[] = [
    {
      icon: <UserCircle size={20} />,
      label: "Login/Sign up",
      onClick: () => handleUserButton(),
    },
    { icon: <Heart size={20} />, label: "Wishlists", redirectTo: "/wishlist" },
    { icon: <ShoppingCart size={20} />, label: "Cart", redirectTo: "/carts" },
    { icon: <Package size={20} />, label: "Orders", redirectTo: "/my-orders" },
    {
      icon: "",
      label: loading
        ? "Loading..."
        : vendorData
          ? "View my store"
          : "Sell on LocalMart",
      onClick: () => handleVendorRedirection(),
      isButton: true,
    },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-full px-4 md:px-6 sm:px-6 lg:px-12 py-3 md:py-4 flex items-center justify-between gap-4">
        {/* logo */}
        <Link
          href="/"
          className="text-[1.5rem] md:text-2xl text-[#009688] font-semibold flex-shrink-0"
        >
          LocalMart
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* wishlist */}
          <Link
            href="/wishlist"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors
              ${
                pathname === "/wishlist"
                  ? "text-[#009688] font-medium bg-[#009688]/5"
                  : "text-[#636363] hover:text-[#009688] hover:bg-gray-50"
              }`}
          >
            <Heart size={18} />
            <span>Wishlists</span>
          </Link>

          {/* cart */}
          <Link
            href="/carts"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors relative
              ${
                pathname === "/carts"
                  ? "text-[#009688] font-medium bg-[#009688]/5"
                  : "text-[#636363] hover:text-[#009688] hover:bg-gray-50"
              }`}
          >
            <span className="relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && <CartBadge count={cartCount} />}
            </span>
            <span>Cart</span>
          </Link>

          {/* orders */}
          <Link
            href="/my-orders"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors
              ${
                pathname === "/my-orders"
                  ? "text-[#009688] font-medium bg-[#009688]/5"
                  : "text-[#636363] hover:text-[#009688] hover:bg-gray-50"
              }`}
          >
            <Package size={18} />
            <span>Orders</span>
          </Link>

          {/* sell on localmart / view my store */}
          <button
            onClick={handleVendorRedirection}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#009688] hover:bg-[#00796B] text-white transition-all ml-2"
          >
            <Storefront size={18} />
            <span>
              {loading
                ? "Loading..."
                : vendorData
                  ? "View my store"
                  : "Sell on LocalMart"}
            </span>
          </button>

          {/* user dropdown */}
          <div ref={userMenuRef} className="relative ml-1">
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#636363] hover:text-[#009688] hover:bg-gray-50 transition-colors"
            >
              {user ? (
                <div className="w-7 h-7 rounded-full bg-[#009688] flex items-center justify-center text-white text-xs font-medium">
                  {user.email?.[0]?.toUpperCase()}
                </div>
              ) : (
                <UserCircle size={20} />
              )}
              <CaretDown
                size={14}
                className={`transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/my-orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Package size={16} className="text-gray-400" />
                        My orders
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Heart size={16} className="text-gray-400" />
                        Wishlists
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <SignOut size={16} />
                        Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-1">
                    <Link
                      href={`/login?redirectTo=${pathname}`}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href={`/signup?redirectTo=${pathname}`}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#009688] font-medium hover:bg-[#009688]/5 transition-colors"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* mobile right side — cart + menu */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/carts" className="relative inline-flex">
            {cartCount > 0 && <CartBadge count={cartCount} />}
            <ShoppingCart size={24} className="text-[#636363]" />
          </Link>

          <button onClick={toggleMenu} className="text-[#636363]">
            {isMenuOpen ? <X size={26} /> : <List size={26} />}
          </button>
        </div>
      </div>

      {/* mobile slide-in menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-[70%] max-w-[280px] bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out md:hidden
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* menu header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#009688] flex items-center justify-center text-white text-sm font-medium">
                {user.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-900">Menu</span>
          )}
          <button onClick={() => setIsMenuOpen(false)}>
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col p-3 gap-0.5">
          {/* sell / view store */}
          <button
            className="flex items-center gap-2 px-3 py-3 rounded-lg bg-[#009688] text-white text-sm font-medium mb-2"
            onClick={() => {
              setIsMenuOpen(false);
              handleVendorRedirection();
            }}
          >
            <Storefront size={18} />
            {loading
              ? "Loading..."
              : vendorData
                ? "View my store"
                : "Sell on LocalMart"}
          </button>

          <Link
            href="/wishlist"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm transition-colors
              ${
                pathname === "/wishlist"
                  ? "text-[#009688] font-medium bg-[#009688]/5"
                  : "text-[#636363] hover:bg-gray-50"
              }`}
          >
            <Heart size={18} />
            Wishlists
          </Link>

          <Link
            href="/my-orders"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm transition-colors
              ${
                pathname === "/my-orders"
                  ? "text-[#009688] font-medium bg-[#009688]/5"
                  : "text-[#636363] hover:bg-gray-50"
              }`}
          >
            <Package size={18} />
            Orders
          </Link>

          {!user ? (
            <>
              <Link
                href={`/login?redirectTo=${pathname}`}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-[#636363] hover:bg-gray-50 transition-colors"
              >
                <UserCircle size={18} />
                Log in
              </Link>
              <Link
                href={`/signup?redirectTo=${pathname}`}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-[#009688] font-medium hover:bg-[#009688]/5 transition-colors"
              >
                <UserCircle size={18} />
                Create account
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors text-left w-full mt-2 border-t border-gray-100 pt-3"
            >
              <SignOut size={18} />
              Log out
            </button>
          )}
        </div>
      </div>

      {/* backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
