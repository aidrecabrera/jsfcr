import { StorageError } from "@supabase/storage-js";

export enum EFinger {
  "R_THUMB",
  "R_INDEX",
  "R_MIDDLE",
  "R_RING",
  "R_PINKY",
  "L_THUMB",
  "L_INDEX",
  "L_MIDDLE",
  "L_RING",
  "L_PINKY",
}

export type TFingerType = keyof typeof EFinger;

export type TUploadFingerprintImageData = {
  path: string;
};

export type TUploadFingerprintImage = {
  data: TUploadFingerprintImageData;
  error: StorageError;
};
export type TUploadResponse = {
  path?: string;
  id?: string;
  fullPath?: string;
  publicUrl?: string;
};
