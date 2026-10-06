import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { CheckoutForm } from "@/components/public/checkout/checkout-form";

export const metadata: Metadata = {
    title: `Checkout | ${siteConfig.name}`,
    description: "Complete your order with Wez Creatives.",
};

export default function CheckoutPage() {
    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                    Checkout
                </h1>
                <CheckoutForm />
            </div>
        </div>
    );
}