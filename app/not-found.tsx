"use client";

import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Storefront,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <section className="min-h-[72vh] flex items-center justify-center py-8 md:py-14 overflow-hidden">
      <div className="w-full max-w-6xl rounded-[2rem] border border-[#009688]/10 bg-[#f5fbfa] px-5 py-8 shadow-[0_22px_70px_rgba(0,150,136,0.10)] md:px-12 md:py-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#009688]">
              <span className="h-2 w-2 rounded-full bg-[#009688] animate-pulse" />
              Route update
            </div>

            <p className="text-7xl font-bold leading-none tracking-[-0.08em] text-[#0d3835] sm:text-8xl">
              404
            </p>

            <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-[#143d3a] md:text-5xl">
              This shopfront seems to have moved down the street.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#55706d] md:text-lg">
              We followed the directions, checked the market square, and even
              asked the neighbours. This page is no longer trading here—but
              there are plenty of good finds waiting nearby.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#009688] px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#007f73] hover:shadow-lg hover:shadow-[#009688]/20"
              >
                Take me to the market
                <ArrowRight size={19} weight="bold" />
              </Link>

              <button
                type="button"
                onClick={() => router.replace("/")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#009688]/20 bg-white px-6 py-3.5 font-semibold text-[#0b7168] transition hover:border-[#009688] hover:bg-[#eaf7f5]"
              >
                <ArrowLeft size={19} weight="bold" />
                Go back
              </button>
            </div>

            <p className="mt-6 text-sm text-[#78918e]">
              Tip: your next local favourite may be just one aisle away.
            </p>
          </div>

          {/* Marketplace story illustration */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-x-10 top-8 h-56 rounded-full bg-[#b7e5df]/45 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(21,88,82,0.12)] backdrop-blur-sm md:p-7">
              <div className="flex items-center justify-between border-b border-[#e3f1ef] pb-4">
                <div className="flex items-center gap-2 font-semibold text-[#153d3a]">
                  <Storefront
                    size={22}
                    weight="fill"
                    className="text-[#009688]"
                  />
                  LocalMart map
                </div>
                <span className="rounded-full bg-[#e8f7f5] px-3 py-1 text-xs font-bold text-[#00897f]">
                  YOU ARE HERE
                </span>
              </div>

              <div className="relative mt-7 h-64 overflow-hidden rounded-2xl border border-[#d9efec] bg-[#edf9f7]">
                <div className="absolute left-[12%] top-[16%] h-12 w-16 rounded-lg border-b-4 border-[#ffb359] bg-[#ffd89b] shadow-sm" />
                <div className="absolute left-[14%] top-[11%] h-3 w-12 rounded-t-md bg-[#ef805e]" />

                <div className="absolute right-[12%] top-[23%] h-16 w-20 rounded-lg border-b-4 border-[#74b5aa] bg-[#a8ded4] shadow-sm" />
                <div className="absolute right-[16%] top-[17%] h-3 w-12 rounded-t-md bg-[#009688]" />

                <div className="absolute bottom-[13%] left-[19%] h-14 w-[4.5rem] rounded-lg border-b-4 border-[#c690d2] bg-[#ecc8ee] shadow-sm" />
                <div className="absolute bottom-[34%] left-[24%] h-3 w-10 rounded-t-md bg-[#a85ab1]" />

                <div className="absolute bottom-[13%] right-[18%] h-14 w-[4.5rem] rounded-lg border-b-4 border-[#7eac60] bg-[#c7e7a2] shadow-sm" />
                <div className="absolute bottom-[34%] right-[23%] h-3 w-10 rounded-t-md bg-[#5da34b]" />

                <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-dashed border-[#009688]/25" />
                <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#009688] text-white shadow-lg shadow-[#009688]/30">
                  <MapPin size={32} weight="fill" />
                </div>

                <div className="absolute left-[31%] top-[35%] h-px w-[16%] rotate-[28deg] border-t-2 border-dashed border-[#009688]/50" />
                <div className="absolute right-[30%] top-[42%] h-px w-[16%] -rotate-[28deg] border-t-2 border-dashed border-[#009688]/50" />
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#fff7e8] p-3 text-sm text-[#815b22]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffce78] font-bold">
                  ?
                </span>
                <span>
                  <strong>Missing pin:</strong> this destination could not be
                  found.
                </span>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 rounded-2xl border border-[#d8eeea] bg-white px-4 py-3 shadow-lg md:-left-8">
              <p className="text-xs font-medium text-[#6f8784]">
                Better direction
              </p>
              <p className="mt-0.5 font-semibold text-[#0d6f67]">
                Back to local finds →
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
