"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Filter,
  Star,
  Zap,
  Code,
  Database,
  Server,
  Wrench,
  Globe,
  Settings,
  X,
  UserPlus,
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
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Skill, SkillFormData, SkillCategory, SkillsByCategory } from "@/types";
import {
  getSkills,
  getSkillsByCategory,
  createSkill,
  updateSkill,
  deleteSkill,
  duplicateSkill,
} from "@/lib/actions/skills";

const SKILL_CATEGORIES = [
  {
    value: "frontend",
    label: "Frontend",
    icon: Globe,
    color:
      "bg-blue-500/20 text-blue-600 border-blue-500/30 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20",
  },
  {
    value: "backend",
    label: "Backend",
    icon: Server,
    color:
      "bg-green-500/20 text-green-600 border-green-500/30 dark:bg-green-400/10 dark:text-green-400 dark:border-green-400/20",
  },
  {
    value: "database",
    label: "Database",
    icon: Database,
    color:
      "bg-purple-500/20 text-purple-600 border-purple-500/30 dark:bg-purple-400/10 dark:text-purple-400 dark:border-purple-400/20",
  },
  {
    value: "devops",
    label: "DevOps",
    icon: Settings,
    color:
      "bg-orange-500/20 text-orange-600 border-orange-500/30 dark:bg-orange-400/10 dark:text-orange-400 dark:border-orange-400/20",
  },
  {
    value: "languages",
    label: "Languages",
    icon: Code,
    color:
      "bg-red-500/20 text-red-600 border-red-500/30 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20",
  },
  {
    value: "frameworks",
    label: "Frameworks",
    icon: Zap,
    color:
      "bg-yellow-500/20 text-yellow-600 border-yellow-500/30 dark:bg-yellow-400/10 dark:text-yellow-400 dark:border-yellow-400/20",
  },
  {
    value: "tools",
    label: "Tools",
    icon: Wrench,
    color:
      "bg-gray-500/20 text-gray-600 border-gray-500/30 dark:bg-gray-400/10 dark:text-gray-400 dark:border-gray-400/20",
  },
  {
    value: "other",
    label: "Other",
    icon: Star,
    color:
      "bg-pink-500/20 text-pink-600 border-pink-500/30 dark:bg-pink-400/10 dark:text-pink-400 dark:border-pink-400/20",
  },
] as const;

const PROFICIENCY_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

