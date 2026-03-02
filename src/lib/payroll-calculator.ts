import prisma from "@/lib/prisma";

export interface PayrollResult {
    workerId: string;
    workerName: string;
    crewName: string;

    // Time & Hourly
    totalHours: number;
    regularHours: number;
    otHours: number;
    hourlyRate: number;
    hourlyEarnings: number;

    // Piece Rate
    pieceEarnings: number;
    productionItems: { code: string; quantity: number; amount: number; total: number }[];

    // Adjustments & Final
    otPremium: number;
    perDiemTotal: number;
    accommodationTotal: number;
    minGuaranteeApplied: boolean;
    totalPay: number;
    paymentMethod: "Piece Rate + OT" | "Hourly Min Guarantee" | "Daily Min Guarantee" | "Hourly Only" | "Piece Rate Only";
}

/**
 * Groups an array of items by a key property into a Map.
 */
function groupBy<T>(items: T[], key: keyof T): Map<string, T[]> {
    const map = new Map<string, T[]>();
    for (const item of items) {
        const k = String(item[key]);
        const group = map.get(k);
        if (group) {
            group.push(item);
        } else {
            map.set(k, [item]);
        }
    }
    return map;
}

/**
 * Calculates the weekly payroll for all active workers based on the exact rules from the spreadsheet.
 * Optimized: uses batch queries instead of per-worker N+1 queries.
 */
