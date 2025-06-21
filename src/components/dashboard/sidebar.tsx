"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Briefcase,
  Code,
  Mail,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Home,
  BarChart3,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  description?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Dashboard overview and analytics",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
    description: "Manage your personal information",
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
    description: "Manage your portfolio projects",
  },
  {
    title: "Experience",
    href: "/dashboard/experience",
    icon: Briefcase,
    description: "Manage your work experience",
  },
  {
    title: "Skills",
    href: "/dashboard/skills",
    icon: Code,
    description: "Manage your technical skills",
  },
  {
    title: "Contact Info",
    href: "/dashboard/contact",
    icon: Mail,
    description: "Manage contact information",
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    description: "View contact form messages",
  },
];

const secondaryNavItems: NavItem[] = [
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "View portfolio analytics",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Dashboard settings",
  },
];

const sidebarVariants = {
  expanded: {
    width: 280,
    transition: { duration: 0.3 },
  },
  collapsed: {
    width: 80,
    transition: { duration: 0.3 },
  },
};

const contentVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, delay: 0.1 },
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.2 },
  },
};

export function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // NavItemComponent with Analytics 'Coming Soon' logic
  const NavItemComponent = ({
    item,
    isCollapsed,
  }: {
    item: NavItem;
    isCollapsed: boolean;
  }) => {
    const isActive =
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href));

    // Show 'Coming Soon' for Analytics
    const isAnalytics = item.title === "Analytics";
    const content = (
      <Link
        href={isAnalytics ? "#" : item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/10",
          isActive ? "bg-gray-400/20" : "",
          isAnalytics && "cursor-not-allowed opacity-60",
        )}
        onClick={
          isAnalytics ? (e) => e.preventDefault() : () => setIsMobileOpen(false)
        }
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex-1"
            >
              {isAnalytics ? "Analytics (Coming Soon)" : item.title}
            </motion.span>
          )}
        </AnimatePresence>
        {item.badge && !isCollapsed && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              <div>
                <div className="font-medium">{item.title}</div>
                {item.description && (
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  // Mobile sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 z-50 h-full w-72 bg-background border-r shadow-lg lg:hidden"
          >
            <SidebarContent />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Sidebar content (no user profile, no 'Tools' heading)
  const SidebarContent = () => (
    <div className="flex h-full bg-transparent flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex items-center gap-2"
            >
              <div className="font-semibold text-lg">Dashboard</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Desktop collapse toggle */}
        <Button
          variant="ghost"
          className="hidden lg:flex dark:hover:bg-gray-400/20"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Quick Actions */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="mb-4"
            >
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href="/" target="_blank">
                    <Eye className="h-3 w-3 mr-1" />
                    View Site
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href="/">
                    <Home className="h-3 w-3 mr-1" />
                    Home
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
          {secondaryNavItems.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        <div className="flex justify-center">{/* <ThemeToggle /> */}</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-muted-foreground hover:text-foreground",
                  isCollapsed && "justify-center",
                )}
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="ml-3"
                    >
                      Sign Out
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Sign Out</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Desktop Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className="hidden lg:flex flex-col border-r  bg-transparent fixed left-0 top-0 h-screen z-30"
      >
        <SidebarContent />
      </motion.div>
    </>
  );
}
