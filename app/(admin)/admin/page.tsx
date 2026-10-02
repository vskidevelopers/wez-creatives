import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LogoutButton } from "./logout-button";

/**
 * Minimal Admin Dashboard Placeholder.
 * Proves that route protection and session handling are working correctly.
 */
export default async function AdminDashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <LogoutButton />
            </div>
            <p className="text-muted-foreground">
                Welcome, {session?.user.email}. The admin authentication foundation is successfully established.
            </p>
        </div>
    );
}