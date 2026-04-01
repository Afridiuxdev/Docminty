"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function InvoiceModernTemplate({ form }) {
    const A = form.templateColor || "#6366F1";
    const calc = calculateLineItems(form.items, form.taxType === "igst");
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);

    const styles = StyleSheet.create({
        page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
        sidebar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: A },
        sideTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#fff", padding: "40 14 6", lineHeight: 1.2 },
        sideNum: { fontSize: 9, color: "rgba(255,255,255,0.7)", padding: "0 14", marginBottom: 4 },
        sideMeta: { fontSize: 8, color: "rgba(255,255,255,0.6)", padding: "0 14", marginBottom: 2 },
        sideLabel: { fontSize: 7, color: "rgba(255,255,255,0.5)", padding: "20 14 4", textTransform: "uppercase", letterSpacing: 1 },
        sideInfo: { fontSize: 8, color: "#fff", padding: "0 14", marginBottom: 2 },
        main: { marginLeft: 130, padding: "30 24 24 0" },
        logo: { width: 50, height: 35, objectFit: "contain", marginBottom: 8 },
        fromName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 2 },
        small: { fontSize: 8, color: "#6B7280", marginBottom: 2 },
        billLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, marginTop: 12 },
        billName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
        tHeader: { flexDirection: "row", backgroundColor: A, padding: "5 6", marginTop: 12 },
        tRow: { flexDirection: "row", padding: "5 6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
        thT: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#fff", textTransform: "uppercase" },
        tdT: { fontSize: 9, color: "#374151" },
        totBox: { alignSelf: "flex-end", width: 180, marginTop: 8 },
        totRow: { flexDirection: "row", justifyContent: "space-between", padding: "3 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
        totL: { fontSize: 9, color: "#6B7280" },
        totV: { fontSize: 9, color: "#374151" },
        totFinal: { flexDirection: "row", justifyContent: "space-between", backgroundColor: A + "15", padding: "7 8", borderRadius: 3, marginTop: 4 },
        totFT: { fontSize: 10, fontFamily: "Helvetica-Bold", color: A },
        wordsBox: { backgroundColor: "#F8F9FA", padding: "6 10", borderLeftWidth: 3, borderLeftColor: A, marginTop: 10 },
        wordsL: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
        wordsT: { fontSize: 8, color: "#374151", fontStyle: "italic" },
        footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
        footerG: { fontSize: 7, color: "#D1D5DB" },
        signBox: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 100, textAlign: "center" },
        signT: { fontSize: 7, color: "#9CA3AF" },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.sidebar}>
                    <Text style={styles.sideTitle}>INVOICE</Text>
                    <Text style={styles.sideNum}>{"#" + form.invoiceNumber}</Text>
                    <Text style={styles.sideMeta}>{"Date: " + form.invoiceDate}</Text>
                    {form.dueDate && <Text style={styles.sideMeta}>{"Due: " + form.dueDate}</Text>}
                    <Text style={styles.sideLabel}>Bill To</Text>
                    <Text style={styles.sideInfo}>{form.toName || "Client"}</Text>
                    {form.toGSTIN && <Text style={styles.sideInfo}>{"GSTIN: " + form.toGSTIN}</Text>}
                    {toState && <Text style={styles.sideInfo}>{toState.name}</Text>}
                    <Text style={styles.sideLabel}>Tax Type</Text>
                    <Text style={styles.sideInfo}>{form.taxType === "cgst_sgst" ? "CGST + SGST" : form.taxType === "igst" ? "IGST" : "No Tax"}</Text>
                </View>
                <View style={styles.main}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.fromName}>{form.fromName || "Your Business"}</Text>
                    {form.fromGSTIN && <Text style={styles.small}>{"GSTIN: " + form.fromGSTIN}</Text>}
                    {form.fromAddress && <Text style={styles.small}>{form.fromAddress + (form.fromCity ? ", " + form.fromCity : "")}</Text>}
                    {fromState && <Text style={styles.small}>{fromState.name}</Text>}
                    <View style={{ marginTop: 12 }}>
                        <View style={styles.tHeader}>
                            <View style={{ flex: 0.3 }}><Text style={styles.thT}>#</Text></View>
                            <View style={{ flex: 2.5 }}><Text style={styles.thT}>Description</Text></View>
                            <View style={{ flex: 0.5 }}><Text style={styles.thT}>Qty</Text></View>
                            <View style={{ flex: 0.8 }}><Text style={styles.thT}>Rate</Text></View>
                            <View style={{ flex: 0.6 }}><Text style={styles.thT}>GST%</Text></View>
                            <View style={{ flex: 0.8 }}><Text style={[styles.thT, { textAlign: "right" }]}>Amt</Text></View>
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
                </View>
            </Page>
        </Document>
    );
}