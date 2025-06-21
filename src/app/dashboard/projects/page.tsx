"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Project, ProjectStatus, ProjectFormData } from "@/types";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  duplicateProject,
} from "@/lib/actions/projects";

const PROJECT_STATUS_OPTIONS = [
  { value: "completed", label: "Completed", variant: "default" as const },
  { value: "ongoing", label: "Ongoing", variant: "secondary" as const },
  { value: "draft", label: "Draft", variant: "outline" as const },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">(
    "all",
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    status: "draft",
    tech_stack: [],
    github_link: "",
    deployed_link: "",
    image: "",
    image_path: "",
    video: "",
    duration: "",
    role: "",
    team_size: undefined,
    features: "",
    learnings: "",
    challenges: "",
  });
  const [techInput, setTechInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Scroll indicator effect
  useEffect(() => {
    if (!isCreateDialogOpen) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollProgress = document.getElementById("scroll-progress");

      if (scrollProgress && target) {
        const { scrollTop, scrollHeight, clientHeight } = target;
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollTop > 50) {
          scrollProgress.style.opacity = "1";
          scrollProgress.style.transform = "translateY(0)";
          scrollProgress.style.background = `linear-gradient(to right,
            hsl(var(--primary)/0.2) 0%,
            hsl(var(--primary)) ${Math.min(scrollPercent, 100)}%,
            hsl(var(--primary)/0.2) 100%)`;
        } else {
          scrollProgress.style.opacity = "0";
          scrollProgress.style.transform = "translateY(-100%)";
        }
      }
    };

    const dialogContent = document.querySelector("[data-radix-dialog-content]");
    if (dialogContent) {
      dialogContent.addEventListener("scroll", handleScroll);
      return () => dialogContent.removeEventListener("scroll", handleScroll);
    }
  }, [isCreateDialogOpen]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getProjects();
      setProjects(projectsData);
    } catch (error) {
      toast.error("Failed to load projects");
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tech_stack.some((tech) =>
        typeof tech === "string"
          ? tech.toLowerCase().includes(searchTerm.toLowerCase())
          : String(tech).toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "draft",
      tech_stack: [],
      github_link: "",
      deployed_link: "",
      image: "",
      image_path: "",
      video: "",
      duration: "",
      role: "",
      team_size: undefined,
      features: "",
      learnings: "",
      challenges: "",
    });
    setEditingProject(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      status: project.status,
      tech_stack: project.tech_stack,
      github_link: project.github_link || "",
      deployed_link: project.deployed_link || "",
      image: project.image || "",
      image_path: project.image_path || "",
      video: project.video || "",
      duration: project.duration || "",
      role: project.role || "",
      team_size: project.team_size,
      features: project.features || "",
      learnings: project.learnings || "",
      challenges: project.challenges || "",
    });
    setEditingProject(project);
    setIsCreateDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let result;
      if (editingProject) {
        result = await updateProject(String(editingProject.id), formData);
      } else {
        result = await createProject(formData);
      }

      if (result.success) {
        toast.success(result.message);
        setIsCreateDialogOpen(false);
        resetForm();
        await loadProjects();
      } else {
        toast.error(result.error || "Failed to save project");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error submitting project:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteProject(id);
      if (result.success) {
        toast.success("Project deleted successfully");
        await loadProjects();
      } else {
        toast.error(result.error || "Failed to delete project");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error deleting project:", error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const result = await duplicateProject(id);
      if (result.success) {
        toast.success("Project duplicated successfully");
        await loadProjects();
      } else {
        toast.error(result.error || "Failed to duplicate project");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error duplicating project:", error);
    }
  };

  const handleAddTech = () => {
    const tech = techInput.trim();
    if (tech && !formData.tech_stack.includes(tech)) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, tech],
      });
    }
    setTechInput("");
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter((t) => t !== tech),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      // Use API route for upload
      const res = await fetch("/api/projects/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const result = await res.json();

      if (result.success && result.data) {
        setFormData({ ...formData, image: result.data.url });
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage your portfolio projects
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects ({projects.length} total)
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as ProjectStatus | "all")
          }
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-lg transition-shadow bg-gray-400/20 dark:bg-gray-400/10"
          >
            {project.image && (
              <div className="aspect-video p-4 w-full overflow-hidden rounded-t-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={
                        PROJECT_STATUS_OPTIONS.find(
                          (option) => option.value === project.status,
                        )?.variant || "default"
                      }
                    >
                      {PROJECT_STATUS_OPTIONS.find(
                        (option) => option.value === project.status,
                      )?.label || project.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicate(String(project.id))}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{project.title}
                          &quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(String(project.id))}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tech_stack.slice(0, 3).map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-gray-400/20 dark:bg-gray-400/10"
                  >
                    {typeof tech === "string" ? tech : String(tech)}
                  </Badge>
                ))}
                {project.tech_stack.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-400/20 dark:bg-gray-400/10"
                  >
                    +{String(project.tech_stack.length - 3)} more
                  </Badge>
                )}
              </div>

              {/* Links */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </a>
                </Button>
                {project.deployed_link && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <a
                      href={project.deployed_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first project"}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Project
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-scroll rounded-xl p-6 bg-gradient-to-br from-background/95 to-muted/20 backdrop-blur-sm border shadow-2xl [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/50">
          <div className="mb-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {editingProject ? "Edit Project" : "Create New Project"}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {editingProject
                  ? "Update your project details below"
                  : "Fill in the details to add a new project to your portfolio"}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            {/* Scroll Progress Indicator */}
            <div
              className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-full opacity-0 transition-all duration-300 z-50"
              id="scroll-progress"
            ></div>
            {/* Basic Information Section */}
            <div className="space-y-8 mb-8">
              <div className="p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      1
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      Project Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter your project title"
                      required
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="status"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      Project Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as ProjectStatus,
                        })
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">✅ Completed</SelectItem>
                        <SelectItem value="ongoing">🚀 Ongoing</SelectItem>
                        <SelectItem value="draft">📝 Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium flex items-center gap-1"
                  >
                    Project Description{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your project - what it does, its purpose, key features, and what makes it special..."
                    rows={4}
                    required
                    className="resize-none text-base"
                  />
                </div>
              </div>

              {/* Tech Stack Section */}
              <div className="p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      2
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">Technology Stack</h3>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="tech_stack" className="text-sm font-medium">
                    Technologies Used
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      id="tech_stack_input"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      placeholder="Add a technology (e.g., React, TypeScript, Node.js)"
                      className="flex-1 h-11 text-base"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTech}
                      size="default"
                      className="h-11 px-6 sm:w-auto w-full"
                    >
                      Add Tech
                    </Button>
                  </div>
                  {formData.tech_stack.length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-lg border border-border/30">
                      <div className="flex flex-wrap gap-2">
                        {formData.tech_stack.map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="flex items-center gap-1 bg-background/90 hover:bg-background transition-colors px-3 py-1 text-sm"
                          >
                            {tech}
                            <button
                              type="button"
                              className="ml-1 text-xs hover:text-destructive transition-colors w-4 h-4 flex items-center justify-center rounded-full hover:bg-destructive/10"
                              onClick={() => handleRemoveTech(tech)}
                              aria-label={`Remove ${tech}`}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Links & Media Section */}
              <div className="p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      3
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">Links & Media</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="github_link"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      <Github className="w-4 h-4" />
                      GitHub Repository{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="github_link"
                      type="url"
                      value={formData.github_link}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          github_link: e.target.value,
                        })
                      }
                      placeholder="https://github.com/username/repository"
                      required
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="deployed_link"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo Link
                    </Label>
                    <Input
                      id="deployed_link"
                      type="url"
                      value={formData.deployed_link}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deployed_link: e.target.value,
                        })
                      }
                      placeholder="https://your-project.com"
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-3 lg:col-span-2">
                    <Label htmlFor="video" className="text-sm font-medium">
                      Demo Video Link
                    </Label>
                    <Input
                      id="video"
                      type="url"
                      value={formData.video}
                      onChange={(e) =>
                        setFormData({ ...formData, video: e.target.value })
                      }
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                      className="h-11 text-base"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3 lg:col-span-2">
                  <Label className="text-sm font-medium">Project Image</Label>
                  <div className="p-6 border-2 border-dashed border-border/50 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {formData.image && (
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden border bg-background shadow-sm">
                          <img
                            src={formData.image}
                            alt="Project preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-11 px-6 bg-background hover:bg-accent text-foreground border-border hover:border-accent-foreground/20 transition-all"
                            onClick={() =>
                              document.getElementById("project-image")?.click()
                            }
                            disabled={uploading}
                          >
                            {uploading
                              ? "Uploading..."
                              : formData.image
                                ? "Change Image"
                                : "Choose Image"}
                          </Button>
                          {formData.image && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="default"
                              onClick={() =>
                                setFormData({ ...formData, image: "" })
                              }
                              className="h-11 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="project-image"
                          disabled={uploading}
                        />
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>PNG, JPG, GIF up to 5MB</p>
                          <p>Recommended: 16:9 aspect ratio (1200x675px)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details Section */}
              <div className="p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      4
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">Project Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-3">
                    <Label htmlFor="duration" className="text-sm font-medium">
                      Project Duration
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="e.g., Jan 2024 - May 2024"
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Your Role
                    </Label>
                    <Input
                      id="role"
                      value={formData.role || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      placeholder="e.g., Full Stack Developer"
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="team_size" className="text-sm font-medium">
                      Team Size
                    </Label>
                    <Input
                      id="team_size"
                      type="number"
                      min={1}
                      value={formData.team_size || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          team_size: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="e.g., 4 people"
                      className="h-11 text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="features" className="text-sm font-medium">
                      Key Features
                    </Label>
                    <Textarea
                      id="features"
                      value={formData.features || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, features: e.target.value })
                      }
                      placeholder="• User authentication&#10;• Real-time messaging&#10;• Responsive design"
                      rows={4}
                      className="resize-none text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="learnings" className="text-sm font-medium">
                      Key Learnings
                    </Label>
                    <Textarea
                      id="learnings"
                      value={formData.learnings || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, learnings: e.target.value })
                      }
                      placeholder="What technologies or concepts did you learn while building this project?"
                      rows={4}
                      className="resize-none text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="challenges" className="text-sm font-medium">
                      Challenges Overcome
                    </Label>
                    <Textarea
                      id="challenges"
                      value={formData.challenges || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, challenges: e.target.value })
                      }
                      placeholder="What technical or design challenges did you face and how did you solve them?"
                      rows={4}
                      className="resize-none text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll hint for long forms */}
            <div className="text-center py-4 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs">📝</span>
                <span>Scroll down to complete all sections and submit</span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t bg-background/50 backdrop-blur-sm rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={submitting}
                  className="h-11 px-6 sm:w-auto w-full order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-11 px-8 sm:w-auto w-full order-1 sm:order-2"
                >
                  {submitting
                    ? "Saving..."
                    : editingProject
                      ? "Update Project"
                      : "Create Project"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
