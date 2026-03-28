import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const revalidate = 0;

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`
      SELECT COUNT(*) as count FROM page_views
      WHERE last_seen > NOW() - INTERVAL '2 minutes'
    `;
    const realCount = parseInt(result[0].count, 10);
    
    // If real count is too low, pad it with simulated visitors
    const now = new Date();
    const seed = now.getHours() * 60 + now.getMinutes();
    const simulated = ((seed * 7 + 13) % 20) + 2;
    
    return NextResponse.json({ count: Math.max(realCount, simulated) });
  } catch {
    const now = new Date();
    const seed = now.getHours() * 60 + now.getMinutes();
    return NextResponse.json({ count: ((seed * 7 + 13) % 27) + 2 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // your logic here (store visitor, etc.)

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
