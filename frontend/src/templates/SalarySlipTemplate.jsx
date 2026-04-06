"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateSalary } from "@/engine/salaryCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

const T = "#0D9488";

const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
    header: { backgroundColor: T, padding: "20 40", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    logo: { width: 50, height: 35, objectFit: "contain", marginBottom: 6 },
    compName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#ffffff" },
    compAddr: { fontSize: 9, color: "rgba(255,255,255,0.8)", marginTop: 2 },
    slipTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#ffffff", textAlign: "right" },
    slipMonth: { fontSize: 12, color: "rgba(255,255,255,0.8)", textAlign: "right", marginTop: 4 },
    body: { padding: "20 40" },
    empGrid: { flexDirection: "row", flexWrap: "wrap", backgroundColor: "#F8F9FA", padding: "12 16", borderRadius: 6, marginBottom: 16 },
    empItem: { width: "25%", marginBottom: 8 },
    empLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
    empValue: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" },
    earnH: { backgroundColor: T, padding: "6 10", borderTopLeftRadius: 4, borderTopRightRadius: 4 },
    dedH: { backgroundColor: "#EF4444", padding: "6 10", borderTopLeftRadius: 4, borderTopRightRadius: 4 },
    sectionHT: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#ffffff", textTransform: "uppercase", letterSpacing: 1 },
    tRow: { flexDirection: "row", justifyContent: "space-between", padding: "5 10", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    rowLabel: { fontSize: 9, color: "#374151" },
    rowValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
    grossRow: { flexDirection: "row", justifyContent: "space-between", padding: "7 10", backgroundColor: "#F0FDFA" },
    grossL: { fontSize: 10, fontFamily: "Helvetica-Bold", color: T },
    dedTotR: { flexDirection: "row", justifyContent: "space-between", padding: "7 10", backgroundColor: "#FEF2F2" },
    dedTotL: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#EF4444" },
    netBox: { backgroundColor: "#134E4A", padding: "16 20", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 8, marginTop: 16 },
    netLabel: { fontSize: 9, color: "#99F6E4", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    netAmt: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#ffffff" },
    netWords: { fontSize: 9, color: "#99F6E4", fontStyle: "italic", maxWidth: 200, textAlign: "right" },
    bankBox: { backgroundColor: "#F8F9FA", padding: "10 14", borderRadius: 6, marginTop: 12 },
    bankLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    bankGrid: { flexDirection: "row" },
    bankItem: { flex: 1 },
    bankKey: { fontSize: 8, color: "#9CA3AF", marginBottom: 2 },
    bankVal: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
    footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footerG: { fontSize: 8, color: "#D1D5DB" },
    signBox: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120, textAlign: "center" },
    signT: { fontSize: 8, color: "#9CA3AF" },
});

export default function SalarySlipTemplate({ form }) {
    const calc = calculateSalary({
        basic: form.basic, hra: form.hra, da: form.da,
        conveyance: form.conveyance, medical: form.medical,
        otherAllowances: form.otherAllowances,
        incomeTax: form.incomeTax, otherDeductions: form.otherDeductions,
    });
    const state = INDIAN_STATES.find(s => s.code === form.companyState);
    const fmt = (n) => "Rs. " + parseFloat(n).toLocaleString("en-IN");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.compName}>{form.companyName || "Company"}</Text>
                        {form.companyAddress && <Text style={styles.compAddr}>{form.companyAddress + (form.companyCity ? ", " + form.companyCity : "")}</Text>}
                        {state && <Text style={styles.compAddr}>{state.name}</Text>}
                    </View>
                    <View>
                        <Text style={styles.slipTitle}>SALARY SLIP</Text>
                        <Text style={styles.slipMonth}>{form.month + " " + form.year}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <View style={styles.empGrid}>
                        {[
                            ["Employee Name", form.employeeName || "—"],
                            ["Employee ID", form.employeeId || "—"],
                            ["Designation", form.designation || "—"],
                            ["Department", form.department || "—"],
                            ["PAN Number", form.panNumber || "—"],
                            ["PF Number", form.pfNumber || "—"],
                            ["Payment Date", form.paymentDate || "—"],
                            ["Working Days", (form.paidDays || "0") + "/" + (form.workingDays || "0")],
                        ].map(([l, v]) => (
                            <View key={l} style={styles.empItem}>
                                <Text style={styles.empLabel}>{l}</Text>
                                <Text style={styles.empValue}>{v}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.earnH}><Text style={styles.sectionHT}>Earnings</Text></View>
                            {[
                                ["Basic Salary", fmt(form.basic || 0)],
                                ["HRA", fmt(form.hra || 0)],
                                ["DA", fmt(form.da || 0)],
                                ["Conveyance", fmt(form.conveyance || 0)],
                                ["Medical Allow.", fmt(form.medical || 0)],
                                ...(form.otherAllowances ? [["Other Allow.", fmt(form.otherAllowances)]] : []),
                            ].map(([l, v]) => (
                                <View key={l} style={styles.tRow}>
                                    <Text style={styles.rowLabel}>{l}</Text>
                                    <Text style={styles.rowValue}>{v}</Text>
                                </View>
                            ))}
                            <View style={styles.grossRow}>
                                <Text style={styles.grossL}>Gross Salary</Text>
                                <Text style={styles.grossL}>{fmt(calc.grossSalary)}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={styles.dedH}><Text style={styles.sectionHT}>Deductions</Text></View>
                            {[
                                ["Employee PF", fmt(calc.employeePF)],
                                ["Professional Tax", fmt(calc.professionalTax)],
                                ...(parseFloat(calc.esi) > 0 ? [["ESI", fmt(calc.esi)]] : []),
                                ...(parseFloat(calc.incomeTax) > 0 ? [["Income Tax (TDS)", fmt(calc.incomeTax)]] : []),
                                ...(parseFloat(calc.otherDeductions) > 0 ? [["Other Deductions", fmt(calc.otherDeductions)]] : []),
                            ].map(([l, v]) => (
                                <View key={l} style={styles.tRow}>
                                    <Text style={styles.rowLabel}>{l}</Text>
                                    <Text style={[styles.rowValue, { color: "#EF4444" }]}>{v}</Text>
                                </View>
                            ))}
                            <View style={styles.dedTotR}>
                                <Text style={styles.dedTotL}>Total Deductions</Text>
                                <Text style={styles.dedTotL}>{fmt(calc.totalDeductions)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.netBox}>
                        <View>
                            <Text style={styles.netLabel}>Net Pay</Text>
                            <Text style={styles.netAmt}>{fmt(calc.netSalary)}</Text>
                        </View>
                        <Text style={styles.netWords}>
                            {"Rupees " + Math.floor(parseFloat(calc.netSalary)).toLocaleString("en-IN") + " Only"}
                        </Text>
                    </View>

                    {(form.bankName || form.accountNumber) && (
                        <View style={styles.bankBox}>
                            <Text style={styles.bankLabel}>Bank Details</Text>
                            <View style={styles.bankGrid}>
                                {[["Bank", form.bankName], ["Account", form.accountNumber], ["IFSC", form.ifscCode]].map(([l, v]) => v ? (
                                    <View key={l} style={styles.bankItem}>
                                        <Text style={styles.bankKey}>{l}</Text>
                                        <Text style={styles.bankVal}>{v}</Text>
                                    </View>
                                ) : null)}
                            </View>
                        </View>
                    )}

                    <View style={styles.footer}>
                        <Text style={styles.footerG}>Generated by DocMinty.com</Text>
                        <View style={styles.signBox}><Text style={styles.signT}>HR Manager</Text></View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}