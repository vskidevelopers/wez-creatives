"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/cart/cart-context";
import { formatKES } from "@/components/public/shop/product-card";

export function CartContent() {
    const { cart, updateQuantity, removeItem, subtotal } = useCart();

    if (cart.items.length === 0) {
        return (
            <div className="text-center py-20">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                    Add some products to get started.
                </p>
                <Link href="/shop">
                    <Button size="lg">Browse Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                    <Card key={`${item.productId}-${item.variantId || "no-variant"}`}>
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                {/* Image */}
                                <div className="relative w-24 h-24 shrink-0 bg-muted rounded-md overflow-hidden">
                                    {item.imageUrl ? (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.productName}
                                            fill
                                            className="object-cover"
                                            sizes="96px"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h3 className="font-semibold">{item.productName}</h3>
                                        {item.variantName && (
                                            <p className="text-sm text-muted-foreground">
                                                {item.variantName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        item.variantId,
                                                        item.quantity - 1
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center border rounded hover:bg-muted transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        item.variantId,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center border rounded hover:bg-muted transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-semibold">{formatKES(item.unitPrice * item.quantity)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatKES(item.unitPrice)} each
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => removeItem(item.productId, item.variantId)}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
                <Card className="sticky top-24">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Order Summary</h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">{formatKES(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Delivery charges</span>
                                <span>To be confirmed</span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatKES(subtotal)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Delivery charges will be confirmed separately.
                            </p>
                        </div>

                        <Link href="/checkout" className="block">
                            <Button size="lg" className="w-full">
                                Proceed to Checkout
                            </Button>
                        </Link>

                        <Link href="/shop" className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Continue Shopping
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}