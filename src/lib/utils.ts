import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

declare global {
  interface String {
    formatData(): string;
  }
}

export {};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

String.prototype.formatData = function (): string {
  return this.trim().toLowerCase().replace(/\s+/g, "");
};
