import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/cases/new")({
  component: () => <div>Hello /_authenticated/cases/new!</div>,
});
