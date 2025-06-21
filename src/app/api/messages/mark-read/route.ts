import { NextResponse } from "next/server";
import { markMessageAsRead, markMessageAsUnread } from "@/lib/actions/contact";

export async function POST(req: Request) {
  const { id, action } = await req.json();
  if (!id || !action) {
    return NextResponse.json({ success: false, error: "Missing id or action" }, { status: 400 });
  }
  if (action === "read") {
    await markMessageAsRead(String(id));
    return NextResponse.json({ success: true });
  }
  if (action === "unread") {
    await markMessageAsUnread(String(id));
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
}
