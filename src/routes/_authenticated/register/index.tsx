// @ts-nocheck
import { FingerprintRegistration } from "@/components/fingerprint-registration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { createStudent } from "@/services/service_student";
import { TableType } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { decode, encode } from "base64-arraybuffer";
import { useForm } from "react-hook-form";
import z from "zod";

// Define schema for form validation
const formSchema = z.object({
  student_id: z.string().min(1).max(255),
  student_name: z.string().min(1).max(255),
  student_middle_name: z.string().optional(),
  student_family_name: z.string().min(1).max(255),
  student_suffix: z.string().optional(),
  student_course: z.string().min(1).max(255),
  student_year: z.string().min(1).max(255),
  student_address: z.string().min(1).max(255),
  student_zip_code: z.string().min(1).max(255),
  student_province: z.string().min(1).max(255),
  student_municipal: z.string().min(1).max(255),
  student_barangay: z.string().min(1).max(255),
  student_region: z.string().min(1).max(255),
  fingerprints: z.record(z.string().nullable()).optional(),
});

type TStudents = TableType<"student">;

// Main component for the registration form
export function RegistrationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_id: "",
      student_name: "",
      student_middle_name: "",
      student_family_name: "",
      student_suffix: "",
      student_course: "",
      student_year: "",
      student_address: "",
      student_zip_code: "",
      student_region: "",
      student_municipal: "",
      student_province: "",
      student_barangay: "",
      fingerprints: {
        "right-thumb": null,
        "right-index": null,
        "right-middle": null,
        "right-ring": null,
        "right-pinky": null,
        "left-thumb": null,
        "left-index": null,
        "left-middle": null,
        "left-ring": null,
        "left-pinky": null,
      },
    },
  });

  async function uploadFingerprintImage(
    fileData: ArrayBuffer,
    folder: string,
    fileName: string
  ) {
    const mimeType = "image/png";
    const fullFileName = `${folder}/${fileName}.png`;

    const { data, error } = await supabase.storage
      .from("fingerprints")
      .upload(fullFileName, new Blob([fileData], { type: mimeType }), {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from("fingerprints")
      .getPublicUrl(fullFileName);

    return publicData?.publicUrl || null;
  }

  async function saveFingerprintData(
    values: z.infer<typeof formSchema>,
    studentUid: number
  ) {
    const studentName = `${values.student_family_name}_${values.student_name}_${
      studentUid
    }`;
    const fingerprints = values.fingerprints || {};
    const fingerprintUrls: Record<string, string | null> = {};

    const columnMap = {
      "left-thumb": "img_left_thumb_url",
      "left-index": "img_left_index_finger_url",
      "left-middle": "img_left_middle_finger_url",
      "left-ring": "img_left_ring_finger_url",
      "left-pinky": "img_left_pinky_url",
      "right-thumb": "img_right_thumb_url",
      "right-index": "img_right_index_finger_url",
      "right-middle": "img_right_middle_finger_url",
      "right-ring": "img_right_ring_finger_url",
      "right-pinky": "img_right_pinky_url",
    };

    for (const [finger, data] of Object.entries(fingerprints)) {
      if (data) {
        const folder = finger.startsWith("left") ? "left" : "right";
        const fileName = `${studentName}_${finger}`;
        const fileUrl = await uploadFingerprintImage(
          decode(data),
          folder,
          fileName
        );
        if (fileUrl && columnMap[finger]) {
          fingerprintUrls[columnMap[finger]] = fileUrl;
        }
      }
    }

    // Ensure studentUid is a bigint (if it needs to be converted)
    const bigIntStudentUid = BigInt(studentUid);

    // Save URLs to student_fingerprint_images table
    await supabase
      .from("student_fingerprint_images")
      .upsert([{ student_uid: bigIntStudentUid, ...fingerprintUrls }]);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Save the student basic info and retrieve the created student ID
    const studentUid = await createStudent({
      student_id: values.student_id,
      student_name: values.student_name,
      student_middle_name: values.student_middle_name,
      student_family_name: values.student_family_name,
      student_suffix: values.student_suffix,
      student_course: values.student_course,
      student_year: values.student_year,
      student_address: values.student_address,
      student_zip_code: values.student_zip_code,
      student_region: values.student_region,
      student_municipal: values.student_municipal,
      student_province: values.student_province,
      student_barangay: values.student_barangay,
    });

    await saveFingerprintData(values, studentUid);
  }

  const handleFileChange = (e: { target: { id: any; files: any } }) => {
    const { id, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        form.setValue(`fingerprints.${id}`, encode(reader.result as any));
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-2"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="student_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="Student ID number"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-row w-full gap-4">
          <FormField
            control={form.control}
            name="student_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="student_middle_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Middle Name (Optional)" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="student_family_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="student_suffix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suffix</FormLabel>
                <FormControl>
                  <Input placeholder="Suffix" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-row w-full gap-4">
          <FormField
            control={form.control}
            name="student_course"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <FormControl>
                  <Input placeholder="Course" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="student_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="Year Level" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div>
          <Separator />
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="student_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    className="flex flex-grow min-w-max"
                    placeholder="House no./ Building no. / Street/ Zone / Purok"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="student_zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="Zip Code" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="student_region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input placeholder="Region" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="student_municipal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municipal</FormLabel>
                <FormControl>
                  <Input placeholder="Municipal" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="student_province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="Province" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="student_barangay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="Barangay" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="py-4">
          <FingerprintRegistration handleFileChange={handleFileChange} />
        </div>
        <div className="flex justify-end col-span-1 md:col-span-2 lg:col-span-3">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export const Route = createFileRoute("/_authenticated/register/")({
  component: () => (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <div>
              <h1 className="text-2xl font-bold">Register</h1>
              <p className="text-sm text-muted-foreground">
                Register a new student or staff member.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <RegistrationForm />
          </CardContent>
        </Card>
      </div>
      <div></div>
    </div>
  ),
});
