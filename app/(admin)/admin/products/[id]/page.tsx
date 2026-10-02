import { db } from "@/lib/db";
import { products, productCategories, productVariants, productMedia, media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
    params
}: {
    params: { id: string }
}) {
    // 1. Fetch the specific product
    const product = await db.query.products.findFirst({
        where: eq(products.id, params.id),
    });

    // If the product doesn't exist, show a 404 page
    if (!product) {
        notFound();
    }

    // 2. Fetch all categories for the dropdown
    const categories = await db.select().from(productCategories);

    // 3. Fetch all variants associated with this product
    const variants = await db.select().from(productVariants).where(
        eq(productVariants.productId, params.id)
    );

    // 4. Fetch all media associated with this product
    const associatedMedia = await db.select({
        id: media.id,
        secureUrl: media.secureUrl,
        isPrimary: productMedia.isPrimary,
    })
        .from(productMedia)
        .innerJoin(media, eq(productMedia.mediaId, media.id))
        .where(eq(productMedia.productId, params.id));

    // Combine the product data with its variants for the form component
    const initialData = {
        ...product,
        variants,
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Product</h1>
            </div>

            {/* Render the form with initialData (edit mode) and existing media */}
            <ProductForm
                initialData={initialData}
                categories={categories}
                existingMedia={associatedMedia}
            />
        </div>
    );
}