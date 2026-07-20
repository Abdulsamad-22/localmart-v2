"use client";

import useAuthStore from "@/state-store/authStore";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  UserCircle,
  Heart,
  ShoppingCart,
  List,
  X,
  SignOut,
} from "@phosphor-icons/react";
import Link from "next/link";
import useCartStore from "@/state-store/cartStore";
import { toast } from "sonner";

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

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleUserButton = () => {
    router.push(`/signup?redirectTo=${pathname}`);
  };

  // const handleUserButton = () => {
  //   if (user) {
  //     router.push("/profile");
  //   } else {
  //     router.push(`/login?redirectTo=${pathname}`);
  //   }
  // };

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
      router.push(`/vendor/register?redirectTo=${pathname}`);
      return;
    }

    router.push("/my-shop");
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.replace("/");
      toast.success("Signed out successfully.");
    }
  };

  const navLinks: NavLinks[] = [
    {
      icon: <UserCircle size={20} />,
      label: "Login/Sign up",
      onClick: () => handleUserButton(),
    },
    { icon: <Heart size={20} />, label: "Wishlists", redirectTo: "/wishlist" },
    { icon: <ShoppingCart size={20} />, label: "Cart", redirectTo: "/carts" },
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
    <header className="w-full bg-white shadow-md sticky top-0 z-[100]">
      <div className="max-w-full px-4 md:px-12 py-4 md:py-6 flex items-center justify-between">
        {/* logo */}
        <Link
          href="/"
          className="text-[1.5rem] md:text-3xl text-[#009688] font-semibold"
        >
          LocalMart
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.redirectTo ? (
              <Link
                key={link.label}
                href={link.redirectTo}
                className={`flex items-center gap-1 text-[1rem] transition-colors
                  ${
                    pathname === link.redirectTo
                      ? "text-[#009688] font-medium border-b-2 border-[#009688] pb-[2px]"
                      : "text-[#636363] hover:text-[#009688]"
                  }`}
                style={{ position: "relative" }}
              >
                {link.icon}
                {link.label === "Cart" && cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-10px",
                      backgroundColor: "#009688",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 500,
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
                <span>{link.label}</span>
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={link.onClick}
                className={`flex items-center gap-1 text-sm transition-colors
                  ${
                    link.isButton
                      ? "bg-[#009688] text-white px-4 py-2 rounded-lg hover:bg-[#00796B]"
                      : "text-[#636363] hover:text-[#009688]"
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ),
          )}

          <button
            className="flex items-center gap-2 text-[#D41E1E]"
            onClick={() => handleLogout}
          >
            <SignOut className="" size={20} />
            Logout
          </button>
        </nav>

        {/* mobile — cart + menu icon */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/carts"
            style={{ position: "relative", display: "inline-flex" }}
          >
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "#009688",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: 500,
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
            <ShoppingCart size={24} className="text-[#636363]" />
          </Link>

          <button onClick={toggleMenu} className="text-[#636363]">
            {isMenuOpen ? <X size={28} /> : <List size={28} />}
          </button>
        </div>
      </div>

      {/* mobile slide-in menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-1/2 bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out md:hidden
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-4 border-b border-gray-100">
          <button onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-1">
          <Link
            href="/wishlist"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-3 py-3 border-b border-gray-100
              ${pathname === "/wishlist" ? "text-[#009688] font-medium" : "text-[#636363]"}`}
          >
            <Heart size={20} />
            Wishlists
          </Link>

          <button
            className="flex items-center gap-3 py-3 border-b border-gray-100 text-[#636363] text-left w-full hover:text-[#009688] transition-colors"
            onClick={() => {
              setIsMenuOpen(false);
              handleUserButton();
            }}
          >
            <UserCircle size={20} />
            Login / Sign up
          </button>

          <button
            className="flex items-center gap-3 py-3 text-[#636363] text-left w-full hover:text-[#009688] transition-colors"
            onClick={() => {
              setIsMenuOpen(false);
              handleVendorRedirection();
            }}
          >
            {loading
              ? "Loading..."
              : vendorData
                ? "View my store"
                : "Sell on LocalMart"}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
