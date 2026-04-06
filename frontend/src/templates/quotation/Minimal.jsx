"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

const COL = {
    n: { width: "5%" },
    desc: { width: "40%" },
    hsn: { width: "10%" },
    qty: { width: "10%" },
    rate: { width: "12%" },
    gst: { width: "8%" },
    amt: { width: "15%" },
};

export default function MinimalTemplate({ form }) {
    const T = form.templateColor || "#0D9488";
    const calc = calculateLineItems(form.items, form.taxType === "igst");
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
        topStripe: { height: 4, backgroundColor: T },
        header: { padding: "24 24", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between" },
        headerLeft: { maxWidth: "60%" },
        headerRight: { textAlign: "right" },
        logo: { height: 48, objectFit: "contain", marginBottom: 8 },
        fromName: { fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 16, color: "#111827" },
        fromDetails: { fontSize: 11, color: "#6B7280", marginTop: 4, lineHeight: 1.4 },
        title: { fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 22, color: "#111827" },
        quoteNum: { fontSize: 12, color: "#6B7280", marginTop: 4 },
        metaBox: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },
        
        main: { padding: "24 24" },
        billSection: { flexDirection: "row", gap: 24, marginBottom: 20 },
        billCol: { flex: 1 },
        billLabel: { fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "Space Grotesk" },
        clientName: { fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk" },
        clientDetails: { fontSize: 11, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
        
        tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 8, marginBottom: 8 },
        thText: { fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" },
        tableRow: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", alignItems: "center" },
        tdText: { fontSize: 9, color: "#374151" },
        
        totalsWrapper: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
        totalsBox: { width: 180 },
        totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
        totalLabel: { fontSize: 10, color: "#6B7280" },
        totalValue: { fontSize: 10, color: "#374151", fontWeight: 600 },
        grandTotalRow: { flexDirection: "row", justifyContent: "space-between", padding: "8 12", borderTopWidth: 2, borderTopColor: "#E5E7EB", marginTop: 6 },
        grandTotalLabel: { fontSize: 12, fontWeight: 700, color: T },
        
        wordsBox: { marginTop: 16, padding: "10 14", backgroundColor: "#F8F9FA", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: T },
        wordsLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
        wordsText: { fontSize: 11, color: "#374151", fontStyle: "italic" },

        footerNote: { marginTop: 20, flexDirection: "row", gap: 16 },
        noteBox: { flex: 1 },
        noteLabel: { fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Space Grotesk" },
        noteText: { fontSize: 11, color: "#6B7280", lineHeight: 1.6 },
        
        footer: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
        footerText: { fontSize: 10, color: "#D1D5DB" },
        signatureBox: { textAlign: "right", width: 140 },
        signatureImage: { height: 45, maxWidth: 140, marginBottom: 4, alignSelf: "flex-end" },
        signatureLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4 },
        signatureLabel: { fontSize: 10, color: "#9CA3AF" }
    });

    return (
        <Document title={`Quotation-${form.quoteNumber}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.topStripe} />
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.fromName}>{form.fromName || "Your Business Name"}</Text>
                        <Text style={styles.fromDetails}>
                            {form.fromGSTIN && `GSTIN: ${form.fromGSTIN}\n`}
                            {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{"\n"}
                            {fromState && fromState.name}
                            {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? `Ph: ${form.fromPhone}` : ""} ${form.fromEmail ? `Em: ${form.fromEmail}` : ""}`}
                        </Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.title}>Quotation</Text>
                        <Text style={styles.quoteNum}>#{form.quoteNumber}</Text>
                        <View style={styles.metaBox}>
                            <Text>Date: {form.quoteDate}</Text>
                            {form.validUntil && <Text>Valid: {form.validUntil}</Text>}
                        </View>
                    </View>
                </View>

                <View style={styles.main}>
                    <View style={styles.billSection}>
                        <View style={styles.billCol}>
                            <Text style={styles.billLabel}>Quote For</Text>
                            <Text style={styles.clientName}>{form.toName || "Client Name"}</Text>
                            <Text style={styles.clientDetails}>
                                {form.toGSTIN && `GSTIN: ${form.toGSTIN}\n`}
                                {form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}{"\n"}
                                {toState && toState.name}
                                {(form.toPhone || form.toEmail) && `\n${form.toPhone ? `Ph: ${form.toPhone}` : ""} ${form.toEmail ? `Em: ${form.toEmail}` : ""}`}
                            </Text>
                        </View>
                        <View style={styles.billCol}>
                            <Text style={styles.billLabel}>Tax Type</Text>
                            <Text style={{ fontSize: 12, color: "#374151" }}>
                                {form.taxType === "cgst_sgst" ? "CGST + SGST (Intrastate)" : form.taxType === "igst" ? "IGST (Interstate)" : "No Tax"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={[styles.thText, COL.n]}>#</Text>
                        <Text style={[styles.thText, COL.desc]}>Description</Text>
                        {form.showHSN && <Text style={[styles.thText, COL.hsn]}>HSN</Text>}
                        <Text style={[styles.thText, COL.qty]}>Qty</Text>
                        <Text style={[styles.thText, COL.rate]}>Rate</Text>
                        <Text style={[styles.thText, COL.gst]}>GST%</Text>
                        <Text style={[styles.thText, COL.amt, { textAlign: "right" }]}>Amount</Text>
                    </View>

                    {calc.items.map((item, i) => (
                        <View key={i} style={styles.tableRow} wrap={false}>
                            <Text style={[styles.tdText, COL.n]}>{i + 1}</Text>
                            <Text style={[styles.tdText, COL.desc]}>{item.description || "—"}</Text>
                            {form.showHSN && <Text style={[styles.tdText, COL.hsn]}>{item.hsn || "—"}</Text>}
                            <Text style={[styles.tdText, COL.qty]}>{item.qty}</Text>
                            <Text style={[styles.tdText, COL.rate]}>Rs.{item.rate}</Text>
                            <Text style={[styles.tdText, COL.gst]}>{item.gstRate}%</Text>
                            <Text style={[styles.tdText, COL.amt, { textAlign: "right", fontWeight: 700 }]}>Rs.{item.amount}</Text>
                        </View>
                    ))}

                    <View style={styles.totalsWrapper} wrap={false}>
                        <View style={styles.totalsBox}>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Subtotal</Text>
                                <Text style={styles.totalValue}>Rs.{calc.subtotal}</Text>
                            </View>
                            {form.taxType === "cgst_sgst" && (
                                <>
                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>CGST</Text>
                                        <Text style={styles.totalValue}>Rs.{calc.totalCGST}</Text>
                                    </View>
                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>SGST</Text>
                                        <Text style={styles.totalValue}>Rs.{calc.totalSGST}</Text>
                                    </View>
                                </>
                            )}
                            {form.taxType === "igst" && (
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>IGST</Text>
                                    <Text style={styles.totalValue}>Rs.{calc.totalIGST}</Text>
                                </View>
                            )}
                            <View style={styles.grandTotalRow}>
                                <Text style={[styles.grandTotalLabel, { color: "#111827" }]}>Total</Text>
                                <Text style={styles.grandTotalLabel}>Rs.{calc.grandTotal}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.wordsBox} wrap={false}>
                        <Text style={styles.wordsLabel}>Amount in Words</Text>
                        <Text style={styles.wordsText}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
                    </View>

                    {(form.notes || form.terms) && (
                        <View style={styles.footerNote} wrap={false}>
                            {form.notes && (
                                <View style={styles.noteBox}>
                                    <Text style={styles.noteLabel}>Notes</Text>
                                    <Text style={styles.noteText}>{form.notes}</Text>
                                </View>
                            )}
                            {form.terms && (
                                <View style={styles.noteBox}>
                                    <Text style={styles.noteLabel}>Terms</Text>
                                    <Text style={styles.noteText}>{form.terms}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerText}>Generated by DocMinty.com</Text>
                        <View style={styles.signatureBox}>
                            {form.signature && <Image src={form.signature} style={styles.signatureImage} />}
                            <View style={styles.signatureLine}>
                                <Text style={styles.signatureLabel}>Authorised Signatory</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}