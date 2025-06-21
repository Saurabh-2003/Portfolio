import { NextResponse } from "next/server";
import { getContactMessages } from "@/lib/actions/contact";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const allMessages = await getContactMessages();
  const total = allMessages.length;
  const totalPages = Math.ceil(total / pageSize);
  const messages = allMessages.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({
    messages,
    total,
    totalPages,
    page,
    pageSize,
  });
}
