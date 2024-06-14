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
import { formatFilename, handleFileChange } from "@/lib/utils";
import { handleFileUpload } from "@/services/service_fingerprint";
import { createStudent } from "@/services/service_student";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

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

function initializeForm() {
  return useForm<z.infer<typeof formSchema>>({
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
      student_province: "",
      student_municipal: "",
      student_barangay: "",
      student_region: "",
      fingerprints: {
        L_thumb: null,
        L_index: null,
        L_middle: null,
        L_ring: null,
        L_pinky: null,
        R_thumb: null,
        R_index: null,
        R_middle: null,
        R_ring: null,
        R_pinky: null,
      },
    },
  });
}

async function handleRegistration(
  form: ReturnType<typeof useForm>,
  values: z.infer<typeof formSchema>
) {
  const registrationPromise = (async () => {
    const { fingerprints = {}, ...studentData } = values;
    const studentUid = await createStudent(studentData);
    const studentName = formatFilename(
      studentData.student_family_name,
      studentData.student_name,
      studentData.student_course,
      studentUid
    );
    await handleFileUpload(fingerprints, studentName, studentUid);
    return studentData;
  })();

  try {
    await registrationPromise;
    form.reset();
    toast.promise(registrationPromise, {
      loading: "Loading...",
      success: (data) =>
        `${data.student_name}'s information and fingerprints have been successfully registered.`,
      error:
        "There was an error registering the student information and fingerprints.",
    });
  } catch (error) {
    console.error("Registration failed:", error);
  }
}

export function RegistrationForm() {
  const form = initializeForm();

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-2"
        noValidate
        onSubmit={form.handleSubmit((values) =>
          handleRegistration(form, values)
        )}
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

        <Separator />

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
          <FingerprintRegistration handleFileChange={handleFileChange(form)} />
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
    </div>
  ),
});
