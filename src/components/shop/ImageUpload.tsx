import { Image, Trash } from "@phosphor-icons/react";

interface ImageUploadProps {
  preview: string | null;
  image: File | null;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function ImageUpload({
  preview,
  image,
  error,
  onChange,
  onRemove,
}: ImageUploadProps) {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl border border-[#dee4e1] p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          Product image
        </h2>
        <input
          id="product-image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onChange}
          className="hidden"
        />
        <label
          htmlFor="product-image"
          className="group relative flex aspect-[4/3] w-full cursor-pointer tems-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#009688]/40 bg-[#009688]/5 transition-all duration-300 hover:border-[#009688] hover:bg-[#009688]/10
        "
        >
          {!preview && (
            <div className="flex flex-col items-center px-6 text-center">
              <div
                className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#009688]/10 text-[#009688] transition-transform duration-300 group-hover:scale-110
              "
              >
                <Image size={40} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                Upload product image
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Drag & drop or click to browse
              </p>

              <p className="mt-4 text-xs text-gray-400">
                PNG, JPG or WEBP • Maximum 5 MB
              </p>
            </div>
          )}

          {preview && (
            <>
              <img
                src={preview}
                alt="Product preview"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105
              "
              />

              <div
                className="absolute inset-0 flex items-center justify-center gap-3 bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100
              "
              >
                <span
                  className="rounded bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow
                "
                >
                  Replace
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="rounded-lg bg-red-600 p-2 text-white shadow transition hover:bg-red-700
                "
                >
                  <Trash size={18} />
                </button>
              </div>
            </>
          )}
        </label>
      </div>
      {image && (
        <div className="mt-3 flex items-center justify-between rounded-xl border bg-white p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {image.name}
            </p>

            <p className="text-xs text-gray-500">
              {(image.size / 1024).toFixed(0)} KB
            </p>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
