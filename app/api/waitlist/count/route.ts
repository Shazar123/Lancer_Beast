import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const revalidate = 0;

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT COUNT(*) as count FROM waitlist`;
    const count = parseInt(result[0].count, 10);
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Count GET error:", err);
    return NextResponse.json({ count: 0 });
  }
}
