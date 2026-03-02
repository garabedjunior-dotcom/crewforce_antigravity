import { calculateWeeklyPayroll } from "@/lib/payroll-calculator";
import { NextResponse } from "next/server";
import { requireAuthForApi, isAuthError } from "@/lib/auth-guard";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Only ADMIN and MANAGER can export payroll data
    const authResult = await requireAuthForApi(["ADMIN", "MANAGER"]);
    if (isAuthError(authResult)) return authResult;

    try {
        const { searchParams } = new URL(request.url);
        const startStr = searchParams.get("start");
        const endStr = searchParams.get("end");

        if (!startStr || !endStr) {
            return new Response("Missing start or end date", { status: 400 });
        }

        const startDate = new Date(startStr);
        const endDate = new Date(endStr);

        const payrollResults = await calculateWeeklyPayroll(startDate, endDate);

        // Define CSV Headers formatted for accounting/QuickBooks imports
        const headers = [
            "Worker Name",
            "Crew",
            "Regular Hours",
            "OT Hours",
            "Hourly Rate",
            "Hourly Earnings",
            "Piece Rate Earnings",
            "Per Diem",
            "Accommodation",
            "Total Pay",
            "Payment Method"
        ];

        const rows = payrollResults.map(r => [
            `"${r.workerName}"`,
            `"${r.crewName}"`,
            r.regularHours.toFixed(2),
            r.otHours.toFixed(2),
            r.hourlyRate.toFixed(2),
            r.hourlyEarnings.toFixed(2),
            r.pieceEarnings.toFixed(2),
            r.perDiemTotal.toFixed(2),
            r.accommodationTotal.toFixed(2),
            r.totalPay.toFixed(2),
            `"${r.paymentMethod}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="payroll_export_${startStr}_to_${endStr}.csv"`,
            }
        });
    } catch (error) {
        console.error("Failed to generate CSV:", error);
        return new Response("Error generating CSV", { status: 500 });
    }
}
