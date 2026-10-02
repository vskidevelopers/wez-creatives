import Link from "next/link";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteServiceAction } from "@/lib/actions/services";

export default async function ServicesPage() {
    const allServices = await db.select().from(services).orderBy(services.sortOrder, services.createdAt);

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Services</h1>
                <Link href="/admin/services/new">
                    <Button>Add Service</Button>
                </Link>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allServices.map((s) => (
                        <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.title}</TableCell>
                            <TableCell>{s.slug}</TableCell>
                            <TableCell>{s.sortOrder}</TableCell>
                            <TableCell>
                                <Badge variant={s.isPublished ? "default" : "secondary"}>
                                    {s.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Link
                                    href={`/admin/services/${s.id}`}
                                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    Edit
                                </Link>
                                <form action={async () => {
                                    "use server";
                                    await deleteServiceAction(s.id);
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