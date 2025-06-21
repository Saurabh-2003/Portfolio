import { NextResponse } from "next/server";
import { uploadProjectImage } from "@/lib/actions/projects";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const result = await uploadProjectImage(formData);

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    console.error("Error in project image upload API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload image"
      },
      { status: 500 }
    );
  }
}
