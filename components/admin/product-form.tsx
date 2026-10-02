/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProductAction, attachMediaToProductAction, detachMediaFromProductAction, setPrimaryMediaAction } from "@/lib/actions/products";
import { uploadMediaAction } from "@/lib/cloudinary/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProductData = any; // Replace with proper type from DB query
type CategoryData = any;
type MediaData = any;

export function ProductForm({
    initialData,
    categories,
    existingMedia
}: {
    initialData?: ProductData,
    categories: CategoryData[],
    existingMedia: MediaData[]
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mediaList, setMediaList] = useState(existingMedia || []);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !initialData?.id) return;
        setUploading(true);
        try {
            const file = e.target.files[0];
            const newMedia = await uploadMediaAction(file, "products");
            await attachMediaToProductAction(initialData.id, newMedia.id);
            setMediaList([...mediaList, { ...newMedia, isPrimary: false }]);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form action={async (formData: FormData) => {
            setIsSubmitting(true);
            await saveProductAction(formData);
            router.push("/admin/products");
        }} className="space-y-8">
            <input type="hidden" name="id" value={initialData?.id || ""} />

            <Card>
                <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input name="name" defaultValue={initialData?.name} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Slug</label>
                        <Input name="slug" defaultValue={initialData?.slug} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Price (KES)</label>
                        <Input name="price" type="number" defaultValue={initialData?.price} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Category</label>
                        <select name="categoryId" className="w-full p-2 rounded-md border bg-background" defaultValue={initialData?.categoryId || ""}>
                            <option value="">Uncategorized</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Short Description</label>
                        <Input name="shortDescription" defaultValue={initialData?.shortDescription} />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Full Description</label>
                        <textarea name="fullDescription" defaultValue={initialData?.fullDescription} className="w-full p-2 rounded-md border bg-background min-h-[100px]" />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="isPublished" defaultChecked={initialData?.isPublished} className="h-4 w-4" />
                            Published
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="isFeatured" defaultChecked={initialData?.isFeatured} className="h-4 w-4" />
                            Featured
                        </label>
                    </div>
                </CardContent>
            </Card>

            {initialData?.id && (
                <Card>
                    <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 flex-wrap">
                            {mediaList.map((m: any) => (
                                <div key={m.id} className="relative group">
                                    <img src={m.secureUrl} className="w-24 h-24 object-cover rounded-md border" />
                                    {m.isPrimary && <Badge className="absolute top-1 left-1">Primary</Badge>}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 rounded-md">
                                        {!m.isPrimary && (
                                            <form action={async () => {
                                                await setPrimaryMediaAction(initialData.id, m.id);
                                                setMediaList(mediaList.map(x => ({ ...x, isPrimary: x.id === m.id })));
                                            }}>
                                                <Button type="button" size="sm" variant="secondary">Set Primary</Button>
                                            </form>
                                        )}
                                        <form action={async () => {
                                            await detachMediaFromProductAction(initialData.id, m.id);
                                            setMediaList(mediaList.filter(x => x.id !== m.id));
                                        }}>
                                            <Button type="button" size="sm" variant="destructive">Remove</Button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Upload New Image</label>
                            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading to Cloudinary...</p>}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Product"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
            </div>
        </form>
    );
}