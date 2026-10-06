import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
    return (
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <div className="max-w-2xl mx-auto space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Project?</h2>
                    <p className="text-lg opacity-90">
                        Let&apos;s bring your creative vision to life. Explore our services, view our work, or get in touch to discuss your needs.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/#what-we-do">
                            <Button size="lg" variant="secondary">
                                Explore Services
                            </Button>
                        </Link>
                        <Link href="/#featured-work">
                            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                View Our Work
                            </Button>
                        </Link>
                        <Link href="/#custom-work">
                            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                Request a Quote
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}