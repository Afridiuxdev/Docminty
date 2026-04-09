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

export default function CorporateTemplate({ form }) {
    const T = form.templateColor || "#0D9488";
    const calc = calculateLineItems(form.items, form.taxType === "igst");
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
        header: { textAlign: "center", padding: "20 24 16", borderBottomWidth: 3, borderBottomColor: T },
        logo: { height: 40, objectFit: "contain", marginBottom: 8, alignSelf: "center" },
        fromName: { fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 20, color: T, marginBottom: 2, letterSpacing: 0.5 },
        fromDetails: { fontSize: 10, color: "#6B7280", lineHeight: 1.5, maxWidth: 500, alignSelf: "center" },
        metaRow: { flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 8 },
        metaItem: { fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8 },
        
        main: { padding: "24 24" },
        billSection: { flexDirection: "row", gap: 24, marginBottom: 24, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 16 },
        billCol: { flex: 1 },
        billLabel: { fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "Space Grotesk" },
        clientName: { fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk" },
        clientDetails: { fontSize: 10, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
        
        tableHeader: { flexDirection: "row", backgroundColor: "#F9FAFB", padding: "8 12", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", borderRadius: 4, marginBottom: 8 },
        thText: { fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontFamily: "Space Grotesk" },
        tableRow: { flexDirection: "row", padding: "8 12", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", alignItems: "center" },
        tdText: { fontSize: 9, color: "#374151" },
        
        totalsWrapper: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
        totalsBox: { width: 200 },
        totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
        totalLabel: { fontSize: 10, color: "#6B7280" },
        totalValue: { fontSize: 10, color: "#374151", fontWeight: 600 },
        grandTotalRow: { flexDirection: "row", justifyContent: "space-between", padding: "8 12", borderTopWidth: 2, borderTopColor: "#E5E7EB", marginTop: 6 },
        grandTotalLabel: { fontSize: 12, fontWeight: 700, color: T },
        
        wordsBox: { marginTop: 16, padding: "10 14", backgroundColor: "#F8F9FA", borderRadius: 6, borderLeftWidth: 4, borderLeftColor: T },
        wordsLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
        wordsText: { fontSize: 10, color: "#374151", fontStyle: "italic" },
        
        notesSection: { flexDirection: "row", gap: 20, marginTop: 24 },
        notesBox: { flex: 1 },
        notesLabel: { fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Space Grotesk" },
        notesText: { fontSize: 10, color: "#6B7280", lineHeight: 1.6 },
        
        footer: { marginTop: "auto", padding: "20 24", borderTopWidth: 1, borderTopColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
        footerText: { fontSize: 9, color: "#D1D5DB" },
        signatureBox: { textAlign: "right", width: 140 },
        signatureImage: { height: 45, maxWidth: 140, marginBottom: 4, alignSelf: "center" },
        signatureLine: { borderTopWidth: 1.5, borderTopColor: "#374151", paddingTop: 4 },
        signatureLabel: { fontSize: 9, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase" }
    });

    return (
        <Document title={`Quotation-${form.quoteNumber}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.fromName}>{form.fromName || "Your Business Name"}</Text>
                    <Text style={styles.fromDetails}>
                        {form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromState && fromState.name}
                        {"\n"}
                        {(form.fromPhone || form.fromEmail) && `${form.fromPhone ? `Ph: ${form.fromPhone}` : ""} ${form.fromEmail ? `| Em: ${form.fromEmail}` : ""}`}
                    </Text>
                    <View style={styles.metaRow}>
                        {form.fromGSTIN && <Text style={styles.metaItem}>GSTIN: {form.fromGSTIN}</Text>}
                        <Text style={styles.metaItem}>QT: #{form.quoteNumber}</Text>
                        <Text style={styles.metaItem}>Date: {form.quoteDate}</Text>
                        {form.validUntil && <Text style={styles.metaItem}>Valid: {form.validUntil}</Text>}
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
                            <Text style={styles.billLabel}>Tax Information</Text>
                            <Text style={{ fontSize: 11, color: "#374151" }}>
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
                        <View style={styles.notesSection} wrap={false}>
                            {form.notes && (
                                <View style={styles.notesBox}>
                                    <Text style={styles.notesLabel}>Notes</Text>
                                    <Text style={styles.notesText}>{form.notes}</Text>
                                </View>
                            )}
                            {form.terms && (
                                <View style={styles.notesBox}>
                                    <Text style={styles.notesLabel}>Terms</Text>
                                    <Text style={styles.notesText}>{form.terms}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerText}>Generated by DocMinty.com</Text>
                        <View style={styles.signatureBox}>
                            {form.signature ? (
                                <Image src={form.signature} style={styles.signatureImage} />
                            ) : (
                                <View style={{ height: 45 }} />
                            )}
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