"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-guard";
import { z } from "zod";

const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required.").trim(),
    description: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    clientName: z.string().nullable().optional(),
    budget: z.number().min(0).nullable().optional(),
    deadline: z.date().nullable().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
});

export async function createProject(formData: FormData) {
    await requireAuth(["ADMIN", "MANAGER"]);

    const budgetStr = formData.get("budget") as string | null;
    const deadlineStr = formData.get("deadline") as string | null;
    const latStr = formData.get("latitude") as string | null;
    const lngStr = formData.get("longitude") as string | null;

    const validated = createProjectSchema.parse({
        name: formData.get("name") as string,
        description: (formData.get("description") as string)?.trim() || null,
        location: (formData.get("location") as string)?.trim() || null,
        clientName: (formData.get("clientName") as string)?.trim() || null,
        budget: budgetStr ? parseFloat(budgetStr) : null,
        deadline: deadlineStr ? new Date(deadlineStr) : null,
        latitude: latStr ? parseFloat(latStr) : null,
        longitude: lngStr ? parseFloat(lngStr) : null,
    });

    const project = await prisma.project.create({
        data: {
            name: validated.name,
            description: validated.description || null,
            location: validated.location || null,
            clientName: validated.clientName || null,
            budget: validated.budget || null,
            deadline: validated.deadline || null,
            latitude: validated.latitude || null,
            longitude: validated.longitude || null,
        },
    });

    revalidatePath("/projects");
    redirect(`/projects/${project.id}`);
}

const projectUpdateSchema = z.object({
    name: z.string().min(1).trim(),
    description: z.string().nullable(),
    location: z.string().nullable(),
    clientName: z.string().nullable(),
    budget: z.number().min(0).nullable(),
    status: z.enum(["ACTIVE", "DELAYED", "COMPLETED"]),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
});

export type ProjectUpdateData = z.infer<typeof projectUpdateSchema>;

export async function updateProject(id: string, data: unknown) {
    await requireAuth(["ADMIN", "MANAGER"]);
    const validated = projectUpdateSchema.parse(data);
    try {
        await prisma.project.update({
            where: { id },
            data: {
                name: validated.name,
                description: validated.description || null,
                location: validated.location || null,
                clientName: validated.clientName || null,
                budget: validated.budget,
                status: validated.status,
                latitude: validated.latitude !== undefined ? validated.latitude : undefined,
                longitude: validated.longitude !== undefined ? validated.longitude : undefined,
            }
        });
        revalidatePath(`/projects/${id}`);
        revalidatePath("/projects");
        revalidatePath("/map");
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: "Invalid input data." };
        }
        console.error("Failed to update project:", error);
        return { success: false, error: "Database update failed." };
    }
}

export async function deleteProject(id: string) {
    await requireAuth(["ADMIN", "MANAGER"]);
    try {
        const project = await prisma.project.findUnique({
            where: { id },
            include: { dailyLogs: true }
        });

        if (!project) {
            return { success: false, error: "Project not found." };
        }

        if (project.dailyLogs.length > 0) {
            return { success: false, error: "Cannot delete project with registered daily logs." };
        }

        // Disconnect any crews assigned to this project so they aren't deleted/blocked
        await prisma.crew.updateMany({
            where: { projectId: id },
            data: { projectId: null }
        });

        await prisma.project.delete({
            where: { id }
        });

        revalidatePath("/projects");
        revalidatePath("/map");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete project:", error);
        return { success: false, error: "Database delete failed." };
    }
}
