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
      {/* Main Content Area - offset by sidebar width */}
      <main className={cn("flex-1 ml-64 flex flex-col", !noPadding && "p-8")}>
        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;