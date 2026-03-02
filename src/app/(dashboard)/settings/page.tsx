import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import { FadeIn } from "@/components/ui/fade-in";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
    });

    const totalWorkers = await prisma.user.count({
        where: { role: { in: ['WORKER', 'MANAGER'] } },
    });

    const workersWithNoRate = await prisma.user.count({
        where: {
            role: { in: ['WORKER', 'MANAGER'] },
            baseHourlyRate: 0,
        },
    });

    // Check integrations
    const hasTelegram = !!process.env.TELEGRAM_BOT_TOKEN;
    const hasAuth = !!process.env.NEXTAUTH_SECRET;
    const hasDB = !!process.env.DATABASE_URL;

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Settings" />
            <div className="flex-1 overflow-y-auto px-4 py-8 md:p-8">
                <div className="max-w-3xl mx-auto space-y-6">

                    <FadeIn delay={0.1}>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h1>
                        <p className="text-slate-500 mt-1">Manage your account, integrations, and system configuration.</p>
                    </FadeIn>

                    <FadeIn delay={0.15}>
                        <SettingsForm
                            admin={{
                                name: admin?.name || null,
                                email: admin?.email || null,
                                telegramChatId: admin?.telegramChatId || null,
                                baseHourlyRate: admin?.baseHourlyRate || 0,
                                dailyRate: admin?.dailyRate || 0,
                                otMultiplier: admin?.otMultiplier || 1.5,
                            }}
                            integrations={{
                                database: hasDB,
                                telegram: hasTelegram,
                                auth: hasAuth,
                            }}
                            stats={{
                                totalWorkers,
                                workersWithNoRate,
                            }}
                        />
                    </FadeIn>
                </div>
            </div>
        </main>
    );
}
