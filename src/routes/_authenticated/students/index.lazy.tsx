import StudentDetailsDialog from "@/components/student-details";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listStudents } from "@/services/service_student";
import { TableType } from "@/types/types";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

type Students = TableType<"student">;

const columns: ColumnDef<Students>[] = [
  {
    accessorKey: "student_id",
    header: ({ column }) => (
      <Button
        className="-ml-4"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student ID
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
  },
  {
    accessorKey: "student_name",
    header: ({ column }) => (
      <Button
        className="-ml-4"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student Name
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const fullName = `${row.original.student_name} ${row.original.student_middle_name ? row.original.student_middle_name : ""} ${row.original.student_family_name} ${row.original.student_suffix ? row.original.student_suffix : ""}`;
      return fullName;
    },
  },
  {
    accessorKey: "student_course",
    header: ({ column }) => (
      <Button
        className="-ml-4"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student Course
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
  },
  {
    accessorKey: "student_year",
    header: ({ column }) => (
      <Button
        className="-ml-4"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student Year
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
  },
  {
    accessorKey: "student_address",
    header: ({ column }) => (
      <Button
        className="-ml-4"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student Address
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
  },
  {
    accessorKey: "date_registered",
    header: ({ column }) => (
      <Button
        className="-ml-4"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Registered
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      console.log(row.original.date_registered);
      const date = new Date(row.original.date_registered);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const caseData = row.original;
      return (
        <Dialog>
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
                  navigator.clipboard.writeText(caseData.student_id.toString())
                }
              >
                Copy Student ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <span>View Details</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <StudentDetailsDialog {...caseData} />
          </DialogContent>
        </Dialog>
      );
    },
    enableSorting: false,
  },
];

export const Route = createLazyFileRoute("/_authenticated/students/")({
  component: () => {
    const [data, setData] = useState<Students[]>([]);

    useEffect(() => {
      const fetchCases = async () => {
        try {
          const cases = await listStudents();
          setData(cases);
        } catch (err) {
          console.error(err);
        }
      };

      fetchCases();
    }, []);

    return (
      <div className="w-full">
        <DataTable
          accessor_filter="student_name"
          accessor_filter_name="Filter students by name"
          columns={columns}
          data={data}
          table_entity={""}
        />
      </div>
    );
  },
});
