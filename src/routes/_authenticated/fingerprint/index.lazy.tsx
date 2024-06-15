import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { createLazyFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";
import "tailwindcss/tailwind.css";

function Fingerprint() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [topN, setTopN] = useState(3);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "image/png") {
      setError("Only PNG files are allowed");
      setImageFile(null);
      return;
    }
    setImageFile(file);
    setImageUrl("");
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let response;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("topN", topN as unknown as string);

        response = await axios.post(
          "http://localhost:5152/match-file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (imageUrl) {
        response = await axios.post(
          "http://localhost:5152/match-url",
          {
            imageUrl,
            topN,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        throw new Error("Please provide either an image URL or upload a file.");
      }

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      {error && <p className="mt-4 text-sm italic text-red-500">{error}</p>}

      <Card className="col-span-1">
        <CardHeader>
          <h2 className="mb-4 text-xl font-bold">Preview</h2>
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
    </div>
  );
}

const ResultCard = ({ results }) => (
  <CardContent className="grid gap-4">
    {results &&
      results.suspects.map((suspect) => (
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

export const Route = createLazyFileRoute("/_authenticated/fingerprint/")({
  component: Fingerprint,
});
