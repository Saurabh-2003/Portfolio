"use client";

import { useState, useEffect } from "react";
import { Camera, Save, Trash2, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Profile, ProfileFormData, ProfileAvailability } from "@/types";
import {
  getProfile,
  createOrUpdateProfile,
  deleteProfile,
} from "@/lib/actions/profile";

const AVAILABILITY_OPTIONS: {
  value: ProfileAvailability;
  label: string;
  color: string;
}[] = [
  { value: "available", label: "Available for work", color: "bg-green-500" },
  { value: "not_available", label: "Not available", color: "bg-red-500" },
  { value: "freelance", label: "Open to freelancing", color: "bg-yellow-400" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    about: "",
    profile_image: "",
    location: "",
    headline: "",
    availability: undefined,
  });

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getProfile();
      setProfile(profileData);

      if (profileData) {
        setFormData({
          name: profileData.name,
          about: profileData.about,
          profile_image: profileData.profile_image || "",
          location: profileData.location || "",
          headline: profileData.headline || "",
          availability: profileData.availability as
            | ProfileAvailability
            | undefined,
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await createOrUpdateProfile(formData);

      if (result.success) {
        toast.success(result.message);
        await loadProfile();
      } else {
        toast.error(result.error || "Failed to save profile");
        if (result.details) {
          result.details.forEach((detail) => {
            toast.error(`${detail.field}: ${detail.message}`);
          });
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteProfile();
      if (result.success) {
        toast.success("Profile deleted successfully");
        setProfile(null);
        setFormData({
          name: "",
          about: "",
          profile_image: "",
          location: "",
          headline: "",
          availability: undefined,
        });
      } else {
        toast.error(result.error || "Failed to delete profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error deleting profile:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      // Use API route for upload
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const result = await res.json();

      if (result.success && result.data) {
        setFormData({ ...formData, profile_image: result.data.url });
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-pulse dark:bg-gray-400/10">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-pulse dark:bg-gray-400/10">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and public profile
          </p>
        </div>
        {profile && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Profile
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete your profile? This action
                  cannot be undone and will remove all your profile information.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Profile
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Preview */}
        <Card className="dark:bg-gray-400/10">
          <CardHeader>
            <CardTitle>Profile Preview</CardTitle>
            <CardDescription>
              This is how your profile will appear to visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={formData.profile_image}
                    alt={formData.name}
                  />
                  <AvatarFallback className="text-lg">
                    {formData.name ? (
                      getInitials(formData.name)
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    {formData.name || "Your Name"}
                  </h3>
                  {formData.headline && (
                    <p className="text-sm text-muted-foreground">
                      {formData.headline}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {formData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {formData.location}
                      </div>
                    )}
                    {formData.availability && (
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            AVAILABILITY_OPTIONS.find(
                              (opt) => opt.value === formData.availability
                            )?.color || "bg-gray-400"
                          }`}
                        ></span>
                        {
                          AVAILABILITY_OPTIONS.find(
                            (opt) => opt.value === formData.availability
                          )?.label
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* About Section */}
              <div>
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {formData.about || "Add a description about yourself..."}
                </p>
              </div>

              {!profile && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">
                    No profile created yet. Fill out the form to create your
                    profile.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="dark:bg-gray-400/10">
          <CardHeader>
            <CardTitle>{profile ? "Edit Profile" : "Create Profile"}</CardTitle>
            <CardDescription>
              {profile
                ? "Update your profile information"
                : "Set up your professional profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={formData.profile_image}
                      alt={formData.name}
                    />
                    <AvatarFallback>
                      {formData.name ? (
                        getInitials(formData.name)
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden "
                      id="profile-image"
                      disabled={uploading}
                    />
                    <Label
                      htmlFor="profile-image"
                      className="cursor-pointer dark:bg-gray-400/10 dark:hover:bg-gray-400/30 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      {uploading ? "Uploading..." : "Change Photo"}
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>

              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline</Label>
                <Input
                  id="headline"
                  value={formData.headline}
                  onChange={(e) =>
                    setFormData({ ...formData, headline: e.target.value })
                  }
                  placeholder="e.g., Full Stack Developer, UI/UX Designer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About *</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) =>
                    setFormData({ ...formData, about: e.target.value })
                  }
                  placeholder="Tell visitors about yourself, your experience, and what you're passionate about..."
                  rows={6}
                  required
                />
              </div>

              {/* Additional Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <select
                    id="availability"
                    value={formData.availability ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availability: e.target.value
                          ? (e.target.value as ProfileAvailability)
                          : undefined,
                      })
                    }
                    className="w-full border dark:bg-gray-400/10 rounded px-3 py-2 bg-background text-foreground"
                  >
                    <option value="">Select availability</option>
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* URL Field (Hidden, used for image) */}
              <input
                type="hidden"
                value={formData.profile_image}
                onChange={(e) =>
                  setFormData({ ...formData, profile_image: e.target.value })
                }
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadProfile}
                  disabled={saving}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving
                    ? "Saving..."
                    : profile
                    ? "Update Profile"
                    : "Create Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      {profile && (
        <Card className="dark:bg-gray-400/10">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Created</p>
                <p className="text-2xl font-bold">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : ""}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-2xl font-bold">
                  {profile.updated_at
                    ? new Date(profile.updated_at).toLocaleDateString()
                    : ""}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Profile Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Completion</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    (((formData.name ? 1 : 0) +
                      (formData.about ? 1 : 0) +
                      (formData.profile_image ? 1 : 0) +
                      (formData.headline ? 1 : 0) +
                      (formData.location ? 1 : 0) +
                      (formData.availability ? 1 : 0)) /
                      6) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
