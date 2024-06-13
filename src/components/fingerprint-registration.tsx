import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function FingerprintRegistration({ handleFileChange }: any) {
  const fingerNames = [
    "right-thumb",
    "right-index",
    "right-middle",
    "right-ring",
    "right-pinky",
    "left-thumb",
    "left-index",
    "left-middle",
    "left-ring",
    "left-pinky",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Fingerprint</CardTitle>
        <CardDescription>
          Please upload the fingerprint image for each finger to register them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 py-4">
          {fingerNames.map((finger) => (
            <div key={finger} className="space-y-2">
              <Label htmlFor={finger}>{finger.replace(/-/g, " ")}</Label>
              <Input
                type="file"
                id={finger}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
