import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  ClipboardList,
  Settings,
  ArrowLeft,
  LucideIcon,
  ShoppingBag,
  Trophy,
  Shield,
  BarChart,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminNavItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

const adminNavItems: AdminNavItem[] = [
  { name: "Dashboard", icon: Home, href: "/admin" },
  { name: "Challenges", icon: ClipboardList, href: "/admin/challenges" },
  { name: "Manage Shop", icon: ShoppingBag, href: "/admin/shop" },
  { name: "Manage Levels", icon: Trophy, href: "/admin/levels" },
  { name: "Manage Guild Levels", icon: Shield, href: "/admin/guild-levels" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Reports", icon: BarChart, href: "/admin/reports" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col h-full w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed top-0 left-0 z-10">
      <div className="p-4 border-b border-sidebar-border h-16 flex items-center">
        <h1 className="text-xl font-bold text-sidebar-primary">
          Sydions - Learning
        </h1>
      </div>

      <nav className="flex-grow p-2 space-y-1 overflow-y-auto no-scrollbar">
        <Link
          to="/"
          className={cn(
            "flex items-center p-3 rounded-lg transition-colors text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          Back to App
        </Link>
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
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;