import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EventsBulk() {
    return (
        <section id="events-bulk" className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Events & Bulk Orders</h2>
                        <p className="text-lg text-muted-foreground">
                            We specialize in supporting events, promotional campaigns, and large-scale production requirements.
                            From event branding to bulk branded merchandise, we handle projects of any scale.
                        </p>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start">
                                <span className="mr-2 font-semibold">•</span>
                                <span>Event branding and promotional materials</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 font-semibold">•</span>
                                <span>Bulk branded merchandise production</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 font-semibold">•</span>
                                <span>Corporate campaigns and launches</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 font-semibold">•</span>
                                <span>Large-scale printing and fulfillment</span>
                            </li>
                        </ul>
                        <Link href="/contact">
                            <Button size="lg" variant="outline">Discuss Your Project</Button>
                        </Link>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-8 border border-primary/10">
                        <h3 className="text-xl font-semibold mb-4">Why Choose Us for Events?</h3>
                        <p className="text-muted-foreground mb-4">
                            We understand the unique demands of event production and promotional campaigns.
                            Our team ensures timely delivery, quality production, and professional execution for your important occasions.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Contact us to discuss your event requirements and receive a customized quote.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}