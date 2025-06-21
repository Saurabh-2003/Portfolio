import fs from "fs";
import path from "path";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadLocalImage(
  file: File,
  prefix: string = "profile",
): Promise<UploadResult> {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${prefix}-${timestamp}.${extension}`;

    // Define the upload directory and full file path
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write the file
    fs.writeFileSync(filePath, buffer);

    // Return the public URL
    return {
      success: true,
      url: `/uploads/${filename}`,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: "Failed to upload image",
    };
  }
}

export async function uploadProjectImage(file: File): Promise<UploadResult> {
  return uploadLocalImage(file, "project");
}

export function deleteLocalImage(imageUrl: string): boolean {
  try {
    // Extract filename from URL
    const filename = imageUrl.split("/").pop();
    if (!filename) return false;

    // Get full file path
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return false;
    }

    // Delete the file
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}
