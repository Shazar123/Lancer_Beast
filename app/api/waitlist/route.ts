import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendWaitlistConfirmation } from "@/lib/email";

const MAX_SPOTS = 50;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Get current count
    const countResult = await sql`SELECT COUNT(*) as count FROM waitlist`;
    const currentCount = parseInt(countResult[0].count, 10);

    if (currentCount >= MAX_SPOTS) {
      return NextResponse.json({ status: "full" }, { status: 200 });
    }

    // Check for duplicate
    const existing = await sql`SELECT id FROM waitlist WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    // Insert
    await sql`
      INSERT INTO waitlist (email, confirmed, created_at)
      VALUES (${email}, true, NOW())
    `;

    const spotNumber = currentCount + 1;

    // Send confirmation email (non-blocking on error)
    try {
      await sendWaitlistConfirmation(email, spotNumber);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Still return success — user is on the list
    }

    return NextResponse.json({ status: "success", spot: spotNumber });
  } catch (err: unknown) {
    console.error("Waitlist POST error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
