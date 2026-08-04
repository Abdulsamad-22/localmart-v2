"use client";

import useAuthStore from "@/state-store/authStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType, string, object } from "yup";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Envelope, Lock } from "@phosphor-icons/react";

const schema = object({
  email: string().email("Invalid email").required("Email is required"),
  password: string().min(8).max(12).required("Password is required"),
});

type SignupFormType = InferType<typeof schema>;

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { supabaseError, signUp, loading, login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const handleSignup = async (formData: SignupFormType) => {
    try {
      const signupResult = await signUp(formData);

      if (!signupResult.success) {
        toast.error(signupResult.error ?? "Signup failed. Please try again.");
        return;
      }

      toast.success("Account created successfully!");
      router.replace(redirectTo || "/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };
  return (
    <div className="w-full mx-auto md:w-[40%] p-6 md:bg-white md:border border-[#dee4e1] rounded-lg text-center">
      <div className="mb-8">
        <h3 className="text-[1.75rem] mb-1">Welcome to LocalMart</h3>
        <p className="text-[#777774] text-[0.75rem]">
          Type your e-mail or phone number to log in or create an account.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleSignup)} className="">
        <div className="text-center">
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
          <p className="text-gray-500 mb-12">
            Already have an accout?
            <Link
              href={"/login"}
              onClick={() => handleSubmit(login)}
              className="ml-1 text-[#009688] font-semibold hover:text-style-underline cursor-pointer"
            >
              Login
            </Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3 bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] flex items-center justify-center mb-2 rounded-lg"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#fff"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Continue"
            )}
          </button>
          <p className="text-[0.875rem]">
            By continuing you agree to LocalMart's{" "}
            <a className="text-[#009688] underline">Terms and Conditions</a>
          </p>
        </div>
      </form>
    </div>
  );
}
