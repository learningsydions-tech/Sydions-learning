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
import { useSession } from "@/contexts/SessionContext";

interface AdminNavItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

export const adminNavItems: AdminNavItem[] = [
  { name: "Dashboard", icon: Home, href: "/admin" },
  { name: "Challenges", icon: ClipboardList, href: "/admin/challenges" },
  { name: "Manage Shop", icon: ShoppingBag, href: "/admin/shop" },
  { name: "Manage Levels", icon: Trophy, href: "/admin/levels" },
  { name: "Manage Guild Levels", icon: Shield, href: "/admin/guild-levels" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Reports", icon: BarChart, href: "/admin/reports" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export const AdminNavContent = ({ adminNavItems, currentPath, handleSignOut, onLinkClick }: { adminNavItems: AdminNavItem[], currentPath: string, handleSignOut: () => void, onLinkClick?: () => void }) => (
  <>
    <div className="p-4 border-b border-sidebar-border h-16 flex items-center">
      <Link to="/admin" className="flex items-center gap-2">
        <img src="/Sydions_logo.jpg" alt="Sydions Logo" className="h-8 w-8 rounded-full" />
        <h1 className="text-xl font-bold text-sidebar-primary">
          Sydions - Admin
        </h1>
      </Link>
    </div>

    <nav className="flex-grow p-2 space-y-1 overflow-y-auto no-scrollbar">
      <Link
        to="/"
        className={cn(
          "flex items-center p-3 rounded-lg transition-colors text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
        onClick={onLinkClick} // Close sheet on link click
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
            onClick={onLinkClick} // Close sheet on link click
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
        onClick={() => {
          handleSignOut();
          onLinkClick?.(); // Close sheet after sign out
        }}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign out
      </Button>
    </div>
  </>
);

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { supabase } = useSession();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    // Desktop Sidebar
    <div className="hidden lg:flex flex-col h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed top-0 left-0 z-10">
      <AdminNavContent 
        adminNavItems={adminNavItems} 
        currentPath={currentPath} 
        handleSignOut={handleSignOut} 
      />
    </div>
  );
};

export default AdminSidebar;