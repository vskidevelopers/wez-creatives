"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveServiceAction, attachMediaToServiceAction, detachMediaFromServiceAction, setPrimaryServiceMediaAction } from "@/lib/actions/services";
import { uploadMediaAction } from "@/lib/cloudinary/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ServiceData = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    isPublished: boolean;
    sortOrder: number;
};

type MediaData = {
    id: string;
    secureUrl: string;
    isPrimary: boolean;
};

export function ServiceForm({
    initialData,
    existingMedia
}: {
    initialData?: ServiceData;
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
            const newMedia = await uploadMediaAction(file, "services");
            await attachMediaToServiceAction(initialData.id, newMedia.id);
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
            await saveServiceAction(formData);
            router.push("/admin/services");
        }} className="space-y-8">
            <input type="hidden" name="id" value={initialData?.id || ""} />

            <Card>
                <CardHeader><CardTitle>Service Information</CardTitle></CardHeader>
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
                        <label className="text-sm font-medium">Display Order</label>
                        <Input name="sortOrder" type="number" defaultValue={initialData?.sortOrder || 0} />
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-2 pb-2">
                            <input type="checkbox" name="isPublished" defaultChecked={initialData?.isPublished} className="h-4 w-4" />
                            Published
                        </label>
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea name="description" defaultValue={initialData?.description || ""} className="w-full p-2 rounded-md border bg-background min-h-[150px]" />
                    </div>
                </CardContent>
            </Card>

            {initialData?.id && (
                <Card>
                    <CardHeader><CardTitle>Service Images</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 flex-wrap">
                            {mediaList.map((m) => (
                                <div key={m.id} className="relative group">
                                    <img src={m.secureUrl} className="w-24 h-24 object-cover rounded-md border" />
                                    {m.isPrimary && <Badge className="absolute top-1 left-1">Primary</Badge>}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 rounded-md">
                                        {!m.isPrimary && (
                                            <form action={async () => {
                                                await setPrimaryServiceMediaAction(initialData.id!, m.id);
                                                setMediaList(mediaList.map(x => ({ ...x, isPrimary: x.id === m.id })));
                                            }}>
                                                <Button type="button" size="sm" variant="secondary">Set Primary</Button>
                                            </form>
                                        )}
                                        <form action={async () => {
                                            await detachMediaFromServiceAction(initialData.id!, m.id);
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
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Service"}</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin/services")}>Cancel</Button>
            </div>
        </form>
    );
}