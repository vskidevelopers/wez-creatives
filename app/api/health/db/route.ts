import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

/**
 * Development/Verification endpoint to test database connectivity.
 * This route should not be used in production or exposed publicly.
 */
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { status: "error", message: "DATABASE_URL is not configured." },
      { status: 500 },
    );
  }

  try {
    // Execute a minimal query to verify the connection
    const result = await db.execute(sql`SELECT 1 as ok`);
    return NextResponse.json({
      status: "success",
      message: "Database connection successful.",
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
