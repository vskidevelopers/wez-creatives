/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatKES } from "@/components/public/shop/product-card";
import Link from "next/link";
import { submitOrderAction } from "@/lib/actions/orders";

export function CheckoutForm() {
    const router = useRouter();
    const { cart, subtotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        fulfillmentType: "delivery" as "delivery" | "pickup",
        deliveryAddress: "",
        orderNotes: "",
        paymentPreference: "pay_later" as "pay_now" | "pay_later",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const result = await submitOrderAction({
                ...formData,
                items: cart.items,
            });

            if (result.success) {
                clearCart();
                router.push(`/order-confirmation/${result.reference}`);
            } else {
                setError(result.error || "Failed to submit order");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                    Add some products before checking out.
                </p>
                <Link href="/shop">
                    <Button size="lg">Browse Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Contact Information</h2>

                        <div>
                            <label className="text-sm font-medium">Full Name *</label>
                            <Input
                                required
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Phone Number *</label>
                            <Input
                                required
                                type="tel"
                                placeholder="+254..."
                                value={formData.customerPhone}
                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Email Address</label>
                            <Input
                                type="email"
                                value={formData.customerEmail}
                                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Fulfillment</h2>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="fulfillmentType"
                                    value="delivery"
                                    checked={formData.fulfillmentType === "delivery"}
                                    onChange={(e) => setFormData({ ...formData, fulfillmentType: e.target.value as any })}
                                />
                                <span>Delivery</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="fulfillmentType"
                                    value="pickup"
                                    checked={formData.fulfillmentType === "pickup"}
                                    onChange={(e) => setFormData({ ...formData, fulfillmentType: e.target.value as any })}
                                />
                                <span>Pickup</span>
                            </label>
                        </div>

                        {formData.fulfillmentType === "delivery" && (
                            <div>
                                <label className="text-sm font-medium">Delivery Address *</label>
                                <Input
                                    required={formData.fulfillmentType === "delivery"}
                                    value={formData.deliveryAddress}
                                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                                    placeholder="Enter your delivery address"
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium">Order Notes (Optional)</label>
                            <textarea
                                className="w-full p-2 border rounded-md min-h-[80px]"
                                value={formData.orderNotes}
                                onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                                placeholder="Any special instructions?"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Payment Preference</h2>

                        <div className="space-y-2">
                            <label className="flex items-start gap-2">
                                <input
                                    type="radio"
                                    name="paymentPreference"
                                    value="pay_later"
                                    checked={formData.paymentPreference === "pay_later"}
                                    onChange={(e) => setFormData({ ...formData, paymentPreference: e.target.value as any })}
                                />
                                <div>
                                    <div>Pay Later</div>
                                    <div className="text-xs text-muted-foreground">
                                        Submit your order and pay when confirmed by our team.
                                    </div>
                                </div>
                            </label>
                            <label className="flex items-start gap-2">
                                <input
                                    type="radio"
                                    name="paymentPreference"
                                    value="pay_now"
                                    checked={formData.paymentPreference === "pay_now"}
                                    onChange={(e) => setFormData({ ...formData, paymentPreference: e.target.value as any })}
                                />
                                <div>
                                    <div>Pay Now (M-Pesa)</div>
                                    <div className="text-xs text-muted-foreground">
                                        M-Pesa payment integration coming soon. Your order will be created and payment details will be provided.
                                    </div>
                                </div>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <Card className="sticky top-24">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Order Summary</h2>

                        <div className="space-y-3">
                            {cart.items.map((item) => (
                                <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                                    <div>
                                        <div>{item.productName}</div>
                                        {item.variantName && (
                                            <div className="text-xs text-muted-foreground">{item.variantName}</div>
                                        )}
                                        <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                                    </div>
                                    <div className="font-semibold">{formatKES(item.unitPrice * item.quantity)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">{formatKES(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Delivery</span>
                                <span>TBD</span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatKES(subtotal)}</span>
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Place Order"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}