import {
  HomeIcon,
  LineChartIcon,
  Package2Icon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

export const navItems = [
  {
    to: "/",
    icon: <HomeIcon className="w-4 h-4" />,
    label: "Dashboard",
  },
  {
    to: "/",
    icon: <ShoppingCartIcon className="w-4 h-4" />,
    label: "Orders",
    badge: 6,
  },
  {
    to: "/",
    icon: <PackageIcon className="w-4 h-4" />,
    label: "Products",
    active: true,
  },
  {
    to: "/",
    icon: <UsersIcon className="w-4 h-4" />,
    label: "Customers",
  },
  {
    to: "/",
    icon: <LineChartIcon className="w-4 h-4" />,
    label: "Analytics",
  },
];

export const navItemsMobile = [
  {
    to: "/",
    icon: <Package2Icon className="w-6 h-6" />,
    label: <span className="sr-only">Acme Inc</span>,
    className: "flex items-center gap-2 text-lg font-semibold",
  },
  {
    to: "/",
    icon: <HomeIcon className="w-5 h-5" />,
    label: "Dashboard",
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  },
  {
    to: "/",
    icon: <ShoppingCartIcon className="w-5 h-5" />,
    label: "Orders",
    badge: 6,
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground",
  },
  {
    to: "/",
    icon: <PackageIcon className="w-5 h-5" />,
    label: "Products",
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  },
  {
    to: "/",
    icon: <UsersIcon className="w-5 h-5" />,
    label: "Customers",
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  },
  {
    to: "/",
    icon: <LineChartIcon className="w-5 h-5" />,
    label: "Analytics",
    className:
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
  },
];
