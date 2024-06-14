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
      const reader = new FileReader();
      reader.onload = () => {
        form.setValue(
          `fingerprints.${id}`,
          encode(reader.result as ArrayBuffer)
        );
      };
      reader.readAsArrayBuffer(files[0]);
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
