"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function InvoiceCorporateTemplate({ form }) {
    const A = form.templateColor || "#1E3A5F";
    const calc = calculateLineItems(form.items, form.taxType === "igst");
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);

    const styles = StyleSheet.create({
        page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
        topStrip: { backgroundColor: A, height: 6 },
        header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: "20 36 16", borderBottomWidth: 2, borderBottomColor: A },
        logo: { width: 50, height: 35, objectFit: "contain", marginBottom: 5 },
        fromName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: A },
        small: { fontSize: 8, color: "#6B7280", marginTop: 1 },
        invoiceL: { fontSize: 20, fontFamily: "Helvetica-Bold", color: A, textAlign: "right" },
        num: { fontSize: 9, color: "#6B7280", textAlign: "right", marginTop: 3 },
        body: { padding: "16 36" },
        infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16, backgroundColor: "#F8FAFD", padding: "10 14", borderRadius: 4 },
        billL: { fontSize: 7, fontFamily: "Helvetica-Bold", color: A, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
        billN: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
        tHeader: { flexDirection: "row", backgroundColor: A, padding: "5 6" },
        tRow: { flexDirection: "row", padding: "5 6", borderBottomWidth: 1, borderBottomColor: "#EBF0F7" },
        thT: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#fff", textTransform: "uppercase" },
        tdT: { fontSize: 9, color: "#374151" },
        totBox: { alignSelf: "flex-end", width: 200, marginTop: 10 },
        totRow: { flexDirection: "row", justifyContent: "space-between", padding: "4 0", borderBottomWidth: 1, borderBottomColor: "#EBF0F7" },
        totL: { fontSize: 9, color: "#6B7280" },
        totV: { fontSize: 9, color: "#374151" },
        totFinal: { flexDirection: "row", justifyContent: "space-between", backgroundColor: A, padding: "8 10", borderRadius: 3, marginTop: 4 },
        totFT: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#fff" },
        wordsBox: { backgroundColor: "#F8FAFD", padding: "6 10", borderLeftWidth: 3, borderLeftColor: A, marginTop: 10 },
        wordsL: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
        wordsT: { fontSize: 8, color: "#374151", fontStyle: "italic" },
        footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, paddingTop: 10, borderTopWidth: 2, borderTopColor: A },
        footerG: { fontSize: 7, color: "#9CA3AF" },
        signBox: { borderTopWidth: 1, borderTopColor: A, paddingTop: 4, width: 110, textAlign: "center" },
        signT: { fontSize: 7, color: "#9CA3AF" },
        botStrip: { backgroundColor: A, height: 6, position: "absolute", bottom: 0, left: 0, right: 0 },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.topStrip} />
                <View style={styles.header}>
                    <View style={{ alignItems: "center", width: "100%" }}>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.fromName}>{form.fromName || "Your Business"}</Text>
                        <Text style={{ fontSize: 9, color: A, letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>Official Tax Invoice</Text>
                        <View style={{ flexDirection: "row", gap: 15, marginTop: 8 }}>
                            {form.fromGSTIN && <Text style={styles.small}>{"GSTIN: " + form.fromGSTIN}</Text>}
                            <Text style={styles.small}>{"No: " + form.invoiceNumber}</Text>
                            <Text style={styles.small}>{"Date: " + form.invoiceDate}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.body}>
                    <View style={styles.infoRow}>
                        <View>
                            <Text style={styles.billL}>Bill To</Text>
                            <Text style={styles.billN}>{form.toName || "Client"}</Text>
                            {form.toGSTIN && <Text style={styles.small}>{"GSTIN: " + form.toGSTIN}</Text>}
                            {toState && <Text style={styles.small}>{toState.name}</Text>}
                        </View>
                        <View>
                            <Text style={styles.billL}>Tax Type</Text>
                            <Text style={{ fontSize: 9, color: "#374151" }}>{form.taxType === "cgst_sgst" ? "CGST + SGST" : form.taxType === "igst" ? "IGST" : "No Tax"}</Text>
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
                        <View key={i} style={[styles.tRow, { backgroundColor: i % 2 === 0 ? "#fff" : "#F8FAFD" }]}>
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
                </View>
                <View style={styles.botStrip} />
            </Page>
        </Document>
    );
}