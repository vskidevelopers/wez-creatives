import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

/**
 * Protected Admin Layout.
 * Verifies the session server-side and redirects unauthenticated users to the login page.
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <AdminSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader userEmail={session.user.email || "Admin"} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}