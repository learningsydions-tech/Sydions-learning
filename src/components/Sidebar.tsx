import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid, Compass, MessageSquare, ShoppingBag, Box, User, Users, Shield, Trophy, Settings, LogOut, LucideIcon, Calendar, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  name: string;
  icon: LucideIcon;
  href: string;
  requiresAdmin?: boolean;
}

const baseNavItems: NavItem[] = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Admin Panel", icon: Grid, href: "/admin", requiresAdmin: true },
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

const NavContent = ({ navItems, currentPath, handleSignOut, session, isAdmin, onLinkClick }: { navItems: NavItem[], currentPath: string, handleSignOut: () => void, session: any, isAdmin: boolean, onLinkClick?: () => void }) => (
  <>
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
            onClick={onLinkClick} // Close sheet on link click
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
        {session?.user?.email}
      </p>
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

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { supabase, session, isAdmin } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State for mobile sheet

  const navItems = baseNavItems.filter(item => !item.requiresAdmin || isAdmin);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed top-0 left-0 z-10">
        <NavContent 
          navItems={navItems} 
          currentPath={currentPath} 
          handleSignOut={handleSignOut} 
          session={session} 
          isAdmin={isAdmin} 
        />
      </div>
      
      {/* Mobile Header and Sheet */}
      <header className="lg:hidden sticky top-0 z-20 w-full bg-background/90 backdrop-blur-sm border-b border-border/50 h-16 flex items-center px-4 justify-between">
        <h1 className="text-xl font-bold text-sidebar-primary">Sydions</h1>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 flex flex-col">
            <NavContent 
              navItems={navItems} 
              currentPath={currentPath} 
              handleSignOut={handleSignOut} 
              session={session} 
              isAdmin={isAdmin} 
              onLinkClick={() => setIsSheetOpen(false)} // Close sheet on link click
            />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};

export default Sidebar;