import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link1Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
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
        <Button
          onClick={() => {
            window.open("http://localhost:5152/scan", "_blank");
          }}
          type="button"
          variant="link"
          className="-mt-4 -ml-4"
        >
          Click here to scan your fingerprint{" "}
          <span className="ml-2">
            <Link1Icon />
          </span>
        </Button>
        <div className="grid grid-cols-2 gap-4 py-4">
          {fingerNames.map((finger) => (
            <div key={finger} className="space-y-2">
              <Label className="capitalize" htmlFor={finger}>
                {finger
                  .replace(/_/g, " ")
                  .replace(/^R/i, "Right")
                  .replace(/^L/i, "Left")
                  .toLowerCase()
                  .split(" ")
                  .map((word, index) =>
                    index === 0
                      ? word.charAt(0).toUpperCase() + word.slice(1)
                      : word
                  )
                  .join(" ")}
              </Label>
              <Input
                required
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
