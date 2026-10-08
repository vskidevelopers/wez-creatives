import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { portfolioWork, portfolioWorkMedia, portfolioCategories, media } from "@/lib/db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
    title: `Our Work | ${siteConfig.name}`,
    description: "Explore our portfolio of branding, printing, and creative design projects.",
};

export default async function WorkPage() {
    const allWork = await db
        .select({
            id: portfolioWork.id,
            title: portfolioWork.title,
            slug: portfolioWork.slug,
            description: portfolioWork.description,
            clientEventReference: portfolioWork.clientEventReference,
            categoryName: portfolioCategories.name,
            mediaUrl: media.secureUrl,
        })
        .from(portfolioWork)
        .leftJoin(
            portfolioWorkMedia,
            and(
                eq(portfolioWork.id, portfolioWorkMedia.workId),
                eq(portfolioWorkMedia.isPrimary, true)
            )
        )
        .leftJoin(media, eq(portfolioWorkMedia.mediaId, media.id))
        .leftJoin(
            portfolioCategories,
            eq(portfolioWork.categoryId, portfolioCategories.id)
        )
        .where(eq(portfolioWork.isPublished, true))
        .orderBy(asc(portfolioWork.sortOrder), desc(portfolioWork.createdAt));

    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
                {/* Page Header */}
                <div className="max-w-3xl mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Our Work
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        A selection of our creative projects showcasing branding, printing, and design solutions.
                    </p>
                </div>

                {/* Work Grid */}
                {allWork.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allWork.map((item) => (
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
                ) : (
                    <div className="text-center py-20 border rounded-lg bg-muted/30">
                        <h2 className="text-xl font-semibold mb-2">
                            No work published yet
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Our portfolio is being updated with recent projects. Check back soon.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}