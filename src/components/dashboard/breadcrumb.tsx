"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, easeOut } from "framer-motion";
import {
  Home,
  ChevronRight,
  LayoutDashboard,
  User,
  FolderOpen,
  Briefcase,
  Code,
  Mail,
  MessageSquare,
  Settings,
  BarChart3,
  Plus,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

// Route configurations with icons and labels
const routeConfig: Record<
  string,
  { label: string; icon?: React.ComponentType<{ className?: string }> }
> = {
  dashboard: { label: "Dashboard", icon: LayoutDashboard },
  profile: { label: "Profile", icon: User },
  projects: { label: "Projects", icon: FolderOpen },
  experience: { label: "Experience", icon: Briefcase },
  skills: { label: "Skills", icon: Code },
  contact: { label: "Contact", icon: Mail },
  messages: { label: "Messages", icon: MessageSquare },
  analytics: { label: "Analytics", icon: BarChart3 },
  settings: { label: "Settings", icon: Settings },
  new: { label: "New", icon: Plus },
  edit: { label: "Edit", icon: Edit },
};

const containerVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easeOut,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: easeOut,
    },
  },
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home/root
    breadcrumbs.push({
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard",
    });

    // Build path progressively
    let currentPath = "";
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;

      // Skip the 'dashboard' segment as it's already added as root
      if (segment === "dashboard") continue;

      const config = routeConfig[segment];
      const isLast = i === segments.length - 1;

      breadcrumbs.push({
        label:
          config?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        icon: config?.icon,
        current: isLast,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs if we're on the root dashboard page
  if (pathname === "/dashboard") {
    return null;
  }

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center space-x-1 text-sm text-muted-foreground"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = item.icon;

          return (
            <motion.li
              key={item.href}
              variants={itemVariants}
              className="flex items-center space-x-1"
            >
              {/* Separator */}
              {index > 0 && (
                <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              )}

              {/* Breadcrumb Item */}
              {isLast ? (
                // Current page - not clickable
                <div className="flex items-center space-x-1.5 text-foreground font-medium">
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span className="truncate max-w-[200px]">{item.label}</span>
                </div>
              ) : (
                // Clickable breadcrumb
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 font-normal text-muted-foreground hover:text-foreground transition-colors"
                  asChild
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1.5"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    <span className="truncate max-w-[150px]">{item.label}</span>
                  </Link>
                </Button>
              )}
            </motion.li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

// Extended breadcrumb with actions
export function DashboardBreadcrumbWithActions({
  actions,
  className,
}: {
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <DashboardBreadcrumb />
      {actions && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center space-x-2"
        >
          {actions}
        </motion.div>
      )}
    </div>
  );
}

// Simple breadcrumb for pages that need custom breadcrumbs
export function SimpleBreadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;

          return (
            <motion.li
              key={item.href}
              variants={itemVariants}
              className="flex items-center space-x-1"
            >
              {index > 0 && (
                <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              )}

              {isLast ? (
                <div className="flex items-center space-x-1.5 text-foreground font-medium">
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span className="truncate max-w-[200px]">{item.label}</span>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 font-normal text-muted-foreground hover:text-foreground transition-colors"
                  asChild
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1.5"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    <span className="truncate max-w-[150px]">{item.label}</span>
                  </Link>
                </Button>
              )}
            </motion.li>
          );
        })}
      </ol>
    </motion.nav>
  );
}
