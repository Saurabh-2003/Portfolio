"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { SkillFormData, Skill, SkillCategory, SkillsByCategory } from "@/types";
import { z } from "zod";

// Type for Prisma skill return data
interface PrismaSkill {
  id: string;
  name: string;
  category: string;
  proficiency_level: number | null;
  created_at: Date;
  updated_at: Date;
}

// Validation schema for skill data
const skillSchema = z.object({
  name: z
    .string()
    .min(1, "Skill name is required")
    .max(100, "Skill name must be less than 100 characters"),
  category: z.enum(
    [
      "frontend",
      "backend",
      "devops",
      "database",
      "tools",
      "languages",
      "frameworks",
      "other",
    ],
    {
      required_error: "Category is required",
    },
  ),
  proficiency_level: z
    .number()
    .min(1, "Proficiency level must be at least 1")
    .max(5, "Proficiency level must be at most 5")
    .optional(),
});

export async function getSkills(): Promise<Skill[]> {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        {
          category: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    return skills.map((skill: PrismaSkill) => ({
      ...skill,
      category: skill.category as SkillCategory,
      proficiency_level: skill.proficiency_level ?? undefined,
    }));
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw new Error("Failed to fetch skills");
  }
}

export async function getSkill(id: string): Promise<Skill | null> {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id },
    });

    return skill
      ? {
          ...skill,
          proficiency_level: skill.proficiency_level ?? undefined,
        }
      : null;
  } catch (error) {
    console.error("Error fetching skill:", error);
    throw new Error("Failed to fetch skill");
  }
}

export async function createSkill(data: SkillFormData) {
  try {
    // Validate the input data
    const validatedData = skillSchema.parse(data);

    const skill = await prisma.skill.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        proficiency_level: validatedData.proficiency_level || 5,
      },
    });

    // Revalidate the pages that use this data
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/skills");

    return {
      success: true,
      data: skill,
      message: "Skill created successfully",
    };
  } catch (error) {
    console.error("Error creating skill:", error);

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

    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        success: false,
        error: "A skill with this name already exists in this category",
      };
    }

    return {
      success: false,
      error: "Failed to create skill",
    };
  }
}

export async function updateSkill(id: string, data: SkillFormData) {
  try {
    // Validate the input data
    const validatedData = skillSchema.parse(data);

    // Check if skill exists
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      return {
        success: false,
        error: "Skill not found",
      };
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name: validatedData.name,
        category: validatedData.category,
        proficiency_level:
          validatedData.proficiency_level || existingSkill.proficiency_level,
      },
    });

    // Revalidate the pages that use this data
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/skills");

    return {
      success: true,
      data: skill,
      message: "Skill updated successfully",
    };
  } catch (error) {
    console.error("Error updating skill:", error);

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

    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        success: false,
        error: "A skill with this name already exists in this category",
      };
    }

    return {
      success: false,
      error: "Failed to update skill",
    };
  }
}

export async function deleteSkill(id: string) {
  try {
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      return {
        success: false,
        error: "Skill not found",
      };
    }

    await prisma.skill.delete({
      where: { id },
    });

    // Revalidate the pages that use this data
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/skills");

    return {
      success: true,
      message: "Skill deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting skill:", error);
    return {
      success: false,
      error: "Failed to delete skill",
    };
  }
}

export async function getSkillsByCategory(): Promise<SkillsByCategory> {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        {
          proficiency_level: "desc",
        },
        {
          name: "asc",
        },
      ],
    });

    // Group skills by category
    const skillsByCategory: SkillsByCategory = {
      frontend: [],
      backend: [],
      devops: [],
      database: [],
      tools: [],
      languages: [],
      frameworks: [],
      other: [],
    };

    skills.forEach((skill: PrismaSkill) => {
      skillsByCategory[skill.category as SkillCategory].push({
        ...skill,
        category: skill.category as SkillCategory,
        proficiency_level: skill.proficiency_level ?? undefined,
      });
    });

    return skillsByCategory;
  } catch (error) {
    console.error("Error fetching skills by category:", error);
    throw new Error("Failed to fetch skills by category");
  }
}

export async function getSkillsForPublic(): Promise<SkillsByCategory> {
  try {
    return await getSkillsByCategory();
  } catch (error) {
    console.error("Error fetching public skills:", error);
    return {
      frontend: [],
      backend: [],
      devops: [],
      database: [],
      tools: [],
      languages: [],
      frameworks: [],
      other: [],
    };
  }
}

export async function getSkillsBySpecificCategory(
  category: SkillCategory,
): Promise<Skill[]> {
  try {
    const skills = await prisma.skill.findMany({
      where: { category },
      orderBy: [
        {
          proficiency_level: "desc",
        },
        {
          name: "asc",
        },
      ],
    });

    return skills.map((skill: PrismaSkill) => ({
      ...skill,
      category: skill.category as SkillCategory,
      proficiency_level: skill.proficiency_level ?? undefined,
    }));
  } catch (error) {
    console.error("Error fetching skills by specific category:", error);
    throw new Error("Failed to fetch skills by category");
  }
}

export async function duplicateSkill(id: string) {
  try {
    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      return {
        success: false,
        error: "Skill not found",
      };
    }

    const duplicatedSkill = await prisma.skill.create({
      data: {
        name: `${existingSkill.name} (Copy)`,
        category: existingSkill.category,
        proficiency_level: existingSkill.proficiency_level,
      },
    });

    // Revalidate the pages that use this data
    revalidatePath("/dashboard/skills");

    return {
      success: true,
      data: duplicatedSkill,
      message: "Skill duplicated successfully",
    };
  } catch (error) {
    console.error("Error duplicating skill:", error);
    return {
      success: false,
      error: "Failed to duplicate skill",
    };
  }
}

export async function bulkCreateSkills(skillsData: SkillFormData[]) {
  try {
    const validatedSkills = skillsData.map((skill) => skillSchema.parse(skill));

    const createdSkills = await Promise.all(
      validatedSkills.map((skill) =>
        prisma.skill.create({
          data: {
            name: skill.name,
            category: skill.category,
            proficiency_level: skill.proficiency_level || 5,
          },
        }),
      ),
    );

    // Revalidate the pages that use this data
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/skills");

    return {
      success: true,
      data: createdSkills,
      message: `${createdSkills.length} skills created successfully`,
    };
  } catch (error) {
    console.error("Error bulk creating skills:", error);

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
      error: "Failed to create skills",
    };
  }
}

export async function bulkDeleteSkills(skillIds: string[]) {
  try {
    await prisma.skill.deleteMany({
      where: {
        id: {
          in: skillIds,
        },
      },
    });

    // Revalidate the pages that use this data
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/skills");

    return {
      success: true,
      message: `${skillIds.length} skills deleted successfully`,
    };
  } catch (error) {
    console.error("Error bulk deleting skills:", error);
    return {
      success: false,
      error: "Failed to delete skills",
    };
  }
}

export async function updateSkillProficiency(
  id: string,
  proficiency_level: number,
) {
  try {
    if (proficiency_level < 1 || proficiency_level > 5) {
      return {
        success: false,
        error: "Proficiency level must be between 1 and 5",
      };
    }

    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      return {
        success: false,
        error: "Skill not found",
      };
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: { proficiency_level },
    });

    // Revalidate the pages that use this data
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/skills");

    return {
      success: true,
      data: skill,
      message: "Skill proficiency updated successfully",
    };
  } catch (error) {
    console.error("Error updating skill proficiency:", error);
    return {
      success: false,
      error: "Failed to update skill proficiency",
    };
  }
}
