import { navItems, navItemsMobile } from "@/resources/navigationItems";
import { Link } from "@tanstack/react-router";
import { Badge } from "../ui/badge";

export const Navigation = () => (
  <div className="flex-1">
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map(({ to, icon, label, badge, active }, index) => (
        <Link
          key={index}
          className={`flex items-center gap-3 px-3 py-2 transition-all rounded-lg ${active ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"}`}
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
      ))}
    </nav>
  </div>
);

export const NavigationMobile = () => (
  <nav className="grid gap-2 text-lg font-medium">
    {navItemsMobile.map(({ to, icon, label, badge, className }, index) => (
      <Link key={index} className={className} to={to}>
        {icon}
        {label}
        {badge && (
          <Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
            {badge}
          </Badge>
        )}
      </Link>
    ))}
  </nav>
);
