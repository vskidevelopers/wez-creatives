import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

console.log("🔐 Auth API route loaded");
console.log("📍 BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
console.log("🔑 BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);
console.log("🗄️ DATABASE_URL exists:", !!process.env.DATABASE_URL);

export const { POST, GET } = toNextJsHandler(auth);
