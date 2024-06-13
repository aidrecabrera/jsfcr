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
    <div className="w-full">
      <DashboardIndicators
        totalCases={totalCases.toString()}
        activeCases={activeCases}
        resolvedCases={resolvedCases}
        totalStudents={totalStudents.toString()}
        recentCaseTitle={recentCaseTitle}
        recentCaseDate={recentCaseDate}
        topUploaderName={topUploaderName}
        topUploaderCount={topUploaderCount}
        totalSuspects={totalSuspects.toString()}
        casesWithSuspects={casesWithSuspects}
        totalFingerprints={totalFingerprints.toString()}
      ></DashboardIndicators>
    </div>
  );
}
