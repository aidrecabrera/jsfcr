import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/cases/pending")({
  component: () => <div>Hello /_authenticated/cases/pending!</div>,
});
