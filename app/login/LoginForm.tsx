"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import useAuthStore from "@/state-store/authStore";
import Link from "next/link";

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

  const handleLogin = async (formData: LoginFormType) => {
    try {
      const loginResult = await login(formData);

      if (!loginResult.success) {
        console.error("Cannot proceed tp login");
        return;
      }
    } catch (error) {}
  };
  return (
    <div className="w-full mx-auto my-12 md:w-[40%] p-6 bg-white shadow rounded-lg text-center">
      <h3 className="text-[1.75rem]">Welcome back to LocalMart</h3>
      <p className="mb-16">
        Type your e-mail or phone number to log in your account.
      </p>

      <form onSubmit={handleSubmit(handleLogin)} className="">
        <div className="text-center">
          {/* Email */}
          <div className="space-y-2 text-left text-gray-800 mb-6">
            <label>Email</label>
            <input
              {...register("email")}
              className="input"
              placeholder="Enter your email"
              type="text"
            />
            <p className="text-[0.875rem] text-red-600">
              {errors.email?.message}
            </p>
          </div>

          {/* Password */}
          <div className="space-y-2 text-left text-gray-800 mb-4">
            <label>Password</label>
            <input
              {...register("password")}
              className="input"
              placeholder="Enter your password"
              type="password"
            />
            {errors.password?.message ? (
              <p className="text-[0.875rem] text-red-600">
                {errors.password.message}
              </p>
            ) : (
              supabaseError && (
                <p className="text-[0.875rem] text-red-600">{supabaseError}</p>
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
