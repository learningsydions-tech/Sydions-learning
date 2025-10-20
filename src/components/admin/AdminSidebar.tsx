import React, { useState } from "react";
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
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

const AdminNavContent = ({ adminNavItems, currentPath, handleSignOut, onLinkClick }: { adminNavItems: AdminNavItem[], currentPath: string, handleSignOut: () => void, onLinkClick?: () => void }) => (
  <>
    <div className="p-4 border-b border-sidebar-border h-16 flex items-center">
      <h1 className="text-xl font-bold text-sidebar-primary">
        Sydions - Admin
      </h1>
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
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State for mobile sheet

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed top-0 left-0 z-10">
        <AdminNavContent 
          adminNavItems={adminNavItems} 
          currentPath={currentPath} 
          handleSignOut={handleSignOut} 
        />
      </div>
      
      {/* Mobile Header and Sheet */}
      <header className="lg:hidden sticky top-0 z-20 w-full bg-background/90 backdrop-blur-sm border-b border-border/50 h-16 flex items-center px-4 justify-between">
        <h1 className="text-xl font-bold text-sidebar-primary">Admin</h1>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 flex flex-col">
            <AdminNavContent 
              adminNavItems={adminNavItems} 
              currentPath={currentPath} 
              handleSignOut={handleSignOut} 
              onLinkClick={() => setIsSheetOpen(false)} // Close sheet on link click
            />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};

export default AdminSidebar;