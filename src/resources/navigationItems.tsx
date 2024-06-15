import {
  HomeIcon,
  Package2Icon,
  PackageIcon,
  PcCaseIcon,
  UsersIcon,
} from "lucide-react";

export const casesNavItems = [
  {
    to: "/",
    icon: <HomeIcon className="w-4 h-4" />,
    label: "Dashboard",
  },
  {
    to: "/students",
    icon: <UsersIcon className="w-4 h-4" />,
    label: "Students",
  },
  {
    to: "/register",
    icon: <UsersIcon className="w-4 h-4" />,
    label: "Register",
  },
];

export const managementNavItems = [
  {
    to: "/cases/all",
    icon: <PackageIcon className="w-4 h-4" />,
    label: "All Cases",
  },
  {
    to: "/cases/new",
    icon: <Package2Icon className="w-4 h-4" />,
    label: "New Cases",
  },
  {
    to: "/cases/pending",
    icon: <PcCaseIcon className="w-4 h-4" />,
    label: "Pending Cases",
  },
  {
    to: "/cases/closed",
    icon: <UsersIcon className="w-4 h-4" />,
    label: "Closed Cases",
  },
  // {
  //   to: "/cases/history",
  //   icon: <LineChartIcon className="w-4 h-4" />,
  //   label: "Case History",
  // },
];

export const matchFingerprint = [
  {
    to: "/fingerprint",
    icon: <UsersIcon className="w-4 h-4" />,
    label: "Suspect Matcher",
  },
];

export const casesNavItemsMobile = [
  {
    to: "/",
    icon: <HomeIcon className="w-5 h-5" />,
    label: "Dashboard",
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  },
  {
    to: "/students",
    icon: <UsersIcon className="w-5 h-5" />,
    label: "Students",
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  },
  {
    to: "/register",
    icon: <UsersIcon className="w-4 h-4" />,
    label: "Register",
  },
];

export const managementNavItemsMobile = [
  {
    to: "/cases/all",
    icon: <PackageIcon className="w-5 h-5" />,
    label: "All Cases",
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  },
  {
    to: "/cases/new",
    icon: <Package2Icon className="w-5 h-5" />,
    label: "New Cases",
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  },
  {
    to: "/cases/pending",
    icon: <PcCaseIcon className="w-5 h-5" />,
    label: "Pending Cases",
    badge: 6,
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground",
  },
  {
    to: "/cases/closed",
    icon: <UsersIcon className="w-5 h-5" />,
    label: "Closed Cases",
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  },

  // {
  //   to: "/cases/history",
  //   icon: <LineChartIcon className="w-5 h-5" />,
  //   label: "Case History",
  //   className:
  //     "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  // },
];

export const fingerprintMatchMobile = [
  {
    to: "/fingerprint",
    icon: <UsersIcon className="w-5 h-5" />,
    label: "Suspect Matcher",
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  },
];
