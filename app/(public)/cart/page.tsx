import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { CartContent } from "@/components/public/cart/cart-content";

export const metadata: Metadata = {
    title: `Cart | ${siteConfig.name}`,
    description: "Review your shopping cart before checkout.",
};

export default function CartPage() {
    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                    Your Cart
                </h1>
                <CartContent />
            </div>
        </div>
    );
}