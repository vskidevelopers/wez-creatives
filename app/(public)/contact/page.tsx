import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
    title: `Contact Us | ${siteConfig.name}`,
    description: "Get in touch with Wez Creatives for branding, printing, and creative design services in Nairobi, Kenya.",
};

export default function ContactPage() {
    return (
        <div className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Ready to start your project? We&apos;d love to hear from you. Reach out through any of the channels below.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Email */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-xl font-semibold">Email Us</h2>
                            </div>
                            <p className="text-muted-foreground">
                                For general inquiries, project discussions, or quotes.
                            </p>
                            <a
                                href="mailto:hello@wezcreatives.co.ke"
                                className="text-lg font-medium text-primary hover:underline"
                            >
                                hello@wezcreatives.co.ke
                            </a>
                        </CardContent>
                    </Card>

                    {/* Phone */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Phone className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-xl font-semibold">Call Us</h2>
                            </div>
                            <p className="text-muted-foreground">
                                Speak directly with our team for immediate assistance.
                            </p>
                            <a
                                href="tel:+254700000000"
                                className="text-lg font-medium text-primary hover:underline"
                            >
                                +254 700 000 000
                            </a>
                        </CardContent>
                    </Card>

                    {/* WhatsApp */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <MessageCircle className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-xl font-semibold">WhatsApp</h2>
                            </div>
                            <p className="text-muted-foreground">
                                Quick questions? Chat with us on WhatsApp for fast responses.
                            </p>
                            <a
                                href="https://wa.me/254700000000?text=Hi%20Wez%20Creatives%2C%20I%27d%20like%20to%20make%20an%20inquiry."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:underline"
                            >
                                Chat on WhatsApp
                                <MessageCircle className="h-4 w-4" />
                            </a>
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-xl font-semibold">Visit Us</h2>
                            </div>
                            <p className="text-muted-foreground">
                                Our studio is located in Nairobi, Kenya.
                            </p>
                            <p className="text-lg font-medium">
                                Nairobi, Kenya
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Business Hours */}
                <Card className="mb-12">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-semibold mb-6 text-center">Business Hours</h2>
                        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Monday - Friday</span>
                                <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Saturday</span>
                                <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
                            </div>
                            <div className="flex justify-between py-2 border-b md:col-span-2">
                                <span className="font-medium">Sunday</span>
                                <span className="text-muted-foreground">Closed</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CTA Section */}
                <div className="text-center space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Have a Custom Project in Mind?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Whether it&apos;s branded merchandise, event materials, or a complete branding package,
                        we&apos;re ready to bring your vision to life.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/custom-request">
                            <Button size="lg">
                                Start a Custom Request
                            </Button>
                        </Link>
                        <Link href="/shop">
                            <Button size="lg" variant="outline">
                                Browse Our Shop
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}