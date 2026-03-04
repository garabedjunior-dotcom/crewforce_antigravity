"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-guard";
import { z } from "zod";

const workerUpdateSchema = z.object({
    name: z.string().nullable().optional(),
    email: z.union([z.string().email(), z.literal(""), z.null()]).optional(),
    employeeType: z.enum(["W2", "1099"]),
    baseHourlyRate: z.number().min(0),
    dailyRate: z.number().min(0),
    otMultiplier: z.number().min(1),
    minHourlyGuarantee: z.boolean(),
    minDailyGuarantee: z.boolean(),
    pieceRateEnabled: z.boolean(),
    crewId: z.string().nullable(),
    telegramChatId: z.string().nullable().optional(),
    jobTitle: z.string().nullable().optional(),
});

export type WorkerUpdateData = z.infer<typeof workerUpdateSchema>;

const createWorkerSchema = z.object({
    name: z.string().min(1, "Worker name is required.").trim(),
    role: z.enum(["WORKER", "MANAGER"]),
    crewId: z.string().optional(),
    telegramChatId: z.string().optional(),
});

export async function createWorker(formData: FormData) {
    await requireAuth(["ADMIN", "MANAGER"]);

    const validated = createWorkerSchema.parse({
        name: formData.get("name"),
        role: formData.get("role"),
        crewId: formData.get("crewId") || undefined,
        telegramChatId: formData.get("telegramChatId") || undefined,
    });

    await prisma.user.create({
        data: {
            name: validated.name,
            role: validated.role,
            ...(validated.crewId && validated.crewId !== "none" ? { crewId: validated.crewId } : {}),
            ...(validated.telegramChatId ? { telegramChatId: validated.telegramChatId } : {}),
        },
    });

    revalidatePath("/crews");
    redirect("/crews");
}

export async function updateWorkerSettings(workerId: string, data: unknown) {
    await requireAuth(["ADMIN", "MANAGER"]);
    try {
        const validated = workerUpdateSchema.parse(data);

        await prisma.user.update({
            where: { id: workerId },
            data: {
                name: validated.name,
                email: validated.email === "" ? null : validated.email,
                employeeType: validated.employeeType,
                baseHourlyRate: validated.baseHourlyRate,
                dailyRate: validated.dailyRate,
                otMultiplier: validated.otMultiplier,
                minHourlyGuarantee: validated.minHourlyGuarantee,
                minDailyGuarantee: validated.minDailyGuarantee,
                pieceRateEnabled: validated.pieceRateEnabled,
                crewId: validated.crewId || null,
                telegramChatId: validated.telegramChatId || null,
                jobTitle: validated.jobTitle || null,
            },
        });

        revalidatePath("/crews");
        revalidatePath("/payroll");
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error:", error.issues);
            return { success: false, error: "Invalid input data." };
        }
        console.error("Failed to update worker settings:", error);
        return { success: false, error: "Database update failed." };
    }
}

const workerIdSchema = z.string().min(1, "Invalid worker ID.");

export async function archiveWorker(workerId: string) {
    await requireAuth(["ADMIN", "MANAGER"]);
    const validId = workerIdSchema.parse(workerId);
    try {
        await prisma.user.update({
            where: { id: validId },
            data: { isActive: false, crewId: null, telegramChatId: null }
        });
        revalidatePath("/crews");
        revalidatePath("/payroll");
        return { success: true };
    } catch (error) {
        console.error("Failed to archive worker:", error);
        return { success: false, error: "Database update failed." };
    }
}
