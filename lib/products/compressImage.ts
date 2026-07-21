export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const objectUrl = URL.createObjectURL(file); // store reference

    img.onload = () => {
      URL.revokeObjectURL(objectUrl); // ← revoke immediately after load

      const ratio = Math.min(800 / img.width, 800 / img.height, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to compress image"));
            return;
          }
          resolve(new File([blob], file.name, { type: "image/webp" }));
        },
        "image/webp", // ← WebP instead of JPEG as per your architecture
        0.8,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl); // ← revoke on error too
      reject(new Error("Failed to load image"));
    };

    img.src = objectUrl;
  });
};
