import { db } from "@/lib/db";
import { portfolioWork, portfolioCategories, portfolioWorkMedia, media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/admin/portfolio-form";

export default async function EditPortfolioWorkPage({
    params
}: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params;
    const work = await db.query.portfolioWork.findFirst({
        where: eq(portfolioWork.id, id),
    });

    if (!work) {
        notFound();
    }

    const categories = await db.select().from(portfolioCategories);

    const associatedMedia = await db.select({
        id: media.id,
        secureUrl: media.secureUrl,
        isPrimary: portfolioWorkMedia.isPrimary,
    })
        .from(portfolioWorkMedia)
        .innerJoin(media, eq(portfolioWorkMedia.mediaId, media.id))
        .where(eq(portfolioWorkMedia.workId, id));

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Work / Project</h1>
            </div>

            <PortfolioForm
                initialData={work}
                categories={categories}
                existingMedia={associatedMedia}
            />
        </div>
    );
}