interface MultiSkillForm {
  skills: Array<{
    name: string;
    category: SkillCategory;
    proficiency_level: number;
  }>;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsByCategory, setSkillsByCategory] = useState<SkillsByCategory>({
    frontend: [],
    backend: [],
    devops: [],
    database: [],
    tools: [],
    languages: [],
    frameworks: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | "all">(
    "all",
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMultiCreateDialogOpen, setIsMultiCreateDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    category: "frontend",
    proficiency_level: 3,
  });
  const [multiSkillData, setMultiSkillData] = useState<MultiSkillForm>({
    skills: [{ name: "", category: "frontend", proficiency_level: 3 }],
  });
  const [submitting, setSubmitting] = useState(false);

  // Load skills on component mount
  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const [skillsData, categorizedSkills] = await Promise.all([
        getSkills(),
        getSkillsByCategory(),
      ]);
      setSkills(skillsData);
      setSkillsByCategory(categorizedSkills);
    } catch (error) {
      toast.error("Failed to load skills");
      console.error("Error loading skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "frontend",
      proficiency_level: 3,
    });
    setEditingSkill(null);
  };

  const resetMultiForm = () => {
    setMultiSkillData({
      skills: [{ name: "", category: "frontend", proficiency_level: 3 }],
    });
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleMultiCreate = () => {
    resetMultiForm();
    setIsMultiCreateDialogOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: (skill.category || "frontend") as SkillCategory,
      proficiency_level: skill.proficiency_level || 3,
    });
    setEditingSkill({
      ...skill,
      id: String(skill.id),
      category: (skill.category || "frontend") as SkillCategory,
    });
    setIsCreateDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let result;
      if (editingSkill) {
        result = await updateSkill(editingSkill.id as string, formData);
      } else {
        result = await createSkill(formData);
      }

      if (result.success) {
        toast.success(result.message);
        setIsCreateDialogOpen(false);
        resetForm();
        await loadSkills();
      } else {
        toast.error(result.error || "Failed to save skill");
      }
    } catch (error) {
      toast.error("An error occurred while saving the skill");
      console.error("Error saving skill:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMultiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const validSkills = multiSkillData.skills.filter(
        (skill) => skill.name.trim() !== "",
      );

      if (validSkills.length === 0) {
        toast.error("Please add at least one skill");
        setSubmitting(false);
        return;
      }

      const results = await Promise.all(
        validSkills.map((skill) => createSkill(skill)),
      );

      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      if (successful > 0) {
        toast.success(
          `Successfully created ${successful} skill${successful > 1 ? "s" : ""}`,
        );
        setIsMultiCreateDialogOpen(false);
        resetMultiForm();
        await loadSkills();
      }

      if (failed > 0) {
        toast.error(`Failed to create ${failed} skill${failed > 1 ? "s" : ""}`);
      }
    } catch (error) {
      toast.error("An error occurred while creating skills");
      console.error("Error creating skills:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteSkill(id);
      if (result.success) {
        toast.success(result.message);
        await loadSkills();
      } else {
        toast.error(result.error || "Failed to delete skill");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the skill");
      console.error("Error deleting skill:", error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const result = await duplicateSkill(id);
      if (result.success) {
        toast.success(result.message);
        await loadSkills();
      } else {
        toast.error(result.error || "Failed to duplicate skill");
      }
    } catch (error) {
      toast.error("An error occurred while duplicating the skill");
      console.error("Error duplicating skill:", error);
    }
  };

  const addSkillToMultiForm = () => {
    setMultiSkillData({
      skills: [
        ...multiSkillData.skills,
        { name: "", category: "frontend", proficiency_level: 3 },
      ],
    });
  };

  const removeSkillFromMultiForm = (index: number) => {
    if (multiSkillData.skills.length > 1) {
      setMultiSkillData({
        skills: multiSkillData.skills.filter((_, i) => i !== index),
      });
    }
  };

  const updateMultiSkill = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedSkills = [...multiSkillData.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setMultiSkillData({ skills: updatedSkills });
  };

  const getCategoryColor = (category: SkillCategory) => {
    const categoryConfig = SKILL_CATEGORIES.find(
      (cat) => cat.value === category,
    );
    return (
      categoryConfig?.color ||
      "bg-gray-500/20 text-gray-600 border-gray-500/30 dark:bg-gray-400/10 dark:text-gray-400 dark:border-gray-400/20"
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-400/10 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-400/10 rounded w-48"></div>
          </div>
          <div className="h-10 bg-gray-400/10 rounded w-32"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-gray-400/10 backdrop-blur-sm">
              <CardHeader>
                <div className="h-4 bg-gray-400/10 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-400/10 rounded"></div>
                  <div className="h-3 bg-gray-400/10 rounded w-2/3"></div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Skills
          </h1>
          <p className="text-muted-foreground">
            Manage your technical skills and expertise ({skills.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
          <Button onClick={handleMultiCreate}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Multiple Skills
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-400/10 backdrop-blur-sm"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) =>
            setCategoryFilter(value as SkillCategory | "all")
          }
        >
          <SelectTrigger className="w-[200px] bg-gray-400/10 backdrop-blur-sm">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {SKILL_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Skills by Category */}
      <div className="space-y-8">
        {SKILL_CATEGORIES.map((categoryConfig) => {
          const categorySkills =
            skillsByCategory[categoryConfig.value as SkillCategory] || [];
          const filteredCategorySkills = categorySkills.filter((skill) => {
            const matchesSearch = skill.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const matchesCategory =
              categoryFilter === "all" ||
              skill.category === categoryConfig.value;
            return matchesSearch && matchesCategory;
          });

          if (
            filteredCategorySkills.length === 0 &&
            categoryFilter !== "all" &&
            categoryFilter !== categoryConfig.value
          ) {
            return null;
          }

          return (
            <div key={categoryConfig.value} className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${categoryConfig.color} border`}
                >
                  <categoryConfig.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">
                  {categoryConfig.label}
                </h2>
                <Badge variant="secondary" className="ml-auto">
                  {filteredCategorySkills.length}
                </Badge>
              </div>

              {filteredCategorySkills.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredCategorySkills.map((skill) => (
                    <Card
                      key={skill.id}
                      className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border-border/50"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold line-clamp-2">
                            {skill.name}
                          </CardTitle>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(skill)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDuplicate(skill.id as string)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Skill
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete &quot;
                                    {skill.name}&quot;? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDelete(skill.id as string)
                                    }
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
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Proficiency
                            </span>
                            <Badge
                              variant="outline"
                              className={getCategoryColor(
                                skill.category as SkillCategory,
                              )}
                            >
                              {PROFICIENCY_LABELS[skill.proficiency_level || 3]}
                            </Badge>
                          </div>
                          <Progress
                            value={(skill.proficiency_level || 3) * 20}
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-400/10 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <categoryConfig.icon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      No {categoryConfig.label} Skills
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Add your first {categoryConfig.label.toLowerCase()} skill
                      to get started
                    </p>
                    <Button onClick={handleCreate} variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add {categoryConfig.label} Skill
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>

      {/* Single Skill Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </DialogTitle>
            <DialogDescription>
              {editingSkill
                ? "Update your skill information"
                : "Add a new skill to your portfolio"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Skill Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., React, Python, Docker"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value as SkillCategory,
                    })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Proficiency Level:{" "}
                  {PROFICIENCY_LABELS[formData.proficiency_level || 3]}
                </Label>
                <Slider
                  value={[formData.proficiency_level || 3]}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      proficiency_level: value[0] || 3,
                    })
                  }
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : editingSkill
                    ? "Update Skill"
                    : "Add Skill"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Multi Skill Create Dialog */}
      <Dialog
        open={isMultiCreateDialogOpen}
        onOpenChange={setIsMultiCreateDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Add Multiple Skills
            </DialogTitle>
            <DialogDescription>
              Add multiple skills at once to save time
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMultiSubmit} className="space-y-6">
            <div className="space-y-4">
              {multiSkillData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gray-400/10 backdrop-blur-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Skill {index + 1}</h4>
                    {multiSkillData.skills.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkillFromMultiForm(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Skill Name</Label>
                      <Input
                        value={skill.name}
                        onChange={(e) =>
                          updateMultiSkill(index, "name", e.target.value)
                        }
                        placeholder="e.g., React, Python, Docker"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category</Label>
                      <Select
                        value={skill.category}
                        onValueChange={(value) =>
                          updateMultiSkill(
                            index,
                            "category",
                            value as SkillCategory,
                          )
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {SKILL_CATEGORIES.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              <div className="flex items-center gap-2">
                                <category.icon className="h-4 w-4" />
                                {category.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Proficiency:{" "}
                      {PROFICIENCY_LABELS[skill.proficiency_level || 3]}
                    </Label>
                    <Slider
                      value={[skill.proficiency_level || 3]}
                      onValueChange={(value) =>
                        updateMultiSkill(
                          index,
                          "proficiency_level",
                          value[0] || 3,
                        )
                      }
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSkillToMultiForm}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Skill
              </Button>
            </div>

            <Separator />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMultiCreateDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating Skills..." : "Create All Skills"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
