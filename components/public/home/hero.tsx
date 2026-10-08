import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
            {/* Subtle grid background for depth */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="container mx-auto px-4 md:px-6 lg:px-12 relative z-10 py-20">
                <div className="max-w-7xl mx-auto">

                    {/* Top metadata row */}
                    <div className="flex items-center justify-between mb-12 md:mb-20">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                Available for projects
                            </span>
                        </div>
                        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground hidden md:block">
                            Est. 2024 — Nairobi, KE
                        </span>
                    </div>

                    {/* Main headline - massive and bold */}
                    <div className="space-y-4 md:space-y-6 mb-12 md:mb-16">
                        <h1 className="text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] tracking-tight">
                            <span className="block">We craft</span>
                            <span className="block text-muted-foreground">brands that</span>
                            <span className="block">stand out.</span>
                        </h1>
                    </div>

                    {/* Subtext and CTAs in asymmetric layout */}
                    <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">

                        {/* Description - takes up less space */}
                        <div className="md:col-span-5 md:col-start-1">
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                                Professional branding, printing, and merchandise solutions.
                                From concept to bulk production, we bring your vision to life.
                            </p>
                        </div>

                        {/* CTAs - positioned to the right */}
                        <div className="md:col-span-6 md:col-start-7 flex flex-col sm:flex-row gap-4 md:justify-end">
                            <Link href="/#what-we-do">
                                <Button size="lg" className="group rounded-none h-14 px-8 text-base font-medium">
                                    Explore Services
                                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </Button>
                            </Link>
                            <Link href="/work">
                                <Button size="lg" variant="outline" className="rounded-none h-14 px-8 text-base font-medium border-2">
                                    View Our Work
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Bottom stats/metadata */}
                    <div className="mt-20 md:mt-32 pt-8 border-t border-border/50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold mb-1">150+</div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground">Projects Delivered</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold mb-1">50+</div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground">Happy Clients</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold mb-1">5+</div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground">Years Experience</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold mb-1">100%</div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground">Commitment</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}