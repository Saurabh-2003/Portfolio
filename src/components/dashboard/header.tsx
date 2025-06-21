"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  User,
  LogOut,
  Eye,
  Home,
  Plus,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { motion } from "framer-motion";
// Mock signOut function since we don't have next-auth set up
const mockSignOut = ({ callbackUrl }: { callbackUrl: string }): void => {
  console.log(`Signing out, would redirect to: ${callbackUrl}`);
  // In a real app, this would navigate to the callbackUrl
};

interface DashboardHeaderProps {
  user: {
    id: string;
    username: string;
  };
}

// Page titles mapping
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/profile": "Profile Management",
  "/dashboard/projects": "Projects",
  "/dashboard/experience": "Work Experience",
  "/dashboard/skills": "Skills & Technologies",
  "/dashboard/contact": "Contact Information",
  "/dashboard/messages": "Contact Messages",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();

  const currentPageTitle = pageTitles[pathname || ""] || "Dashboard";

  const handleSignOut = () => {
    try {
      mockSignOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const quickActions = [
    {
      label: "View Portfolio",
      icon: Eye,
      href: "/",
      target: "_blank",
    },
  ];

  return (
    <header className="border-b dark:bg-transparent bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section - Title */}
        <div className="flex items-center gap-4 flex-1">
          {/* Page Title */}
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-foreground">
              {currentPageTitle}
            </h1>
          </div>

          {/* Mobile Title */}
          <div className="lg:hidden">
            <h1 className="text-base font-semibold text-foreground truncate max-w-[200px]">
              {currentPageTitle}
            </h1>
          </div>
        </div>

        {/* Right Section - Actions and Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-2 mr-2">
            {quickActions.map((action) => (
              <TooltipProvider key={action.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8"
                    >
                      <Link
                        href={action.href}
                        target={action.target}
                        rel={
                          action.target === "_blank"
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        <action.icon className="h-4 w-4" />
                        <span className="sr-only">{action.label}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle variant="ghost" size="icon" className="h-8 w-8" />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 px-2 rounded-md hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" alt={user.username} />
                    <AvatarFallback className="text-xs">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium">
                    {user.username}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Administrator
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Mobile Quick Actions */}
              <div className="lg:hidden">
                <DropdownMenuItem asChild>
                  <Link href="/" target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View Portfolio</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/projects/new">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>New Project</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>

              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 dark:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Options - Mobile */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Go to Portfolio</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

// Simplified header for pages that don't need full features
interface DashboardHeaderSimpleProps {
  title: string;
  description?: string;
}

export function DashboardHeaderSimple({
  title,
  description,
}: DashboardHeaderSimpleProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-16 items-center px-4 lg:px-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
