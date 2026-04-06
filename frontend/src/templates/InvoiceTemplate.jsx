"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

const T = "#0D9488";

const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 40, backgroundColor: "#ffffff" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 16, marginBottom: 16 },
    logo: { width: 60, height: 40, objectFit: "contain", marginBottom: 6 },
    fromName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#111827" },
    title: { fontSize: 22, fontFamily: "Helvetica-Bold", color: T, textAlign: "right" },
    num: { fontSize: 11, color: "#6B7280", textAlign: "right", marginTop: 4 },
    meta: { fontSize: 9, color: "#9CA3AF", textAlign: "right", marginTop: 2 },
    small: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    billSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    billLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    billName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#111827" },
    tableHeader: { flexDirection: "row", backgroundColor: "#F0F4F3", padding: "6 8", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
    tableRow: { flexDirection: "row", padding: "6 8", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    thText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#6B7280", textTransform: "uppercase" },
    tdText: { fontSize: 9, color: "#374151" },
    totalsBox: { alignSelf: "flex-end", width: 220, marginTop: 8 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", padding: "4 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    totalLabel: { fontSize: 9, color: "#6B7280" },
    totalValue: { fontSize: 9, color: "#374151" },
    totalFinal: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#F0FDFA", padding: "8 10", borderRadius: 4, marginTop: 4 },
    totalFinalT: { fontSize: 11, fontFamily: "Helvetica-Bold", color: T },
    wordsBox: { backgroundColor: "#F8F9FA", padding: "8 12", borderLeftWidth: 3, borderLeftColor: T, marginTop: 12, marginBottom: 12 },
    wordsLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
    wordsText: { fontSize: 9, color: "#374151", fontStyle: "italic" },
    footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footerGen: { fontSize: 8, color: "#D1D5DB" },
    signBox: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120, textAlign: "center" },
    signText: { fontSize: 8, color: "#9CA3AF" },
    notesGrid: { flexDirection: "row", gap: 16, marginTop: 12 },
    notesBox: { flex: 1 },
    notesLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    notesText: { fontSize: 9, color: "#6B7280", lineHeight: 1.5 },
});

const COL = {
    n: { flex: 0.3 },
    desc: { flex: 2.5 },
    hsn: { flex: 0.7 },
    qty: { flex: 0.5 },
    rate: { flex: 0.8 },
    gst: { flex: 0.6 },
    amt: { flex: 0.8 },
};

