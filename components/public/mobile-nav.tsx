"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <div className="md:hidden">
            <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg">
                    <nav className="container mx-auto flex flex-col space-y-4 p-4">
                        <Link href="/" onClick={closeMenu} className="text-sm font-medium py-2">
                            Home
                        </Link>
                        <Link href="/services" onClick={closeMenu} className="text-sm font-medium py-2">
                            Services
                        </Link>
                        <Link href="/work" onClick={closeMenu} className="text-sm font-medium py-2">
                            Work
                        </Link>
                        <Link href="/shop" onClick={closeMenu} className="text-sm font-medium py-2">
                            Shop
                        </Link>
                        <Link href="/about" onClick={closeMenu} className="text-sm font-medium py-2">
                            About
                        </Link>
                        <Link href="/contact" onClick={closeMenu} className="text-sm font-medium py-2">
                            Contact
                        </Link>
                        <div className="border-t pt-4 space-y-2">
                            <Link href="/track-order" onClick={closeMenu}>
                                <Button variant="outline" size="sm" className="w-full">
                                    Track Order
                                </Button>
                            </Link>
                            <Link href="/custom-request" onClick={closeMenu}>
                                <Button size="sm" className="w-full">
                                    Request a Quote
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
}