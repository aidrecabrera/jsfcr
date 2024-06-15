import Indicator from "@/components/indicator";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/_authenticated/")({
  component: Dashboard,
});

function DashboardIndicators(props: {
  totalCases: string;
  activeCases: any;
  resolvedCases: any;
  totalStudents: string;
  recentCaseTitle: string;
  recentCaseDate: string;
  topUploaderName: string;
  topUploaderCount: any;
  totalSuspects: string;
  casesWithSuspects: any;
  totalFingerprints: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 ">
      <Indicator
        title="Total Cases"
        icon={undefined}
        mainContent={props.totalCases}
        subContent={`Active: ${props.activeCases}, Resolved: ${props.resolvedCases}`}
      />
      <Indicator
        title="Total Students"
        icon={undefined}
        mainContent={props.totalStudents}
        subContent=""
      />
      <Indicator
        title="Recent Case"
        icon={undefined}
        mainContent={props.recentCaseTitle}
        subContent={props.recentCaseDate}
      />
      <Indicator
        title="Top Uploader"
        icon={undefined}
        mainContent={props.topUploaderName}
        subContent={`Cases: ${props.topUploaderCount}`}
      />
      <Indicator
        title="Suspects Identified"
        icon={undefined}
        mainContent={props.totalSuspects}
        subContent={`Cases with Suspects: ${props.casesWithSuspects}`}
      />
      <Indicator
        title="Student Fingerprints"
        icon={undefined}
        mainContent={props.totalFingerprints}
        subContent=""
      />
    </div>
  );
}

function Dashboard() {
  const [totalCases, setTotalCases] = useState(0);
  const [activeCases, setActiveCases] = useState(0);
  const [resolvedCases, setResolvedCases] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [recentCaseTitle, setRecentCaseTitle] = useState("");
  const [recentCaseDate, setRecentCaseDate] = useState("");
  const [topUploaderName, setTopUploaderName] = useState("");
  const [topUploaderCount, setTopUploaderCount] = useState(0);
  const [totalSuspects, setTotalSuspects] = useState(0);
  const [casesWithSuspects, setCasesWithSuspects] = useState(0);
  const [totalFingerprints, setTotalFingerprints] = useState(0);

  useEffect(() => {
    setTotalCases(120);
    setActiveCases(75);
    setResolvedCases(45);
    setTotalStudents(300);
    setRecentCaseTitle("CEE-002");
    setRecentCaseDate("2024-06-13");
    setTopUploaderName("John Doe");
    setTopUploaderCount(15);
    setTotalSuspects(25);
    setCasesWithSuspects(30);
    setTotalFingerprints(200);
  }, []);

  return (
    <div className="flex items-center justify-center w-full">
      <div className="h-full bg-muted lg:block rounded-xl">
        <div className="relative w-full h-full">
          <img
            alt="Image"
            className="h-full w-full object-cover rounded-xl dark:brightness-[0.2] dark:grayscale"
            height="1080"
            src="https://online.jhcsc.edu.ph/img/red.jpg"
            width="1920"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-green-700 rounded-xl bg-opacity-65">
            <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full gap-3 px-4 sm:flex-row sm:px-0">
              <h1 className="text-3xl font-bold text-center text-white sm:text-6xl text-ellipsis font-tight">
                JH Cerilles State College
              </h1>
              <div className="h-16 border-2 b-r-white"></div>
              <p className="text-3xl font-bold text-white sm:text-6xl font-tight">
                JSFCR System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
