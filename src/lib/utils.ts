import { decode, encode } from "base64-arraybuffer";
import { type ClassValue, clsx } from "clsx";

import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

declare global {
  interface String {
    formatData(): string;
  }
}

export function formatFilename(
  familyName: string,
  firstName: string,
  course: string,
  studentUid: number
): string {
  return `${familyName}_${firstName}_${course}_${studentUid}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

String.prototype.formatData = function (): string {
  return this.trim().toLowerCase().replace(/\s+/g, "");
};

export const handleFileChange =
  (form: ReturnType<typeof useForm>) =>
  (e: { target: { id: string; files: FileList } }) => {
    const { id, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const fileReader = new FileReader();
                  fileReader.onload = () => {
                    form.setValue(
                      `fingerprints.${id}`,
                      encode(fileReader.result as ArrayBuffer)
                    );
                  };
                  fileReader.readAsArrayBuffer(blob);
                }
              },
              "image/png",
              1.0
            );
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

export function bufferToHex(buffer: ArrayBuffer): string {
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateHash(base64Data: string): Promise<string> {
  const buffer = decode(base64Data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return bufferToHex(hashBuffer);
}
