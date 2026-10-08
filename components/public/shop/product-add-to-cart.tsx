"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";
import { formatKES } from "./product-card";
import { WhatsAppButton } from "@/components/public/whatsapp-button";

type Variant = {
    id: string;
    name: string;
    size?: string | null;
    color?: string | null;
    priceOverride?: number | null;
};

type ProductAddToCartProps = {
    productId: string;
    productName: string;
    basePrice: number;
    variants: Variant[];
    imageUrl?: string;
};

export function ProductAddToCart({
    productId,
    productName,
    basePrice,
    variants,
    imageUrl,
}: ProductAddToCartProps) {
    const { addToCart } = useCart();
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const selectedVariant = variants.find((v) => v.id === selectedVariantId);
    const unitPrice = selectedVariant?.priceOverride ?? basePrice;
    const hasVariants = variants.length > 0;

    const handleAddToCart = () => {
        if (hasVariants && !selectedVariantId) {
            return; // Require variant selection
        }

        addToCart({
            productId,
            variantId: selectedVariantId || undefined,
            quantity,
            productName,
            variantName: selectedVariant?.name,
            unitPrice,
            imageUrl,
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // Generate WhatsApp message based on current selection
    const whatsappMessage = `Hi Wez Creatives, I'm interested in:
Product: ${productName}${selectedVariant ? `\nVariant: ${selectedVariant.name}` : ""}
I'd like to get more information.`;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                    <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-muted transition-colors"
                        aria-label="Decrease quantity"
                    >
                        -
                    </button>
                    <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-muted transition-colors"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
            </div>

            <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={hasVariants && !selectedVariantId}
            >
                {added ? (
                    <>
                        <Check className="mr-2 h-4 w-4" />
                        Added to Cart
                    </>
                ) : (
                    <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart — {formatKES(unitPrice * quantity)}
                    </>
                )}
            </Button>

            <WhatsAppButton
                phone={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}
                message={whatsappMessage}
                label="Inquire on WhatsApp"
                variant="outline"
                size="lg"
                className="w-full"
            />

            {hasVariants && !selectedVariantId && (
                <p className="text-sm text-muted-foreground text-center">
                    Please select a variant above
                </p>
            )}
        </div>
    );
}