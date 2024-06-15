import {
  casesNavItems,
  casesNavItemsMobile,
  fingerprintMatchMobile,
  managementNavItems,
  managementNavItemsMobile,
  matchFingerprint,
} from "@/resources/navigationItems";
import { Link } from "@tanstack/react-router";
import { Key } from "react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const renderNavItems = (navItems: any[]) =>
  navItems.map(({ to, icon, label, badge, className }: any, index: Key) => (
    <Link
      key={index}
      className={`flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary`}
      activeProps={{
        className: `bg-muted text-primary`,
      }}
      to={to}
    >
      {icon}
      {label}
      {badge && (
        <Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
          {badge}
        </Badge>
      )}
    </Link>
  ));

export const Navigation = () => (
  <div className="flex-1">
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <div className="space-y-2">{renderNavItems(casesNavItems)}</div>
      <Separator className="mt-2 mb-3" />
      <div className="space-y-2">{renderNavItems(managementNavItems)}</div>
      <Separator className="mt-2 mb-3" />
      <div className="space-y-2">{renderNavItems(matchFingerprint)}</div>
    </nav>
  </div>
);

export const NavigationMobile = () => (
  <nav className="grid gap-2 text-lg font-medium">
    <div className="space-y-2">{renderNavItems(casesNavItemsMobile)}</div>
    <Separator />
    <div className="space-y-2">{renderNavItems(managementNavItemsMobile)}</div>
    <Separator />
    <div className="space-y-2">{renderNavItems(fingerprintMatchMobile)}</div>
  </nav>
);
