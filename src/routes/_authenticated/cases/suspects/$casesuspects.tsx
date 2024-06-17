import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/cases/suspects/$casesuspects"
)({
  component: () => <div>Hello /_authenticated/cases/view/$casesuspects!</div>,
});
