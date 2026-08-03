"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import useAuthStore from "@/state-store/authStore";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Envelope } from "@phosphor-icons/react";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8).max(12).required("Password is required"),
});

type LoginFormType = InferType<typeof schema>;
export default function LoginForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });
  const { loading, login, supabaseError } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const handleLogin = async (formData: LoginFormType) => {
    try {
      const loginResult = await login(formData);

      if (!loginResult.success) {
        toast.error(loginResult.error ?? "Login failed. Please try again.");
        return;
      }
      console.log("redirecting to:", redirectTo);
      // redirect after successful login
      router.replace(redirectTo || "/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };
  return (
    <div className="w-full mx-auto my-12 md:w-[40%] p-6 bg-white shadow rounded-lg text-center">
      <div className="mb-8">
        <h3 className="text-[1.75rem]">Welcome back to LocalMart</h3>
        <p className="text-[#777774] text-[0.875rem]">
          Type your e-mail or phone number to log in your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleLogin)} className="">
        <div className="text-center">
          {/* Email */}
          <div className="text-left mb-6">
            <label className="block text-[0.875rem] md:text-[1rem] font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Envelope
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                {...register("email")}
                className="w-full border border-[#c4c4c4] pl-9 pr-4 py-2.5 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent placeholder:text-gray-400"
                placeholder="Your email address"
                type="email"
              />
            </div>
            {errors.email && (
              <p className="text-[0.875rem] text-red-600 mt-1">
                {errors.email?.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2 text-left text-gray-800 mb-4">
            <label className="block text-[0.875rem] md:text-[1rem] font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                {...register("password")}
                className="w-full border border-[#c4c4c4] pl-9 pr-4 py-2.5 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent placeholder:text-gray-400"
                placeholder="Your Password"
                type="password"
              />
            </div>
            {errors.password?.message ? (
              <p className="text-[0.875rem] text-red-600">
                {errors.password.message}
              </p>
            ) : (
              supabaseError && (
                <p className="text-[0.875rem]  text-red-600">{supabaseError}</p>
              )
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mb-6">
            <span className="text-sm text-[#009688] hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3 bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
        hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] flex items-center justify-center mb-2 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-1 my-8">
            <hr className="w-[50%] border-[1px] border-[#CACACA] rounded-full" />
            <span className="text-[1.125rem]">or</span>
            <hr className="w-[50%] border-[1px] border-[#CACACA] rounded-full" />
          </div>

          {/* Sign up redirect */}
          <p className="mb-12 text-sm">
            Don’t have an account?
            <Link
              href="/signup"
              className="ml-1 text-[#009688] font-semibold hover:underline cursor-pointer"
            >
              Create new account
            </Link>
          </p>

          {/* Terms */}
          <p className="text-[0.75rem] text-gray-600">
            By logging in you agree to LocalMart's{" "}
            <a className="text-[#009688] underline">Terms and Conditions</a>
          </p>
        </div>
      </form>
    </div>
  );
}