export async function calculateWeeklyPayroll(startDate: Date, endDate: Date): Promise<PayrollResult[]> {
    // Batch query 1: All active workers
    const workers = await prisma.user.findMany({
        where: { role: 'WORKER', isActive: true },
        include: { crew: true, projectRates: true }
    });

    const workerIds = workers.map(w => w.id);

    // Batch query 2: All timecards for all workers in period
    const allTimecards = await prisma.timecard.findMany({
        where: {
            workerId: { in: workerIds },
            checkIn: { gte: startDate, lte: endDate }
        }
    });

    // Batch query 3: All daily logs for all workers in period
    const allDailyLogs = await prisma.dailyLog.findMany({
        where: {
            workerId: { in: workerIds },
            dateReported: { gte: startDate, lte: endDate }
        },
        include: {
            productionLogs: {
                include: { payItem: true }
            }
        }
    });

    // Group by workerId for O(1) lookup
    const timecardsByWorker = groupBy(allTimecards, "workerId");
    const dailyLogsByWorker = groupBy(allDailyLogs, "workerId");

    // Batch query 4: All project pay items for relevant projects
    const distinctProjectIds = [...new Set(allDailyLogs.map(log => log.projectId))];
    const allProjectPieceRates = await prisma.projectPayItem.findMany({
        where: { projectId: { in: distinctProjectIds } }
    });

    const results: PayrollResult[] = [];

    for (const worker of workers) {
        const timecards = timecardsByWorker.get(worker.id) || [];
        const dailyLogs = dailyLogsByWorker.get(worker.id) || [];

        // 1. Calculate hours from timecards
        let totalHours = 0;
        timecards.forEach(tc => {
            if (tc.totalHours) totalHours += tc.totalHours;
        });

        const regularHours = totalHours > 40 ? 40 : totalHours;
        const otHours = totalHours > 40 ? totalHours - 40 : 0;
        const hourlyEarnings = (regularHours * worker.baseHourlyRate) + (otHours * worker.baseHourlyRate * worker.otMultiplier);

        // 2. Calculate Piece Rate from production logs
        const workerProjectIds = [...new Set(dailyLogs.map(log => log.projectId))];
        const projectPieceRates = allProjectPieceRates.filter(r => workerProjectIds.includes(r.projectId));

        let pieceEarnings = 0;
        const productionItemsMap: Record<string, { code: string; quantity: number; amount: number; total: number }> = {};

        dailyLogs.forEach(log => {
            log.productionLogs.forEach(prod => {
                const customRateRecord = projectPieceRates.find(r => r.projectId === log.projectId && r.payItemCode === prod.payItemCode);
                const activeRate = customRateRecord ? customRateRecord.customRate : prod.payItem.rateAmount;

                if (!productionItemsMap[prod.payItemCode]) {
                    productionItemsMap[prod.payItemCode] = {
                        code: prod.payItemCode,
                        quantity: 0,
                        amount: activeRate,
                        total: 0
                    };
                }
                const pInfo = productionItemsMap[prod.payItemCode];
                pInfo.quantity += prod.quantity;
                const earned = prod.quantity * activeRate;
                pInfo.total += earned;
                pieceEarnings += earned;
            });
        });

        const productionItemsList = Object.values(productionItemsMap);

        // 3. Calculate Daily Guarantees and Allowances
        let dailyGuaranteeEarnings = 0;
        let perDiemTotal = 0;
        let accommodationTotal = 0;

        const daysWorkedMap: Record<string, { fraction: number; projectId?: string }> = {};

        timecards.forEach(tc => {
            const dStr = tc.checkIn.toDateString();
            const frac = tc.totalHours && tc.totalHours <= 4 ? 0.5 : 1.0;
            if (!daysWorkedMap[dStr] || frac > daysWorkedMap[dStr].fraction) {
                daysWorkedMap[dStr] = { fraction: frac };
            }
        });

        dailyLogs.forEach(log => {
            const dStr = log.dateReported.toDateString();
            const frac = log.dayFraction || 1.0;
            if (!daysWorkedMap[dStr] || frac > daysWorkedMap[dStr].fraction) {
                daysWorkedMap[dStr] = { fraction: frac, projectId: log.projectId };
            }
        });

        Object.values(daysWorkedMap).forEach(d => {
            let activeDailyRate = worker.dailyRate;
            let activePerDiem = 0;
            let activeAccom = 0;

            if (d.projectId) {
                const customRate = worker.projectRates.find(r => r.projectId === d.projectId);
                if (customRate) {
                    if (customRate.customDailyRate !== null) activeDailyRate = customRate.customDailyRate;
                    if (customRate.perDiem !== null) activePerDiem = customRate.perDiem;
                    if (customRate.accommodation !== null) activeAccom = customRate.accommodation;
                }
            }

            dailyGuaranteeEarnings += (d.fraction * activeDailyRate);
            perDiemTotal += (d.fraction * activePerDiem);
            accommodationTotal += (d.fraction * activeAccom);
        });

        // 4. Apply the comparison logic
        let totalPay = 0;
        let otPremium = 0;
        let paymentMethod: PayrollResult["paymentMethod"] = "Hourly Only";
        let minGuaranteeApplied = false;

        let guaranteeEarnings = 0;
        let guaranteeType: "Daily" | "Hourly" | "None" = "None";

        if (worker.minDailyGuarantee) {
            guaranteeEarnings = dailyGuaranteeEarnings;
            guaranteeType = "Daily";
        } else if (worker.minHourlyGuarantee) {
            guaranteeEarnings = hourlyEarnings;
            guaranteeType = "Hourly";
        }

        if (worker.pieceRateEnabled && pieceEarnings > 0) {
            if (guaranteeType !== "None") {
                if (pieceEarnings >= guaranteeEarnings) {
                    totalPay = pieceEarnings;

                    if (otHours > 0 && guaranteeType === "Hourly") {
                        const effectiveHourlyRate = pieceEarnings / totalHours;
                        otPremium = effectiveHourlyRate * 0.5 * otHours;
                        totalPay += otPremium;
                        paymentMethod = "Piece Rate + OT";
                    } else {
                        paymentMethod = "Piece Rate Only";
                    }
                } else {
                    totalPay = guaranteeEarnings;
                    minGuaranteeApplied = true;
                    paymentMethod = guaranteeType === "Daily" ? "Daily Min Guarantee" : "Hourly Min Guarantee";
                }
            } else {
                totalPay = pieceEarnings;
                paymentMethod = "Piece Rate Only";
            }
        } else {
            totalPay = guaranteeEarnings;
            minGuaranteeApplied = true;
            paymentMethod = guaranteeType === "Daily" ? "Daily Min Guarantee" : "Hourly Only";
        }

        totalPay += perDiemTotal + accommodationTotal;

        results.push({
            workerId: worker.id,
            workerName: worker.name || "Unknown Worker",
            crewName: worker.crew?.name || "No Crew",
            totalHours,
            regularHours,
            otHours,
            hourlyRate: worker.minDailyGuarantee ? worker.dailyRate : worker.baseHourlyRate,
            hourlyEarnings: worker.minDailyGuarantee ? dailyGuaranteeEarnings : hourlyEarnings,
            pieceEarnings,
            productionItems: productionItemsList,
            otPremium,
            perDiemTotal,
            accommodationTotal,
            minGuaranteeApplied,
            totalPay,
            paymentMethod
        });
    }

    return results;
}
