"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateSalary } from "@/engine/salaryCalc";
import { numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function CorporateTemplate({ form }) {
    const T = form.templateColor || "#0D9488";
    const calc = calculateSalary({
        basic: form.basic, hra: form.hra, da: form.da,
        conveyance: form.conveyance, medical: form.medical,
        otherAllowances: form.otherAllowances,
        incomeTax: form.incomeTax, otherDeductions: form.otherDeductions,
    });

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
        header: { background: T, padding: "20 24", textAlign: "center" },
        logo: { height: 36, objectFit: "contain", alignSelf: "center", marginBottom: 8, filter: "brightness(0) invert(1)" },
        companyName: { fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 15, color: "#ffffff", marginBottom: 2 },
        companyDetails: { fontSize: 9, color: "rgba(255,255,255,0.75)", marginBottom: 10 },
        titleBox: { background: "rgba(255,255,255,0.15)", borderRadius: 4, padding: "4 16", alignSelf: "center" },
        title: { fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 16, color: "#ffffff" },
        period: { fontSize: 10, color: "rgba(255,255,255,0.8)", marginTop: 2 },

        main: { padding: "24 24" },
        empGrid: { flexDirection: "row", flexWrap: "wrap", gap: "16 0", padding: 16, backgroundColor: "#F8F9FA", borderRadius: 8, marginBottom: 16 },
        empItem: { width: "33%" },
        label: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2, fontFamily: "Space Grotesk" },
        value: { fontSize: 10, color: "#111827", fontWeight: 700, fontFamily: "Space Grotesk" },

        splitSection: { flexDirection: "row", gap: 16, marginBottom: 16 },
        tableBox: { flex: 1 },
        tableTitle: { fontSize: 10, fontWeight: 700, color: "#ffffff", padding: "6 12", borderTopLeftRadius: 4, borderTopRightRadius: 4, fontFamily: "Space Grotesk" },
        table: { borderWidth: 1, borderColor: "#E5E7EB", borderTopWidth: 0 },
        tr: { flexDirection: "row", justifyContent: "space-between", padding: "8 12", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
        tdLabel: { fontSize: 9, color: "#374151", fontFamily: "Space Grotesk" },
        tdValue: { fontSize: 9, fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk" },

        netPayBox: { backgroundColor: T, borderRadius: 8, padding: "16 20", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
        netAmount: { fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 24, color: "#ffffff" },
        words: { fontSize: 10, color: "#ffffff", fontStyle: "italic", maxWidth: 200, textAlign: "right" },

        bankSection: { marginTop: 16, padding: "12 16", background: "#F8F9FA", borderRadius: 6 },
        bankGrid: { flexDirection: "row", gap: 24 },

        footer: { marginTop: "auto", paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
        footerText: { fontSize: 9, color: "#D1D5DB" },
        signatureBox: { textAlign: "center", minWidth: 120 },
        signatureImage: { height: 36, marginBottom: 4, alignSelf: "center" },
        mgrName: { fontSize: 10, fontWeight: 700, fontFamily: "Space Grotesk" },
        mgrLabel: { fontSize: 8, color: "#9CA3AF", fontFamily: "Space Grotesk" }
    });

    return (
        <Document title={`SalarySlip-${form.employeeName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.companyName}>{form.companyName || "Company Name"}</Text>
                    <Text style={styles.companyDetails}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}</Text>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>SALARY SLIP</Text>
                        <Text style={styles.period}>{form.month} {form.year}</Text>
                    </View>
                </View>

                <View style={styles.main}>
                    <View style={styles.empGrid}>
                        {[
                            ["Employee Name", form.employeeName || "—"],
                            ["Employee ID", form.employeeId || "—"],
                            ["Designation", form.designation || "—"],
                            ["Department", form.department || "—"],
                            ["PAN Number", form.panNumber || "—"],
                            ["PF Number", form.pfNumber || "—"],
                            ["Joining Date", form.joiningDate || "—"],
                            ["Payment Date", form.paymentDate || "—"],
                            ["Working Days", `${form.paidDays} / ${form.workingDays}`],
                        ].map(([l, v]) => (
                            <View key={l} style={styles.empItem}>
                                <Text style={styles.label}>{l}</Text>
                                <Text style={styles.value}>{v}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.splitSection}>
                        <View style={styles.tableBox}>
                            <Text style={[styles.tableTitle, { backgroundColor: T }]}>EARNINGS</Text>
                            <View style={styles.table}>
                                <View style={styles.tr}><Text style={styles.tdLabel}>Basic Salary</Text><Text style={styles.tdValue}>Rs.{parseFloat(form.basic || 0).toLocaleString("en-IN")}</Text></View>
                                <View style={styles.tr}><Text style={styles.tdLabel}>HRA</Text><Text style={styles.tdValue}>Rs.{parseFloat(form.hra || 0).toLocaleString("en-IN")}</Text></View>
                                <View style={styles.tr}><Text style={styles.tdLabel}>DA</Text><Text style={styles.tdValue}>Rs.{parseFloat(form.da || 0).toLocaleString("en-IN")}</Text></View>
                                <View style={styles.tr}><Text style={styles.tdLabel}>Conveyance</Text><Text style={styles.tdValue}>Rs.{parseFloat(form.conveyance || 0).toLocaleString("en-IN")}</Text></View>
                                <View style={styles.tr}><Text style={styles.tdLabel}>Medical Allow.</Text><Text style={styles.tdValue}>Rs.{parseFloat(form.medical || 0).toLocaleString("en-IN")}</Text></View>
                                {form.otherAllowances && <View style={styles.tr}><Text style={styles.tdLabel}>Other Allowances</Text><Text style={styles.tdValue}>Rs.{parseFloat(form.otherAllowances).toLocaleString("en-IN")}</Text></View>}
                                <View style={[styles.tr, { backgroundColor: "#F9FAFB" }]}><Text style={[styles.tdLabel, { fontWeight: 700 }]}>Gross Pay</Text><Text style={[styles.tdValue, { fontWeight: 700 }]}>Rs.{parseFloat(calc.grossSalary).toLocaleString("en-IN")}</Text></View>
                            </View>
                        </View>
                        <View style={styles.tableBox}>
                            <Text style={[styles.tableTitle, { backgroundColor: "#EF4444" }]}>DEDUCTIONS</Text>
                            <View style={styles.table}>
                                <View style={styles.tr}><Text style={styles.tdLabel}>Employee PF</Text><Text style={styles.tdValue}>Rs.{parseFloat(calc.employeePF).toLocaleString("en-IN")}</Text></View>
                                <View style={styles.tr}><Text style={styles.tdLabel}>Professional Tax</Text><Text style={styles.tdValue}>Rs.{parseFloat(calc.professionalTax).toLocaleString("en-IN")}</Text></View>
                                {parseFloat(calc.esi) > 0 && <View style={styles.tr}><Text style={styles.tdLabel}>ESI</Text><Text style={styles.tdValue}>Rs.{parseFloat(calc.esi).toLocaleString("en-IN")}</Text></View>}
                                {parseFloat(calc.incomeTax) > 0 && <View style={styles.tr}><Text style={styles.tdLabel}>Income Tax (TDS)</Text><Text style={styles.tdValue}>Rs.{parseFloat(calc.incomeTax).toLocaleString("en-IN")}</Text></View>}
                                {parseFloat(calc.otherDeductions) > 0 && <View style={styles.tr}><Text style={styles.tdLabel}>Other Deductions</Text><Text style={styles.tdValue}>Rs.{parseFloat(calc.otherDeductions).toLocaleString("en-IN")}</Text></View>}
                                <View style={[styles.tr, { backgroundColor: "#FEF2F2" }]}><Text style={[styles.tdLabel, { fontWeight: 700 }]}>Total Ded.</Text><Text style={[styles.tdValue, { fontWeight: 700 }]}>Rs.{parseFloat(calc.totalDeductions).toLocaleString("en-IN")}</Text></View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.netPayBox}>
                        <View>
                            <Text style={[styles.label, { color: "rgba(255,255,255,0.7)" }]}>Net Pay</Text>
                            <Text style={styles.netAmount}>Rs.{parseFloat(calc.netSalary).toLocaleString("en-IN")}</Text>
                        </View>
                        <Text style={styles.words}>{numberToWords(Math.floor(calc.netSalary))} Only</Text>
                    </View>

                    {(form.bankName || form.accountNumber) && (
                        <View style={styles.bankSection}>
                            <Text style={[styles.label, { color: "#9CA3AF", marginBottom: 8, fontWeight: 700 }]}>Bank Details</Text>
                            <View style={styles.bankGrid}>
                                {form.bankName && <View><Text style={styles.label}>Bank</Text><Text style={styles.value}>{form.bankName}</Text></View>}
                                {form.accountNumber && <View><Text style={styles.label}>Account</Text><Text style={styles.value}>{"XXXX" + form.accountNumber.slice(-4)}</Text></View>}
                                {form.ifscCode && <View><Text style={styles.label}>IFSC</Text><Text style={styles.value}>{form.ifscCode}</Text></View>}
                            </View>
                        </View>
                    )}

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerText}>Generated by DocMinty.com</Text>
                        <View style={styles.signatureBox}>
                            {form.signature ? (
                                <Image src={form.signature} style={styles.signatureImage} />
                            ) : (
                                <View style={{ height: 36, borderBottomWidth: 1, borderBottomColor: "#374151", marginBottom: 4 }} />
                            )}
                            <Text style={styles.mgrName}>{form.hrManagerName || "HR Manager"}</Text>
                            <Text style={styles.mgrLabel}>Authorized Signatory</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}