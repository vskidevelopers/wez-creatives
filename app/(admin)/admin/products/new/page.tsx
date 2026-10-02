import { db } from "@/lib/db";
import { productCategories } from "@/lib/db/schema";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
    // Fetch all categories to populate the dropdown in the form
    const categories = await db.select().from(productCategories);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create New Product</h1>
            </div>

            {/* Render the form without initialData (create mode) and no existing media */}
            <ProductForm
                categories={categories}
                existingMedia={[]}
            />
        </div>
    );
}
