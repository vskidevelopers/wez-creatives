import { db } from "@/lib/db";
import { productCategories } from "@/lib/db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveCategoryAction, deleteCategoryAction } from "@/lib/actions/categories";

export default async function CategoriesPage() {
    const categories = await db.select().from(productCategories);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Product Categories</h1>

            <form action={saveCategoryAction} className="flex gap-4 items-end bg-muted p-4 rounded-lg">
                <input type="hidden" name="id" />
                <div className="flex-1">
                    <label className="text-sm font-medium">Name</label>
                    <input name="name" required className="w-full mt-1 p-2 rounded-md border bg-background" />
                </div>
                <div className="flex-1">
                    <label className="text-sm font-medium">Slug</label>
                    <input name="slug" required className="w-full mt-1 p-2 rounded-md border bg-background" />
                </div>
                <input type="hidden" name="isActive" value="on" />
                <Button type="submit">Add Category</Button>
            </form>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-25">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((cat) => (
                        <TableRow key={cat.id}>
                            <TableCell className="font-medium">{cat.name}</TableCell>
                            <TableCell>{cat.slug}</TableCell>
                            <TableCell>
                                <Badge variant={cat.isActive ? "default" : "secondary"}>
                                    {cat.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <form action={async () => {
                                    "use server";
                                    await deleteCategoryAction(cat.id);
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