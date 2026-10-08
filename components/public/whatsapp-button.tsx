"use client";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";

interface WhatsAppButtonProps {
    phone: string;
    message?: string;
    label?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function WhatsAppButton({
    phone,
    message,
    label = "Chat on WhatsApp",
    variant = "default",
    size = "default",
    className = "",
}: WhatsAppButtonProps) {
    // Fail gracefully if phone number is not configured
    if (!phone) {
        return null;
    }

    const link = getWhatsAppLink(phone, message);

    const handleClick = () => {
        const newWindow = window.open(link, "_blank");
        if (newWindow) newWindow.opener = null;
    };

    return (
        <Button
            onClick={handleClick}
            variant={variant}
            size={size}
            className={className + " flex items-center gap-2"}
            aria-label={label}
        >
            <MessageCircle className="h-4 w-4" />
            {label}
        </Button>
    );
}