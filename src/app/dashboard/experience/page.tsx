"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Building,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Experience, ExperienceFormData } from "@/types";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  duplicateExperience,
} from "@/lib/actions/experience";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null,
  );
  const [formData, setFormData] = useState<ExperienceFormData>({
    company_name: "",
    role: "",
    duration: "",
    role_description: "",
    achievements: [],
    challenges_faced: "",
    learnings: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [achievementInput, setAchievementInput] = useState("");

  // Load experiences on component mount
  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const experiencesData = await getExperiences();
      setExperiences(experiencesData);
    } catch (error) {
      toast.error("Failed to load experiences");
      console.error("Error loading experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter experiences based on search
  const filteredExperiences = experiences.filter((experience) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      experience.company_name.toLowerCase().includes(searchLower) ||
      experience.role.toLowerCase().includes(searchLower) ||
      experience.duration.toLowerCase().includes(searchLower)
    );
  });

  const resetForm = () => {
    setFormData({
      company_name: "",
      role: "",
      duration: "",
      role_description: "",
      achievements: [],
      challenges_faced: "",
      learnings: "",
    });
    setAchievementInput("");
    setEditingExperience(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setFormData({
      company_name: experience.company_name,
      role: experience.role,
      duration: experience.duration,
      role_description: experience.role_description,
      achievements: experience.achievements || [],
      challenges_faced: experience.challenges_faced,
      learnings: experience.learnings,
    });
    setEditingExperience(experience);
    setIsCreateDialogOpen(true);
  };

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, achievementInput.trim()],
      });
      setAchievementInput("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let result;
      if (editingExperience) {
        result = await updateExperience(
          editingExperience.id as string,
          formData,
        );
      } else {
        result = await createExperience(formData);
      }

      if (result.success) {
        toast.success(result.message);
        setIsCreateDialogOpen(false);
        resetForm();
        await loadExperiences();
      } else {
        toast.error(result.error || "Failed to save experience");
      }
    } catch (error) {
      toast.error("An error occurred while saving the experience");
      console.error("Error saving experience:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteExperience(id);
      if (result.success) {
        toast.success(result.message);
        await loadExperiences();
      } else {
        toast.error(result.error || "Failed to delete experience");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the experience");
      console.error("Error deleting experience:", error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const result = await duplicateExperience(id);
      if (result.success) {
        toast.success(result.message);
        await loadExperiences();
      } else {
        toast.error(result.error || "Failed to duplicate experience");
      }
    } catch (error) {
      toast.error("An error occurred while duplicating the experience");
      console.error("Error duplicating experience:", error);
    }
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
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-400/10 backdrop-blur-sm">
              <CardHeader>
                <div className="h-6 bg-gray-400/10 rounded w-3/4"></div>
                <div className="h-4 bg-gray-400/10 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-400/10 rounded"></div>
                  <div className="h-4 bg-gray-400/10 rounded w-2/3"></div>
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
            Experience
          </h1>
          <p className="text-muted-foreground">
            Manage your work experience and career journey ({experiences.length}{" "}
            total)
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search experiences..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-400/10 backdrop-blur-sm"
        />
      </div>

      {/* Experiences List */}
      <div className="space-y-6">
        {filteredExperiences.length > 0 ? (
          filteredExperiences.map((experience) => (
            <Card
              key={experience.id}
              className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border-border/50"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 dark:bg-primary/5 dark:border-primary/10">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {experience.role}
                        </CardTitle>
                        <CardDescription className="text-base font-medium">
                          {experience.company_name}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{experience.duration}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(experience)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(experience.id as string)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this experience at
                            &quot;{experience.company_name}&quot;? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDelete(experience.id as string)
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
              <CardContent className="space-y-6">
                {/* Role Description */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Role Description
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {experience.role_description}
                  </p>
                </div>

                {/* Achievements */}
                {experience.achievements &&
                  experience.achievements.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Key Achievements
                      </h4>
                      <div className="space-y-2">
                        {experience.achievements.map((achievement, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Challenges */}
                  {experience.challenges_faced && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        Challenges Faced
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {experience.challenges_faced}
                      </p>
                    </div>
                  )}

                  {/* Learnings */}
                  {experience.learnings && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Key Learnings
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {experience.learnings}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-gray-400/10 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm
                  ? "No experiences found"
                  : "No experience added yet"}
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Add your first work experience to get started"}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreate} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Experience
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-400/10 to-gray-500/5 backdrop-blur-sm border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {editingExperience ? "Edit Experience" : "Add New Experience"}
            </DialogTitle>
            <DialogDescription>
              {editingExperience
                ? "Update your work experience details"
                : "Add a new work experience to your portfolio"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="p-6 rounded-lg bg-gray-400/10 backdrop-blur-sm border border-border/50 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-sm font-medium">
                    Company Name
                  </Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    placeholder="e.g., Google, Microsoft, Startup Inc."
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    Job Title
                  </Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="e.g., Frontend Developer, Product Manager"
                    required
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">
                  Duration
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g., Jan 2022 - Present, 2 years"
                  required
                  className="h-11"
                />
              </div>
            </div>

            {/* Role Description */}
            <div className="p-6 rounded-lg bg-gray-400/10 backdrop-blur-sm border border-border/50 space-y-4">
              <h3 className="text-lg font-semibold">Role Description</h3>
              <div className="space-y-2">
                <Label
                  htmlFor="role_description"
                  className="text-sm font-medium"
                >
                  Describe your role and responsibilities
                </Label>
                <Textarea
                  id="role_description"
                  value={formData.role_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role_description: e.target.value,
                    })
                  }
                  placeholder="Describe your main responsibilities, projects you worked on, and your contributions to the team..."
                  rows={4}
                  required
                  className="resize-none"
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="p-6 rounded-lg bg-gray-400/10 backdrop-blur-sm border border-border/50 space-y-4">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Add your key achievements
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAchievement();
                      }
                    }}
                    placeholder="e.g., Increased team productivity by 40%"
                    className="flex-1 h-10"
                  />
                  <Button
                    type="button"
                    onClick={handleAddAchievement}
                    size="sm"
                    className="h-10"
                  >
                    Add
                  </Button>
                </div>
                {formData.achievements.length > 0 && (
                  <div className="space-y-2">
                    {formData.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-gray-400/10 backdrop-blur-sm rounded-lg"
                      >
                        <Target className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="flex-1 text-sm">{achievement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAchievement(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="p-6 rounded-lg bg-gray-400/10 backdrop-blur-sm border border-border/50 space-y-4">
              <h3 className="text-lg font-semibold">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="challenges_faced"
                    className="text-sm font-medium"
                  >
                    Challenges Faced
                  </Label>
                  <Textarea
                    id="challenges_faced"
                    value={formData.challenges_faced}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        challenges_faced: e.target.value,
                      })
                    }
                    placeholder="What challenges did you overcome in this role?"
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learnings" className="text-sm font-medium">
                    Key Learnings
                  </Label>
                  <Textarea
                    id="learnings"
                    value={formData.learnings}
                    onChange={(e) =>
                      setFormData({ ...formData, learnings: e.target.value })
                    }
                    placeholder="What did you learn from this experience?"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
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
                  : editingExperience
                    ? "Update Experience"
                    : "Add Experience"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
