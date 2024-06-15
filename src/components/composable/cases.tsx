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
import { Cases as TCase } from "@/services/service_case";
import { Copy, SquareArrowOutUpRightIcon } from "lucide-react";
import { useState } from "react";
import { Textarea } from "../ui/textarea";

type CasesProps = TCase;

async function updateToPending(case_id: string) {
  await supabase
    .from("cases")
    .update({ case_status: "PENDING" })
    .eq("case_id", case_id);
}

async function updateToClosed(case_id: string) {
  await supabase
    .from("cases")
    .update({ case_status: "CLOSED" })
    .eq("case_id", case_id);
}

export const CaseCard = ({
  allowPending,
  allowClose,
  caseProps,
  onStatusChange,
}: {
  allowPending: boolean;
  allowClose: boolean;
  caseProps: CasesProps;
  onStatusChange: (caseId: string, newStatus: string) => void;
}) => {
  const [caseStatus, setCaseStatus] = useState(caseProps.case_status);

  const handleUpdateToPending = async (case_id: string) => {
    await updateToPending(case_id);
    setCaseStatus("PENDING");
    onStatusChange(case_id, "PENDING");
  };

  const handleUpdateToClosed = async (case_id: string) => {
    await updateToClosed(case_id);
    setCaseStatus("CLOSED");
    onStatusChange(case_id, "CLOSED");
  };

  return (
    <Card className="min-w-[250px] max-w-full col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-3 overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="flex items-center gap-2 text-lg group">
            <div>
              <p>{caseProps.case_title}</p>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="w-6 h-6 transition-opacity opacity-0 group-hover:opacity-100"
            >
              <Copy className="w-3 h-3" />
              <span className="sr-only">Copy Case ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            {"CSE#" + caseProps.case_id} at{" "}
            {new Date(caseProps.case_date_time).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Case Details</div>
          <ul className="grid gap-3">
            <li className="flex flex-col items-start justify-between gap-2">
              <span className="text-muted-foreground">Description</span>
              <Textarea
                className="resize-none"
                value={caseProps.case_description}
                readOnly
              />
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Location</span>
              <span>{caseProps.case_location}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Evidence</span>
              <a href={caseProps.case_evidence} target="_blank">
                <Button className="-mr-4" variant="link">
                  View Evidence{" "}
                  <span>
                    <SquareArrowOutUpRightIcon className="w-4 h-4 ml-2" />
                  </span>
                </Button>
              </a>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Uploader ID</span>
              <span>{caseProps.case_uploader_id || "N/A"}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span>{caseStatus}</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center px-6 py-3 border-t bg-muted/50">
        <div className="flex flex-row items-center justify-center w-full gap-2">
          {allowClose && (
            <Button
              onClick={() => handleUpdateToClosed(caseProps.case_id.toString())}
              variant="outline"
              className="w-full"
            >
              Mark as Closed
            </Button>
          )}
          {allowPending && (
            <Button
              onClick={() =>
                handleUpdateToPending(caseProps.case_id.toString())
              }
              variant="default"
              className="w-full"
            >
              Mark as Pending
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
