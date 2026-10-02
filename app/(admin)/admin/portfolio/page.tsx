import Link from "next/link";
import { db } from "@/lib/db";
import { portfolioWork, portfolioCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deletePortfolioWorkAction } from "@/lib/actions/portfolio";

export default async function PortfolioPage() {
    const allWork = await db.select({
        id: portfolioWork.id,
        title: portfolioWork.title,
        slug: portfolioWork.slug,
        isPublished: portfolioWork.isPublished,
        sortOrder: portfolioWork.sortOrder,
        categoryName: portfolioCategories.name,
    }).from(portfolioWork).leftJoin(portfolioCategories, eq(portfolioWork.categoryId, portfolioCategories.id))
        .orderBy(portfolioWork.sortOrder, portfolioWork.createdAt);

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Portfolio / Work</h1>
                <div className="flex gap-2">
                    <Link href="/admin/portfolio/categories" className={buttonVariants({ variant: "outline" })}>
                        Manage Categories
                    </Link>
                    <Link href="/admin/portfolio/new" className={buttonVariants()}>
                        Add Work
                    </Link>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allWork.map((w) => (
                        <TableRow key={w.id}>
                            <TableCell className="font-medium">{w.title}</TableCell>
                            <TableCell>{w.categoryName || "Uncategorized"}</TableCell>
                            <TableCell>{w.sortOrder}</TableCell>
                            <TableCell>
                                <Badge variant={w.isPublished ? "default" : "secondary"}>
                                    {w.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Link href={`/admin/portfolio/${w.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                                    Edit
                                </Link>
                                <form action={async () => {
                                    "use server";
                                    await deletePortfolioWorkAction(w.id);
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
