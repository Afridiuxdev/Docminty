"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

const T = "#EF4444";
const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 40 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 3, borderBottomColor: T, paddingBottom: 14, marginBottom: 14 },
    logo: { width: 55, height: 38, objectFit: "contain", marginBottom: 5 },
    fromName: { fontSize: 14, fontWeight: 700, color: "#111827" },
    small: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
    title: { fontSize: 24, fontWeight: 800, color: T, textAlign: "right" },
    num: { fontSize: 11, color: "#6B7280", textAlign: "right", marginTop: 4 },
    meta: { fontSize: 9, color: "#9CA3AF", textAlign: "right", marginTop: 2 },
    
    billSec: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 10 },
    billCol: { flex: 1 },
    billL: { fontSize: 8, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Space Grotesk" },
    billN: { fontSize: 11, fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk" },
    
    tHeader: { flexDirection: "row", backgroundColor: "#F9FAFB", padding: "8 12", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", borderRadius: 4 },
    tRow: { flexDirection: "row", padding: "8 12", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", alignItems: "center" },
    thT: { fontSize: 8, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontFamily: "Space Grotesk" },
    tdT: { fontSize: 9, color: "#374151" },
    
    totBox: { alignSelf: "flex-end", width: 200, marginTop: 12 },
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "5 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    totL: { fontSize: 10, color: "#6B7280" },
    totV: { fontSize: 10, color: "#374151", fontWeight: 600 },
    totFinal: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FEF2F2", padding: "8 12", borderRadius: 4, marginTop: 6 },
    totFT: { fontSize: 12, fontWeight: 800, color: T },
    
    wordsBox: { backgroundColor: "#F8F9FA", padding: "10 14", borderLeftWidth: 4, borderLeftColor: T, marginTop: 16 },
    wordsL: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2, fontFamily: "Space Grotesk", fontWeight: 700 },
    wordsT: { fontSize: 10, color: "#374151", fontStyle: "italic" },
    
    notesGrid: { flexDirection: "row", gap: 20, marginTop: 20 },
    noteBox: { flex: 1 },
    noteL: { fontSize: 8, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    noteT: { fontSize: 10, color: "#6B7280", lineHeight: 1.6 },
    
    footer: { marginTop: "auto", paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    footerG: { fontSize: 9, color: "#D1D5DB" },
    signatureBox: { textAlign: "right", width: 140 },
    signatureImage: { height: 40, maxWidth: 140, marginBottom: 4, alignSelf: "flex-end" },
    signBox: { borderTopWidth: 1.5, borderTopColor: "#374151", paddingTop: 4, width: "100%", textAlign: "center" },
    signT: { fontSize: 9, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase" },
});

export default function QuotationBoldTemplate({ form }) {
    const calc = calculateLineItems(form.items, form.taxType === "igst");
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);
    
    return (
        <Document title={`Quotation-${form.quoteNumber}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.fromName}>{form.fromName || "Your Business"}</Text>
                        <Text style={styles.small}>
                            {form.fromGSTIN && `GSTIN: ${form.fromGSTIN}\n`}
                            {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{"\n"}
                            {fromState && fromState.name}
                            {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? `Ph: ${form.fromPhone}` : ""} ${form.fromEmail ? `Em: ${form.fromEmail}` : ""}`}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.title}>QUOTATION</Text>
                        <Text style={styles.num}>{"#" + form.quoteNumber}</Text>
                        <View style={styles.meta}>
                            <Text>Date: {form.quoteDate}</Text>
                            {form.validUntil && <Text>Valid: {form.validUntil}</Text>}
                        </View>
                    </View>
                </View>

                <View style={styles.billSec}>
                    <View style={styles.billCol}>
                        <Text style={styles.billL}>Quote For</Text>
                        <Text style={styles.billN}>{form.toName || "Client Name"}</Text>
                        <Text style={styles.small}>
                            {form.toGSTIN && `GSTIN: ${form.toGSTIN}\n`}
                            {form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}{"\n"}
                            {toState && toState.name}
                            {(form.toPhone || form.toEmail) && `\n${form.toPhone ? `Ph: ${form.toPhone}` : ""} ${form.toEmail ? `Em: ${form.toEmail}` : ""}`}
                        </Text>
                    </View>
                    <View style={{ width: 120 }}>
                        <Text style={styles.billL}>Tax Type</Text>
                        <Text style={{ fontSize: 10, color: "#374151" }}>{form.taxType === "cgst_sgst" ? "CGST + SGST" : form.taxType === "igst" ? "IGST" : "No Tax"}</Text>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <View style={styles.tHeader}>
                        <View style={{ flex: 0.3 }}><Text style={styles.thT}>#</Text></View>
                        <View style={{ flex: 2.5 }}><Text style={styles.thT}>Description</Text></View>
                        {form.showHSN && <View style={{ flex: 0.6 }}><Text style={styles.thT}>HSN</Text></View>}
                        <View style={{ flex: 0.5 }}><Text style={styles.thT}>Qty</Text></View>
                        <View style={{ flex: 0.8 }}><Text style={styles.thT}>Rate</Text></View>
                        <View style={{ flex: 0.6 }}><Text style={styles.thT}>GST%</Text></View>
                        <View style={{ flex: 1 }}><Text style={[styles.thT, { textAlign: "right" }]}>Amount</Text></View>
                    </View>
                    {calc.items.map((item, i) => (
                        <View key={i} style={styles.tRow} wrap={false}>
                            <View style={{ flex: 0.3 }}><Text style={styles.tdT}>{i + 1}</Text></View>
                            <View style={{ flex: 2.5 }}><Text style={styles.tdT}>{item.description || "-"}</Text></View>
                            {form.showHSN && <View style={{ flex: 0.6 }}><Text style={styles.tdT}>{item.hsn || "-"}</Text></View>}
                            <View style={{ flex: 0.5 }}><Text style={styles.tdT}>{item.qty}</Text></View>
                            <View style={{ flex: 0.8 }}><Text style={styles.tdT}>{"Rs. " + item.rate}</Text></View>
                            <View style={{ flex: 0.6 }}><Text style={styles.tdT}>{item.gstRate + "%"}</Text></View>
                            <View style={{ flex: 1 }}><Text style={[styles.tdT, { textAlign: "right", fontWeight: 700 }]}>{"Rs. " + item.amount}</Text></View>
                        </View>
                    ))}
                </View>

                <View style={styles.totBox} wrap={false}>
                    <View style={styles.totRow}><Text style={styles.totL}>Subtotal</Text><Text style={styles.totV}>{"Rs. " + calc.subtotal}</Text></View>
                    {form.taxType === "cgst_sgst" && <><View style={styles.totRow}><Text style={styles.totL}>CGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalCGST}</Text></View><View style={styles.totRow}><Text style={styles.totL}>SGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalSGST}</Text></View></>}
                    {form.taxType === "igst" && <View style={styles.totRow}><Text style={styles.totL}>IGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalIGST}</Text></View>}
                    <View style={styles.totFinal}><Text style={styles.totFT}>Total</Text><Text style={styles.totFT}>{"Rs. " + calc.grandTotal}</Text></View>
                </View>

                <View style={styles.wordsBox} wrap={false}><Text style={styles.wordsL}>Amount in Words</Text><Text style={styles.wordsT}>{numberToWords(parseFloat(calc.grandTotal))}</Text></View>

                {(form.notes || form.terms) && (
                    <View style={styles.notesGrid} wrap={false}>
                        {form.notes && <View style={styles.noteBox}><Text style={styles.noteL}>Notes</Text><Text style={styles.noteT}>{form.notes}</Text></View>}
                        {form.terms && <View style={styles.noteBox}><Text style={styles.noteL}>Terms</Text><Text style={styles.noteT}>{form.terms}</Text></View>}
                    </View>
                )}

                <View style={styles.footer} fixed>
                    <Text style={styles.footerG}>Generated by DocMinty.com</Text>
                    <View style={styles.signatureBox}>
                        {form.signature ? (
                            <Image src={form.signature} style={styles.signatureImage} />
                        ) : (
                            <View style={{ height: 40 }} />
                        )}
                        <View style={styles.signBox}><Text style={styles.signT}>Authorised Signatory</Text></View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}