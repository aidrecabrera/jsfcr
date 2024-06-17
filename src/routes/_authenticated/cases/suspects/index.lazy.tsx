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
import { PrinterIcon, SquareArrowUpRightIcon } from "lucide-react";
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
  const [listOfSuspects, setListOfSuspects] = useState<CaseData[]>([]);
  const [listOfCases, setListOfCases] = useState<TableType<"cases">[]>([]);

  const [filteredCases, setFilteredCases] = useState<TableType<"cases">[]>([]);

  useEffect(() => {
    getAllCasesId().then(setListOfCases);
    getAllCases().then(setListOfSuspects);
  }, []);

  useEffect(() => {
    if (search !== "") {
      const searchTerm = search.toLowerCase();
      const filtered = listOfCases.filter((c) => {
        const hasMatchingSuspect = listOfSuspects.some(
          (s) =>
            s.case_id === c.case_id &&
            `${s.student_name} ${s.student_middle_name} ${s.student_family_name} ${s.student_year} ${s.student_course}`
              .toLowerCase()
              .includes(searchTerm)
        );
        return (
          `${c.case_title} ${c.case_description}`
            .toLowerCase()
            .includes(searchTerm) || hasMatchingSuspect
        );
      });
      setFilteredCases(filtered);
    } else {
      setFilteredCases(listOfCases);
    }
  }, [search, listOfCases, listOfSuspects]);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-row justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Cases with Match</h1>
          <p className="text-sm text-muted-foreground">
            View all cases in the system with match.
          </p>
        </div>
        <div className="print:hidden">
          <Button onClick={() => window.print()} variant="outline">
            Print
            <PrinterIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
      <div>
        <Input
          className="print:hidden"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Cases..."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {filteredCases.map((c, index) => (
          <Card key={index}>
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
                  className="-ml-4 print:hidden"
                >
                  View Case
                  <SquareArrowUpRightIcon className="w-4 h-4 ml-2" />
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
            <CardContent className="print:hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <h1 className="text-sm">Case Suspects</h1>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2">
                    {listOfSuspects
                      .filter((s) => s.case_id === c.case_id)
                      .map((s, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-sm">
                              {`${s.student_name} ${s.student_middle_name} ${s.student_family_name}`}
                            </CardTitle>
                            <p>{`${s.student_year} ${s.student_course}`}</p>
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
                      ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardContent className="hidden print:block">
              <div className="flex flex-col gap-4">
                {listOfSuspects
                  .filter((s) => s.case_id === c.case_id)
                  .map((s, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {`${s.student_name} ${s.student_middle_name} ${s.student_family_name}`}
                        </CardTitle>
                        <p>{`${s.student_year} ${s.student_course}`}</p>
                      </CardHeader>
                      <CardContent className="-mt-2">
                        <Badge
                          variant={
                            s.suspect_result_confidence > 20
                              ? "destructive"
                              : "outline"
                          }
                        >
                          Confidence: {s.suspect_result_confidence.toFixed(2)}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
