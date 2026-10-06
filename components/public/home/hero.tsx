import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />

            <div className="container mx-auto px-4 md:px-6 relative">
                <div className="max-w-3xl space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Creative Solutions for Your Brand
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        Wez Creatives delivers professional branding, printing, and branded merchandise solutions.
                        From custom designs to bulk production, we bring your vision to life.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/#what-we-do">
                            <Button size="lg">Explore Services</Button>
                        </Link>
                        <Link href="/#featured-work">
                            <Button size="lg" variant="outline">View Our Work</Button>
                        </Link>
                        <Link href="/#shop-preview">
                            <Button size="lg" variant="outline">Shop</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}