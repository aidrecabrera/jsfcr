import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { decode } from "base64-arraybuffer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "../../../lib/supabase";

const formSchema = z.object({
  case_title: z.string().max(255),
  case_description: z.string().min(1),
  case_location: z.string().min(1),
  case_uploader_id: z.number().nullable(),
  case_image: z.any().nullable(),
});

function initializeForm() {
  return useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      case_title: "",
      case_description: "",
      case_location: "",
      case_uploader_id: null,
      case_image: null,
    },
  });
}

async function handleImageUpload(
  file: File,
  case_id: number,
  case_title: string,
  case_location: string,
  serverIp: string
) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  const evidenceFileName = `${case_id}-${case_title}-${case_location}`.replace(
    /\s+/g,
    "_"
  );

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        const base64FileData = reader.result.split(",")[1];
        const { error: uploadError } = await supabase.storage
          .from("evidences")
          .upload(`public/${evidenceFileName}`, decode(base64FileData), {
            contentType: file.type,
          });

        if (uploadError) {
          reject(uploadError);
          return;
        }

        const { data: linkUrl } = supabase.storage
          .from("evidences")
          .getPublicUrl(`public/${evidenceFileName}`);

        if (!linkUrl?.publicUrl) {
          reject(new Error("Failed to get public URL for the uploaded image."));
          return;
        }

        const { error: updateError } = await supabase
          .from("cases")
          .update({
            case_evidence: linkUrl.publicUrl,
          })
          .eq("case_id", case_id)
          .select("case_id, case_evidence")
          .single();

        if (updateError) {
          reject(updateError);
          return;
        }

        try {
          const response = await axios.post(
            `http://${serverIp}:5152/match-url`,
            {
              imageUrl: linkUrl.publicUrl,
              topN: 3,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const formattedSuspects = response.data.suspects.map(
            (suspect: any) => ({
              case_id: case_id,
              student_id: suspect.student_id,
              suspect_result_confidence: suspect.confidence,
            })
          );

          const { error: insertError } = await supabase
            .from("case_suspects")
            .insert(formattedSuspects);

          if (insertError) {
            reject(insertError);
            return;
          }

          resolve(response.data);
        } catch (matchError) {
          reject(matchError);
        }
      } else {
        reject(new Error("FileReader result is not a string"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

async function handleSubmission(
  form: ReturnType<typeof useForm>,
  values: z.infer<typeof formSchema>,
  navigate: ReturnType<typeof useNavigate>
) {
  let caseIdPar;
  const myPromise = async () => {
    try {
      const { data, error }: PostgrestSingleResponse<any> = await supabase
        .from("cases")
        .insert([
          {
            case_title: values.case_title,
            case_description: values.case_description,
            case_location: values.case_location,
            case_uploader_id: values.case_uploader_id,
          },
        ])
        .select(
          "case_id, case_uploader_id, case_title, case_description, case_location"
        )
        .single();
      if (error) {
        throw error;
      }
      if (values.case_image && values.case_image.length) {
        const file = values.case_image[0];
        const uploadResponse = await handleImageUpload(
          file,
          data.case_id,
          data.case_title,
          data.case_location,
          "localhost"
        );
        console.log(uploadResponse);
      }
      caseIdPar = data.case_id;
      navigate({
        to: "/cases/view/$caseid",
        params: { caseid: caseIdPar },
      });
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  await toast.promise(myPromise(), {
    loading: "Loading...",
    success: "Case has been successfully registered.",
    error: "There was an error registering the case.",
  });

  form.reset();
  return caseIdPar;
}

async function getListOfAdmins() {
  const { data, error } = await supabase.from("user_account").select("*");
  if (error) throw error;
  return data;
}

export function CaseSubmissionForm() {
  const form = initializeForm();
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getListOfAdmins()
      .then((data) => setAdmins(data))
      .catch((error) => console.error("Failed to fetch admins:", error));
  }, []);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <h1 className="text-2xl font-bold">Submit Case</h1>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col space-y-2"
            noValidate
            onSubmit={form.handleSubmit(async (values) => {
              try {
                handleSubmission(form, values, navigate);
              } catch (error) {
                console.error("Submission error:", error);
              }
            })}
          >
            <FormField
              control={form.control}
              name="case_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Title</FormLabel>
                  <FormControl>
                    <Input required placeholder="Case Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="case_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Case Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="case_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Location</FormLabel>
                  <FormControl>
                    <Input required placeholder="Case Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="case_uploader_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uploader</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an uploader" />
                      </SelectTrigger>
                      <SelectContent>
                        {admins.map((admin) => (
                          <SelectItem
                            key={admin.user_uid}
                            value={String(admin.user_uid)}
                          >
                            {admin.user_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="case_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image Evidence</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className="flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export const Route = createLazyFileRoute("/_authenticated/submit/")({
  component: () => (
    <div className="flex flex-col items-center w-full">
      <CaseSubmissionForm />
    </div>
  ),
});
