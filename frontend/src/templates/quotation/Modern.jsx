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

export default function ModernTemplate({ form }) {
    const T = form.templateColor || "#0D9488";
    const calc = calculateLineItems(form.items, form.taxType === "igst");
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff", flexDirection: "row" },
        sidebar: { width: 140, backgroundColor: T, padding: "24 16", color: "#ffffff", height: "100%" },
        main: { flex: 1, padding: "24 24" },
        
        sidebarTitle: { fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 16, marginBottom: 4 },
        sidebarNum: { fontSize: 10, color: "rgba(255,255,255,0.75)", marginBottom: 24 },
        sidebarLabel: { fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 3, letterSpacing: 0.6 },
        sidebarName: { fontSize: 10, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 },
        sidebarText: { fontSize: 9, color: "rgba(255,255,255,0.85)", marginBottom: 16, lineHeight: 1.4 },
        sidebarFooter: { marginTop: "auto" },
        
        mainHeader: { paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", marginBottom: 16 },
        logo: { height: 36, objectFit: "contain", marginBottom: 8 },
        headerMeta: { fontSize: 10, color: "#9CA3AF", marginBottom: 2 },
        
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
        grandTotalLabel: { fontSize: 12, fontWeight: 800, color: T },
        
        wordsBox: { marginTop: 16, padding: "10 14", backgroundColor: "#F8F9FA", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: T },
        wordsLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
        wordsText: { fontSize: 10, color: "#374151", fontStyle: "italic" },

        footerNote: { marginTop: 20, flexDirection: "row", gap: 16 },
        noteBox: { flex: 1 },
        noteLabel: { fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4, fontFamily: "Space Grotesk" },
        noteText: { fontSize: 10, color: "#6B7280", lineHeight: 1.5 },
        
        footer: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
        footerText: { fontSize: 9, color: "#D1D5DB" },
        signatureBox: { textAlign: "right", width: 120 },
        signatureImage: { height: 36, maxWidth: 100, marginBottom: 4, alignSelf: "center" },
        signatureLine: { borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 4 },
        signatureLabel: { fontSize: 8, color: "#9CA3AF" }
    });

    return (
        <Document title={`Quotation-${form.quoteNumber}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>QUOTATION</Text>
                    <Text style={styles.sidebarNum}>#{form.quoteNumber}</Text>
                    
                    <Text style={styles.sidebarLabel}>From</Text>
                    <Text style={styles.sidebarName}>{form.fromName || "Your Business"}</Text>
                    <Text style={styles.sidebarText}>
                        {form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromState && fromState.name}
                        {"\n"}{form.fromPhone && `Ph: ${form.fromPhone}`}{"\n"}{form.fromEmail && `Em: ${form.fromEmail}`}
                    </Text>

                    <Text style={styles.sidebarLabel}>Quote For</Text>
                    <Text style={styles.sidebarName}>{form.toName || "Client Name"}</Text>
                    <Text style={styles.sidebarText}>
                        {form.toGSTIN && `GSTIN: ${form.toGSTIN}\n`}
                        {form.toAddress} {form.toCity && `${form.toCity}, `} {toState && toState.name}
                        {"\n"}{form.toPhone && `Ph: ${form.toPhone}`}{"\n"}{form.toEmail && `Em: ${form.toEmail}`}
                    </Text>

                    <View style={styles.sidebarFooter}>
                        {form.validUntil && (
                            <View style={{ marginBottom: 16 }}>
                                <Text style={styles.sidebarLabel}>Valid Until</Text>
                                <Text style={{ fontSize: 10, fontWeight: 600 }}>{form.validUntil}</Text>
                            </View>
                        )}
                        <Text style={styles.sidebarLabel}>Total Amount</Text>
                        <Text style={{ fontSize: 14, fontWeight: 800 }}>Rs.{calc.grandTotal}</Text>
                    </View>
                </View>

                <View style={styles.main}>
                    <View style={styles.mainHeader}>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        {form.fromGSTIN && <Text style={styles.headerMeta}>GSTIN: {form.fromGSTIN}</Text>}
                        <Text style={styles.headerMeta}>Date: {form.quoteDate}</Text>
                        <Text style={styles.headerMeta}>Tax Type: {form.taxType === "cgst_sgst" ? "CGST + SGST" : form.taxType === "igst" ? "IGST" : "No Tax"}</Text>
                        
                        {form.signature && (
                            <View style={{ position: "absolute", top: 0, right: 0, alignItems: "center" }}>
                                <Image src={form.signature} style={styles.signatureImage} />
                                <View style={styles.signatureLine}>
                                    <Text style={styles.signatureLabel}>Authorised Signatory</Text>
                                </View>
                            </View>
                        )}
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
                                <Text style={styles.grandTotalLabel}>Total</Text>
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
                        <View style={{ textAlign: "right" }}>
                             <Text style={{ fontSize: 8, color: "#D1D5DB" }}>Quote ID: {form.quoteNumber}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
