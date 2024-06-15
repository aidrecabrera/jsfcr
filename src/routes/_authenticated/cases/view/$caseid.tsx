import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { createFileRoute } from "@tanstack/react-router";
import { SquareArrowOutUpRightIcon } from "lucide-react";
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
    <div className="p-4">
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

      <h4 className="mb-2 text-xl font-semibold">Suspects</h4>
      <div className="grid grid-cols-12 gap-4">
        {caseDetails.map((suspect) => (
          <Card
            key={suspect.case_suspects_id}
            className="w-full h-full col-span-12 lg:col-span-6 xl:col-span-4"
          >
            <CardHeader>
              <CardTitle className="text-lg">
                {`${suspect.student_name} ${suspect.student_middle_name} ${suspect.student_family_name}`}
              </CardTitle>
              <CardDescription>
                {suspect.student_course} - Year {suspect.student_year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Suspect ID:</strong> {suspect.case_suspects_id}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(suspect.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Student ID:</strong> {suspect.student_id}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {`${suspect.student_address}, ${suspect.student_barangay}, ${suspect.student_municipal}, ${suspect.student_province}, ${suspect.student_region}, ${suspect.student_zip_code}`}
              </p>
              <p>
                <strong>Date Registered:</strong>{" "}
                {new Date(suspect.date_registered).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter>
              <img src={suspect.case_evidenence} alt="" />
              <p>
                Confidence Value: {suspect.suspect_result_confidence.toFixed(2)}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
