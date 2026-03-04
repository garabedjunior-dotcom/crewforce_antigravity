import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { ProjectRatesTable } from "@/components/projects/project-rates-table";
import { ProjectPieceRatesTable } from "@/components/projects/project-piece-rates-table";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const project = await prisma.project.findUnique({
        where: { id: params.id },
        select: { name: true },
    });

    return {
        title: project ? `Team & Rates — ${project.name} | CrewForce` : "Rates | CrewForce",
    };
}

export default async function ProjectRatesPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const project = await prisma.project.findUnique({
        where: { id: params.id },
    });

    if (!project) notFound();

    // Fetch all active workers who might be on this project
    // For a real app, you might only fetch workers assigned to specific crews on this project
    const allWorkers = await prisma.user.findMany({
        where: {
            role: { in: ['WORKER', 'MANAGER'] },
            isActive: true,
        },
        orderBy: { name: 'asc' }
    });

    const existingRates = await prisma.projectWorkerRate.findMany({
        where: { projectId: params.id }
    });

    const catalogItems = await prisma.payItemCatalog.findMany({
        orderBy: { code: 'asc' }
    });

    const existingPieceRates = await prisma.projectPayItem.findMany({
        where: { projectId: params.id }
    });

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title={`Rates: ${project.name}`} />
            <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-8">
                <div className="max-w-[1440px] mx-auto space-y-6">

                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
                        <ChevronRight size={14} className="text-slate-400" />
                        <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">{project.name}</Link>
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="text-slate-900 dark:text-white">Team & Rates</span>
                    </nav>

                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Team & Rates</h1>
                            <p className="text-slate-500 mt-1 max-w-2xl">
                                Override global pay rates for specific workers on this project.
                                Set a custom hourly/daily rate, or add fixed allowances like Per Diem or Accommodation.
                            </p>
                        </div>
                    </div>

                    <ProjectRatesTable
                        projectId={project.id}
                        workers={allWorkers}
                        existingRates={existingRates}
                    />

                    <ProjectPieceRatesTable
                        projectId={project.id}
                        catalogItems={catalogItems}
                        existingPieceRates={existingPieceRates}
                    />
                </div>
            </div>
        </main>
    );
}
