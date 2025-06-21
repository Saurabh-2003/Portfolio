'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { ExperienceFormData, Experience } from '@/types';
import { z } from 'zod';

// Validation schema for experience data
const experienceSchema = z.object({
  company_name: z.string().min(1, 'Company name is required').max(200, 'Company name must be less than 200 characters'),
  role: z.string().min(1, 'Role is required').max(200, 'Role must be less than 200 characters'),
  duration: z.string().min(1, 'Duration is required').max(100, 'Duration must be less than 100 characters'),
  role_description: z.string().min(1, 'Role description is required').max(3000, 'Role description must be less than 3000 characters'),
  achievements: z.array(z.string().min(1, 'Achievement cannot be empty')).min(1, 'At least one achievement is required'),
  challenges_faced: z.string().min(1, 'Challenges faced is required').max(2000, 'Challenges faced must be less than 2000 characters'),
  learnings: z.string().min(1, 'Learnings is required').max(2000, 'Learnings must be less than 2000 characters'),
});

export async function getExperiences(): Promise<Experience[]> {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    // Parse achievements string back to array
    return experiences.map(experience => ({
      ...experience,
      achievements: experience.achievements ? JSON.parse(experience.achievements) : [],
    }));
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw new Error('Failed to fetch experiences');
  }
}

export async function getExperience(id: string): Promise<Experience | null> {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) return null;

    // Parse achievements string back to array
    return {
      ...experience,
      achievements: experience.achievements ? JSON.parse(experience.achievements) : [],
    };
  } catch (error) {
    console.error('Error fetching experience:', error);
    throw new Error('Failed to fetch experience');
  }
}

export async function createExperience(data: ExperienceFormData) {
  try {
    // Validate the input data
    const validatedData = experienceSchema.parse(data);

    // Convert achievements array to string for SQLite storage
    const experienceData = {
      company_name: validatedData.company_name,
      role: validatedData.role,
      duration: validatedData.duration,
      role_description: validatedData.role_description,
      achievements: JSON.stringify(validatedData.achievements),
      challenges_faced: validatedData.challenges_faced,
      learnings: validatedData.learnings,
    };

    const experience = await prisma.experience.create({
      data: experienceData,
    });

    // Revalidate the pages that use this data
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/experience');

    return {
      success: true,
      data: {
        ...experience,
        achievements: JSON.parse(experience.achievements),
      },
      message: 'Experience created successfully',
    };
  } catch (error) {
    console.error('Error creating experience:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    return {
      success: false,
      error: 'Failed to create experience',
    };
  }
}

export async function updateExperience(id: string, data: ExperienceFormData) {
  try {
    // Validate the input data
    const validatedData = experienceSchema.parse(data);

    // Check if experience exists
    const existingExperience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!existingExperience) {
      return {
        success: false,
        error: 'Experience not found',
      };
    }

    // Convert achievements array to string for SQLite storage
    const experienceData = {
      company_name: validatedData.company_name,
      role: validatedData.role,
      duration: validatedData.duration,
      role_description: validatedData.role_description,
      achievements: JSON.stringify(validatedData.achievements),
      challenges_faced: validatedData.challenges_faced,
      learnings: validatedData.learnings,
    };

    const experience = await prisma.experience.update({
      where: { id },
      data: experienceData,
    });

    // Revalidate the pages that use this data
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/experience');

    return {
      success: true,
      data: {
        ...experience,
        achievements: JSON.parse(experience.achievements),
      },
      message: 'Experience updated successfully',
    };
  } catch (error) {
    console.error('Error updating experience:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    return {
      success: false,
      error: 'Failed to update experience',
    };
  }
}

export async function deleteExperience(id: string) {
  try {
    const existingExperience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!existingExperience) {
      return {
        success: false,
        error: 'Experience not found',
      };
    }

    await prisma.experience.delete({
      where: { id },
    });

    // Revalidate the pages that use this data
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/experience');

    return {
      success: true,
      message: 'Experience deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting experience:', error);
    return {
      success: false,
      error: 'Failed to delete experience',
    };
  }
}

export async function getExperiencesForPublic(): Promise<Experience[]> {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    // Parse achievements string back to array
    return experiences.map(experience => ({
      ...experience,
      achievements: experience.achievements ? JSON.parse(experience.achievements) : [],
    }));
  } catch (error) {
    console.error('Error fetching public experiences:', error);
    return [];
  }
}

export async function duplicateExperience(id: string) {
  try {
    const existingExperience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!existingExperience) {
      return {
        success: false,
        error: 'Experience not found',
      };
    }

    const duplicatedExperience = await prisma.experience.create({
      data: {
        company_name: `${existingExperience.company_name} (Copy)`,
        role: existingExperience.role,
        duration: existingExperience.duration,
        role_description: existingExperience.role_description,
        achievements: existingExperience.achievements,
        challenges_faced: existingExperience.challenges_faced,
        learnings: existingExperience.learnings,
      },
    });

    // Revalidate the pages that use this data
    revalidatePath('/dashboard/experience');

    return {
      success: true,
      data: {
        ...duplicatedExperience,
        achievements: JSON.parse(duplicatedExperience.achievements),
      },
      message: 'Experience duplicated successfully',
    };
  } catch (error) {
    console.error('Error duplicating experience:', error);
    return {
      success: false,
      error: 'Failed to duplicate experience',
    };
  }
}

export async function reorderExperiences(experienceIds: string[]) {
  try {
    // This is a simple approach - in a more complex app you might want to add an order field
    // For now, we'll just update the updated_at timestamps to reflect the new order

    for (let i = 0; i < experienceIds.length; i++) {
      await prisma.experience.update({
        where: { id: experienceIds[i] },
        data: {
          updated_at: new Date(Date.now() + i * 1000) // Ensure unique timestamps
        },
      });
    }

    // Revalidate the pages that use this data
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/experience');

    return {
      success: true,
      message: 'Experience order updated successfully',
    };
  } catch (error) {
    console.error('Error reordering experiences:', error);
    return {
      success: false,
      error: 'Failed to reorder experiences',
    };
  }
}
