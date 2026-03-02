"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-guard";
import { z } from "zod";

const crewIdSchema = z.string().min(1, "Invalid crew ID.");

export async function deleteCrew(crewId: string) {
    await requireAuth(["ADMIN", "MANAGER"]);
    const validId = crewIdSchema.parse(crewId);
    try {
        await prisma.crew.delete({
            where: { id: validId }
        });
        revalidatePath("/crews");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete crew:", error);
        return { success: false, error: "Database delete failed" };
    }
}
