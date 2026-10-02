import Link from "next/link";
import Image from "next/image";
import { getPublicProducts } from "@/lib/data/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function ShopPreview() {
    const products = await getPublicProducts(8);

    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-2xl mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop Ready-Made Merchandise</h2>
                    <p className="text-lg text-muted-foreground">
                        Browse our selection of ready-made branded products.
                    </p>
                </div>

                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Link key={product.id} href={`/shop/${product.slug}`}>
                                    <Card className="overflow-hidden group hover:shadow-lg transition-shadow h-full">
                                        {product.mediaUrl && (
                                            <div className="relative h-48 overflow-hidden">
                                                <Image
                                                    src={product.mediaUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <CardHeader className="p-4">
                                            <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <p className="text-lg font-semibold">
                                                KES {product.price.toLocaleString()}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/shop">
                                <Button variant="outline" size="lg">Visit Shop</Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Shop coming soon. Contact us to inquire about available merchandise.</p>
                    </div>
                )}
            </div>
        </section>
    );
}