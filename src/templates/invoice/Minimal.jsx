"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: "40 48" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
    logo: { width: 50, height: 35, objectFit: "contain", marginBottom: 6 },
    fromName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#111827" },
    small: { fontSize: 8, color: "#9CA3AF", marginTop: 1 },
    invoiceL: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "right" },
    num: { fontSize: 9, color: "#9CA3AF", textAlign: "right", marginTop: 3 },
    divider: { borderBottomWidth: 1, borderBottomColor: "#111827", marginBottom: 16 },
    billSec: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    billL: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    billN: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    tHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#111827", padding: "4 0", marginBottom: 2 },
    tRow: { flexDirection: "row", padding: "5 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    thT: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#111827", textTransform: "uppercase", letterSpacing: 0.5 },
    tdT: { fontSize: 9, color: "#374151" },
    totBox: { alignSelf: "flex-end", width: 160, marginTop: 12 },
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "3 0" },
    totL: { fontSize: 9, color: "#9CA3AF" },
    totV: { fontSize: 9, color: "#374151" },
    totFinal: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#111827", paddingTop: 6, marginTop: 4 },
    totFT: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 24, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footerG: { fontSize: 7, color: "#D1D5DB" },
    signBox: { borderTopWidth: 1, borderTopColor: "#111827", paddingTop: 4, width: 100, textAlign: "center" },
    signT: { fontSize: 7, color: "#9CA3AF" },
});

export default function InvoiceMinimalTemplate({ form }) {
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
                        {form.fromGSTIN && <Text style={styles.small}>{"GSTIN: " + form.fromGSTIN}</Text>}
                        {form.fromCity && <Text style={styles.small}>{form.fromCity + (fromState ? ", " + fromState.name : "")}</Text>}
                    </View>
                    <View>
                        <Text style={styles.invoiceL}>Invoice</Text>
                        <Text style={styles.num}>{"#" + form.invoiceNumber}</Text>
                        <Text style={styles.num}>{"Date: " + form.invoiceDate}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.billSec}>
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
                    <View style={{ flex: 0.6 }}><Text style={styles.thT}>GST</Text></View>
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
                <View style={styles.footer}>
                    <Text style={styles.footerG}>Generated by DocMinty.com</Text>
                    <View style={styles.signBox}><Text style={styles.signT}>Authorised Signatory</Text></View>
                </View>
            </Page>
        </Document>
    );
}