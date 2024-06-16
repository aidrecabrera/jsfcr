import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, FingerprintIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/cases/view/$caseid")({
  component: () => {
    const case_id = Route.useParams().caseid;
    return <CaseDetails caseId={case_id} />;
  },
});

const CaseDetails = ({ caseId }) => {
  const [caseDetails, setCaseDetails] = useState(null);
  const [caseInformation, setCaseInformation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caseDetailsRes, caseInfoRes] = await Promise.all([
          supabase.from("vw_case").select("*").eq("case_id", caseId),
          supabase.from("cases").select("*").eq("case_id", caseId).single(),
        ]);

        if (caseDetailsRes.error || caseInfoRes.error) {
          throw new Error(
            `Error fetching data: ${caseDetailsRes.error?.message || caseInfoRes.error?.message}`
          );
        }

        setCaseDetails(caseDetailsRes.data);
        setCaseInformation(caseInfoRes.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [caseId]);

  if (!caseInformation || !caseDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 grid grid-cols-2 gap-4 w-full">
      <Card className="mb-4">
        <CardHeader>
          <div>
            <h1 className="text-2xl font-bold">
              Case {"#" + caseInformation.case_id}
            </h1>
          </div>
          <CardTitle className="text-xl font-semibold">
            {caseInformation.case_title}
          </CardTitle>
          <CardDescription>{caseInformation.case_description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row justify-between">
          <div>
            <p>
              <strong>Case ID:</strong> {caseInformation.case_id}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(caseInformation.case_date_time).toLocaleString()}
            </p>
            <p>
              <strong>Case Status:</strong> {caseInformation.case_status}
            </p>
            <p>
              <strong>Case Location:</strong> {caseInformation.case_location}
            </p>
            <p>
              <strong>Uploader ID:</strong> {caseInformation.case_uploader_id}
            </p>
            <p>
              <strong>Evidence:</strong>{" "}
              <a href={caseInformation.case_evidence}>
                <Button variant="link">
                  Full Preview{" "}
                  <span>
                    <SquareArrowOutUpRightIcon className="w-4 h-4 ml-2" />
                  </span>
                </Button>
              </a>
            </p>
            <img
              className="w-[500px] h-[500px] rounded-2xl"
              width={50}
              height={50}
              src={caseInformation.case_evidence}
              alt=""
            />
          </div>
          <div className="h-full bg-black"></div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold mb-2 inline-flex"><span className="mr-2 mt-1">
              <FingerprintIcon />
            </span>{caseDetails.length} Potential Suspects</h1>
            <CardDescription className="mb-4">
              Potential suspects found in the database.
            </CardDescription>
          </CardHeader>
        </Card>
        <ScrollArea className="grid grid-cols-1 w-full h-[87vh] py-2 pb-10">
          {caseDetails.map((suspect) => (
            <Card className="overflow-hidden lg:col-span-1 w-full mb-4">
              <CardHeader className="flex flex-row items-start -mb-6">
                <div className="grid gap-0.5">
                  <div className="mb-2">
                    <Badge variant={suspect.suspect_result_confidence.toFixed(2) > 50 ? "destructive" : "secondary"}>
                      Match Confidence: {suspect.suspect_result_confidence.toFixed(2)}
                    </Badge>
                  </div>
                  <CardTitle>
                    {suspect.student_name} {suspect.student_middle_name} {suspect.student_family_name}{" "}
                    {suspect.student_suffix}
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-6 h-6 transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      <Copy className="w-3 h-3" />
                      <span className="sr-only">Copy Student Name</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Student ID: {suspect.student_id}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-2">
                  <div className="font-semibold">Academic Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Course</span>
                      <span>{suspect.student_course}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Year</span>
                      <span>{suspect.student_year}</span>
                    </li>
                  </ul>
                  <ul className="grid gap-2">
                    <Separator className="my-4" />
                    <div className="font-semibold">Personal Details</div>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Address</span>
                      <span>{suspect.student_address}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Barangay</span>
                      <span>{suspect.student_barangay}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Municipal</span>
                      <span>{suspect.student_municipal}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Province</span>
                      <span>{suspect.student_province}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Region</span>
                      <span>{suspect.student_region}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Zip Code</span>
                      <span>{suspect.student_zip_code}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date Registered</span>
                      <span>
                        {new Date(suspect.date_registered).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="text-xs text-muted-foreground">
                  <span className="text-muted-foreground">Details Registered at </span>
                  <span>
                    {new Date(suspect.date_registered).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea></div>
    </div>
  );
};
