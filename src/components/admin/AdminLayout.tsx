import React from "react";
import AdminSidebar from "./AdminSidebar";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className={cn(
        "flex-1 flex flex-col",
        "lg:ml-64", // Desktop sidebar offset
        "p-4 lg:p-8", // Responsive padding
        "pt-20 lg:pt-8" // Extra padding for mobile header height (h-16 + p-4)
      )}>
        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;