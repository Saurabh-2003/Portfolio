import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/shell";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLoadingSkeleton() {
  return (
    <div className="flex h-screen bg-transparent">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex w-64 flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex-1 p-4 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-9 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="h-16 border-b flex items-center justify-between px-6">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-6 space-y-6">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  // Check authentication
  const session = await getAuthSession();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

// Metadata for the dashboard
export const metadata = {
  title: {
    template: "%s | Dashboard",
    default: "Dashboard",
  },
  description: "Portfolio management dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
