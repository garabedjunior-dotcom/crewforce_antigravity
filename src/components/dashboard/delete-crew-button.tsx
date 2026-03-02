"use client";

import { Trash2 } from "lucide-react";
import { deleteCrew } from "@/app/actions/crew-actions";
import { toast } from "sonner";
import { useState } from "react";

export function DeleteCrewButton({ crewId, crewName }: { crewId: string, crewName: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${crewName}? This will leave its members unassigned.`)) {
            return;
        }
        setIsDeleting(true);
        const res = await deleteCrew(crewId);
        if (res.success) {
            toast.success(`${crewName} deleted successfully!`);
        } else {
            toast.error("Failed to delete crew");
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors ml-4 shrink-0 bg-red-500/10 dark:bg-red-500/20"
            title="Delete Crew"
        >
            <Trash2 size={18} strokeWidth={2.5} />
        </button>
    );
}
