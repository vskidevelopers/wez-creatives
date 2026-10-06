import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CustomWork() {
    return (
        <section id="custom-work" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-8 md:p-12">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Custom Work & Bulk Production</h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Have a specific requirement? We handle custom branding, merchandise, printing, and bulk production.
                                Upload your artwork or describe your needs, and we&apos;ll bring your vision to life.
                            </p>
                            <ul className="space-y-2 mb-8 text-muted-foreground">
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>Custom branded merchandise</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>Bulk production for events and campaigns</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>Artwork-based printing and design</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✓</span>
                                    <span>Custom specifications and requirements</span>
                                </li>
                            </ul>
                            <Link href="/custom-request">
                                <Button size="lg">Request a Quote</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}