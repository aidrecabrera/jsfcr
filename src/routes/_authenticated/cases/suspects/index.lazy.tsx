import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { TableType } from "@/types/types";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { SquareArrowUpRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/_authenticated/cases/suspects/")({
  component: CaseSuspects,
});

export interface CaseData {
  case_suspects_id: number;
  created_at: Date;
  student_id: number;
  student_name: string;
  student_middle_name: string;
  student_family_name: string;
  student_course: string;
  student_year: string;
  student_address: string;
  student_zip_code: string;
  date_registered: Date;
  student_province: string;
  student_barangay: string;
  student_municipal: string;
  student_region: string;
  case_id: number;
  suspect_result_confidence: number;
  case_evidence: string;
}

async function getAllCases() {
  const { data, error } = await supabase.from("vw_case").select("*");
  if (error) throw error;
  return data as CaseData[];
}

async function getAllCasesId() {
  const { data, error } = await supabase.from("cases").select("*");
  if (error) throw error;
  return data;
}

function CaseSuspects() {
  const [search, setSearch] = useState("");
  const [cases, setCases] = useState<CaseData[]>([]);
  const [casesId, setCasesId] = useState<TableType<"cases">[]>([]);

  const [filterByCaseTitle, setFilterByCaseTitle] = useState<CaseData[]>([]);
  const [filterBySuspectName, setFilterBySuspectName] = useState<CaseData[]>(
    []
  );
  const [filterBySuspectCourse, setFilterBySuspectCourse] = useState<
    CaseData[]
  >([]);
  const [filterBySuspectYear, setFilterBySuspectYear] = useState<CaseData[]>(
    []
  );

  useEffect(() => {}, []);

  useEffect(() => {
    getAllCasesId().then((data) => {
      setCasesId(data);
    });
    getAllCases().then((data) => {
      setCases(data);
    });
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col w-full gap-4">
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
          {casesId.map((c) => {
            return (
              <Card>
                <CardHeader>
                  <div>
                    <h1 className="text-lg font-bold">{c.case_title}</h1>
                    <Button
                      onClick={() =>
                        navigate({
                          to: `/cases/view/${c.case_id}`,
                          params: { caseid: c.case_id.toString() },
                        })
                      }
                      variant="link"
                      className="-ml-4"
                    >
                      View Case{" "}
                      <span>
                        <SquareArrowUpRightIcon className="w-4 h-4 ml-2" />
                      </span>
                    </Button>
                  </div>
                  <p className="text-sm">
                    {c.case_location +
                      " at " +
                      new Date(c.case_date_time).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {c.case_description}
                  </p>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <h1 className="text-sm">Case Suspects</h1>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-2">
                        {cases
                          .filter((e) => e.case_id === c.case_id)
                          .map((s) => {
                            return (
                              <Card key={s.case_suspects_id}>
                                <CardHeader>
                                  <CardTitle className="text-sm">
                                    {s.student_name +
                                      " " +
                                      s.student_middle_name +
                                      " " +
                                      s.student_family_name}
                                  </CardTitle>
                                  <p>
                                    {s.student_year + " " + s.student_course}
                                  </p>
                                </CardHeader>
                                <CardContent className="-mt-2">
                                  <Badge
                                    variant={
                                      s.suspect_result_confidence > 20
                                        ? "destructive"
                                        : "outline"
                                    }
                                  >
                                    Confidence:{" "}
                                    {s.suspect_result_confidence.toFixed(2)}
                                  </Badge>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
