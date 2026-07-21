const MAX_ORIGINAL_SIZE = 15 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImage(file: File | null): string | null {
  if (!file) {
    return "Please select an image.";
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, PNG and WEBP images are allowed.";
  }

  if (file.size > MAX_ORIGINAL_SIZE) {
    return `Image must be smaller than ${MAX_ORIGINAL_SIZE / (1024 * 1024)}MB.`;
  }

  return null;
}
