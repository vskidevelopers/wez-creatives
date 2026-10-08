import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { WhatsAppButton } from "./whatsapp-button";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">{siteConfig.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            Creative agency specializing in branding, printing, and branded merchandise.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Explore</h4>
                        <nav className="flex flex-col space-y-2 text-sm">
                            <Link href="/#what-we-do" className="text-muted-foreground hover:text-foreground transition-colors">
                                Services
                            </Link>
                            <Link href="/#featured-work" className="text-muted-foreground hover:text-foreground transition-colors">
                                Work
                            </Link>
                            <Link href="/#shop-preview" className="text-muted-foreground hover:text-foreground transition-colors">
                                Shop
                            </Link>
                            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                About
                            </Link>
                        </nav>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Actions</h4>
                        <nav className="flex flex-col space-y-2 text-sm">
                            <Link href="/#custom-work" className="text-muted-foreground hover:text-foreground transition-colors">
                                Request a Quote
                            </Link>
                            <Link href="/track-order" className="text-muted-foreground hover:text-foreground transition-colors">
                                Track Order
                            </Link>
                            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                                Contact
                            </Link>
                            <Link href="/work" className="text-muted-foreground hover:text-foreground transition-colors">
                                Work
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Direction */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Get in Touch</h4>
                        <p className="text-sm text-muted-foreground">
                            Ready to start your project? Contact us to discuss your creative needs.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Link href="/contact" className="text-sm text-foreground hover:underline">
                                Contact Us →
                            </Link>
                            <WhatsAppButton
                                phone={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}
                                message="Hi Wez Creatives, I'd like to make an inquiry about your services."
                                label="Chat on WhatsApp"
                                variant="outline"
                                size="sm"
                                className="w-fit"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} {siteConfig.name}. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm text-muted-foreground">
                            <Link href="/about" className="hover:text-foreground transition-colors">
                                About
                            </Link>
                            <Link href="/contact" className="hover:text-foreground transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}