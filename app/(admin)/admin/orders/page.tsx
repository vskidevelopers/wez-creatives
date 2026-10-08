import Link from "next/link";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { desc, like, or } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatKES } from "@/components/public/shop/product-card";

type SearchParams = {
    search?: string;
};

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const { search } = await searchParams;
    const searchTerm = search || "";

    let allOrders;

    if (searchTerm) {
        allOrders = await db
            .select()
            .from(orders)
            .where(
                or(
                    like(orders.reference, `%${searchTerm}%`),
                    like(orders.customerName, `%${searchTerm}%`),
                    like(orders.customerPhone, `%${searchTerm}%`)
                )
            )
            .orderBy(desc(orders.createdAt))
            .limit(100);
    } else {
        allOrders = await db
            .select()
            .from(orders)
            .orderBy(desc(orders.createdAt))
            .limit(100);
    }

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
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            </div>

            <form className="flex gap-4">
                <Input
                    name="search"
                    placeholder="Search by reference, name, or phone..."
                    defaultValue={searchTerm}
                    className="max-w-md"
                />
                <Button type="submit">Search</Button>
                {searchTerm && (
                    <Link href="/admin/orders"><Button type="button" variant="outline">
                        Clear</Button></Link>

                )}
            </form>

            {allOrders.length > 0 ? (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reference</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allOrders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-mono text-sm font-medium">{order.reference}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadge(order.orderStatus)} className="capitalize">
                                            {order.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getPaymentBadge(order.paymentStatus)} className="capitalize">
                                            {order.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{formatKES(order.itemsSubtotal)}</TableCell>
                                    <TableCell>

                                        <Link href={`/admin/orders/${order.id}`}><Button size="sm" variant="outline" className="h-8">View</Button></Link>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/30">
                    <p className="text-muted-foreground">
                        {searchTerm ? "No orders found matching your search." : "No orders yet."}
                    </p>
                </div>
            )}
        </div>
    );
}