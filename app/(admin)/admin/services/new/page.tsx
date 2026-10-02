import { ServiceForm } from "@/components/admin/service-form";

export default async function NewServicePage() {
    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create New Service</h1>
            </div>

            <ServiceForm existingMedia={[]} />
        </div>
    );
}