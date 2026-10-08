import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { portfolioWork, portfolioWorkMedia, portfolioCategories, media } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const [work] = await db
        .select({
            title: portfolioWork.title,
            description: portfolioWork.description,
        })
        .from(portfolioWork)
        .where(and(eq(portfolioWork.slug, slug), eq(portfolioWork.isPublished, true)))
        .limit(1);

    if (!work) {
        return {
            title: `Work Not Found | ${siteConfig.name}`,
        };
    }

    return {
        title: `${work.title} | ${siteConfig.name}`,
        description: work.description || `View our ${work.title} project.`,
    };
}

export default async function WorkDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const [work] = await db
        .select({
            id: portfolioWork.id,
            title: portfolioWork.title,
            slug: portfolioWork.slug,
            description: portfolioWork.description,
            clientEventReference: portfolioWork.clientEventReference,
            projectContext: portfolioWork.projectContext,
            projectDate: portfolioWork.projectDate,
            categoryName: portfolioCategories.name,
        })
        .from(portfolioWork)
        .leftJoin(portfolioCategories, eq(portfolioWork.categoryId, portfolioCategories.id))
        .where(and(eq(portfolioWork.slug, slug), eq(portfolioWork.isPublished, true)))
        .limit(1);

    if (!work) {
        notFound();
    }

    const workMedia = await db
        .select({
            id: media.id,
            secureUrl: media.secureUrl,
            isPrimary: portfolioWorkMedia.isPrimary,
        })
        .from(portfolioWorkMedia)
        .innerJoin(media, eq(portfolioWorkMedia.mediaId, media.id))
        .where(eq(portfolioWorkMedia.workId, work.id))
        .orderBy(asc(portfolioWorkMedia.sortOrder));

    return (
        <div className="py-8 md:py-16">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                {/* Back navigation */}
                <Link
                    href="/work"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Work
                </Link>

                {/* Header */}
                <div className="mb-8 space-y-4">
                    {work.categoryName && (
                        <Badge variant="secondary">{work.categoryName}</Badge>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {work.title}
                    </h1>
                    {work.clientEventReference && (
                        <p className="text-lg text-muted-foreground">
                            {work.clientEventReference}
                        </p>
                    )}
                    {work.projectDate && (
                        <p className="text-sm text-muted-foreground">
                            {new Date(work.projectDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                            })}
                        </p>
                    )}
                </div>

                {/* Media Gallery */}
                {workMedia.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {workMedia.map((item, index) => (
                            <div
                                key={item.id}
                                className={`relative ${index === 0 && workMedia.length > 1
                                    ? "md:col-span-2 aspect-[21/9]"
                                    : "aspect-square"
                                    } overflow-hidden rounded-lg`}
                            >
                                <Image
                                    src={item.secureUrl}
                                    alt={`${work.title} - image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Description */}
                {work.description && (
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {work.description}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Project Context */}
                {work.projectContext && (
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Project Context</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {work.projectContext}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* CTA */}
                <div className="flex flex-wrap gap-4 justify-center pt-8 border-t">
                    <Link href="/work">
                        <Button variant="outline" size="lg">
                            View More Work
                        </Button>
                    </Link>
                    <Link href="/custom-request">
                        <Button size="lg">Start Your Project</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}