"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  PencilSimple,
  Trash,
  CurrencyNgn,
  Package,
} from "@phosphor-icons/react";
import ShopCard from "./ShopCard";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { deleteProduct } from "@/lib/products/deleteProducts";
import { updateProductField } from "@/lib/products/updateProducts";
import { useInlineEdit } from "@/hooks/useInlineEdits";
import type { ProductsWithVendor, ProductRow } from "@/types/product";
import { on } from "events";

type Props = {
  product: ProductsWithVendor;
};

function InlineNumberEdit({
  label,
  icon,
  initialValue,
  prefix,
  onSave,
}: {
  label: string;
  icon: React.ReactNode;
  initialValue: number;
  prefix?: string;
  onSave: (value: number) => Promise<void>;
}) {
  const {
    isEditing,
    value,
    saving,
    inputRef,
    setValue,
    setIsEditing,
    handleSave,
    handleKeyDown,
  } = useInlineEdit({ initialValue, onSave });

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        {icon}
        <span>{label}</span>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-1">
          {prefix && <span className="text-xs text-gray-400">{prefix}</span>}
          <input
            ref={inputRef}
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-20 text-xs text-right border border-[#009688] rounded px-1.5 py-1 focus:outline-none"
          />
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          disabled={saving}
          className="flex items-center gap-1 text-xs font-medium text-gray-800 hover:text-[#009688] transition-colors group"
          title="Click to edit"
        >
          {saving ? (
            <i
              className="ti ti-loader-2 animate-spin text-[#009688]"
              aria-hidden="true"
            />
          ) : (
            <>
              {prefix && <span className="text-gray-500">{prefix}</span>}
              <span>{Number(initialValue).toLocaleString("en-NG")}</span>
              <PencilSimple
                size={11}
                className="opacity-0 group-hover:opacity-100 text-[#009688] transition-opacity"
              />
            </>
          )}
        </button>
      )}
    </div>
  );
}

function ActiveToggle({
  productId,
  initialValue,
  onToggle,
}: {
  productId: string;
  initialValue: boolean;
  onToggle: () => void;
}) {
  const [isActive, setIsActive] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    setSaving(true);
    const newValue = !isActive;
    setIsActive(newValue); // optimistic update

    const result = await updateProductField(productId, "is_active", newValue);

    if (!result.success) {
      setIsActive(!newValue); // revert on failure
      toast.error("Failed to update product status.");
    } else {
      toast.success(
        newValue ? "Product is now visible." : "Product hidden from store.",
      );
      onToggle(); // refresh parent state
    }
    setSaving(false);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-gray-500">
        {isActive ? "Visible in store" : "Hidden from store"}
      </span>
      <button
        onClick={handleToggle}
        disabled={saving}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50
          ${isActive ? "bg-[#009688]" : "bg-gray-300"}`}
        role="switch"
        aria-checked={isActive}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200
            ${isActive ? "translate-x-[18px]" : "translate-x-[3px]"}`}
        />
      </button>
    </div>
  );
}

export function ManageProductCard({ product }: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteProduct(product.id);

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete product.");
      setDeleting(false);
      return;
    }

    toast.success(`"${product.item_name}" deleted.`);
    setConfirmOpen(false);
    router.refresh();
    setDeleting(false);
  };

  const handleSavePrice = async (value: number) => {
    const result = await updateProductField(product.id, "item_price", value);
    if (!result.success) {
      toast.error("Failed to update price.");
    } else {
      toast.success("Price updated.");
      router.refresh();
    }
  };

  const handleSaveStock = async (value: number) => {
    const result = await updateProductField(product.id, "item_units", value);
    if (!result.success) {
      toast.error("Failed to update stock.");
    } else {
      toast.success("Stock updated.");
      router.refresh();
    }
  };

  return (
    <>
      <div className="flex flex-col">
        {/* reuse ShopCard with owner controls */}
        <ShopCard
          product={product}
          isOwner={true}
          onDelete={() => setConfirmOpen(true)}
          onEdit={() => router.push(`/manage-products/${product.id}/edit`)}
        />

        {/* quick action bar */}
        <div className="bg-gray-50 border border-t-0 border-gray-200 rounded-b-[10px] px-3 py-2.5 space-y-2">
          {/* price inline edit */}
          <InlineNumberEdit
            label="Price"
            icon={<CurrencyNgn size={12} />}
            initialValue={product.item_price}
            prefix="₦"
            onSave={handleSavePrice}
          />

          {/* stock inline edit */}
          <InlineNumberEdit
            label="Stock"
            icon={<Package size={12} />}
            initialValue={product.item_units}
            onSave={handleSaveStock}
          />

          {/* active toggle */}
          <ActiveToggle
            productId={product.id}
            initialValue={product.is_active ?? true}
            onToggle={() => router.refresh()}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete product"
        description={`Are you sure you want to delete "${product.item_name}"? This cannot be undone.`}
        confirmLabel="Delete product"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </>
  );
}
