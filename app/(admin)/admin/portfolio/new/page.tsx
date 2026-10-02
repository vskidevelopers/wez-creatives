import { db } from "@/lib/db";
import { portfolioCategories } from "@/lib/db/schema";
import { PortfolioForm } from "@/components/admin/portfolio-form";

export default async function NewPortfolioWorkPage() {
    const categories = await db.select().from(portfolioCategories);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create New Work / Project</h1>
            </div>

            <PortfolioForm categories={categories} existingMedia={[]} />
        </div>
    );
}