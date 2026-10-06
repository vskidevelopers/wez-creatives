"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart/cart-context";

export function CartIcon() {
    const { itemCount } = useCart();

    return (
        <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
                <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                    {itemCount}
                </Badge>
            )}
        </Link>
    );
}
