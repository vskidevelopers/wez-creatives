export type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  // Snapshot data for display (will be revalidated on server)
  productName: string;
  variantName?: string;
  unitPrice: number;
  imageUrl?: string;
};

export type Cart = {
  items: CartItem[];
};

export type CartContextType = {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  updateQuantity: (
    productId: string,
    variantId: string | undefined,
    quantity: number,
  ) => void;
  removeItem: (productId: string, variantId: string | undefined) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};