export default function InvoiceTemplate({ form }) {
    const calc = calculateLineItems(form.items, form.taxType === "igst");
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.fromName}>{form.fromName || "Your Business"}</Text>
                        {form.fromGSTIN && <Text style={styles.small}>GSTIN: {form.fromGSTIN}</Text>}
                        {form.fromAddress && <Text style={styles.small}>{form.fromAddress}</Text>}
                        {form.fromCity && <Text style={styles.small}>{form.fromCity}{fromState ? ", " + fromState.name : ""}</Text>}
                        {form.fromPhone && <Text style={styles.small}>Ph: {form.fromPhone}</Text>}
                    </View>
                    <View>
                        <Text style={styles.title}>INVOICE</Text>
                        <Text style={styles.num}>{"#" + form.invoiceNumber}</Text>
                        <Text style={styles.meta}>{"Date: " + form.invoiceDate}</Text>
                        {form.dueDate && <Text style={styles.meta}>{"Due: " + form.dueDate}</Text>}
                    </View>
                </View>

                <View style={styles.billSection}>
                    <View>
                        <Text style={styles.billLabel}>Bill To</Text>
                        <Text style={styles.billName}>{form.toName || "Client"}</Text>
                        {form.toGSTIN && <Text style={styles.small}>GSTIN: {form.toGSTIN}</Text>}
                        {form.toAddress && <Text style={styles.small}>{form.toAddress}</Text>}
                        {form.toCity && <Text style={styles.small}>{form.toCity}{toState ? ", " + toState.name : ""}</Text>}
                    </View>
                    <View>
                        <Text style={styles.billLabel}>Tax Type</Text>
                        <Text style={{ fontSize: 9, color: "#374151" }}>
                            {form.taxType === "cgst_sgst" ? "CGST + SGST (Intrastate)" : form.taxType === "igst" ? "IGST (Interstate)" : "No Tax"}
                        </Text>
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <View style={styles.tableHeader}>
                        <View style={COL.n}><Text style={styles.thText}>#</Text></View>
                        <View style={COL.desc}><Text style={styles.thText}>Description</Text></View>
                        {form.showHSN && <View style={COL.hsn}><Text style={styles.thText}>HSN</Text></View>}
                        <View style={COL.qty}><Text style={styles.thText}>Qty</Text></View>
                        <View style={COL.rate}><Text style={styles.thText}>Rate</Text></View>
                        <View style={COL.gst}><Text style={styles.thText}>GST%</Text></View>
                        <View style={COL.amt}><Text style={[styles.thText, { textAlign: "right" }]}>Amount</Text></View>
                    </View>
                    {calc.items.map((item, i) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={COL.n}><Text style={styles.tdText}>{i + 1}</Text></View>
                            <View style={COL.desc}><Text style={styles.tdText}>{item.description || "—"}</Text></View>
                            {form.showHSN && <View style={COL.hsn}><Text style={styles.tdText}>{item.hsn || "—"}</Text></View>}
                            <View style={COL.qty}><Text style={styles.tdText}>{item.qty}</Text></View>
                            <View style={COL.rate}><Text style={styles.tdText}>{"Rs. " + item.rate}</Text></View>
                            <View style={COL.gst}><Text style={styles.tdText}>{item.gstRate + "%"}</Text></View>
                            <View style={COL.amt}><Text style={[styles.tdText, { textAlign: "right", fontFamily: "Helvetica-Bold" }]}>{"Rs. " + item.amount}</Text></View>
                        </View>
                    ))}
                </View>

                <View style={styles.totalsBox}>
                    <View style={styles.totalRow}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.totalValue}>{"Rs. " + calc.subtotal}</Text></View>
                    {form.taxType === "cgst_sgst" && <>
                        <View style={styles.totalRow}><Text style={styles.totalLabel}>CGST</Text><Text style={styles.totalValue}>{"Rs. " + calc.totalCGST}</Text></View>
                        <View style={styles.totalRow}><Text style={styles.totalLabel}>SGST</Text><Text style={styles.totalValue}>{"Rs. " + calc.totalSGST}</Text></View>
                    </>}
                    {form.taxType === "igst" && <View style={styles.totalRow}><Text style={styles.totalLabel}>IGST</Text><Text style={styles.totalValue}>{"Rs. " + calc.totalIGST}</Text></View>}
                    <View style={styles.totalFinal}>
                        <Text style={styles.totalFinalT}>Total</Text>
                        <Text style={styles.totalFinalT}>{"Rs. " + calc.grandTotal}</Text>
                    </View>
                </View>

                <View style={styles.wordsBox}>
                    <Text style={styles.wordsLabel}>Amount in Words</Text>
                    <Text style={styles.wordsText}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
                </View>

                {(form.notes || form.terms) && (
                    <View style={styles.notesGrid}>
                        {form.notes && <View style={styles.notesBox}><Text style={styles.notesLabel}>Notes</Text><Text style={styles.notesText}>{form.notes}</Text></View>}
                        {form.terms && <View style={styles.notesBox}><Text style={styles.notesLabel}>Terms</Text><Text style={styles.notesText}>{form.terms}</Text></View>}
                    </View>
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerGen}>Generated by DocMinty.com</Text>
                    <View style={styles.signBox}><Text style={styles.signText}>Authorised Signatory</Text></View>
                </View>
            </Page>
        </Document>
    );
}