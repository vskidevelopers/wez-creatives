import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProductCardProps = {
    slug: string;
    name: string;
    shortDescription?: string | null;
    price: number;
    mediaUrl?: string | null;
    categoryName?: string | null;
};

/**
 * Format an integer KES price as a readable currency string.
 */
export function formatKES(amount: number): string {
    return `KES ${amount.toLocaleString("en-KE")}`;
}

export function ProductCard({
    slug,
    name,
    shortDescription,
    price,
    mediaUrl,
    categoryName,
}: ProductCardProps) {
    return (
        <Link href={`/shop/${slug}`} className="group block h-full">
            <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg bg-card">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {mediaUrl ? (
                        <Image
                            src={mediaUrl}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <span className="text-sm">No image available</span>
                        </div>
                    )}
                    {categoryName && (
                        <Badge
                            variant="secondary"
                            className="absolute top-3 left-3 bg-background/90 backdrop-blur"
                        >
                            {categoryName}
                        </Badge>
                    )}
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    {shortDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {shortDescription}
                        </p>
                    )}
                    <p className="text-lg font-bold pt-1">{formatKES(price)}</p>
                </CardContent>
            </Card>
        </Link>
    );
}