"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

const T = "#0D9488";

const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 40 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 14, marginBottom: 16 },
    logo: { width: 55, height: 38, objectFit: "contain", marginBottom: 5 },
    fromName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827" },
    small: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: T, textAlign: "right" },
    num: { fontSize: 11, color: "#6B7280", textAlign: "right", marginTop: 3 },
    meta: { fontSize: 9, color: "#9CA3AF", textAlign: "right", marginTop: 2 },
    amtBox: { backgroundColor: "#F0FDFA", borderWidth: 2, borderColor: T, borderRadius: 8, padding: "16 20", alignItems: "center", marginBottom: 16 },
    amtLabel: { fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    amtValue: { fontSize: 32, fontFamily: "Helvetica-Bold", color: T },
    amtWords: { fontSize: 9, color: "#374151", fontStyle: "italic", marginTop: 6 },
    tRow: { flexDirection: "row", padding: "7 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    tLabel: { flex: 1, fontSize: 9, color: "#6B7280" },
    tValue: { flex: 2, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
    notesBox: { backgroundColor: "#F8F9FA", padding: "8 12", borderLeftWidth: 3, borderLeftColor: T, marginBottom: 16 },
    notesL: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
    notesT: { fontSize: 9, color: "#374151" },
    footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footerG: { fontSize: 8, color: "#D1D5DB" },
    signBox: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120, textAlign: "center" },
    signT: { fontSize: 8, color: "#9CA3AF" },
});

function numToWords(n) {
    if (!n || n === 0) return "Zero Rupees Only";
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    function convert(num) {
        if (num < 20) return ones[num];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
        if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convert(num % 100) : "");
        if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "");
        return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
    }
    return "Rupees " + convert(Math.floor(n)) + " Only";
}

export default function ReceiptTemplate({ form }) {
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const amount = parseFloat(form.amount) || 0;
    const amtFmt = amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.fromName}>{form.fromName || "Business Name"}</Text>
                        {form.fromAddress && <Text style={styles.small}>{form.fromAddress + (form.fromCity ? ", " + form.fromCity : "")}</Text>}
                        {fromState && <Text style={styles.small}>{fromState.name}</Text>}
                        {form.fromPhone && <Text style={styles.small}>{"Ph: " + form.fromPhone}</Text>}
                    </View>
                    <View>
                        <Text style={styles.title}>RECEIPT</Text>
                        <Text style={styles.num}>{"#" + form.receiptNumber}</Text>
                        <Text style={styles.meta}>{"Date: " + form.receiptDate}</Text>
                    </View>
                </View>

                <View style={styles.amtBox}>
                    <Text style={styles.amtLabel}>Amount Received</Text>
                    <Text style={styles.amtValue}>{"Rs. " + amtFmt}</Text>
                    <Text style={styles.amtWords}>{numToWords(amount)}</Text>
                </View>

                <View style={{ marginBottom: 16 }}>
                    <View style={styles.tRow}><Text style={styles.tLabel}>Received From</Text><Text style={styles.tValue}>{form.receivedFrom || "—"}</Text></View>
                    <View style={styles.tRow}><Text style={styles.tLabel}>Payment Mode</Text><Text style={styles.tValue}>{form.paymentMode || "—"}</Text></View>
                    <View style={styles.tRow}><Text style={styles.tLabel}>Purpose</Text><Text style={styles.tValue}>{form.purpose || "—"}</Text></View>
                    <View style={styles.tRow}><Text style={styles.tLabel}>Date</Text><Text style={styles.tValue}>{form.receiptDate || "—"}</Text></View>
                </View>

                {form.notes && (
                    <View style={styles.notesBox}>
                        <Text style={styles.notesL}>Notes</Text>
                        <Text style={styles.notesT}>{form.notes}</Text>
                    </View>
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerG}>Generated by DocMinty.com</Text>
                    <View style={styles.signBox}><Text style={styles.signT}>Authorised Signatory</Text></View>
                </View>
            </Page>
        </Document>
    );
}