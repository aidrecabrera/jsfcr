import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/cases/closed")({
  component: () => <div>Hello /_authenticated/cases/closed!</div>,
});
