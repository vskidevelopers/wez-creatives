/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { trackOrderAction } from "@/lib/actions/public-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatKES } from "@/components/public/shop/product-card";
import { Package, CheckCircle, Clock, XCircle } from "lucide-react";

type TrackingResult = {
    reference: string;
    customerName: string;
    fulfillmentType: string;
    orderStatus: string;
    paymentStatus: string;
    paymentPreference: string;
    itemsSubtotal: number;
    createdAt: Date;
    items: Array<{
        productName: string;
        variantName?: string | null;
        quantity: number;
    }>;
};

const statusMessages: Record<string, { title: string; description: string; icon: any }> = {
    received: {
        title: "Order Received",
        description: "We've received your order and will review it shortly.",
        icon: Clock,
    },
    confirmed: {
        title: "Order Confirmed",
        description: "Your order has been reviewed and confirmed.",
        icon: CheckCircle,
    },
    processing: {
        title: "Order Processing",
        description: "Your order is being prepared.",
        icon: Package,
    },
    ready: {
        title: "Order Ready",
        description: "Your order is ready for pickup/delivery.",
        icon: CheckCircle,
    },
    completed: {
        title: "Order Completed",
        description: "Your order has been completed.",
        icon: CheckCircle,
    },
    cancelled: {
        title: "Order Cancelled",
        description: "This order has been cancelled.",
        icon: XCircle,
    },
};

export default function TrackOrderPage() {
    const [reference, setReference] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<TrackingResult | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await trackOrderAction(reference);

            if (response.success && response.order) {
                setResult(response.order);
            } else {
                setError(response.error || "Order not found");
            }
        } catch (err) {
            setError("Failed to retrieve order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                <div className="mb-8 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Track Your Order
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Enter your order reference to check the status of your order.
                    </p>
                </div>

                <Card className="mb-8">
                    <CardContent className="p-6">
                        <form onSubmit={handleTrack} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Order Reference</label>
                                <Input
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="e.g., ORD-2026-123456"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Searching..." : "Track Order"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {error && (
                    <Card className="border-destructive">
                        <CardContent className="p-6 text-center">
                            <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
                            <p className="text-muted-foreground">{error}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Please check your order reference and try again.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {result && (
                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card>
                            <CardContent className="p-6">
                                {(() => {
                                    const statusInfo = statusMessages[result.orderStatus] || statusMessages.received;
                                    const Icon = statusInfo.icon;
                                    return (
                                        <div className="text-center space-y-4">
                                            <Icon className="mx-auto h-16 w-16 text-primary" />
                                            <div>
                                                <h2 className="text-2xl font-bold mb-2">{statusInfo.title}</h2>
                                                <p className="text-muted-foreground">{statusInfo.description}</p>
                                            </div>
                                            <div className="pt-4 border-t space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Order Reference:</span>
                                                    <span className="font-mono font-semibold">{result.reference}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Order Date:</span>
                                                    <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Payment Status:</span>
                                                    <Badge variant={result.paymentStatus === "paid" ? "default" : "secondary"}>
                                                        {result.paymentStatus}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-semibold">Order Items</h3>
                                <div className="space-y-3">
                                    {result.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm border-b pb-2 last:border-0">
                                            <div>
                                                <p className="font-medium">{item.productName}</p>
                                                {item.variantName && (
                                                    <p className="text-xs text-muted-foreground">{item.variantName}</p>
                                                )}
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-semibold">
                                        <span>Subtotal</span>
                                        <span>{formatKES(result.itemsSubtotal)}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Delivery charges will be confirmed separately.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Fulfillment Info */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Fulfillment</h3>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {result.fulfillmentType}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}