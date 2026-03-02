"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-guard";
import { z } from "zod";

const projectWorkerRateSchema = z.object({
    workerId: z.string().min(1),
    projectId: z.string().min(1),
    customHourlyRate: z.number().min(0).nullable(),
    customDailyRate: z.number().min(0).nullable(),
    customPieceRate: z.number().min(0).nullable(),
    perDiem: z.number().min(0).nullable(),
    accommodation: z.number().min(0).nullable(),
});

export type ProjectRateUpdateData = z.infer<typeof projectWorkerRateSchema>;

export async function updateProjectWorkerRate(data: unknown) {
    await requireAuth(["ADMIN", "MANAGER"]);
    const validated = projectWorkerRateSchema.parse(data);
    try {
        await prisma.projectWorkerRate.upsert({
            where: {
                workerId_projectId: {
                    workerId: validated.workerId,
                    projectId: validated.projectId,
                }
            },
            update: {
                customHourlyRate: validated.customHourlyRate,
                customDailyRate: validated.customDailyRate,
                customPieceRate: validated.customPieceRate,
                perDiem: validated.perDiem,
                accommodation: validated.accommodation,
            },
            create: {
                workerId: validated.workerId,
                projectId: validated.projectId,
                customHourlyRate: validated.customHourlyRate,
                customDailyRate: validated.customDailyRate,
                customPieceRate: validated.customPieceRate,
                perDiem: validated.perDiem,
                accommodation: validated.accommodation,
            }
        });

        revalidatePath(`/projects/${validated.projectId}/rates`);
        revalidatePath(`/payroll`);
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: "Invalid input data." };
        }
        console.error("Failed to update project worker rate:", error);
        return { success: false, error: "Database update failed." };
    }
}

const projectPieceRateSchema = z.object({
    projectId: z.string().min(1),
    payItemCode: z.string().min(1),
    customRate: z.number().min(0),
});

export type ProjectPieceRateUpdateData = z.infer<typeof projectPieceRateSchema>;

export async function updateProjectPieceRate(data: unknown) {
    await requireAuth(["ADMIN", "MANAGER"]);
    const validated = projectPieceRateSchema.parse(data);
    try {
        await prisma.projectPayItem.upsert({
            where: {
                projectId_payItemCode: {
                    projectId: validated.projectId,
                    payItemCode: validated.payItemCode,
                }
            },
            update: {
                customRate: validated.customRate,
            },
            create: {
                projectId: validated.projectId,
                payItemCode: validated.payItemCode,
                customRate: validated.customRate,
            }
        });

        revalidatePath(`/projects/${validated.projectId}/rates`);
        revalidatePath(`/payroll`);
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: "Invalid input data." };
        }
        console.error("Failed to update project piece rate:", error);
        return { success: false, error: "Database update failed." };
    }
}
