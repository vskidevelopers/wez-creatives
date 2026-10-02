import { config } from "dotenv";
// Load your local environment variables FIRST
config({ path: ".env.local" });

async function checkAndFixAdmin() {
  console.log("🔍 Checking database for admin user...\n");

  const { db } = await import("../lib/db");
  const schema = await import("../lib/db/schema/auth");
  const { eq } = await import("drizzle-orm");

  // 1. Check if the user exists
  const allUsers = await db.select().from(schema.user);
  console.log(`Total users in database: ${allUsers.length}`);

  const adminUser = allUsers.find(
    (u) => u.email === "admin@wezcreatives.co.ke",
  );

  if (!adminUser) {
    console.log("\n❌ ADMIN USER NOT FOUND.");
    console.log("💡 Creating new admin user now...");
  } else {
    console.log(`✅ User found: ${adminUser.email} (ID: ${adminUser.id})`);

    // 2. Check if the account (password) record exists
    const adminAccount = await db
      .select()
      .from(schema.account)
      .where(eq(schema.account.userId, adminUser.id));

    if (adminAccount.length === 0) {
      console.log("\n❌ ACCOUNT/PASSWORD RECORD MISSING.");
      console.log(
        "💡 The user exists, but the password wasn't saved. Login will fail.",
      );
      console.log("🗑️ Deleting broken user record...");

      await db.delete(schema.user).where(eq(schema.user.id, adminUser.id));
      console.log("✅ Broken user deleted.");
    } else {
      console.log(`✅ Account record found. Password is securely stored.`);
      console.log(`   Provider: ${adminAccount[0].providerId}`);
      console.log("\n🎉 DATABASE LOOKS GOOD.");
      console.log(
        "⚠️ If login STILL fails, ensure you are typing the password EXACTLY as: WezCreativesAdmin@123!",
      );
      return;
    }
  }

  // 3. Re-seed the admin user if it was missing or broken
  console.log("🔄 Re-seeding admin user with secure password hash...");
  try {
    const { auth } = await import("../lib/auth");
    const newUser = await auth.api.signUpEmail({
      body: {
        name: "Wez Admin",
        email: "admin@wezcreatives.co.ke",
        password: "WezCreativesAdmin@123!",
      },
    });
    console.log("✅ Admin user created successfully!");
    console.log(`📧 Email: ${newUser.user.email}`);
    console.log("🎉 You can now log in at http://localhost:3000/login");
  } catch (error) {
    console.error("❌ Error re-seeding admin user:", error);
  }
}

checkAndFixAdmin().catch(console.error);
