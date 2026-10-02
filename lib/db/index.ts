import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
      "Please create a .env.local file with your Neon PostgreSQL connection string.",
  );
}

// In Next.js development, we use a global variable to prevent
// creating a new database connection on every hot reload.
const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof neon> | undefined;
};

const sql = globalForDb.sql ?? neon(connectionString);

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

export const db: ReturnType<typeof drizzle> = drizzle({ client: sql, schema });
