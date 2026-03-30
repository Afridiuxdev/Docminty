"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

const A = "#D97706";
const BG = "#FFFDF5";

const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 36, backgroundColor: BG },
    header: { alignItems: "center", borderBottomWidth: 1, borderBottomColor: A, paddingBottom: 20, marginBottom: 20 },
    logo: { width: 60, height: 40, objectFit: "contain", marginBottom: 8 },
    fromName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#111827", letterSpacing: 1, textTransform: "uppercase" },
    small: { fontSize: 8, color: "#6B7280", marginTop: 2, textAlign: "center" },
    invoiceL: { fontSize: 10, color: A, letterSpacing: 3, marginTop: 10, textTransform: "uppercase" },
    num: { fontSize: 9, color: "#6B7280", marginTop: 4 },
    accentLine: { borderBottomWidth: 1, borderBottomColor: A, marginBottom: 14 },
    billSec: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    billL: { fontSize: 7, fontFamily: "Helvetica-Bold", color: A, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 },
    billN: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    tHeader: { flexDirection: "row", borderBottomWidth: 2, borderBottomColor: A, padding: "5 4" },
    tRow: { flexDirection: "row", padding: "5 4", borderBottomWidth: 1, borderBottomColor: "#F5ECD5" },
    thT: { fontSize: 8, fontFamily: "Helvetica-Bold", color: A, textTransform: "uppercase", letterSpacing: 0.5 },
    tdT: { fontSize: 9, color: "#374151" },
    totBox: { alignSelf: "flex-end", width: 190, marginTop: 10 },
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "4 0", borderBottomWidth: 1, borderBottomColor: "#F5ECD5" },
    totL: { fontSize: 9, color: "#6B7280" },
    totV: { fontSize: 9, color: "#374151" },
    totFinal: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FEF9C3", borderWidth: 1, borderColor: A, padding: "8 10", borderRadius: 3, marginTop: 4 },
    totFT: { fontSize: 11, fontFamily: "Helvetica-Bold", color: A },
    wordsBox: { backgroundColor: "#FEF9C3", padding: "6 10", borderLeftWidth: 3, borderLeftColor: A, marginTop: 10 },
    wordsL: { fontSize: 7, color: "#92400E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
    wordsT: { fontSize: 8, color: "#374151", fontStyle: "italic" },
    footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, paddingTop: 10, borderTopWidth: 2, borderTopColor: A },
    footerG: { fontSize: 7, color: "#D1D5DB" },
    signBox: { borderTopWidth: 1, borderTopColor: A, paddingTop: 4, width: 110, textAlign: "center" },
    signT: { fontSize: 7, color: "#9CA3AF" },
});

export default function InvoiceElegantTemplate({ form }) {
    const calc = calculateLineItems(form.items, form.taxType === "igst");
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.fromName}>{form.fromName || "Your Business"}</Text>
                    {form.fromGSTIN && <Text style={styles.small}>{"GSTIN: " + form.fromGSTIN}</Text>}
                    {fromState && <Text style={styles.small}>{fromState.name}</Text>}
                    
                    <Text style={styles.invoiceL}>TAX INVOICE</Text>
                    <Text style={styles.num}>{"#" + form.invoiceNumber + " • Date: " + form.invoiceDate}</Text>
                </View>
                <View style={styles.billSec}>
                    <View>
                        <Text style={styles.billL}>Bill To</Text>
                        <Text style={styles.billN}>{form.toName || "Client"}</Text>
                        {form.toGSTIN && <Text style={styles.small}>{"GSTIN: " + form.toGSTIN}</Text>}
                        {toState && <Text style={styles.small}>{toState.name}</Text>}
                    </View>
                </View>
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
                <View style={styles.totBox}>
                    <View style={styles.totRow}><Text style={styles.totL}>Subtotal</Text><Text style={styles.totV}>{"Rs. " + calc.subtotal}</Text></View>
                    {form.taxType === "cgst_sgst" && <>
                        <View style={styles.totRow}><Text style={styles.totL}>CGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalCGST}</Text></View>
                        <View style={styles.totRow}><Text style={styles.totL}>SGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalSGST}</Text></View>
                    </>}
                    {form.taxType === "igst" && <View style={styles.totRow}><Text style={styles.totL}>IGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalIGST}</Text></View>}
                    <View style={styles.totFinal}><Text style={styles.totFT}>Total</Text><Text style={styles.totFT}>{"Rs. " + calc.grandTotal}</Text></View>
                </View>
                <View style={styles.wordsBox}>
                    <Text style={styles.wordsL}>Amount in Words</Text>
                    <Text style={styles.wordsT}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerG}>Generated by DocMinty.com</Text>
                    <View style={styles.signBox}><Text style={styles.signT}>Authorised Signatory</Text></View>
                </View>
            </Page>
        </Document>
    );
}