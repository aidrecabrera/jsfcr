import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { createLazyFileRoute } from "@tanstack/react-router";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/_authenticated/cases/suspects/")({
  component: CaseSuspects,
});

export interface CaseData {
  case_suspects_id: number;
  created_at: Date;
  student_id: StudentID;
  case_id: CaseID;
  suspect_result_confidence: number;
}

export interface CaseID {
  case_id: number;
  case_title: string;
  case_status: string;
  case_evidence: string;
  case_location: string;
  case_date_time: Date;
  case_description: string;
  case_uploader_id: number;
}

export interface StudentID {
  student_id: string;
  student_uid: number;
  student_name: string;
  student_year: string;
  student_course: string;
  student_region: string;
  student_suffix: string;
  date_registered: Date;
  student_address: string;
  student_barangay: string;
  student_province: string;
  student_zip_code: string;
  student_municipal: string;
  student_family_name: string;
  student_middle_name: string;
}

async function getAllCaseSuspects() {
  const { data, error } = await supabase
    .from("case_suspects")
    .select("*, case_id(*), student_id(*)");
  if (error) throw error;
  return data as CaseData[];
}

async function getAllCasesWithSuspectInformation() {
  const { data, error } = await supabase.from("case_suspects").select(
    `
    case_id(*),
    student_id(*),
    suspect_result_confidence
    `
  );
  if (error) throw error;
  return data;
}

function CaseSuspects() {
  const [allSuspects, setAllSuspects] = useState<CaseData[]>([]);
  const [search, setSearch] = useState("");
  const [filteredSuspects, setFilteredSuspects] = useState<CaseData[]>([]);

  useEffect(() => {
    getAllCaseSuspects().then((response) => {
      setAllSuspects(response);
    });
  }, []);

  useEffect(() => {
    setFilteredSuspects(
      allSuspects.filter(
        (suspect) =>
          suspect.case_id.case_title
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          suspect.student_id.student_course
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    );
  }, [allSuspects, search]);

  console.log(allSuspects);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Cases with Match</h1>
          <p className="text-sm text-muted-foreground">
            View all cases in the system with match.
          </p>
        </div>
        <div>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Cases..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {filteredSuspects.map((suspect) => (
            <Card key={suspect.case_suspects_id}>
              <CardHeader>
                <CardTitle>{suspect.case_id.case_title}</CardTitle>
                <p>Status: {suspect.case_id.case_status}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Location: {suspect.case_id.case_location}
                </p>
                <p className="text-sm text-muted-foreground">
                  Date:{" "}
                  {new Date(suspect.case_id.case_date_time).toDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Description: {suspect.case_id.case_description}
                </p>
                <p className="text-sm text-muted-foreground">
                  <Button
                    variant="link"
                    className="-ml-4"
                    onClick={() => {
                      window.open(suspect.case_id.case_evidence, "_blank");
                    }}
                  >
                    View Evidence{" "}
                    <span>
                      <SquareArrowOutUpRightIcon className="w-4 h-4 ml-2" />
                    </span>
                  </Button>
                </p>
              </CardContent>
              <CardFooter>
                <h1 className="text-sm">Case Suspects</h1>
                <p className="text-sm text-muted-foreground">
                  Student: {suspect.student_id.student_name}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
