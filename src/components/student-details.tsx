import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface StudentDetailsProps {
  date_registered: string | null;
  student_address: string;
  student_barangay: string | null;
  student_course: string;
  student_family_name: string;
  student_id: string;
  student_middle_name: string | null;
  student_municipal: string | null;
  student_name: string;
  student_province: string | null;
  student_region: string | null;
  student_suffix: string | null;
  student_uid: number;
  student_year: string;
  student_zip_code: string;
}

export default function StudentDetailsDialog({
  date_registered,
  student_address,
  student_barangay,
  student_course,
  student_family_name,
  student_id,
  student_middle_name,
  student_municipal,
  student_name,
  student_province,
  student_region,
  student_suffix,
  student_uid,
  student_year,
  student_zip_code,
}: StudentDetailsProps) {
  return (
    <Card className="overflow-hidden border-none shadow-none">
      <CardHeader className="flex flex-row items-start -mb-6">
        <div className="grid gap-0.5">
          <CardTitle className="flex items-center gap-2 text-lg group">
            {student_name} {student_middle_name} {student_family_name}{" "}
            {student_suffix}
            <Button
              size="icon"
              variant="outline"
              className="w-6 h-6 transition-opacity opacity-0 group-hover:opacity-100"
            >
              <Copy className="w-3 h-3" />
              <span className="sr-only">Copy Student Name</span>
            </Button>
          </CardTitle>
          <CardDescription>Student ID: {student_id}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-2">
          <div className="font-semibold">Academic Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Course</span>
              <span>{student_course}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Year</span>
              <span>{student_year}</span>
            </li>
          </ul>
          <ul className="grid gap-2">
            <Separator className="my-4" />
            <div className="font-semibold">Personal Details</div>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Address</span>
              <span>{student_address}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Barangay</span>
              <span>{student_barangay}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Municipal</span>
              <span>{student_municipal}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Province</span>
              <span>{student_province}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Region</span>
              <span>{student_region}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Zip Code</span>
              <span>{student_zip_code}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Date Registered</span>
              <span>
                {new Date(date_registered).toLocaleDateString("en-US", {
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
            {new Date(date_registered).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
