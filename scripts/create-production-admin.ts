import { config } from "dotenv";
config({ path: ".env.local" });

import { auth } from "../lib/auth";

async function createAdmin() {
  try {
    const user = await auth.api.signUpEmail({
      body: {
        email: "admin@wezcreatives.co.ke",
        password: "WezCreativesAdmin@123!",
        name: "Wez Admin",
      },
    });
    console.log("✅ Admin created successfully:", user);
  } catch (error) {
    console.error("❌ Failed to create admin:", error);
  }
}

createAdmin();
