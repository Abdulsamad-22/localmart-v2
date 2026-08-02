"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Bank, Lock } from "@phosphor-icons/react";
import { toast } from "sonner";
import type { VendorFormData } from "@/types/vendor";
import { getBankCode } from "@/lib/vendorsAccount/getBankCode";
import { verifyAccountNumber } from "@/lib/vendorsAccount/verifyAccountNumber";

// Paystack supported banks in Nigeria
const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank",
  "Ecobank",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank",
  "Guaranty Trust Bank",
  "Heritage Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Opay",
  "Palmpay",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Titan Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa",
  "Unity Bank",
  "VFD Microfinance Bank",
  "Wema Bank",
  "Zenith Bank",
].sort();

export function StepBankDetails() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useFormContext<VendorFormData>();

  const [verifying, setVerifying] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [showBankList, setShowBankList] = useState(false);

  const bankName = watch("bankName");
  const accountNumber = watch("accountNumber");
  const accountName = watch("accountName");

  const filteredBanks = NIGERIAN_BANKS.filter((bank) =>
    bank.toLowerCase().includes(bankSearch.toLowerCase()),
  );

  // auto-verify when both bank and 10-digit account number are available
  useEffect(() => {
    if (!bankName || !accountNumber || accountNumber.length !== 10) return;

    if (accountName) return;

    const verify = async () => {
      setVerifying(true);
      clearErrors("accountNumber");
      clearErrors("accountName");
      setValue("accountName", "");

      try {
        const bankCodeResult = await getBankCode(bankName);
        console.log(bankCodeResult);
        if (!bankCodeResult.success) {
          setError("bankName", { message: bankCodeResult.error });
          setVerifying(false);
          return;
        }

        const verifyResult = await verifyAccountNumber(
          accountNumber,
          bankCodeResult.bankCode,
        );

        if (!verifyResult.success) {
          setError("accountNumber", {
            message: "Account not found. Check your account number and bank.",
          });
        } else {
          console.log(verifyResult.data.accountName);
          setValue("accountName", verifyResult.data.accountName, {
            // shouldValidate: true,
          });
          toast.success(`Account verified: ${verifyResult.data.accountName}`);
        }
      } catch {
        setError("accountNumber", {
          message: "Verification failed. Try again.",
        });
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [bankName, accountNumber]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[1.125rem] font-medium text-gray-900 mb-0.5">
          Bank Details
        </h2>
        <p className="text-sm text-gray-400">
          Your earnings will be paid directly to this account
        </p>
      </div>

      {/* bank name — searchable */}
      <div>
        <label className="block text-[0.9375rem] font-medium text-gray-700 mb-1.5">
          Bank name
        </label>
        <div className="relative">
          <div
            className="w-full flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg text-sm cursor-pointer focus-within:ring-2 focus-within:ring-[#009688] focus-within:border-transparent"
            onClick={() => setShowBankList(true)}
          >
            <Bank size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={bankSearch || bankName || ""}
              onChange={(e) => {
                setBankSearch(e.target.value);
                setShowBankList(true);
                if (!e.target.value) setValue("bankName", "");
              }}
              onFocus={() => setShowBankList(true)}
              placeholder="Search for your bank"
              className="flex-1 focus:outline-none placeholder:text-gray-400"
            />
          </div>

          {showBankList && filteredBanks.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {filteredBanks.map((bank) => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => {
                    setValue("bankName", bank, { shouldValidate: true });
                    setBankSearch(bank);
                    setShowBankList(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                    ${bankName === bank ? "text-[#009688] font-medium" : "text-gray-700"}`}
                >
                  {bank}
                </button>
              ))}
            </div>
          )}
        </div>
        {errors.bankName && (
          <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>
        )}
      </div>

      {/* account number */}
      <div>
        <label className="block text-[0.9375rem] font-medium text-gray-700 mb-1.5">
          Account number
        </label>
        <input
          {...register("accountNumber")}
          type="text"
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit account number"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent placeholder:text-gray-400"
        />
        {errors.accountNumber && (
          <p className="text-red-500 text-xs mt-1">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      {/* account name — auto-verified, read only */}
      <div>
        <label className="block text-[0.9375rem] font-medium text-gray-700 mb-1.5">
          Account name
        </label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            {...register("accountName")}
            type="text"
            readOnly
            placeholder={
              verifying
                ? "Verifying account..."
                : "Automatically filled after verification"
            }
            className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none placeholder:text-gray-400
              ${
                accountName
                  ? "border-[#009688] bg-[#009688]/5 text-gray-900 font-medium"
                  : "border-gray-300 text-gray-400"
              } ${verifying ? "animate-pulse" : ""}`}
          />
        </div>
        {accountName && (
          <p className="text-[#009688] text-xs mt-1 flex items-center gap-1">
            <i className="ti ti-circle-check" aria-hidden="true" />
            Account verified successfully
          </p>
        )}
        {errors.accountName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.accountName.message}
          </p>
        )}
      </div>

      {/* security note */}
      <div className="bg-gray-100 rounded-lg p-3 flex items-start gap-2">
        <Lock size={14} className="text-gray-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-600">
          Your bank details are securely processed by Paystack. LocalMart does
          not store your full account details.
        </p>
      </div>
    </div>
  );
}
