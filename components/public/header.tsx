"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { CartIcon } from "./cart-icon";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Services", href: "/#what-we-do" },
        { label: "Work", href: "/work" },
        { label: "Shop", href: "/shop" },
    ];

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${isScrolled
                    ? "bg-background/80 backdrop-blur-md shadow-sm"
                    : "bg-background/50 backdrop-blur-sm border-transparent"
                }`}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center space-x-2 group">
                    <span className="text-xl font-bold tracking-tight transition-transform duration-300 group-hover:scale-105">
                        {siteConfig.name}
                    </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="relative transition-colors hover:text-foreground group py-2"
                        >
                            {item.label}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center space-x-4">
                    <CartIcon />
                    <Link href="/track-order">
                        <Button variant="ghost" size="sm" className="rounded-full">
                            Track Order
                        </Button>
                    </Link>
                    <Link href="/custom-request">
                        <Button size="sm" className="rounded-full">
                            Request a Quote
                        </Button>
                    </Link>
                </div>

                <MobileNav />
            </div>
        </header>
    );
}