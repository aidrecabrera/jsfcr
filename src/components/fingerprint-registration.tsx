import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FingerprintRegistration() {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Register Fingerprint</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Register Fingerprint</DialogTitle>
          <DialogDescription>
            Please place each of your 10 fingers on the sensor to register them.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="right-thumb">Right Thumb</Label>
            <Input id="right-thumb" placeholder="Scan right thumb" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="right-index">Right Index</Label>
            <Input id="right-index" placeholder="Scan right index" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="right-middle">Right Middle</Label>
            <Input id="right-middle" placeholder="Scan right middle" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="right-ring">Right Ring</Label>
            <Input id="right-ring" placeholder="Scan right ring" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="right-pinky">Right Pinky</Label>
            <Input id="right-pinky" placeholder="Scan right pinky" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="left-thumb">Left Thumb</Label>
            <Input id="left-thumb" placeholder="Scan left thumb" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="left-index">Left Index</Label>
            <Input id="left-index" placeholder="Scan left index" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="left-middle">Left Middle</Label>
            <Input id="left-middle" placeholder="Scan left middle" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="left-ring">Left Ring</Label>
            <Input id="left-ring" placeholder="Scan left ring" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="left-pinky">Left Pinky</Label>
            <Input id="left-pinky" placeholder="Scan left pinky" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Register Fingerprint</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
