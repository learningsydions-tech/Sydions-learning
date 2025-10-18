import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, ClipboardList, Settings, ArrowLeft, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminNavItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

const adminNavItems: AdminNavItem[] = [
  { name: "Dashboard", icon: Home, href: "/admin" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Challenges", icon: ClipboardList, href: "/admin/challenges" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col h-full w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed top-0 left-0 z-10">
      <div className="p-4 border-b border-sidebar-border h-16 flex items-center">
        <h1 className="text-xl font-bold text-sidebar-primary">
          Admin Panel
        </h1>
      </div>

      <nav className="flex-grow p-2 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center p-3 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50",
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start text-sm text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;