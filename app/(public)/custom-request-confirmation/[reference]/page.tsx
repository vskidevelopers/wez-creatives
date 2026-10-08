import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { customRequests } from "@/lib/db/schema/custom-requests";
import { eq } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { WhatsAppButton } from "@/components/public/whatsapp-button";

type PageProps = {
    params: Promise<{ reference: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: `Request Submitted | ${siteConfig.name}`,
    };
}

export default async function CustomRequestConfirmationPage({ params }: PageProps) {
    const { reference } = await params;

    const [request] = await db
        .select()
        .from(customRequests)
        .where(eq(customRequests.reference, reference))
        .limit(1);

    if (!request) {
        notFound();
    }

    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-8">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                    <h1 className="text-4xl font-bold mb-2">Request Submitted</h1>
                    <p className="text-lg text-muted-foreground">
                        Thank you for your interest in Wez Creatives!
                    </p>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6 space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Request Reference</p>
                            <p className="text-2xl font-bold">{request.reference}</p>
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <h2 className="font-semibold">What happens next?</h2>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Our team will review your request details and any uploaded artwork.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>We&apos;ll contact you using the details you provided to discuss your project further.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Once we understand your requirements, we&apos;ll provide a personalized quote.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                            <p className="font-medium text-blue-900 mb-1">Need to make changes?</p>
                            <p className="text-blue-800">
                                If you need to update your request or have questions, please contact us directly.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button variant="outline" size="lg">
                            Back to Home
                        </Button>
                    </Link>
                    <WhatsAppButton
                        phone={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}
                        message={`Hi Wez Creatives, I've submitted a custom request.\n\nRequest Reference: ${request.reference}\n\nI'd like to follow up on my request.`}
                        label="Follow up on WhatsApp"
                        variant="default"
                        size="lg"
                    />
                </div>
            </div>
        </div>
    );
}