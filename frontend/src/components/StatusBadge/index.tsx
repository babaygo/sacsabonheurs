"use client";

import { OrderStatusType } from "@/types/OrderStatusType";
import { useState } from "react";

interface StatusBadgeProps {
    status: OrderStatusType;
    onChange?: (newStatus: OrderStatusType) => void;
}

const statusMap: Record<OrderStatusType, { label: string; color: string }> = {
    pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
    paid: { label: "Payée", color: "bg-blue-100 text-blue-800" },
    shipped: { label: "Expédiée", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "Livrée", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
};

export default function StatusBadge({ status, onChange }: StatusBadgeProps) {
    const [open, setOpen] = useState(false);

    const handleChange = (newStatus: OrderStatusType) => {
        setOpen(false);
        if (newStatus !== status && onChange) {
            onChange(newStatus);
        }
    };

    const { label, color } = statusMap[status];

    return (
        <div className="relative inline-block">
            <button
                className={`px-2 py-1 rounded text-sm font-medium ${color}`}
                onClick={() => setOpen(!open)}
            >
                {label}
            </button>

            {open && (
                <ul className="absolute z-10 mt-1 w-32 bg-white border rounded shadow">
                    {Object.keys(statusMap).map((s) => (
                        <li
                            key={s}
                            className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleChange(s as OrderStatusType)}
                        >
                            {statusMap[s as OrderStatusType].label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
