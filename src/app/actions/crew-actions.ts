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

const createCrewSchema = z.object({
    name: z.string().min(1, "Crew name is required.").trim(),
    description: z.string().nullable().optional(),
    projectId: z.string().nullable().optional(),
});

export async function createCrew(data: z.infer<typeof createCrewSchema>) {
    await requireAuth(["ADMIN", "MANAGER"]);
    const validated = createCrewSchema.parse(data);
    try {
        const crew = await prisma.crew.create({
            data: {
                name: validated.name,
                description: validated.description || null,
                projectId: validated.projectId || null,
            },
        });
        revalidatePath("/crews");
        return { success: true, crew };
    } catch (error) {
        console.error("Failed to create crew:", error);
        return { success: false, error: "Database create failed" };
    }
}
