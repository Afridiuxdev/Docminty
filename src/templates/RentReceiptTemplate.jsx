"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const T = "#0D9488";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 14, marginBottom: 16 },
  logo: { width: 55, height: 38, objectFit: "contain", marginBottom: 5 },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: T },
  num: { fontSize: 10, color: "#6B7280", marginTop: 3 },
  periodT: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "right" },
  dateT: { fontSize: 9, color: "#9CA3AF", textAlign: "right", marginTop: 3 },
  amtBox: { backgroundColor: "#F0FDFA", borderWidth: 2, borderColor: T, borderRadius: 8, padding: "14 18", alignItems: "center", marginBottom: 16 },
  amtLabel: { fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  amtValue: { fontSize: 30, fontFamily: "Helvetica-Bold", color: T },
  amtWords: { fontSize: 9, color: "#374151", fontStyle: "italic", marginTop: 5 },
  tRow: { flexDirection: "row", padding: "7 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  tLabel: { flex: 1.2, fontSize: 9, color: "#6B7280" },
  tValue: { flex: 2, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
  sigRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 32, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  llName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
  llInfo: { fontSize: 9, color: "#6B7280", marginTop: 2 },
  signBox: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120, textAlign: "center" },
  signT: { fontSize: 8, color: "#9CA3AF" },
  footer: { marginTop: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  footerG: { fontSize: 8, color: "#D1D5DB" },
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

export default function RentReceiptTemplate({ form }) {
  const amount = parseFloat(form.rentAmount) || 0;
  const amtFmt = amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.title}>RENT RECEIPT</Text>
            <Text style={styles.num}>{"#" + form.receiptNumber}</Text>
          </View>
          <View>
            <Text style={styles.periodT}>{form.month + " " + form.year}</Text>
            <Text style={styles.dateT}>{"Date: " + form.receiptDate}</Text>
          </View>
        </View>

        <View style={styles.amtBox}>
          <Text style={styles.amtLabel}>Rent Amount</Text>
          <Text style={styles.amtValue}>{"Rs. " + amtFmt}</Text>
          <Text style={styles.amtWords}>{numToWords(amount)}</Text>
        </View>

        <View>
          <View style={styles.tRow}><Text style={styles.tLabel}>Received From (Tenant)</Text><Text style={styles.tValue}>{form.tenantName || "—"}</Text></View>
          <View style={styles.tRow}><Text style={styles.tLabel}>Rent Period</Text><Text style={styles.tValue}>{form.month + " " + form.year}</Text></View>
          <View style={styles.tRow}><Text style={styles.tLabel}>Property Address</Text><Text style={styles.tValue}>{form.propertyAddress || "—"}</Text></View>
          <View style={styles.tRow}><Text style={styles.tLabel}>Payment Mode</Text><Text style={styles.tValue}>{form.paymentMode || "—"}</Text></View>
        </View>

        <View style={styles.sigRow}>
          <View>
            <Text style={styles.llName}>{form.landlordName || "Landlord Name"}</Text>
            {form.landlordPan && <Text style={styles.llInfo}>{"PAN: " + form.landlordPan}</Text>}
            {form.landlordAddress && <Text style={styles.llInfo}>{form.landlordAddress}</Text>}
          </View>
          <View style={styles.signBox}><Text style={styles.signT}>Landlord Signature</Text></View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerG}>Generated by DocMinty.com - Valid for HRA exemption claim</Text>
        </View>
      </Page>
    </Document>
  );
}