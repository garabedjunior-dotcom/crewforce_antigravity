"use client";

import { useState } from "react";
import { updateProjectPieceRate, ProjectPieceRateUpdateData } from "@/app/actions/rate-actions";
import { GitBranch } from "lucide-react";

type PayItemCatalog = {
    id: string;
    code: string;
    description: string;
    rateAmount: number;
    rateUnit: string;
};

type ProjectPayItem = {
    id: string;
    payItemCode: string;
    customRate: number;
};

interface ProjectPieceRatesTableProps {
    projectId: string;
    catalogItems: PayItemCatalog[];
    existingPieceRates: ProjectPayItem[];
}

export function ProjectPieceRatesTable({ projectId, catalogItems, existingPieceRates }: ProjectPieceRatesTableProps) {
    const [savingCode, setSavingCode] = useState<string | null>(null);

    const handleSave = async (payItemCode: string, form: HTMLFormElement) => {
        setSavingCode(payItemCode);
        const formData = new FormData(form);
        const inputVal = formData.get("customRate") as string;

        if (!inputVal) {
            alert("Please enter a valid rate");
            setSavingCode(null);
            return;
        }

        const data: ProjectPieceRateUpdateData = {
            projectId,
            payItemCode,
            customRate: parseFloat(inputVal),
        };

        await updateProjectPieceRate(data);
        setSavingCode(null);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden mt-8">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <GitBranch className="text-primary" size={18} />
                        Rate Card do Projeto (Produção)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Configuração de taxas variáveis da Obra que se sobrepõem ao Catálogo Global.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <tr className="text-[11px] uppercase font-medium text-slate-500 tracking-wider">
                            <th className="px-6 py-4 w-1/4">Código (Atividade)</th>
                            <th className="px-6 py-4 w-1/4">Descrição</th>
                            <th className="px-6 py-4">Valor Padrão (Global)</th>
                            <th className="px-6 py-4">Rate do Projeto ($)</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {catalogItems.map((item) => {
                            const customItem = existingPieceRates.find(r => r.payItemCode === item.code);
                            const isSavingThis = savingCode === item.code;

                            return (
                                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{item.code}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-500 font-medium">{item.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-400 line-through decoration-slate-300">
                                            ${item.rateAmount.toFixed(2)} / {item.rateUnit.replace('per ', '')}
                                        </div>
                                    </td>
                                    <td colSpan={2} className="p-0">
                                        <form
                                            className="grid grid-cols-2 items-center w-full"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSave(item.code, e.currentTarget);
                                            }}
                                        >
                                            <div className="px-6 py-4">
                                                <input
                                                    type="number" step="0.01" name="customRate"
                                                    required
                                                    defaultValue={customItem?.customRate || ""}
                                                    placeholder={item.rateAmount.toString()}
                                                    className="w-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div className="px-6 py-4 text-right">
                                                <button
                                                    type="submit"
                                                    disabled={isSavingThis}
                                                    className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1 ml-auto"
                                                >
                                                    {isSavingThis ? "Salvando..." : (customItem ? "Atualizar Rate" : "Definir Rate")}
                                                </button>
                                            </div>
                                        </form>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
