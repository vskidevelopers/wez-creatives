import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProductBySlug } from "@/lib/data/public";
import { ProductGallery } from "@/components/public/shop/product-gallery";
import { VariantSelector } from "@/components/public/shop/variant-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { formatKES } from "@/components/public/shop/product-card";
import { ProductAddToCart } from "@/components/public/shop/product-add-to-cart";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const product = await getPublicProductBySlug((await params).slug);

    if (!product) {
        return {
            title: `Product Not Found | ${siteConfig.name}`,
        };
    }

    const description =
        product.shortDescription ||
        product.fullDescription?.slice(0, 160) ||
        `${product.name} — available at ${siteConfig.name}`;

    const imageUrl = product.media.find((m) => m.isPrimary)?.secureUrl
        ?? product.media[0]?.secureUrl;

    return {
        title: `${product.name} | ${siteConfig.name}`,
        description,
        openGraph: {
            title: product.name,
            description,
            type: "website",
            ...(imageUrl && { images: [{ url: imageUrl }] }),
        },
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const product = await getPublicProductBySlug((await params).slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="py-8 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                        <ProductGallery
                            media={product.media.map((m) => ({
                                id: m.id,
                                secureUrl: m.secureUrl,
                                isPrimary: m.isPrimary,
                            }))}
                            productName={product.name}
                        />
                    </div>

                    <div className="space-y-6">
                        {product.categoryName && (
                            <Badge variant="secondary" className="text-xs">
                                {product.categoryName}
                            </Badge>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            {product.name}
                        </h1>

                        {product.shortDescription && (
                            <p className="text-lg text-muted-foreground">
                                {product.shortDescription}
                            </p>
                        )}

                        <div className="border-t" />

                        <VariantSelector
                            variants={product.variants.map((v) => ({
                                id: v.id,
                                name: v.name,
                                size: v.size,
                                color: v.color,
                                priceOverride: v.priceOverride,
                            }))}
                            basePrice={product.price}

                        />

                        <div className="border-t" />

                        {product.fullDescription && (
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold">About this product</h2>
                                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {product.fullDescription}
                                </div>
                            </div>
                        )}

                        <ProductAddToCart
                            productId={product.id}
                            productName={product.name}
                            basePrice={product.price}
                            variants={product.variants}
                            imageUrl={product.media.find((m) => m.isPrimary)?.secureUrl || product.media[0]?.secureUrl}
                        />

                        <div className="bg-muted/50 border rounded-lg p-4 text-sm text-muted-foreground">
                            <p className="font-medium text-foreground mb-1">
                                Interested in this product?
                            </p>
                            <p>
                                Contact us to place an order or discuss custom requirements.
                                We handle both individual purchases and bulk orders for events
                                and organizations.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link href="/shop">
                                <Button variant="outline" size="lg">
                                    Browse More Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}