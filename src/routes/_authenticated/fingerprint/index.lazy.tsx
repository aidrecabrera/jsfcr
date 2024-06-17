import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { createLazyFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "tailwindcss/tailwind.css";

function Fingerprint() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [topN, setTopN] = useState(3);
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverIp, setServerIp] = useState("localhost");
  const [allEvidences, setAllEvidences] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageFile(null);
  };

  const handleServerIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerIp(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);

    const submissionPromise = (async () => {
      let response;
      const serverUrl = `http://${serverIp}:5152`;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("topN", topN.toString());

        response = await axios.post(`${serverUrl}/match-file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (imageUrl) {
        response = await axios.post(
          `${serverUrl}/match-url`,
          { imageUrl, topN },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        throw new Error("Please provide either an image URL or upload a file.");
      }

      return response.data;
    })();

    toast.promise(submissionPromise, {
      loading: "Scanning...",
      success: (data) => {
        setResults(data);
        return "Scanned Successfully!";
      },
      error: (error) => {
        setError(error.message || "An error occurred");
        return "Submission failed!";
      },
    });
  };

  const fetchEvidences = async () => {
    const { data: evidences, error } = await supabase
      .from("cases")
      .select("case_evidence");
    if (error) {
      console.error(error);
    } else {
      setAllEvidences(evidences);
    }
  };

  const handleEvidenceClick = (url: string) => {
    setImageUrl(url);
    setImageFile(null);
  };

  useEffect(() => {
    fetchEvidences();
  }, []);

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <h2 className="mb-4 text-xl font-bold">Preview</h2>
          {error && <p className="mt-4 text-sm italic text-red-500">{error}</p>}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <Card className="w-full h-full p-8">
            <CardContent className="flex items-center justify-center w-full h-full">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Fingerprint preview"
                  width={300}
                  height={300}
                  className="h-full min-w-full min-h-full"
                />
              )}
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Fingerprint preview"
                  width={300}
                  height={300}
                  className="h-full min-w-full min-h-full"
                />
              )}
            </CardContent>
          </Card>
          <Separator className="my-4" />
          <CardFooter>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="imageUrl"
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  Image URL:
                </label>
                <Input
                  type="text"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  placeholder="Enter the fingerprint image URL"
                  disabled={!!imageFile}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  Upload Image:
                </label>
                <Input
                  type="file"
                  id="file"
                  accept="image/png"
                  onChange={handleFileChange}
                  disabled={!!imageUrl}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="topN"
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  Top N Matches:
                </label>
                <Input
                  type="number"
                  id="topN"
                  value={topN}
                  onChange={(e) => setTopN(Number(e.target.value))}
                  placeholder="Enter number of top matches"
                  min="1"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="serverIp"
                  className="block mb-2 text-sm font-bold text-gray-700"
                >
                  Server IP:
                </label>
                <Input
                  type="text"
                  id="serverIp"
                  value={serverIp}
                  onChange={handleServerIpChange}
                  placeholder="Enter server IP (default: localhost)"
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
          </CardFooter>
        </CardContent>
      </Card>

      <Card className="w-full col-span-1">
        <CardHeader>
          <h2 className="mb-4 text-xl font-bold">Results</h2>
        </CardHeader>
        {results && <ResultCard results={results} />}
      </Card>
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Browse Existing Evidence</h3>
        </CardHeader>
        <CardContent className="mt-4">
          <EvidenceList
            evidences={allEvidences}
            onEvidenceClick={handleEvidenceClick}
          />
        </CardContent>
      </Card>
    </div>
  );
}

const ResultCard = ({ results }: { results: any }) => (
  <CardContent className="grid gap-4">
    {results.suspects.map((suspect: any) => (
      <Card key={suspect.suspect_id}>
        <CardContent className="flex items-center gap-4 mt-5">
          <a href={suspect.url}>
            <img
              src={suspect.url || "/placeholder.svg"}
              alt={`Suspect ${suspect.suspect_id}`}
              width={64}
              height={64}
              className="rounded-md"
            />
          </a>
          <div className="grid flex-1 gap-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                Suspect ID: {suspect.suspect_id}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Confidence: {suspect.confidence.toFixed(2)}%
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Student ID: {suspect.student_id}
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </CardContent>
);

const EvidenceList = ({
  evidences,
  onEvidenceClick,
}: {
  evidences: any[];
  onEvidenceClick: (url: string) => void;
}) => (
  <CardContent className="grid gap-4">
    {evidences.map((evidence, index) => (
      <Card
        key={index}
        className="cursor-pointer"
        onClick={() => onEvidenceClick(evidence.case_evidence)}
      >
        <CardContent className="flex flex-col items-center gap-2">
          <img
            src={evidence.case_evidence}
            alt={`Evidence ${index + 1}`}
            className="object-cover w-64 h-64"
          />
          <div className="text-sm text-blue-500 underline">
            Click to use this image
          </div>
        </CardContent>
      </Card>
    ))}
  </CardContent>
);

export const Route = createLazyFileRoute("/_authenticated/fingerprint/")({
  component: Fingerprint,
});
