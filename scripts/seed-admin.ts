import { config } from "dotenv";

// 1. Load environment variables FIRST
config({ path: ".env.local" });

async function seedAdmin() {
  try {
    console.log("🔄 Creating admin user...");

    // 2. Dynamically import auth AFTER dotenv has loaded the variables
    const { auth } = await import("../lib/auth");

    // 3. Register the account through Better Auth's email sign-up endpoint
    const newUser = await auth.api.signUpEmail({
      body: {
        name: "Wez Admin",
        email: "admin@wezcreatives.co.ke",
        password: "WezCreativesAdmin@123!",
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", newUser.user.email);
    console.log("🆔 ID:", newUser.user.id);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
}

seedAdmin();
