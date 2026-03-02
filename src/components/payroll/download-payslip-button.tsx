"use client";

import { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import type { PayrollResult } from "@/lib/payroll-calculator";

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 12, color: "#333" },
    header: { flexDirection: "row", justifyContent: "space-between", borderBottom: 2, borderBottomColor: "#ea580c", paddingBottom: 10, marginBottom: 20 },
    companyTitle: { fontSize: 24, fontWeight: "bold", color: "#ea580c" },
    documentTitle: { fontSize: 18, color: "#64748b", marginTop: 5 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 14, fontWeight: "bold", backgroundColor: "#f8fafc", padding: 5, marginBottom: 10, borderBottom: 1, borderBottomColor: "#cbd5e1" },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    bold: { fontWeight: "bold" },
    totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: 2, borderTopColor: "#10b981" },
    totalText: { fontSize: 16, fontWeight: "bold", color: "#10b981" },
    footer: { position: "absolute", bottom: 40, left: 40, right: 40, textAlign: "center", fontSize: 10, color: "#94a3b8", borderTop: 1, borderTopColor: "#e2e8f0", paddingTop: 10 },
    subText: { fontSize: 10, color: "#64748b" }
});

const PayslipDocument = ({ workerData, startDate, endDate }: { workerData: PayrollResult; startDate: string; endDate: string }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.companyTitle}>CrewForce Inc.</Text>
                    <Text style={styles.subText}>Infrastructure OS Portal</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.documentTitle}>PAYSLIP</Text>
                    <Text style={styles.subText}>Period: {startDate} - {endDate}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.row}><Text>Worker Name:</Text><Text style={styles.bold}>{workerData.workerName}</Text></View>
                <View style={styles.row}><Text>Crew Assignment:</Text><Text style={styles.bold}>{workerData.crewName}</Text></View>
                <View style={styles.row}><Text>Payment Rule:</Text><Text>{workerData.paymentMethod}</Text></View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Earnings & Production</Text>
                <View style={styles.row}>
                    <Text>Regular Hours ({workerData.regularHours.toFixed(1)}h @ ${workerData.hourlyRate.toFixed(2)})</Text>
                    <Text>${workerData.hourlyEarnings.toFixed(2)}</Text>
                </View>
                {workerData.otHours > 0 && (
                    <View style={styles.row}>
                        <Text>Overtime Premium ({workerData.otHours.toFixed(1)}h)</Text>
                        <Text>${workerData.otPremium.toFixed(2)}</Text>
                    </View>
                )}
                {workerData.pieceEarnings > 0 && (
                    <View style={styles.row}>
                        <Text>Piece Rate (Production) Earnings</Text>
                        <Text>${workerData.pieceEarnings.toFixed(2)}</Text>
                    </View>
                )}
                {workerData.productionItems.length > 0 && (
                    <View style={{ marginLeft: 15, marginTop: 5, marginBottom: 5 }}>
                        {workerData.productionItems.map((item, idx) => (
                            <View key={idx} style={styles.row}>
                                <Text style={styles.subText}>- {item.code}: {item.quantity} QTY @ ${item.amount.toFixed(2)}</Text>
                                <Text style={styles.subText}>${item.total.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Allowances & Reimbursements</Text>
                <View style={styles.row}>
                    <Text>Per Diem (Project Exceptions)</Text>
                    <Text>${workerData.perDiemTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                    <Text>Accommodation / Travel</Text>
                    <Text>${workerData.accommodationTotal.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalText}>GROSS PAY</Text>
                <Text style={styles.totalText}>${workerData.totalPay.toFixed(2)}</Text>
            </View>

            <View style={{ marginTop: 20 }}>
                <Text style={styles.subText}>
                    * This is a gross pay calculation based on field daily logs and does not include
                    statutory tax deductions. Final net pay may vary after W-2/1099 withholding via QuickBooks.
                </Text>
            </View>

            <View style={styles.footer}>
                <Text>Generated by CrewForce OS automatically. Valid as internal payroll receipt.</Text>
            </View>
        </Page>
    </Document>
);

export function DownloadPayslipButton({ workerData, startDate, endDate }: { workerData: PayrollResult; startDate: string; endDate: string }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null; // Avoid hydration mismatch on the server

    return (
        <PDFDownloadLink
            document={<PayslipDocument workerData={workerData} startDate={startDate} endDate={endDate} />}
            fileName={`Payslip_${workerData.workerName.replace(/\s+/g, '_')}_${startDate.replace(/\//g, '-')}.pdf`}
            className="text-primary hover:text-emerald-600 transition-colors flex items-center justify-end gap-1 font-bold text-sm"
        >
            {/* 
            // @ts-ignore */}
            {({ loading }) => (
                <>
                    <span className="material-symbols-outlined text-[18px]">
                        {loading ? 'hourglass_empty' : 'picture_as_pdf'}
                    </span>
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                </>
            )}
        </PDFDownloadLink>
    );
}
