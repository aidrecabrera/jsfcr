import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="bottom-center" expand richColors />
    </>
  ),
});
