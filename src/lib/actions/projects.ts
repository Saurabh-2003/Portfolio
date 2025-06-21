"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ProjectFormData, Project, ProjectStatus } from "@/types";
import { z } from "zod";
import {
  uploadProjectImage as uploadProjectImageFile,
  deleteLocalImage,
} from "@/lib/fileUpload";

// Validation schema for project data
const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  status: z.enum(["completed", "ongoing", "draft"], {
    required_error: "Status is required",
  }),
  tech_stack: z.array(z.string()).min(1, "At least one technology is required"),
  github_link: z.string().url("Please enter a valid GitHub URL"),
  deployed_link: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  image: z.string().optional(),
  image_path: z.string().optional(),
  video: z.string().optional(),
  duration: z.string().optional(),
  role: z.string().optional(),
  team_size: z.number().optional(),
  features: z.string().optional(),
  learnings: z.string().optional(),
  challenges: z.string().optional(),
});

// Define a type for the raw project from the database
interface RawProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  tech_stack: string; // stored as JSON string in DB
  github_link: string;
  deployed_link: string | null;
  image: string | null;
  image_path: string | null;
  video: string | null;
  duration: string | null;
  role: string | null;
  team_size: number | null;
  features: string | null;
  learnings: string | null;
  challenges: string | null;
  created_at: Date;
  updated_at: Date;
}

// Helper to map RawProject to Project
function mapRawProjectToProject(raw: RawProject): Project {
  return {
    ...raw,
    tech_stack: raw.tech_stack ? JSON.parse(raw.tech_stack) : [],
    deployed_link: raw.deployed_link || undefined,
    image: raw.image || undefined,
    image_path: raw.image_path || undefined,
    video: raw.video || undefined,
    duration: raw.duration || undefined,
    role: raw.role || undefined,
    team_size: raw.team_size || undefined,
    features: raw.features || undefined,
    learnings: raw.learnings || undefined,
    challenges: raw.challenges || undefined,
  };
}

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return projects.map((project) =>
      mapRawProjectToProject(project as RawProject),
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) return null;
    return mapRawProjectToProject(project as RawProject);
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error("Failed to fetch project");
  }
}

export async function createProject(data: ProjectFormData) {
  try {
    // Validate the input data
    const validatedData = projectSchema.parse(data);

    // Convert tech_stack array to string for SQLite storage
    const projectData = {
      title: validatedData.title,
      description: validatedData.description,
      status: validatedData.status,
      tech_stack: JSON.stringify(validatedData.tech_stack),
      github_link: validatedData.github_link,
      deployed_link: validatedData.deployed_link || null,
      image: validatedData.image || null,
      image_path: validatedData.image_path || null,
      video: validatedData.video || null,
      duration: validatedData.duration || null,
      role: validatedData.role || null,
      team_size: validatedData.team_size || null,
      features: validatedData.features || null,
      learnings: validatedData.learnings || null,
      challenges: validatedData.challenges || null,
    };

    const project = await prisma.project.create({
      data: projectData,
    });
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return {
      success: true,
      data: mapRawProjectToProject(project as RawProject),
      message: "Project created successfully",
    };
  } catch (error) {
    console.error("Error creating project:", error);

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
      error: "Failed to create project",
    };
  }
}

export async function updateProject(id: string, data: ProjectFormData) {
  try {
    // Validate the input data
    const validatedData = projectSchema.parse(data);

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    // Convert tech_stack array to string for SQLite storage
    const projectData = {
      title: validatedData.title,
      description: validatedData.description,
      status: validatedData.status,
      tech_stack: JSON.stringify(validatedData.tech_stack),
      github_link: validatedData.github_link,
      deployed_link: validatedData.deployed_link || null,
      image: validatedData.image || null,
      image_path: validatedData.image_path || null,
      video: validatedData.video || null,
      duration: validatedData.duration || null,
      role: validatedData.role || null,
      team_size: validatedData.team_size || null,
      features: validatedData.features || null,
      learnings: validatedData.learnings || null,
      challenges: validatedData.challenges || null,
    };

    const project = await prisma.project.update({
      where: { id },
      data: projectData,
    });
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return {
      success: true,
      data: mapRawProjectToProject(project as RawProject),
      message: "Project updated successfully",
    };
  } catch (error) {
    console.error("Error updating project:", error);

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
      error: "Failed to update project",
    };
  }
}

export async function deleteProject(id: string) {
  try {
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    // Delete associated image if it exists
    if (typeof existingProject.image === "string" && existingProject.image) {
      deleteLocalImage(existingProject.image);
    }

    await prisma.project.delete({
      where: { id },
    });

    // Revalidate the pages that use this data
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");

    return {
      success: true,
      message: "Project deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      error: "Failed to delete project",
    };
  }
}

export async function getProjectsForPublic(): Promise<Project[]> {
  try {
    // Only return published projects (completed and ongoing)
    const projects = await prisma.project.findMany({
      where: {
        status: {
          in: ["completed", "ongoing"],
        },
      },
      orderBy: [
        {
          status: "asc", // completed first, then ongoing
        },
        {
          created_at: "desc",
        },
      ],
    });

    // Parse tech_stack string back to array
    return projects.map((project) =>
      mapRawProjectToProject(project as RawProject),
    );
  } catch (error) {
    console.error("Error fetching public projects:", error);
    return [];
  }
}

export async function getProjectsByStatus(
  status: ProjectStatus,
): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { status },
      orderBy: {
        created_at: "desc",
      },
    });

    // Parse tech_stack string back to array
    return projects.map((project) =>
      mapRawProjectToProject(project as RawProject),
    );
  } catch (error) {
    console.error("Error fetching projects by status:", error);
    throw new Error("Failed to fetch projects by status");
  }
}

export async function duplicateProject(id: string) {
  try {
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    const duplicatedProject = await prisma.project.create({
      data: {
        title: `${existingProject.title} (Copy)`,
        description: existingProject.description,
        status: "draft",
        tech_stack: existingProject.tech_stack,
        github_link: existingProject.github_link,
        deployed_link: existingProject.deployed_link,
        image: existingProject.image,
        image_path: existingProject.image_path,
        video: existingProject.video,
        duration: existingProject.duration,
        role: existingProject.role,
        team_size: existingProject.team_size,
        features: existingProject.features,
        learnings: existingProject.learnings,
        challenges: existingProject.challenges,
      },
    });
    return {
      success: true,
      data: mapRawProjectToProject(duplicatedProject as RawProject),
      message: "Project duplicated successfully",
    };
  } catch (error) {
    console.error("Error duplicating project:", error);
    return {
      success: false,
      error: "Failed to duplicate project",
    };
  }
}

export async function uploadProjectImage(formData: FormData) {
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
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: "File size must be less than 5MB",
      };
    }

    // Upload image locally
    const uploadResult = await uploadProjectImageFile(file);

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
    console.error("Error uploading project image:", error);
    return {
      success: false,
      error: "Failed to upload image",
    };
  }
}
