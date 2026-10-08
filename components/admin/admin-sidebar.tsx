"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    Briefcase,
    Image as ImageIcon,
    ShoppingCart,
    FolderTree
} from "lucide-react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/services", label: "Services", icon: Briefcase },
    { href: "/admin/portfolio", label: "Portfolio", icon: ImageIcon },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex flex-col w-64 border-r bg-card h-full">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold tracking-tight">Wez Admin</h2>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}