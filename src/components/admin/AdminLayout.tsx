import React from "react";
import AdminSidebar from "./AdminSidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="flex-1 ml-64 flex flex-col p-8">
        {/* Header with theme switcher */}
        <header className="flex justify-end mb-6">
          <ThemeSwitcher />
        </header>
        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;