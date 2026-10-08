import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/components/public/shop/product-card";
import Link from "next/link";
import { OrderStatusForm } from "./order-status-form";
import { WhatsAppButton } from "@/components/public/whatsapp-button";


type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: PageProps) {
    const { id } = await params;

    const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, id))
        .limit(1);

    if (!order) {
        notFound();
    }

    const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            received: "secondary",
            confirmed: "default",
            processing: "default",
            ready: "outline",
            completed: "default",
            cancelled: "destructive",
        };
        return variants[status] || "secondary";
    };

    const getPaymentBadge = (status: string) => {
        return status === "paid" ? "default" : "secondary";
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Order {order.reference}</h1>
                    <p className="text-muted-foreground mt-1">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <Link href="/admin/orders">
                    <Button variant="outline">Back to Orders</Button>
                </Link>
            </div>

            {/* Order Status Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderStatusForm orderId={order.id} currentStatus={order.orderStatus} />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <p className="font-medium">{order.customerName}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Phone:</span>
                            <p className="font-medium">{order.customerPhone}</p>
                        </div>
                        {order.customerEmail && (
                            <div>
                                <span className="text-sm text-muted-foreground">Email:</span>
                                <p className="font-medium">{order.customerEmail}</p>
                            </div>
                        )}

                        {order.customerPhone && (
                            <div className="pt-2">
                                <WhatsAppButton
                                    phone={order.customerPhone || ""}
                                    message={`Hi ${order.customerName}, this is Wez Creatives following up regarding your order ${order.reference}.`}
                                    label="Contact Customer on WhatsApp"
                                    variant="outline"
                                    size="sm"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Order Status:</span>
                            <Badge variant={getStatusBadge(order.orderStatus)}>
                                {order.orderStatus}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Payment Status:</span>
                            <Badge variant={getPaymentBadge(order.paymentStatus)}>
                                {order.paymentStatus}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Payment Preference:</span>
                            <span className="font-medium">
                                {order.paymentPreference === "pay_now" ? "Pay Now (M-Pesa)" : "Pay Later"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Fulfillment:</span>
                            <span className="font-medium capitalize">{order.fulfillmentType}</span>
                        </div>
                        {order.deliveryAddress && (
                            <div>
                                <span className="text-sm text-muted-foreground">Delivery Address:</span>
                                <p className="font-medium">{order.deliveryAddress}</p>
                            </div>
                        )}
                        {order.orderNotes && (
                            <div>
                                <span className="text-sm text-muted-foreground">Customer Notes:</span>
                                <p className="font-medium">{order.orderNotes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                                <div className="flex-1">
                                    <p className="font-medium">{item.productName}</p>
                                    {item.variantName && (
                                        <p className="text-sm text-muted-foreground">{item.variantName}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Qty: {item.quantity} × {formatKES(item.unitPrice)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{formatKES(item.lineTotal)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-4 pt-4 space-y-2">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Subtotal</span>
                            <span>{formatKES(order.itemsSubtotal)}</span>
                        </div>
                        {order.deliveryFee && order.deliveryFee > 0 && (
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Delivery Fee</span>
                                <span>{formatKES(order.deliveryFee)}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}