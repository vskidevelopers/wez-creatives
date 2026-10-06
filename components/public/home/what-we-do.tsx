import Link from "next/link";
import Image from "next/image";
import { getPublicServices } from "@/lib/data/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function WhatWeDo() {
    const services = await getPublicServices(6);

    return (
        <section id="what-we-do" className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-2xl mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
                    <p className="text-lg text-muted-foreground">
                        Comprehensive creative and production services tailored to your needs.
                    </p>
                </div>

                {services.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <Card key={service.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                                    {service.mediaUrl && (
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={service.mediaUrl}
                                                alt={service.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-xl">{service.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {service.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                                {service.description}
                                            </p>
                                        )}
                                        <Link href={`/services/${service.slug}`}>
                                            <Button variant="ghost" size="sm" className="p-0 h-auto">
                                                Learn More →
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/services">
                                <Button variant="outline" size="lg">View All Services</Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Services coming soon. Contact us to learn more about our capabilities.</p>
                    </div>
                )}
            </div>
        </section>
    );
}