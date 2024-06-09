import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Login() {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:block">
        <div className="relative w-full h-full">
          <img
            alt="Image"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            height="1080"
            src="https://online.jhcsc.edu.ph/img/red.jpg"
            width="1920"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-green-700 bg-opacity-65">
            <div className="absolute top-0 left-0 flex flex-row items-center justify-start gap-3 m-8">
              <h1 className="text-2xl font-medium text-white text-ellipsis font-tight">
                JH Cerilles State College
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" required type="password" />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
