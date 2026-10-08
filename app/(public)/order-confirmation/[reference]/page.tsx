import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { formatKES } from "@/components/public/shop/product-card";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { WhatsAppButton } from "@/components/public/whatsapp-button";

export async function generateMetadata({ params }: { params: Promise<{ reference: string }> }): Promise<Metadata> {
    const { reference } = await params;
    return {
        title: `Order Confirmation | ${siteConfig.name}`,
    };
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
    const { reference } = await params;

    const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.reference, reference))
        .limit(1);

    if (!order) {
        notFound();
    }

    const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-8">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                    <h1 className="text-4xl font-bold mb-2">Order Submitted</h1>
                    <p className="text-lg text-muted-foreground">
                        Thank you for your order!
                    </p>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6 space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Order Reference</p>
                            <p className="text-2xl font-bold">{order.reference}</p>
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <h2 className="font-semibold">Order Details</h2>
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <div>
                                        <div>{item.productName}</div>
                                        {item.variantName && (
                                            <div className="text-xs text-muted-foreground">{item.variantName}</div>
                                        )}
                                        <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                                    </div>
                                    <div className="font-semibold">{formatKES(item.lineTotal)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Subtotal</span>
                                <span>{formatKES(order.itemsSubtotal)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Delivery charges will be confirmed separately.
                            </p>
                        </div>

                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Payment Preference: </span>
                                <span className="font-medium">
                                    {order.paymentPreference === "pay_now" ? "Pay Now (M-Pesa)" : "Pay Later"}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Payment Status: </span>
                                <span className="font-medium capitalize">{order.paymentStatus}</span>
                            </div>
                        </div>

                        {order.paymentPreference === "pay_now" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                                <p className="font-medium text-blue-900 mb-1">M-Pesa Payment</p>
                                <p className="text-blue-800">
                                    M-Pesa payment integration will be available soon. Our team will contact you with payment instructions.
                                </p>
                            </div>
                        )}

                        {order.paymentPreference === "pay_later" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                                <p className="font-medium text-green-900 mb-1">Pay Later</p>
                                <p className="text-green-800">
                                    Your order has been submitted. Our team will contact you to confirm details and arrange payment.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/shop">
                        <Button variant="outline" size="lg">
                            Continue Shopping
                        </Button>
                    </Link>
                    <WhatsAppButton
                        phone={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}
                        message={`Hi Wez Creatives, I'm following up on my order.\n\nOrder Reference: ${order.reference}\n\nI'd like an update on my order.`}
                        label="Follow up on WhatsApp"
                        variant="default"
                        size="lg"
                    />
                </div>
            </div>
        </div>
    );
}