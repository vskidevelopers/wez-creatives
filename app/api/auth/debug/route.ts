import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema/auth";

export async function GET() {
  const diagnostics = {
    environment: {
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "MISSING",
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "SET" : "MISSING",
      DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
      NODE_ENV: process.env.NODE_ENV,
    },
    database: {
      status: "unknown",
      userCount: 0,
      error: null as string | null,
    },
    authConfig: {
      loaded: false,
      error: null as string | null,
    },
  };

  // Test database connection
  try {
    const users = await db.select().from(user);
    diagnostics.database.status = "connected";
    diagnostics.database.userCount = users.length;
  } catch (error) {
    diagnostics.database.status = "error";
    diagnostics.database.error =
      error instanceof Error ? error.message : "Unknown error";
  }

  // Test auth config
  try {
    const { auth } = await import("@/lib/auth");
    diagnostics.authConfig.loaded = true;
  } catch (error) {
    diagnostics.authConfig.error =
      error instanceof Error ? error.message : "Unknown error";
  }

  return NextResponse.json(diagnostics);
}
