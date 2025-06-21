import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const goals = await prisma.goal.findMany({ orderBy: { created_at: "desc" } });
  return NextResponse.json(goals);
}

export async function POST(req: Request) {
  const { title, description } = await req.json();
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  const goal = await prisma.goal.create({ data: { title, description } });
  return NextResponse.json(goal);
}
