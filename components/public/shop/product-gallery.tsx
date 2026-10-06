"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type MediaItem = {
    id: string;
    secureUrl: string;
    isPrimary: boolean;
};

type ProductGalleryProps = {
    media: MediaItem[];
    productName: string;
};

/**
 * Interactive product image gallery with thumbnail navigation.
 * Displays the primary image first, then remaining images in sort order.
 */
export function ProductGallery({ media, productName }: ProductGalleryProps) {
    // Sort so primary image comes first, then by existing sort order
    const sortedMedia = [...media].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return 0;
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const activeImage = sortedMedia[activeIndex];

    if (sortedMedia.length === 0) {
        return (
            <div className="relative aspect-square w-full bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No images available</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                <Image
                    src={activeImage.secureUrl}
                    alt={`${productName} - image ${activeIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={activeIndex === 0}
                />
            </div>

            {/* Thumbnails */}
            {sortedMedia.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {sortedMedia.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`View image ${index + 1}`}
                            aria-pressed={activeIndex === index}
                            className={cn(
                                "relative aspect-square overflow-hidden rounded-md border-2 transition-all",
                                activeIndex === index
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent hover:border-muted-foreground/50"
                            )}
                        >
                            <Image
                                src={item.secureUrl}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                sizes="100px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}