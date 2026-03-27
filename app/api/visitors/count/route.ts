import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  // Generate a realistic-looking visitor count that varies over time
  // Uses current minute as seed so it changes every minute but stays consistent
  const now = new Date();
  const seed = now.getHours() * 60 + now.getMinutes();
  
  // Pseudo-random but deterministic per minute: range 2–28
  const base = ((seed * 7 + 13) % 27) + 2;
  
  return NextResponse.json({ count: base });
}