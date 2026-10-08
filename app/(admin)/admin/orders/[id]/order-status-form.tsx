"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";

export function OrderStatusForm({
    orderId,
    currentStatus,
}: {
    orderId: string;
    currentStatus: string;
}) {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("orderId", orderId);
        formData.append("status", selectedStatus);

        await updateOrderStatusAction(formData);
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
                <label className="text-sm font-medium">Update Status</label>
                <Select
                    value={selectedStatus}
                    onValueChange={(value: string | null) => setSelectedStatus(value ?? "")}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="received">Received</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" disabled={isSubmitting || selectedStatus === currentStatus}>
                {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
        </form>
    );
}