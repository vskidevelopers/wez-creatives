import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { CustomRequestForm } from "@/components/public/custom-request/custom-request-form";

export const metadata: Metadata = {
    title: `Custom Request | ${siteConfig.name}`,
    description: "Request custom branding, printing, or bulk production from Wez Creatives.",
};

export default function CustomRequestPage() {
    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="mb-8 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Custom Request
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Tell us about your project. We&apos;ll review your requirements and get back to you with a personalized quote.
                    </p>
                </div>

                <CustomRequestForm />
            </div>
        </div>
    );
}