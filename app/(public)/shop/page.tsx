import { getPublicProducts } from "@/lib/data/public";
import { ProductCard } from "@/components/public/shop/product-card";
import { db } from "@/lib/db";
import { productCategories } from "@/lib/db/schema";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
    title: `Shop | ${siteConfig.name}`,
    description:
        "Browse ready-made branded merchandise from Wez Creatives. T-shirts, hoodies, caps, bottles, bags and more.",
};

export default async function ShopPage() {
    const [products, categories] = await Promise.all([
        getPublicProducts(100),
        db.select().from(productCategories),
    ]);

    console.log("Fetched products:", products);

    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
                {/* Page Header */}
                <div className="max-w-3xl mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Shop
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Ready-made branded merchandise from Wez Creatives. Quality products
                        available for individuals, events, and organizations.
                    </p>
                </div>

                {/* Category filter hint (non-functional in V1, informational only) */}
                {categories.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <span
                                key={cat.id}
                                className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Product Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                slug={product.slug}
                                name={product.name}
                                shortDescription={product.shortDescription}
                                price={product.price}
                                mediaUrl={product.mediaUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border rounded-lg bg-muted/30">
                        <h2 className="text-xl font-semibold mb-2">
                            No products available yet
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Our shop is being stocked with new merchandise. Check back soon or
                            contact us to discuss custom orders.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}