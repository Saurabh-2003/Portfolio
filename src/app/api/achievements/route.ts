import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const achievements = await prisma.achievement.findMany({ orderBy: { created_at: "desc" } });
  return NextResponse.json(achievements);
}

export async function POST(req: Request) {
  const { title, description } = await req.json();
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  const achievement = await prisma.achievement.create({ data: { title, description } });
  return NextResponse.json(achievement);
}
