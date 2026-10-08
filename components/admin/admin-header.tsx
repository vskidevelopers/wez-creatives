"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./admin-sidebar";
import { LogoutButton } from "@/app/(admin)/admin/logout-button";



export function AdminHeader({ userEmail }: { userEmail: string }) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            {/* Mobile Menu Trigger */}
            <Sheet>
                <SheetTrigger>
                    <Button variant="outline" size="icon" className="md:hidden" type="button">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <AdminSidebar />
                </SheetContent>
            </Sheet>

            <div className="flex-1" />

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-medium">{userEmail}</span>
                    <span className="text-xs text-muted-foreground">Administrator</span>
                </div>
                <LogoutButton />
            </div>
        </header>
    );
}