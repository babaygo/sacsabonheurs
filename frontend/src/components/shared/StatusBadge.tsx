"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { OrderStatusType } from "@/lib/constants/OrderStatusType";

interface StatusBadgeProps {
    status: OrderStatusType;
    onChange?: (newStatus: OrderStatusType) => void;
    clickable?: boolean;
}

const statusMap: Record<OrderStatusType, { label: string; color: string }> = {
    pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
    shipped: { label: "Expédiée", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "Livrée", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
};

export default function StatusBadge({ status, onChange, clickable = true }: StatusBadgeProps) {
    const { label, color } = statusMap[status];

    if (!clickable) {
        return (
            <span className={`px-2 py-1 rounded text-sm font-medium cursor-default ${color}`}>
                {label}
            </span>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={`px-2 py-1 rounded text-sm font-medium ${color}`}>
                    {label}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="z-50">
                {Object.entries(statusMap).map(([key, { label }]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => onChange?.(key as OrderStatusType)}
                        className="cursor-pointer"
                    >
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
