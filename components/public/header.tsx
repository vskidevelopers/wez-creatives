import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { CartIcon } from "./cart-icon";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo / Brand */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold tracking-tight">
                        {siteConfig.name}
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-foreground/80">
                        Home
                    </Link>
                    <Link href="/#what-we-do" className="transition-colors hover:text-foreground/80">
                        Services
                    </Link>
                    <Link href="/#featured-work" className="transition-colors hover:text-foreground/80">
                        Work
                    </Link>
                    <Link href="/#shop-preview" className="transition-colors hover:text-foreground/80">
                        Shop
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-foreground/80">
                        About
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-foreground/80">
                        Contact
                    </Link>
                </nav>
                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <CartIcon />
                    <Link href="/track-order">
                        <Button variant="ghost" size="sm">
                            Track Order
                        </Button>
                    </Link>
                    <Link href="/custom-request">
                        <Button size="sm">
                            Request a Quote
                        </Button>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <MobileNav />
            </div>
        </header>
    );
}