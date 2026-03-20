"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

const T = "#EF4444";
const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 40 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 14, marginBottom: 14 },
    logo: { width: 55, height: 38, objectFit: "contain", marginBottom: 5 },
    fromName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827" },
    small: { fontSize: 8, color: "#6B7280", marginTop: 2 },
    title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: T, textAlign: "right" },
    num: { fontSize: 10, color: "#6B7280", textAlign: "right", marginTop: 3 },
    meta: { fontSize: 8, color: "#9CA3AF", textAlign: "right", marginTop: 2 },
    billSec: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
    billL: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
    billN: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    tHeader: { flexDirection: "row", backgroundColor: "#FEF2F2", padding: "5 6", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
    tRow: { flexDirection: "row", padding: "5 6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    thT: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#6B7280", textTransform: "uppercase" },
    tdT: { fontSize: 9, color: "#374151" },
    totBox: { alignSelf: "flex-end", width: 190, marginTop: 8 },
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "4 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    totL: { fontSize: 9, color: "#6B7280" },
    totV: { fontSize: 9, color: "#374151" },
    totFinal: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FEF2F2", padding: "7 10", borderRadius: 3, marginTop: 4 },
    totFT: { fontSize: 10, fontFamily: "Helvetica-Bold", color: T },
    wordsBox: { backgroundColor: "#F8F9FA", padding: "6 10", borderLeftWidth: 3, borderLeftColor: T, marginTop: 10, marginBottom: 10 },
    wordsL: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
    wordsT: { fontSize: 8, color: "#374151", fontStyle: "italic" },
    notesGrid: { flexDirection: "row", gap: 14, marginTop: 10 },
    noteBox: { flex: 1 },
    noteL: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
    noteT: { fontSize: 8, color: "#6B7280", lineHeight: 1.5 },
    footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footerG: { fontSize: 7, color: "#D1D5DB" },
    signBox: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 110, textAlign: "center" },
    signT: { fontSize: 7, color: "#9CA3AF" },
});

export default function QuotationBoldTemplate({ form }) {
    const calc = calculateLineItems(form.items, form.taxType === "igst");
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);
    return (
        <Document><Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.fromName}>{form.fromName || "Your Business"}</Text>
                    {form.fromGSTIN && <Text style={styles.small}>{"GSTIN: " + form.fromGSTIN}</Text>}
                    {form.fromAddress && <Text style={styles.small}>{form.fromAddress + (form.fromCity ? ", " + form.fromCity : "")}</Text>}
                    {fromState && <Text style={styles.small}>{fromState.name}</Text>}
                </View>
                <View>
                    <Text style={styles.title}>QUOTATION</Text>
                    <Text style={styles.num}>{"#" + form.quoteNumber}</Text>
                    <Text style={styles.meta}>{"Date: " + form.quoteDate}</Text>
                    {form.validUntil && <Text style={styles.meta}>{"Valid Until: " + form.validUntil}</Text>}
                </View>
            </View>
            <View style={styles.billSec}>
                <View>
                    <Text style={styles.billL}>Quote For</Text>
                    <Text style={styles.billN}>{form.toName || "Client"}</Text>
                    {form.toGSTIN && <Text style={styles.small}>{"GSTIN: " + form.toGSTIN}</Text>}
                    {form.toAddress && <Text style={styles.small}>{form.toAddress + (form.toCity ? ", " + form.toCity : "")}</Text>}
                    {toState && <Text style={styles.small}>{toState.name}</Text>}
                </View>
                <View>
                    <Text style={styles.billL}>Tax Type</Text>
                    <Text style={{ fontSize: 9, color: "#374151" }}>{form.taxType === "cgst_sgst" ? "CGST + SGST" : form.taxType === "igst" ? "IGST" : "No Tax"}</Text>
                </View>
            </View>
            <View style={{ marginBottom: 10 }}>
                <View style={styles.tHeader}>
                    <View style={{ flex: 0.3 }}><Text style={styles.thT}>#</Text></View>
                    <View style={{ flex: 2.5 }}><Text style={styles.thT}>Description</Text></View>
                    <View style={{ flex: 0.5 }}><Text style={styles.thT}>Qty</Text></View>
                    <View style={{ flex: 0.8 }}><Text style={styles.thT}>Rate</Text></View>
                    <View style={{ flex: 0.6 }}><Text style={styles.thT}>GST%</Text></View>
                    <View style={{ flex: 0.8 }}><Text style={[styles.thT, { textAlign: "right" }]}>Amount</Text></View>
                </View>
                {calc.items.map((item, i) => (
                    <View key={i} style={styles.tRow}>
                        <View style={{ flex: 0.3 }}><Text style={styles.tdT}>{i + 1}</Text></View>
                        <View style={{ flex: 2.5 }}><Text style={styles.tdT}>{item.description || "-"}</Text></View>
                        <View style={{ flex: 0.5 }}><Text style={styles.tdT}>{item.qty}</Text></View>
                        <View style={{ flex: 0.8 }}><Text style={styles.tdT}>{"Rs. " + item.rate}</Text></View>
                        <View style={{ flex: 0.6 }}><Text style={styles.tdT}>{item.gstRate + "%"}</Text></View>
                        <View style={{ flex: 0.8 }}><Text style={[styles.tdT, { textAlign: "right", fontFamily: "Helvetica-Bold" }]}>{"Rs. " + item.amount}</Text></View>
                    </View>
                ))}
            </View>
            <View style={styles.totBox}>
                <View style={styles.totRow}><Text style={styles.totL}>Subtotal</Text><Text style={styles.totV}>{"Rs. " + calc.subtotal}</Text></View>
                {form.taxType === "cgst_sgst" && <><View style={styles.totRow}><Text style={styles.totL}>CGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalCGST}</Text></View><View style={styles.totRow}><Text style={styles.totL}>SGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalSGST}</Text></View></>}
                {form.taxType === "igst" && <View style={styles.totRow}><Text style={styles.totL}>IGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalIGST}</Text></View>}
                <View style={styles.totFinal}><Text style={styles.totFT}>Total</Text><Text style={styles.totFT}>{"Rs. " + calc.grandTotal}</Text></View>
            </View>
            <View style={styles.wordsBox}><Text style={styles.wordsL}>Amount in Words</Text><Text style={styles.wordsT}>{numberToWords(parseFloat(calc.grandTotal))}</Text></View>
            {(form.notes || form.terms) && (<View style={styles.notesGrid}>{form.notes && <View style={styles.noteBox}><Text style={styles.noteL}>Notes</Text><Text style={styles.noteT}>{form.notes}</Text></View>}{form.terms && <View style={styles.noteBox}><Text style={styles.noteL}>Terms</Text><Text style={styles.noteT}>{form.terms}</Text></View>}</View>)}
            <View style={styles.footer}><Text style={styles.footerG}>Generated by DocMinty.com</Text><View style={styles.signBox}><Text style={styles.signT}>Authorised Signatory</Text></View></View>
        </Page></Document>
    );
}