import { supabase } from "@/lib/supabase";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/cases/view/$caseid")({
  component: () => {
    const case_id = Route.useParams().caseid;
    return <CaseDetails caseId={case_id} />;
  },
});

const CaseDetails = ({ caseId }) => {
  const [caseDetails, setCaseDetails] = useState(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      const { data, error } = await supabase
        .from("vw_case")
        .select("*")
        .eq("case_id", caseId);

      if (error) {
        console.error("Error fetching case details:", error);
      } else {
        setCaseDetails(data);
      }
    };

    fetchCaseDetails();
  }, [caseId]);

  if (!caseDetails) {
    return <div>Loading...</div>;
  }

  const { case_name, case_description } = caseDetails[0];

  return (
    <div>
      <h2>Case Details</h2>
      <h3>{case_name}</h3>
      <p>{case_description}</p>
      <h4>Suspects</h4>
      <table>
        <thead>
          <tr>
            <th>Suspect ID</th>
            <th>Created At</th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Student Course</th>
            <th>Student Year</th>
            <th>Address</th>
            <th>Suspect Result Confidence</th>
          </tr>
        </thead>
        <tbody>
          {caseDetails.map((suspect) => (
            <tr key={suspect.case_suspects_id}>
              <td>{suspect.case_suspects_id}</td>
              <td>{suspect.suspect_created_at}</td>
              <td>{suspect.student_id}</td>
              <td>{`${suspect.student_name} ${suspect.student_middle_name} ${suspect.student_family_name}`}</td>
              <td>{suspect.student_course}</td>
              <td>{suspect.student_year}</td>
              <td>{`${suspect.student_address}, ${suspect.student_barangay}, ${suspect.student_municipal}, ${suspect.student_province}, ${suspect.student_region}, ${suspect.student_zip_code}`}</td>
              <td>{suspect.suspect_result_confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
