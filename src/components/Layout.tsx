import React from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, noPadding = false }) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      {/* Main Content Area - offset by sidebar width on desktop, and mobile header height on mobile */}
      <main className={cn(
        "flex-1 flex flex-col",
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