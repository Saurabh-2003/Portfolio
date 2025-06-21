"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  ContactFormData,
  ContactInfo,
  ContactMessage,
  ContactMessageFormData,
} from "@/types";
import { z } from "zod";

// Validation schema for contact info
const contactInfoSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  phone: z
    .string()
    .max(20, "Phone number must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("Please enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
});

// Validation schema for contact messages
const contactMessageSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message must be less than 2000 characters"),
});

// Contact Info Management
export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const contactInfo = await prisma.contactInfo.findFirst();
    if (!contactInfo) return null;

    return {
      ...contactInfo,
      phone: contactInfo.phone || undefined,
      linkedin: contactInfo.linkedin || undefined,
      github: contactInfo.github || undefined,
    };
  } catch (error) {
    console.error("Error fetching contact info:", error);
    throw new Error("Failed to fetch contact info");
  }
}

export async function createOrUpdateContactInfo(data: ContactFormData) {
  try {
    // Validate the input data
    const validatedData = contactInfoSchema.parse(data);

    // Clean up empty optional fields
    const cleanData = {
      email: validatedData.email,
      phone: validatedData.phone || null,
      linkedin: validatedData.linkedin || null,
      github: validatedData.github || null,
    };

    // Check if contact info exists
    const existingContactInfo = await prisma.contactInfo.findFirst();

    let contactInfo;
    if (existingContactInfo) {
      // Update existing contact info
      contactInfo = await prisma.contactInfo.update({
        where: { id: existingContactInfo.id },
        data: cleanData,
      });
    } else {
      // Create new contact info
      contactInfo = await prisma.contactInfo.create({
        data: cleanData,
      });
    }

    // Revalidate the pages that use this data
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contact");

    return {
      success: true,
      data: contactInfo,
      message: existingContactInfo
        ? "Contact info updated successfully"
        : "Contact info created successfully",
    };
  } catch (error) {
    console.error("Error creating/updating contact info:", error);

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
      error: "Failed to save contact info",
    };
  }
}

export async function getContactInfoForPublic(): Promise<ContactInfo | null> {
  try {
    const contactInfo = await prisma.contactInfo.findFirst({
      select: {
        id: true,
        email: true,
        phone: true,
        linkedin: true,
        github: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!contactInfo) return null;

    return {
      ...contactInfo,
      phone: contactInfo.phone || undefined,
      linkedin: contactInfo.linkedin || undefined,
      github: contactInfo.github || undefined,
    };
  } catch (error) {
    console.error("Error fetching public contact info:", error);
    return null;
  }
}

// Contact Messages Management
export async function createContactMessage(data: ContactMessageFormData) {
  try {
    // Validate the input data
    const validatedData = contactMessageSchema.parse(data);

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        is_read: false,
      },
    });

    // Revalidate the dashboard pages that show messages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contact");
    revalidatePath("/dashboard/messages");

    return {
      success: true,
      data: contactMessage,
      message: "Message sent successfully! Thank you for reaching out.",
    };
  } catch (error) {
    console.error("Error creating contact message:", error);

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
      error: "Failed to send message. Please try again.",
    };
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return messages;
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    throw new Error("Failed to fetch contact messages");
  }
}

export async function getContactMessage(
  id: string,
): Promise<ContactMessage | null> {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    return message;
  } catch (error) {
    console.error("Error fetching contact message:", error);
    throw new Error("Failed to fetch contact message");
  }
}

export async function markMessageAsRead(id: string) {
  try {
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return {
        success: false,
        error: "Message not found",
      };
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { is_read: true },
    });

    // Revalidate the dashboard pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contact");
    revalidatePath("/dashboard/messages");

    return {
      success: true,
      data: message,
      message: "Message marked as read",
    };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return {
      success: false,
      error: "Failed to mark message as read",
    };
  }
}

export async function markMessageAsUnread(id: string) {
  try {
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return {
        success: false,
        error: "Message not found",
      };
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { is_read: false },
    });

    // Revalidate the dashboard pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contact");
    revalidatePath("/dashboard/messages");

    return {
      success: true,
      data: message,
      message: "Message marked as unread",
    };
  } catch (error) {
    console.error("Error marking message as unread:", error);
    return {
      success: false,
      error: "Failed to mark message as unread",
    };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return {
        success: false,
        error: "Message not found",
      };
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    // Revalidate the dashboard pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contact");
    revalidatePath("/dashboard/messages");

    return {
      success: true,
      message: "Message deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return {
      success: false,
      error: "Failed to delete message",
    };
  }
}

export async function getUnreadMessagesCount(): Promise<number> {
  try {
    const count = await prisma.contactMessage.count({
      where: { is_read: false },
    });

    return count;
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    return 0;
  }
}

export async function bulkMarkMessagesAsRead(messageIds: string[]) {
  try {
    await prisma.contactMessage.updateMany({
      where: {
        id: {
          in: messageIds,
        },
      },
      data: { is_read: true },
    });

    // Revalidate the dashboard pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contact");
    revalidatePath("/dashboard/messages");

    return {
      success: true,
      message: `${messageIds.length} messages marked as read`,
    };
  } catch (error) {
    console.error("Error bulk marking messages as read:", error);
    return {
      success: false,
      error: "Failed to mark messages as read",
    };
  }
}

export async function bulkDeleteMessages(messageIds: string[]) {
  try {
    await prisma.contactMessage.deleteMany({
      where: {
        id: {
          in: messageIds,
        },
      },
    });

    // Revalidate the dashboard pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/contact");
    revalidatePath("/dashboard/messages");

    return {
      success: true,
      message: `${messageIds.length} messages deleted successfully`,
    };
  } catch (error) {
    console.error("Error bulk deleting messages:", error);
    return {
      success: false,
      error: "Failed to delete messages",
    };
  }
}

export async function getRecentMessages(
  limit: number = 5,
): Promise<ContactMessage[]> {
  try {
    const messages = await prisma.contactMessage.findMany({
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return messages;
  } catch (error) {
    console.error("Error fetching recent messages:", error);
    return [];
  }
}
