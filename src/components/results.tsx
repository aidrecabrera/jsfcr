import { Card, CardContent } from "@/components/ui/card";

export function Results() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="flex items-center gap-4">
          <img
            alt="Suspect Image"
            className="rounded-md"
            height="64"
            src="/placeholder.svg"
            style={{
              aspectRatio: "64/64",
              objectFit: "cover",
            }}
            width="64"
          />
          <div className="grid flex-1 gap-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">Suspect ID: 12345</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Confidence: 92%
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Student ID: 67890
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4">
          <img
            alt="Suspect Image"
            className="rounded-md"
            height="64"
            src="/placeholder.svg"
            style={{
              aspectRatio: "64/64",
              objectFit: "cover",
            }}
            width="64"
          />
          <div className="grid flex-1 gap-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">Suspect ID: 54321</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Confidence: 85%
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Student ID: 09876
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4">
          <img
            alt="Suspect Image"
            className="rounded-md"
            height="64"
            src="/placeholder.svg"
            style={{
              aspectRatio: "64/64",
              objectFit: "cover",
            }}
            width="64"
          />
          <div className="grid flex-1 gap-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">Suspect ID: 98765</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Confidence: 78%
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Student ID: 43210
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
