import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid, Compass, MessageSquare, ShoppingBag, Box, User, Users, Shield, Trophy, Settings, LogOut, LucideIcon, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Admin Panel", icon: Grid, href: "/admin" },
  { name: "Challenges", icon: Calendar, href: "/challenges" },
  { name: "Explore", icon: Compass, href: "/explore" },
  { name: "Messages", icon: MessageSquare, href: "/messages" },
  { name: "Shop", icon: ShoppingBag, href: "/shop" },
  { name: "Inventory", icon: Box, href: "/inventory" },
  { name: "Profile", icon: User, href: "/profile" },
  { name: "Friends", icon: Users, href: "/friends" },
  { name: "Guilds", icon: Shield, href: "/guilds" },
  { name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col h-full w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed top-0 left-0 z-10">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border h-16 flex items-center">
        <h1 className="text-xl font-bold text-sidebar-primary">
          Sydions - Learning
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-2 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
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

      {/* Footer/User Info */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-sm text-muted-foreground mb-3 truncate">
          itzkarthik.cyber@gmail.com
        </p>
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

export default Sidebar;