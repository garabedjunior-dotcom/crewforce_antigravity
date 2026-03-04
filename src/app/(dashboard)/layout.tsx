import { Sidebar } from "@/components/layout/sidebar";
import { auth } from "@/auth";
import { AnimatedLayout } from "@/components/layout/animated-layout";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar user={session?.user} />
            <AnimatedLayout>
                {children}
            </AnimatedLayout>
        </div>
    );
}
