import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 md:py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <p className="text-eyebrow animate-fade-in-up">
                        Wez Creatives — Nairobi
                    </p>

                    <h1 className="text-display animate-fade-in-up animate-delay-100">
                        Creative Solutions for <br className="hidden md:block" />
                        <span className="text-muted-foreground">Your Brand.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
                        We deliver professional branding, printing, and branded merchandise solutions.
                        From custom designs to bulk production, we bring your vision to life with precision and style.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in-up animate-delay-300">
                        <Link href="/#what-we-do">
                            <Button size="lg" className="rounded-full px-8 h-12 text-base transition-transform hover:scale-105">
                                Explore Services
                            </Button>
                        </Link>
                        <Link href="/#featured-work">
                            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-2 transition-transform hover:scale-105">
                                View Our Work
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}