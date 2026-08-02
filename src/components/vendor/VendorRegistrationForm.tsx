"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { vendorSchema, type VendorFormData } from "@/types/vendor";
import { VENDOR_STEPS } from "@/types/vendor";
import { createVendorRecord } from "@/lib/vendors/createVendorRecord";
import { uploadProductImage } from "@/lib/products/uploadProductImage";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Resolver } from "react-hook-form";
import { Check } from "@phosphor-icons/react";

// step components
import { StepPersonalInfo } from "./steps/StepPersonalInfo";
import { StepBusinessInfo } from "./steps/StepBusinessInfo";
import { StepPolicies } from "./steps/StepPolicies";
import { StepBankDetails } from "./steps/StepBankDetails";

export function VendorRegisterForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);

  const methods = useForm<VendorFormData>({
    resolver: yupResolver(vendorSchema) as unknown as Resolver<VendorFormData>,
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      businessName: "",
      storeType: "",
      productCategory: "",
      businessAddress: "",
      socials: {
        instagram: "",
        twitter: "",
        tiktok: "",
        facebook: "",
        website: "",
      },
      returnPolicy: "",
      deliveryDuration: "",
      agreesToPlatformFee: false,
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
    mode: "onChange",
  });

  const { trigger, handleSubmit } = methods;

  const handleNext = async () => {
    const currentStepFields = VENDOR_STEPS[currentStep - 1].fields;
    const isValid = await trigger(currentStepFields);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (formData: VendorFormData) => {
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // upload logo if provided
      let logoUrl: string | null = null;
      if (logo && user) {
        try {
          const { url } = await uploadProductImage(logo, user.id);
          logoUrl = url;
        } catch {
          // logo upload failed — continue without it, not critical
          toast.warning(
            "Logo upload failed. You can add it later from your dashboard.",
          );
        }
      }

      const result = await createVendorRecord(formData, logoUrl);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Store created successfully! Welcome to LocalMart.");
      router.replace("/my-shop");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = (currentStep / VENDOR_STEPS.length) * 100;
  const currentStepData = VENDOR_STEPS[currentStep - 1];

  return (
    <div className=" bg-gray-50 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        {/* header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            Become a vendor
          </h1>
          <p className="text-sm text-gray-500">
            Set up your store and start selling on LocalMart
          </p>
        </div>

        {/* progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900">
              {currentStepData.title}
            </span>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {VENDOR_STEPS.length}
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#009688] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {currentStepData.description}
          </p>
        </div>

        {/* step indicators */}
        <div className="flex items-center justify-between mb-8 px-6">
          {VENDOR_STEPS.map((step) => {
            const isComplete = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300
                    ${
                      isComplete
                        ? "bg-[#009688] text-[#fff]"
                        : isCurrent
                          ? "bg-[#009688]/10 text-[#009688] ring-2 ring-[#009688]"
                          : "bg-gray-300 text-gray-700"
                    }`}
                >
                  {isComplete ? (
                    <Check
                      size={14}
                      weight="bold"
                      className="text-white"
                      aria-hidden="true"
                    />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-[0.75rem] hidden md:block text-center
                  ${
                    isCurrent
                      ? "text-[#009688] font-medium"
                      : isComplete
                        ? "text-gray-400"
                        : "text-gray-200"
                  }`}
                >
                  {step.title.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              {currentStep === 1 && (
                <StepPersonalInfo logo={logo} setLogo={setLogo} />
              )}
              {currentStep === 2 && <StepBusinessInfo />}
              {currentStep === 3 && <StepPolicies />}
              {currentStep === 4 && <StepBankDetails />}
            </div>

            {/* navigation buttons */}
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 px-6 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
              )}

              {currentStep < VENDOR_STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#009688] hover:bg-[#00796B] text-white text-sm font-medium transition-all active:scale-95"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#009688] hover:bg-[#00796B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <i
                        className="ti ti-loader-2 animate-spin"
                        aria-hidden="true"
                      />
                      Creating your store...
                    </>
                  ) : (
                    "Create my store"
                  )}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
