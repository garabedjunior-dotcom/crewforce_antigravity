"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-guard";
import { z } from "zod";
import bcrypt from "bcryptjs";

const companySettingsSchema = z.object({
    companyName: z.string().optional(),
    ownerName: z.string().min(1),
    ownerEmail: z.string().email(),
    timezone: z.string().optional(),
    overtimeThreshold: z.string().optional(),
    payPeriod: z.string().optional(),
});

export async function updateCompanySettings(formData: FormData) {
    await requireAuth(["ADMIN"]);

    const raw = {
        companyName: formData.get("companyName") as string,
        ownerName: formData.get("ownerName") as string,
        ownerEmail: formData.get("ownerEmail") as string,
        timezone: formData.get("timezone") as string,
        overtimeThreshold: formData.get("overtimeThreshold") as string,
        payPeriod: formData.get("payPeriod") as string,
    };

    const validated = companySettingsSchema.parse(raw);

    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (admin) {
        await prisma.user.update({
            where: { id: admin.id },
            data: {
                name: validated.ownerName || admin.name,
                email: validated.ownerEmail || admin.email,
            },
        });
    }

    revalidatePath("/settings");
    revalidatePath("/");
}

const defaultRatesSchema = z.object({
    defaultHourlyRate: z.number().min(0),
    defaultDailyRate: z.number().min(0),
    defaultOtMultiplier: z.number().min(1),
});

export async function updateDefaultRates(formData: FormData) {
    await requireAuth(["ADMIN"]);

    const validated = defaultRatesSchema.parse({
        defaultHourlyRate: parseFloat(formData.get("defaultHourlyRate") as string || "0"),
        defaultDailyRate: parseFloat(formData.get("defaultDailyRate") as string || "0"),
        defaultOtMultiplier: parseFloat(formData.get("defaultOtMultiplier") as string || "1.5"),
    });

    await prisma.user.updateMany({
        where: {
            role: { in: ['WORKER', 'MANAGER'] },
            baseHourlyRate: 0,
        },
        data: {
            baseHourlyRate: validated.defaultHourlyRate,
            dailyRate: validated.defaultDailyRate,
            otMultiplier: validated.defaultOtMultiplier,
        },
    });

    revalidatePath("/settings");
    revalidatePath("/payroll");
}

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export async function changePassword(formData: FormData): Promise<{ error?: string; success?: boolean }> {
    const session = await requireAuth(["ADMIN"]);

    const raw = {
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const result = changePasswordSchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!admin || !admin.password) {
        return { error: "User not found." };
    }

    const isValid = await bcrypt.compare(result.data.currentPassword, admin.password);
    if (!isValid) {
        return { error: "Current password is incorrect." };
    }

    const hashedPassword = await bcrypt.hash(result.data.newPassword, 10);
    await prisma.user.update({
        where: { id: admin.id },
        data: { password: hashedPassword },
    });

    return { success: true };
}
