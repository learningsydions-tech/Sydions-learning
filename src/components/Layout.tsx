import React, { useState } from "react";
import Sidebar, { NavContent, baseNavItems } from "./Sidebar"; // Import NavContent and baseNavItems
import AdminSidebar, { AdminNavContent, adminNavItems } from "./admin/AdminSidebar"; // Import AdminNavContent and adminNavItems
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, noPadding = false }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { session, isAdmin, supabase } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State for mobile sheet

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const isCurrentPathAdmin = currentPath.startsWith("/admin");

  const navItemsToRender = isCurrentPathAdmin 
    ? adminNavItems 
    : baseNavItems.filter(item => !item.requiresAdmin || isAdmin);

  const NavComponentToRender = isCurrentPathAdmin ? AdminNavContent : NavContent;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar />
      <AdminSidebar /> {/* AdminSidebar will only render on desktop if path is /admin */}

      {/* Mobile Header and Sheet */}
      <header className="lg:hidden sticky top-0 z-20 w-full bg-background/90 backdrop-blur-sm border-b border-border/50 h-16 flex items-center px-4 justify-between">
        <h1 className="text-xl font-bold text-sidebar-primary">
          {isCurrentPathAdmin ? "Admin" : "Sydions"}
        </h1>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 flex flex-col">
            <NavComponentToRender 
              navItems={navItemsToRender} 
              currentPath={currentPath} 
              handleSignOut={handleSignOut} 
              session={session} 
              isAdmin={isAdmin} 
              onLinkClick={() => setIsSheetOpen(false)} // Close sheet on link click
            />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col w-full", // Ensure main takes full width
        "lg:ml-64", // Desktop sidebar offset
        !noPadding && "p-4 lg:p-8", // Responsive padding
        !noPadding && "pt-20 lg:pt-8" // Extra padding for mobile header height (h-16 + p-4)
      )}>
        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;