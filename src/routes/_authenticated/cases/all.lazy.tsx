import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listCases } from "@/services/service_case";
import { TableType } from "@/types/types";
import { createFileRoute } from "@tanstack/react-router";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

type Cases = TableType<"cases">;

const columns: ColumnDef<Cases>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "case_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Case ID
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("case_id")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "case_title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("case_title")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "case_status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("case_status")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "case_date_time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Time
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("case_date_time"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(date);
      return <div className="font-medium text-left">{formatted}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "case_description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("case_description")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "case_evidence",
    header: "Evidence",
    cell: ({ row }) => <div>{row.getValue("case_evidence")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "case_location",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("case_location")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "case_suspect",
    header: "Suspect",
    cell: ({ row }) => (
      <div>{row.getValue("case_suspect") || "No Suspect"}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "case_uploader_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Uploader ID
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("case_uploader_id") || "N/A"}</div>,
    enableSorting: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const caseData = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(caseData.case_id.toString())
              }
            >
              Copy case ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];

export const Route = createFileRoute("/_authenticated/cases/all")({
  component: () => {
    const [data, setData] = useState<Cases[]>([]);
    useEffect(() => {
      const fetchCases = async () => {
        try {
          const cases = await listCases();
          setData(cases);
        } catch (err) {
          console.error(err);
        }
      };

      fetchCases();
    }, []);

    return (
      <div className="w-full">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">All Cases</h1>
          <p className="text-sm text-muted-foreground">
            View all cases in the system.
          </p>
        </div>
        <DataTable
          columns={columns}
          data={data}
          accessor_filter={"case_title"}
          accessor_filter_name={"Filter by Case Title"}
          table_entity="cases"
        />
      </div>
    );
  },
});
