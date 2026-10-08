import { db } from "@/lib/db";
import { products, services, portfolioWork, orders } from "@/lib/db/schema";
import { count, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Briefcase, Image as ImageIcon, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
    // Fetch counts and recent orders in parallel for performance
    const [productStats, serviceStats, portfolioStats, recentOrders] = await Promise.all([
        db.select({ count: count() }).from(products),
        db.select({ count: count() }).from(services),
        db.select({ count: count() }).from(portfolioWork),
        db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
    ]);

    const productCount = productStats[0]?.count || 0;
    const serviceCount = serviceStats[0]?.count || 0;
    const portfolioCount = portfolioStats[0]?.count || 0;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your Wez Creatives business.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{serviceCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{portfolioCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recentOrders.length} New</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders & Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Orders List */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="text-sm font-medium">{order.customerName}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{order.reference}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">KES {order.itemsSubtotal.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{order.orderStatus}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">No orders yet.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-4">
                            Manage your store and services efficiently.
                        </p>
                        <div className="grid gap-2">
                            <Link href="/admin/products/new">
                                <Button variant="outline" className="justify-start w-full">
                                    <Package className="mr-2 h-4 w-4" /> Add New Product
                                </Button>
                            </Link>

                            <Link href="/admin/orders">
                                <Button variant="outline" className="justify-start w-full">
                                    <ShoppingCart className="mr-2 h-4 w-4" /> View All Orders
                                </Button>
                            </Link>

                            <Link href="/admin/portfolio/new">
                                <Button variant="outline" className="justify-start w-full">
                                    <ImageIcon className="mr-2 h-4 w-4" /> Add Portfolio Item
                                </Button>
                            </Link>
                        </div>
          </CardContent>
                </Card>
            </div>
        </div>
    );
}