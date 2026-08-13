"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string, ref, InferType } from "yup";
import { toast } from "sonner";
import { Lock, Eye, EyeSlash } from "@phosphor-icons/react";
import { getSupabaseClient } from "@/lib/supabase/client";

const schema = object({
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: string()
    .required("Please confirm your password")
    .oneOf([ref("password")], "Passwords do not match"),
});

type FormData = InferType<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // verify the reset token is valid
  useEffect(() => {
    const supabase = getSupabaseClient();

    // Supabase fires onAuthStateChange with SIGNED_IN event
    // when the reset token in the URL is valid
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully.");
      router.replace("/login");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mx-auto" />
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Lock size={24} className="text-red-500" />
        </div>
        <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Invalid or expired link
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          This password reset link has expired or already been used. Please
          request a new one.
        </p>

        <a
          href="/forgot-password"
          className="text-sm font-medium text-[#009688] hover:underline"
        >
          Request new reset link
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-1">
          Set new password
        </h1>
        <p className="text-sm text-gray-500">Must be at least 8 characters</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* new password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            New password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent dark:bg-gray-800 dark:text-white placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* confirm password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Confirm password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent dark:bg-gray-800 dark:text-white placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#009688] hover:bg-[#00796B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
              Updating password...
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </div>
  );
}
