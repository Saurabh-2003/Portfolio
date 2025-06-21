import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Plus,
  Users,
  FolderOpen,
  Code,
  MessageSquare,
  Eye,
  Calendar,
  ArrowUpRight,
  Activity,
  User,
  Briefcase,
  Mail,
  Target,
  Award,
  TrendingUp,
  Star,
  Globe,
  Settings,
  Database,
  Zap,
  Clock,
  CheckCircle,
  Sparkles,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getProfile } from "@/lib/actions/profile";
import { getProjects } from "@/lib/actions/projects";
import { getExperiences } from "@/lib/actions/experience";
import { getSkills } from "@/lib/actions/skills";
import { PROJECT_STATUS_LABELS } from "@/types";
import type { Skill } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description: "Portfolio management dashboard overview",
};

// Enhanced loading skeletons
function StatsCardSkeleton() {
  return (
    <Card className="bg-gray-400/10 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-20 bg-gray-400/20 animate-pulse rounded" />
        <div className="h-4 w-4 bg-gray-400/20 animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-gray-400/20 animate-pulse rounded mb-2" />
        <div className="h-3 w-24 bg-gray-400/20 animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-10 w-64 bg-gray-400/10 animate-pulse rounded" />
        <div className="h-5 w-96 bg-gray-400/10 animate-pulse rounded" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-gray-400/10 backdrop-blur-sm">
              <CardHeader>
                <div className="h-6 w-48 bg-gray-400/10 animate-pulse rounded" />
                <div className="h-4 w-64 bg-gray-400/10 animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-4 w-full bg-gray-400/10 animate-pulse rounded"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-4 space-y-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="bg-gray-400/10 backdrop-blur-sm">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-400/10 animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-400/10 animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-gray-400/10 animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced stats cards with beautiful gradients and animations
async function StatsCards() {
  const [projects, experiences, skills] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
  ]);

  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const ongoingProjects = projects.filter((p) => p.status === "ongoing").length;

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      description: `${completedProjects} completed, ${ongoingProjects} ongoing`,
      icon: FolderOpen,
      trend: "+12%",
      trendUp: true,
      color: "from-blue-500/10 to-blue-600/5",
      borderColor: "border-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10 dark:bg-blue-400/10",
    },
    {
      title: "Work Experience",
      value: experiences.length,
      description: "Professional roles & positions",
      icon: Briefcase,
      trend: "",
      trendUp: true,
      color: "from-green-500/10 to-green-600/5",
      borderColor: "border-green-500/20",
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10 dark:bg-green-400/10",
    },
    {
      title: "Skills & Technologies",
      value: skills.length,
      description: "Technical skills & expertise",
      icon: Code,
      trend: "+3 this month",
      trendUp: true,
      color: "from-purple-500/10 to-purple-600/5",
      borderColor: "border-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10 dark:bg-purple-400/10",
    },
    {
      title: "Portfolio Score",
      value: Math.min(
        100,
        Math.round(
          (projects.length * 15 + experiences.length * 20 + skills.length * 5) /
            2,
        ),
      ),
      description: "Completeness & quality",
      icon: TrendingUp,
      trend: "+5 points",
      trendUp: true,
      color: "from-orange-500/10 to-orange-600/5",
      borderColor: "border-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10 dark:bg-orange-400/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`group hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${stat.color} backdrop-blur-sm ${stat.borderColor} border hover:scale-105`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {stat.title}
            </CardTitle>
            <div
              className={`p-2 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}
            >
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.trend && (
                <Badge
                  variant={stat.trendUp ? "default" : "secondary"}
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Enhanced recent projects with better visual hierarchy
async function RecentProjects() {
  const projects = await getProjects().catch(() => []);
  const recentProjects = projects.slice(0, 4);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400";
      case "ongoing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400";
      case "draft":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 dark:bg-primary/5 dark:border-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Recent Projects</CardTitle>
            <CardDescription>Your latest portfolio projects</CardDescription>
          </div>
        </div>
        <Button size="sm" variant="outline" asChild className="gap-1">
          <Link href="/dashboard/projects">
            View All
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentProjects.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No projects yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start building your portfolio by creating your first project.
            </p>
            <Button asChild>
              <Link href="/dashboard/projects">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="group p-4 rounded-lg bg-gray-400/5 hover:bg-gray-400/10 transition-all duration-200 border border-transparent hover:border-border/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(project.status)}`}
                      >
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">
                    {project.created_at &&
                      new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.slice(0, 3).map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary border-primary/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-gray-400/10"
                      >
                        +{project.tech_stack.length - 3}
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Enhanced skills overview with beautiful progress bars
async function SkillsOverview() {
  const skills = await getSkills().catch(() => []);
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (skill.category && !acc[skill.category]) acc[skill.category] = [];
      if (skill.category) (acc[skill.category] as Skill[]).push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  const categoryIcons: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    frontend: Globe,
    backend: Database,
    languages: Code,
    frameworks: Zap,
    tools: Settings,
    devops: Activity,
    database: Database,
    other: Star,
  };

  const topCategories = Object.entries(skillsByCategory)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 5);

  return (
    <Card className="bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 dark:bg-primary/5 dark:border-primary/10">
            <Code className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Skills Overview</CardTitle>
            <CardDescription>
              Your technical expertise by category
            </CardDescription>
          </div>
        </div>
        <Button size="sm" variant="outline" asChild className="gap-1">
          <Link href="/dashboard/skills">
            Manage
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {topCategories.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto mb-4">
              <Code className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No skills added
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your technical skills to showcase your expertise.
            </p>
            <Button asChild>
              <Link href="/dashboard/skills">
                <Plus className="mr-2 h-4 w-4" />
                Add Skills
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {topCategories.map(([category, categorySkills]) => {
              const Icon = categoryIcons[category] || Star;
              const percentage = Math.round(
                (categorySkills.length / skills.length) * 100,
              );

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {categorySkills.length} skills
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex flex-wrap gap-1">
                    {categorySkills.slice(0, 6).map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary border-primary/20"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                    {categorySkills.length > 6 && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-gray-400/10"
                      >
                        +{categorySkills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Enhanced messages card with better visual design
async function UnreadMessagesCard() {
  // In a real app, you'd fetch actual message data
  const unreadCount = 0;
  const totalMessages = 0;

  return (
    <Card className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 backdrop-blur-sm border-blue-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 dark:bg-blue-400/10 dark:border-blue-400/20">
            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Messages</CardTitle>
            <CardDescription>Contact form submissions</CardDescription>
          </div>
        </div>
        <Button size="sm" variant="outline" asChild className="gap-1">
          <Link href="/dashboard/messages">
            View All
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {unreadCount}
            </div>
            <div>
              <p className="text-sm font-medium">Unread Messages</p>
              <p className="text-xs text-muted-foreground">
                {totalMessages} total messages
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount === 0 && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">All caught up!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// New Activity Feed component
function ActivityFeed() {
  const activities = [
    {
      type: "project",
      title: "Updated Portfolio Website",
      description: "Added new features and improved UI",
      time: "2 hours ago",
      icon: FolderOpen,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      type: "skill",
      title: "Added React 18 Skills",
      description: "Mastered new React features",
      time: "1 day ago",
      icon: Code,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      type: "experience",
      title: "Updated Work Experience",
      description: "Added recent project achievements",
      time: "3 days ago",
      icon: Briefcase,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 dark:bg-primary/5 dark:border-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Your latest portfolio updates</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${activity.bg} border border-current/20`}
              >
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-xs text-muted-foreground mb-1">
                  {activity.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced goals card with progress tracking
function GoalsCard() {
  const goals = [
    { title: "Master TypeScript", progress: 75, completed: false },
    { title: "Open Source Contributions", progress: 40, completed: false },
    { title: "Build SaaS Product", progress: 25, completed: false },
    { title: "Tech Conference Talk", progress: 10, completed: false },
  ];

  return (
    <Card className="bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 backdrop-blur-sm border-yellow-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 dark:bg-yellow-400/10 dark:border-yellow-400/20">
            <Target className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Goals & Objectives</CardTitle>
            <CardDescription>
              Track your professional development
            </CardDescription>
          </div>
        </div>
        <Button size="sm" variant="outline" className="gap-1">
          <Settings className="h-3 w-3" />
          Manage
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{goal.title}</span>
                <span className="text-xs text-muted-foreground">
                  {goal.progress}%
                </span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </div>
        <Button size="sm" variant="ghost" className="w-full mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Add New Goal
        </Button>
      </CardContent>
    </Card>
  );
}

// Enhanced achievements with visual medals
function AchievementsCard() {
  const achievements = [
    {
      title: "Portfolio Master",
      description: "Completed 10+ projects",
      icon: Award,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-500/10",
      date: "This month",
    },
    {
      title: "Code Contributor",
      description: "First open source contribution",
      icon: Star,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      date: "Last week",
    },
    {
      title: "Content Creator",
      description: "Published technical blog post",
      icon: Sparkles,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      date: "2 weeks ago",
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-green-500/5 to-green-600/5 backdrop-blur-sm border-green-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 dark:bg-green-400/10 dark:border-green-400/20">
            <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Achievements</CardTitle>
            <CardDescription>Your milestone accomplishments</CardDescription>
          </div>
        </div>
        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-400/5 hover:bg-gray-400/10 transition-colors"
            >
              <div
                className={`p-2 rounded-full ${achievement.bg} border border-current/20`}
              >
                <achievement.icon className={`h-4 w-4 ${achievement.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                {achievement.date}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced quick actions with better organization
function QuickActions() {
  const actions = [
    {
      title: "Manage Profile",
      description: "Update personal information",
      href: "/dashboard/profile",
      icon: User,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Add Project",
      description: "Create new portfolio project",
      href: "/dashboard/projects",
      icon: Plus,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Work Experience",
      description: "Manage professional history",
      href: "/dashboard/experience",
      icon: Briefcase,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Technical Skills",
      description: "Update skill proficiencies",
      href: "/dashboard/skills",
      icon: Code,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Contact & Messages",
      description: "Manage contact info and messages",
      href: "/dashboard/contact",
      icon: Mail,
      color: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-500/10",
    },
    {
      title: "View Live Portfolio",
      description: "See your public portfolio",
      href: "/",
      icon: Eye,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
      external: true,
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 dark:bg-primary/5 dark:border-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Manage your portfolio content</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {actions.map((action) => (
            <Button
              key={action.href}
              variant="ghost"
              className="justify-start h-auto p-3 hover:bg-gray-400/10 transition-colors"
              asChild
            >
              <Link
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
              >
                <div
                  className={`p-2 rounded-lg ${action.bg} border border-current/20 mr-3`}
                >
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <div className="text-left flex-1">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
                {action.external && (
                  <ArrowUpRight className="ml-auto h-3 w-3" />
                )}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced profile summary component
async function ProfileSummary() {
  const profile = await getProfile().catch(() => null);

  return (
    <Card className="bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 dark:bg-primary/5 dark:border-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Profile Summary</CardTitle>
            <CardDescription>Your portfolio information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!profile ? (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Profile not set up
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete your profile to get started with your portfolio.
            </p>
            <Button asChild>
              <Link href="/dashboard/profile">
                <Plus className="mr-2 h-4 w-4" />
                Set Up Profile
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage
                  src={profile.profile_image || ""}
                  alt={profile.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {profile.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{profile.name}</h3>
                {profile.headline && (
                  <p className="text-sm text-muted-foreground mb-1">
                    {profile.headline}
                  </p>
                )}
                {profile.location && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {profile.location}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {profile.about && (
              <div>
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {profile.about}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20"
              >
                {profile.availability || "Status not set"}
              </Badge>
              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main dashboard content with enhanced layout
async function DashboardContent() {
  return (
    <div className="p-6 space-y-8">
      {/* Enhanced Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here&apos;s a comprehensive view of your portfolio
            progress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Portfolio Analytics</span>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <StatsCards />

      {/* Main Content Grid with improved layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <RecentProjects />

          <div className="grid gap-6 md:grid-cols-2">
            <UnreadMessagesCard />
            <ActivityFeed />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <GoalsCard />
            <AchievementsCard />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileSummary />
          <QuickActions />
          <SkillsOverview />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
