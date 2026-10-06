import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { CartProvider } from "@/lib/cart/cart-context";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </CartProvider>
    );
}