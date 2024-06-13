import { Login } from "@/components/login";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_unauthorized/login")({
  component: Index,
});

function Index() {
  return <Login />;
}
