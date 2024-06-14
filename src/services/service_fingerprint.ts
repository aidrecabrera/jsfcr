import { supabase } from "@/lib/supabase";
import { generateHash } from "@/lib/utils";
import {
  EFinger,
  TFingerType,
  TUploadFingerprintImage,
  TUploadResponse,
} from "@/types/fingerprint.types";
import { StorageError } from "@supabase/storage-js";
import { PostgrestError } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";

const MIME_TYPE = "image/png";
const FINGERPRINTS_FOLDER = "fingerprints";

export async function uploadFingerprintImage(
  fileData: ArrayBuffer,
  folder: string,
  fileName: string
): Promise<TUploadResponse | StorageError> {
  const fullFileName = `${folder}/${fileName}.png`;
  const { data, error }: TUploadFingerprintImage = await supabase.storage
    .from(FINGERPRINTS_FOLDER)
    .upload(fullFileName, new Blob([fileData], { type: MIME_TYPE }), {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return error as StorageError;
  }

  const publicUrl = getPublicUrl(fullFileName);
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
      const folderPath = `${folder}/${studentName}-STUDENT-${studentUid}`;
      await processUpload(data, folderPath, fileName, finger, studentUid);
    }
  }
}

async function processUpload(
  data: string,
  folderPath: string,
  fileName: string,
  finger: string,
  studentUid: number
) {
  try {
    const uploadResponse: TUploadResponse | StorageError =
      await uploadFingerprintImage(decode(data), folderPath, fileName);
    if (uploadResponse instanceof StorageError) {
      throw uploadResponse;
    }

    if (uploadResponse) {
      const { id: objectId, publicUrl: imgUrl } = uploadResponse;
      const imgHash = await generateHash(data);
      const fingerprint_meta_id = await createFingerprintMetadata(
        finger as TFingerType,
        objectId,
        imgUrl,
        imgHash
      );
      if (typeof fingerprint_meta_id === "number") {
        await registerFingerprint(studentUid, fingerprint_meta_id);
      } else {
        console.error(
          "Failed to create fingerprint metadata:",
          fingerprint_meta_id
        );
        return;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function createFingerprintMetadata(
  finger: string,
  objectId: string,
  img_url: string | null,
  hash: string
): Promise<number | PostgrestError> {
  if (!Object.values(EFinger).includes(finger)) {
    console.error("Invalid finger:", finger);
    throw Error("Invalid finger");
  }

  const { data, error } = await supabase
    .from("fingerprint_metadata")
    .insert({ finger, hash, img_url, object_id: objectId })
    .select("fingerprint_metadata_id")
    .single();

  if (error) {
    console.error("Error inserting fingerprint metadata:", error);
    throw error;
  }

  return data.fingerprint_metadata_id;
}

export async function registerFingerprint(
  studentUid: number,
  fingerprint_metadata_id: number
) {
  const {
    data,
    error,
  }: {
    data: { fingerprint_id: number };
    error: PostgrestError;
  } = await supabase
    .from("student_fingerprint")
    .insert({
      student_owner: studentUid,
      fingerprint_metadata_id,
    })
    .select("fingerprint_id")
    .single();

  if (error) {
    return error;
  }
  const { error: registrationFingerprintError } = await supabase
    .from("student")
    .update({
      fingerprint_data: data.fingerprint_id,
    })
    .eq("student_uid", studentUid);
  if (registrationFingerprintError) {
    throw registrationFingerprintError;
  }
}

function getPublicUrl(fullFileName: string): string {
  const publicUrlData = supabase.storage
    .from(FINGERPRINTS_FOLDER)
    .getPublicUrl(fullFileName).data;

  return publicUrlData?.publicUrl || "";
}
