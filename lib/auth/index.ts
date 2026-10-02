import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

/**
 * Better Auth server configuration.
 * Integrates with Neon PostgreSQL via Drizzle ORM.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Note: Public registration UI is intentionally not built in V1.
  // The single admin account is provisioned via the Better Auth CLI.
});
