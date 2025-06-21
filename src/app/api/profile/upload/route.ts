import { NextResponse } from "next/server";
import { uploadProfileImage } from "@/lib/actions/profile";

export async function POST(req: Request) {
  const formData = await req.formData();
  const result = await uploadProfileImage(formData);
  if (result.success) {
    return NextResponse.json(result);
  }
  return NextResponse.json(result, { status: 400 });
}
