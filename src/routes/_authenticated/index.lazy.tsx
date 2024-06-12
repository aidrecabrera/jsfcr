import { Dashboard } from "@/components/dashboard/dashboard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/")({
  component: Dashboard,
});
