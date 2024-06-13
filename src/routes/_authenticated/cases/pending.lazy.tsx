// @ts-nocheck

import { CaseCard } from "@/components/composable/cases";
import { listCases } from "@/services/service_case";
import { TableType } from "@/types/types";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Cases = TableType<"cases">;

export const Route = createLazyFileRoute("/_authenticated/cases/pending")({
  component: () => {
    const [data, setData] = useState<Cases[]>([]);

    const fetchCases = async () => {
      try {
        const cases = await listCases({
          case_status: "PENDING",
        });
        setData(cases);
      } catch (err) {
        console.error(err);
      }
    };

    useEffect(() => {
      fetchCases();
    }, []);

    const handleStatusChange = (caseId: string, newStatus: string) => {
      fetchCases();
    };

    return (
      <div className="flex flex-col w-full gap-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Pending Cases</h1>
          <p className="text-sm text-muted-foreground">
            View all pending cases in the system.
          </p>
        </div>
        <div className="grid w-full grid-cols-12 gap-4">
          {data.map((item) => (
            <CaseCard
              allowPending={false}
              allowClose={true}
              caseProps={item}
              key={item.case_id}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    );
  },
});
