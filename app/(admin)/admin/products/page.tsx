import Link from "next/link";
import { db } from "@/lib/db";
import { products, productCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteProductAction } from "@/lib/actions/products";

export default async function ProductsPage() {
    const allProducts = await db.select({
        id: products.id,
        name: products.name,
        price: products.price,
        isPublished: products.isPublished,
        categoryName: productCategories.name,
    }).from(products).leftJoin(productCategories, eq(products.categoryId, productCategories.id));

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Products</h1>
                <div className="flex gap-2">
                    <Link
                        href="/admin/products/categories"
                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        Manage Categories
                    </Link>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        Add Product
                    </Link>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price (KES)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-25">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allProducts.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.name}</TableCell>
                            <TableCell>{p.categoryName || "Uncategorized"}</TableCell>
                            <TableCell>{p.price.toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge variant={p.isPublished ? "default" : "secondary"}>
                                    {p.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Link
                                    href={`/admin/products/${p.id}`}
                                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    Edit
                                </Link>
                                <form action={async () => {
                                    "use server";
                                    await deleteProductAction(p.id);
                                }}>
                                    <Button variant="destructive" size="sm" type="submit">Del</Button>
                                </form>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}