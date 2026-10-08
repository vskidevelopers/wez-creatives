"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatKES } from "./product-card"; // Import the function directly here

type Variant = {
    id: string;
    name: string;
    size?: string | null;
    color?: string | null;
    priceOverride?: number | null;
};

type VariantSelectorProps = {
    variants: Variant[];
    basePrice: number;
};

/**
 * Interactive variant selector.
 * Displays available options and updates the displayed price when a variant
 * with a price override is selected.
 */
export function VariantSelector({
    variants,
    basePrice,
}: VariantSelectorProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedVariant = useMemo(
        () => variants.find((v) => v.id === selectedId) ?? null,
        [selectedId, variants]
    );

    const displayedPrice = selectedVariant?.priceOverride ?? basePrice;

    const hasSize = variants.some((v) => v.size);
    const hasColor = variants.some((v) => v.color);

    if (variants.length === 0) {
        return (
            <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Price</span>
                    <span className="text-2xl font-bold">{formatKES(basePrice)}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Price Display */}
            <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-muted-foreground">Price</span>
                <span className="text-2xl font-bold">{formatKES(displayedPrice)}</span>
            </div>

            {/* Size Options */}
            {hasSize && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Size</label>
                    <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(variants.map((v) => v.size).filter(Boolean))).map(
                            (size) => {
                                const matchingVariants = variants.filter((v) => v.size === size);
                                const isSelected = matchingVariants.some((v) => v.id === selectedId);
                                const isAvailable = matchingVariants.length > 0;

                                return (
                                    <button
                                        key={size}
                                        type="button"
                                        disabled={!isAvailable}
                                        onClick={() => {
                                            const target = matchingVariants[0];
                                            if (target) setSelectedId(target.id);
                                        }}
                                        aria-pressed={isSelected}
                                        className={cn(
                                            "min-w-[60px] px-4 py-2 rounded-md border text-sm font-medium transition-all",
                                            isSelected
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-background hover:border-primary/50",
                                            !isAvailable && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {size}
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>
            )}

            {/* Color Options */}
            {hasColor && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(variants.map((v) => v.color).filter(Boolean))).map(
                            (color) => {
                                const matchingVariants = variants.filter((v) => v.color === color);
                                const isSelected = matchingVariants.some((v) => v.id === selectedId);
                                const isAvailable = matchingVariants.length > 0;

                                return (
                                    <button
                                        key={color}
                                        type="button"
                                        disabled={!isAvailable}
                                        onClick={() => {
                                            const target = matchingVariants[0];
                                            if (target) setSelectedId(target.id);
                                        }}
                                        aria-pressed={isSelected}
                                        className={cn(
                                            "px-4 py-2 rounded-md border text-sm font-medium transition-all",
                                            isSelected
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-background hover:border-primary/50",
                                            !isAvailable && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {color}
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>
            )}

            {/* Fallback: if variants exist but have neither size nor color, show them by name */}
            {!hasSize && !hasColor && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Options</label>
                    <div className="flex flex-wrap gap-2">
                        {variants.map((variant) => (
                            <button
                                key={variant.id}
                                type="button"
                                onClick={() => setSelectedId(variant.id)}
                                aria-pressed={selectedId === variant.id}
                                className={cn(
                                    "px-4 py-2 rounded-md border text-sm font-medium transition-all",
                                    selectedId === variant.id
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-background hover:border-primary/50"
                                )}
                            >
                                {variant.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Selection summary */}
            {selectedVariant && (
                <p className="text-sm text-muted-foreground">
                    Selected: <span className="font-medium text-foreground">{selectedVariant.name}</span>
                </p>
            )}
        </div>
    );
}