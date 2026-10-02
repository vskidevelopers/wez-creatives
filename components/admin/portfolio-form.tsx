"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePortfolioWorkAction, attachMediaToPortfolioWorkAction, detachMediaFromPortfolioWorkAction, setPrimaryPortfolioMediaAction } from "@/lib/actions/portfolio";
import { uploadMediaAction } from "@/lib/cloudinary/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type WorkData = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    categoryId?: string | null;
    clientEventReference?: string | null;
    projectContext?: string | null;
    projectDate?: string | null;
    isPublished: boolean;
    sortOrder: number;
};

type MediaData = {
    id: string;
    secureUrl: string;
    isPrimary: boolean;
};

export function PortfolioForm({
    initialData,
    categories,
    existingMedia
}: {
    initialData?: WorkData;
    categories: { id: string; name: string }[];
    existingMedia: MediaData[];
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
            const newMedia = await uploadMediaAction(file, "portfolio");
            await attachMediaToPortfolioWorkAction(initialData.id, newMedia.id);
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
            await savePortfolioWorkAction(formData);
            router.push("/admin/portfolio");
        }} className="space-y-8">
            <input type="hidden" name="id" value={initialData?.id || ""} />

            <Card>
                <CardHeader><CardTitle>Project Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input name="title" defaultValue={initialData?.title} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Slug</label>
                        <Input name="slug" defaultValue={initialData?.slug} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Category</label>
                        <select name="categoryId" className="w-full p-2 rounded-md border bg-background" defaultValue={initialData?.categoryId || ""}>
                            <option value="">Uncategorized</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Display Order</label>
                        <Input name="sortOrder" type="number" defaultValue={initialData?.sortOrder || 0} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Client / Event Reference</label>
                        <Input name="clientEventReference" defaultValue={initialData?.clientEventReference || ""} placeholder="e.g., XYZ Ltd, Nairobi Expo" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Project Date</label>
                        <Input name="projectDate" type="date" defaultValue={initialData?.projectDate || ""} />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea name="description" defaultValue={initialData?.description || ""} className="w-full p-2 rounded-md border bg-background min-h-[100px]" />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Project Context</label>
                        <textarea name="projectContext" defaultValue={initialData?.projectContext || ""} className="w-full p-2 rounded-md border bg-background min-h-[100px]" placeholder="Additional context, challenges, solutions, etc." />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="isPublished" defaultChecked={initialData?.isPublished} className="h-4 w-4" />
                            Published
                        </label>
                    </div>
                </CardContent>
            </Card>

            {initialData?.id && (
                <Card>
                    <CardHeader><CardTitle>Project Images</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 flex-wrap">
                            {mediaList.map((m) => (
                                <div key={m.id} className="relative group">
                                    <img src={m.secureUrl} className="w-24 h-24 object-cover rounded-md border" />
                                    {m.isPrimary && <Badge className="absolute top-1 left-1">Primary</Badge>}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 rounded-md">
                                        {!m.isPrimary && (
                                            <form action={async () => {
                                                await setPrimaryPortfolioMediaAction(initialData.id!, m.id);
                                                setMediaList(mediaList.map(x => ({ ...x, isPrimary: x.id === m.id })));
                                            }}>
                                                <Button type="button" size="sm" variant="secondary">Set Primary</Button>
                                            </form>
                                        )}
                                        <form action={async () => {
                                            await detachMediaFromPortfolioWorkAction(initialData.id!, m.id);
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
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Work"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin/portfolio")}>Cancel</Button>
            </div>
        </form>
    );
}