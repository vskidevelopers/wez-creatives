import { db } from "@/lib/db";
import { portfolioCategories } from "@/lib/db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { savePortfolioCategoryAction, deletePortfolioCategoryAction } from "@/lib/actions/portfolio";

export default async function PortfolioCategoriesPage() {
    const categories = await db.select().from(portfolioCategories).orderBy(portfolioCategories.sortOrder, portfolioCategories.createdAt);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Portfolio Categories</h1>

            <form action={savePortfolioCategoryAction} className="flex gap-4 items-end bg-muted p-4 rounded-lg">
                <input type="hidden" name="id" />
                <div className="flex-1">
                    <label className="text-sm font-medium">Name</label>
                    <input name="name" required className="w-full mt-1 p-2 rounded-md border bg-background" />
                </div>
                <div className="flex-1">
                    <label className="text-sm font-medium">Slug</label>
                    <input name="slug" required className="w-full mt-1 p-2 rounded-md border bg-background" />
                </div>
                <div className="w-32">
                    <label className="text-sm font-medium">Order</label>
                    <input name="sortOrder" type="number" defaultValue="0" className="w-full mt-1 p-2 rounded-md border bg-background" />
                </div>
                <input type="hidden" name="isActive" value="on" />
                <Button type="submit">Add Category</Button>
            </form>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((cat) => (
                        <TableRow key={cat.id}>
                            <TableCell className="font-medium">{cat.name}</TableCell>
                            <TableCell>{cat.slug}</TableCell>
                            <TableCell>{cat.sortOrder}</TableCell>
                            <TableCell>
                                <Badge variant={cat.isActive ? "default" : "secondary"}>
                                    {cat.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <form action={async () => {
                                    "use server";
                                    await deletePortfolioCategoryAction(cat.id);
                                }}>
                                    <Button variant="destructive" size="sm" type="submit">Delete</Button>
                                </form>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}