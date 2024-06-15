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
    setImageFile(e.target.files[0]);
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
        formData.append("topN", topN as any);
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
        // Submit URL
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
      {error && <p className="mt-4 text-sm italic text-red-500">{error}</p>}

      <Card className="col-span-1">
        <CardHeader>
          <h2 className="mb-4 text-xl font-bold">Preview</h2>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <Card className="w-full h-full p-8">
            <CardContent className="w-full h-full">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Fingerprint preview"
                  className="h-auto max-w-full"
                />
              )}
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Fingerprint preview"
                  className="h-auto max-w-full"
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
                  accept="image/*"
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
        {results && (
          <div className="p-8 mt-8 bg-white rounded shadow-md">
            <h2 className="mb-4 text-xl font-bold">Results</h2>
            <ul>
              {results.suspects.map((match) => (
                <li
                  key={match.suspect_id}
                  className="flex items-center py-4 border-b border-gray-200"
                >
                  <div className="mr-4">
                    <p>
                      <strong>Suspect ID:</strong> {match.suspect_id}
                    </p>
                    <p>
                      <strong>Student ID:</strong> {match.student_id}
                    </p>
                    <p>
                      <strong>Confidence:</strong> {match.confidence.toFixed(2)}
                    </p>
                  </div>
                  {match.url && (
                    <img
                      src={match.url}
                      alt={`Suspect ${match.suspect_id}`}
                      className="object-contain w-16 h-16 border rounded"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}

export const Route = createLazyFileRoute("/_authenticated/fingerprint/")({
  component: Fingerprint,
});
