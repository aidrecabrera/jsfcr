import { supabase } from "@/lib/supabase";
import {
  EFinger,
  TFingerType,
  TUploadFingerprintImage,
  TUploadResponse,
} from "@/types/fingerprint.types";
import { StorageError } from "@supabase/storage-js";
import { decode } from "base64-arraybuffer";

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

export async function handleFileUpload(
  fingerprints: Record<string, string | null>,
  studentName: string,
  studentUid: number
) {
  for (const [finger, data] of Object.entries(fingerprints)) {
    if (data && finger) {
      const folder = finger.startsWith("L_") ? "left" : "right";
      const fileName = `${studentName}_${finger}`;
      try {
        const UploadResponse: TUploadResponse | StorageError =
          await uploadFingerprintImage(
            decode(data),
            `${folder}/${studentName}-STUDENT-${studentUid}`,
            fileName
          );
        if (UploadResponse instanceof StorageError) {
          throw UploadResponse;
        }
        if (UploadResponse !== null) {
          const { id: object_id, publicUrl: img_url } =
            UploadResponse as TUploadResponse;
          await createFingerprintMetadata(
            finger as TFingerType,
            object_id,
            img_url,
            object_id
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
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

  // ! TODO: Replace with toast
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
