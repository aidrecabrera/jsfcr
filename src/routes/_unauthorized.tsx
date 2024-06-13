import { isAuthenticated } from "@/lib/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthorized")({
  beforeLoad: async ({ location }) => {
    const isAuth = await isAuthenticated();
    if (isAuth) {
      throw redirect({
        to: "/students",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Outlet,
});
