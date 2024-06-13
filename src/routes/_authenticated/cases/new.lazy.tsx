import CaseCard from "@/components/composable/cases";
import { listCases } from "@/services/service_case";
import { TableType } from "@/types/types";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Cases = TableType<"cases">;

export const Route = createLazyFileRoute("/_authenticated/cases/new")({
  component: () => {
    const [data, setData] = useState<Cases[]>([]);
    useEffect(() => {
      const fetchCases = async () => {
        try {
          const cases = await listCases({
            case_status: "NEW",
          });
          setData(cases);
        } catch (err) {
          console.error(err);
        }
      };
      fetchCases();
    }, []);

    return (
      <div className="flex flex-col w-full gap-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Recent Cases</h1>
          <p className="text-sm text-muted-foreground">
            View all recent cases in the system.
          </p>
        </div>
        <div className="grid w-full grid-cols-12 gap-4">
          {data.map((item) => (
            <CaseCard
              allowPending={true}
              allowClose={true}
              caseProps={item}
              key={item.case_id}
            />
          ))}
        </div>
      </div>
    );
  },
});
