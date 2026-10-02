import { db } from "@/lib/db";
import { services, serviceMedia, media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/service-form";

export default async function EditServicePage({
    params
}: {
    params: { id: string }
}) {
    const service = await db.query.services.findFirst({
        where: eq(services.id, params.id),
    });

    if (!service) {
        notFound();
    }

    const associatedMedia = await db.select({
        id: media.id,
        secureUrl: media.secureUrl,
        isPrimary: serviceMedia.isPrimary,
    })
        .from(serviceMedia)
        .innerJoin(media, eq(serviceMedia.mediaId, media.id))
        .where(eq(serviceMedia.serviceId, params.id));

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Service</h1>
            </div>

            <ServiceForm
                initialData={service}
                existingMedia={associatedMedia}
            />
        </div>
    );
}