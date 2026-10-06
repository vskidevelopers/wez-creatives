/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Cart, CartItem, CartContextType } from "./types";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "wez-creatives-cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart>({ items: [] });
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && Array.isArray(parsed.items)) {
                    setCart(parsed);
                }
            }
        } catch (error) {
            console.error("Failed to load cart from storage:", error);
        }
        setIsHydrated(true);
    }, []);

    // Persist cart to localStorage on changes
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            } catch (error) {
                console.error("Failed to save cart to storage:", error);
            }
        }
    }, [cart, isHydrated]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const existingIndex = prev.items.findIndex(
                (i) => i.productId === item.productId && i.variantId === item.variantId
            );

            if (existingIndex >= 0) {
                // Update quantity if item already exists
                const updated = [...prev.items];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + item.quantity,
                };
                return { items: updated };
            }

            // Add new item
            return { items: [...prev.items, item] };
        });
    };

    const updateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId, variantId);
            return;
        }

        setCart((prev) => ({
            items: prev.items.map((item) =>
                item.productId === productId && item.variantId === variantId
                    ? { ...item, quantity }
                    : item
            ),
        }));
    };

    const removeItem = (productId: string, variantId: string | undefined) => {
        setCart((prev) => ({
            items: prev.items.filter(
                (item) => !(item.productId === productId && item.variantId === variantId)
            ),
        }));
    };

    const clearCart = () => {
        setCart({ items: [] });
    };

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
                itemCount,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}