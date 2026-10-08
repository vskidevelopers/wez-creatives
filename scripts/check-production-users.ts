import { config } from "dotenv";
config({ path: ".env.local" });

async function checkUsers() {
  const { db } = await import("../lib/db");
  const { user } = await import("../lib/db/schema/auth");

  console.log("🔍 Checking users in database...\n");
  console.log(
    "🗄️ DATABASE_URL:",
    process.env.DATABASE_URL?.substring(0, 50) + "...",
  );

  try {
    const users = await db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      })
      .from(user);

    console.log(`\n✅ Found ${users.length} user(s):\n`);
    users.forEach((u, i) => {
      console.log(`${i + 1}. ${u.email} (${u.name || "No name"})`);
      console.log(`   ID: ${u.id}`);
      console.log(`   Created: ${u.createdAt}\n`);
    });

    if (users.length === 0) {
      console.log("⚠️  NO USERS FOUND! You need to create an admin account.");
    }
  } catch (error) {
    console.error("❌ Database error:", error);
  }
}

checkUsers();
