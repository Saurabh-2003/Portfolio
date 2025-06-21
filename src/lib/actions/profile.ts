"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ProfileFormData, Profile, ProfileAvailability } from "@/types";
import { z } from "zod";
import { uploadLocalImage, deleteLocalImage } from "@/lib/fileUpload";

// Validation schema for profile data
const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  about: z
    .string()
    .min(1, "About section is required")
    .max(2000, "About must be less than 2000 characters"),
  profile_image: z.string().optional().or(z.literal("")),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  headline: z
    .string()
    .max(200, "Headline must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  availability: z.enum(["available", "not_available", "freelance"]).optional(),
});

export async function getProfile(): Promise<Profile | null> {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) return null;
    return {
      ...profile,
      profile_image: profile.profile_image || undefined,
      location: profile.location || undefined,
      headline: profile.headline || undefined,
      availability: (profile.availability as ProfileAvailability) || undefined,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile data");
  }
}

export async function createOrUpdateProfile(data: ProfileFormData) {
  try {
    // Validate the input data
    const validatedData = profileSchema.parse(data);

    // Clean up empty optional fields
    const cleanData = {
      name: validatedData.name,
      about: validatedData.about,
      profile_image: validatedData.profile_image || undefined,
      location: validatedData.location || undefined,
      headline: validatedData.headline || undefined,
      availability: validatedData.availability || undefined,
    };

    // Check if profile exists
    const existingProfile = await prisma.profile.findFirst();

    let profile;
    if (existingProfile) {
      // If profile image is changing, delete the old one
      if (
        existingProfile.profile_image &&
        existingProfile.profile_image !== cleanData.profile_image
      ) {
        deleteLocalImage(existingProfile.profile_image);
      }
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: cleanData,
      });
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: cleanData,
      });
    }

    // Revalidate the pages that use this data
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      data: profile,
      message: existingProfile
        ? "Profile updated successfully"
        : "Profile created successfully",
    };
  } catch (error) {
    console.error("Error creating/updating profile:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
    }

    return {
      success: false,
      error: "Failed to save profile data",
    };
  }
}

export async function deleteProfile() {
  try {
    const existingProfile = await prisma.profile.findFirst();

    if (!existingProfile) {
      return {
        success: false,
        error: "Profile not found",
      };
    }

    // Delete the profile image if it exists
    if (existingProfile.profile_image) {
      deleteLocalImage(existingProfile.profile_image);
    }

    await prisma.profile.delete({
      where: { id: existingProfile.id },
    });

    // Revalidate the pages that use this data
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Profile deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting profile:", error);
    return {
      success: false,
      error: "Failed to delete profile",
    };
  }
}

export async function uploadProfileImage(formData: FormData) {
  try {
    const file = formData.get("image") as File;

    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Please upload an image file",
      };
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "File size must be less than 5MB",
      };
    }

    // Upload image locally
    const uploadResult = await uploadLocalImage(file);

    if (!uploadResult.success) {
      return {
        success: false,
        error: uploadResult.error || "Failed to upload image",
      };
    }

    return {
      success: true,
      data: { url: uploadResult.url },
      message: "Image uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return {
      success: false,
      error: "Failed to upload image",
    };
  }
}

export async function getProfileForPublic(): Promise<Profile | null> {
  try {
    // Only return public-facing profile data
    const profile = await prisma.profile.findFirst({
      select: {
        id: true,
        name: true,
        about: true,
        profile_image: true,
        location: true,
        headline: true,
        availability: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!profile) return null;
    return {
      ...profile,
      profile_image: profile.profile_image || undefined,
      location: profile.location || undefined,
      headline: profile.headline || undefined,
      availability: (profile.availability as ProfileAvailability) || undefined,
    };
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return null;
  }
}
