"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string, InferType } from "yup";
import { toast } from "sonner";
import { Envelope, ArrowLeft } from "@phosphor-icons/react";
import { getSupabaseClient } from "@/lib/supabase/client";

const schema = object({
  email: string().email("Invalid email").required("Email is required"),
});

type FormData = InferType<typeof schema>;

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // success state
  if (submitted) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-[#009688]/10 flex items-center justify-center mx-auto mb-4">
          <Envelope size={24} className="text-[#009688]" />
        </div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Check your email
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          We sent a password reset link to{" "}
          <span className="font-medium text-gray-700">
            {getValues("email")}
          </span>
        </p>
        <p className="text-xs text-gray-400 mb-6">
          Didn't receive it? Check your spam folder or{" "}
          <button
            onClick={() => setSubmitted(false)}
            className="text-[#009688] hover:underline"
          >
            try again
          </button>
        </p>
        <Link
          href="/login"
          className="text-sm text-[#009688] hover:underline flex items-center justify-center gap-1"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          Forgot password?
        </h1>
        <p className="text-sm text-gray-500">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Envelope
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent placeholder:text-gray-400"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </form>
    </div>
  );
}
