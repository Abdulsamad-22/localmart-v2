export function createPreview(file: File): string {
  return URL.createObjectURL(file);
}

export function revokePreview(previewUrl: string): void {
  if (!previewUrl) return;
  URL.revokeObjectURL(previewUrl);
}
