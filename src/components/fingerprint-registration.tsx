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
    "R_THUMB",
    "R_INDEX",
    "R_MIDDLE",
    "R_RING",
    "R_PINKY",
    "L_THUMB",
    "L_INDEX",
    "L_MIDDLE",
    "L_RING",
    "L_PINKY",
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
