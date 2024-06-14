import { supabase } from "@/lib/supabase";
import {
  EFinger,
  TUploadFingerprintImage,
  TUploadResponse,
} from "@/types/fingerprint.types";
import { StorageError } from "@supabase/storage-js";

export async function uploadFingerprintImage(
  fileData: ArrayBuffer,
  folder: string,
  fileName: string
): Promise<TUploadResponse | StorageError> {
  const mimeType = "image/png";
  const fullFileName = `${folder}/${fileName}.png`;
  const { data, error }: TUploadFingerprintImage = await supabase.storage
    .from("fingerprints")
    .upload(fullFileName, new Blob([fileData], { type: mimeType }), {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return error as StorageError;
  }

  const publicUrl = `${
    supabase.storage.from("fingerprints").getPublicUrl(fullFileName).data
      .publicUrl
  }`;

  return { ...data, publicUrl } as TUploadResponse;
}

export async function createFingerprintMetadata(
  finger: string,
  objectId: string,
  img_url: string | null,
  hash: string
): Promise<any | null> {
  if (!Object.values(EFinger).includes(finger)) {
    console.error("Invalid finger:", finger);
    return null;
  }

  // ! TODO: Replace with toast.
  console.log(
    "Creating fingerprint metadata for",
    finger,
    "with object ID",
    objectId
  );

  const { data, error } = await supabase
    .from("fingerprint_metadata")
    .insert([
      {
        finger: finger,
        hash: hash,
        img_url: img_url,
        object_id: objectId,
      },
    ])
    .select("fingerprint_metadata_id")
    .single();

  if (error) {
    console.error("Error inserting fingerprint metadata:", error);
    return null;
  }

  return data?.fingerprint_metadata_id || null;
}
