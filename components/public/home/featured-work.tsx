import Link from "next/link";
import Image from "next/image";
import { getPublicPortfolioWork } from "@/lib/data/public";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export async function FeaturedWork() {
    const work = await getPublicPortfolioWork(6);

    return (
        <section id="featured-work" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-2xl mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Work</h2>
                    <p className="text-lg text-muted-foreground">
                        A selection of our recent projects showcasing our creative capabilities.
                    </p>
                </div>

                {work.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {work.map((item) => (
                                <Link key={item.id} href={`/work/${item.slug}`}>
                                    <Card className="overflow-hidden group hover:shadow-lg transition-shadow h-full">
                                        {item.mediaUrl && (
                                            <div className="relative h-64 overflow-hidden">
                                                <Image
                                                    src={item.mediaUrl}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <CardContent className="p-6">
                                            {item.categoryName && (
                                                <Badge variant="secondary" className="mb-2">
                                                    {item.categoryName}
                                                </Badge>
                                            )}
                                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                            {item.clientEventReference && (
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {item.clientEventReference}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/work">
                                <Button variant="outline" size="lg">View All Work</Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Portfolio coming soon. Contact us to see examples of our work.</p>
                    </div>
                )}
            </div>
        </section>
    );
}