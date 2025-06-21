"use client";
import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardShell({
  user,
  children,
}: {
  user: { id: string; username: string }; // Restore correct type
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarWidth = isCollapsed ? 80 : 280;

  return (
    <div className="h-screen bg-transparent">
      {/* Sidebar - fixed on the left */}
      <div
        className="hidden lg:block fixed left-0 top-0 h-screen"
        style={{ width: sidebarWidth }}
      >
        <DashboardSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>
      {/* Main Content - margin left for sidebar, dynamic */}
      <div
        className="flex flex-col h-screen"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Header - sticky at the top of the main content */}
        <div className="sticky top-0">
          <DashboardHeader user={user} />
        </div>
        {/* Breadcrumb */}
        <div className="border-b bg-muted/20">
          <div className="px-6 py-3">
            <DashboardBreadcrumb />
          </div>
        </div>
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--background), 0.98)", // less transparent
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
            backdropFilter: "blur(2px)",
            zIndex: 60, // above header
          },
        }}
      />
    </div>
  );
}
