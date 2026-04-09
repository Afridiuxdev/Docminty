"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

function numToWords(n) {
  if (!n || n === 0) return "Zero Rupees Only";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function convert(num) {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convert(num % 100) : "");
    if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "");
    if (num < 10000000) return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
    return convert(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + convert(num % 10000000) : "");
  }
  return "Rupees " + convert(Math.floor(n)) + " Only";
}

export default function ReceiptCorporateTemplate({ form }) {
  const T = form.templateColor || "#1E3A5F";
  const amount = parseFloat(form.amount) || 0;
  const amtFmt = amount.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "50 70", backgroundColor: "#ffffff" },
    header: { marginBottom: 32, textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 20 },
    logo: { height: 40, objectFit: "contain", marginBottom: 12, margin: "0 auto" },
    orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
    docType: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, fontFamily: "Space Grotesk", fontWeight: 700 },
    
    dateRow: { marginTop: 24, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 12 },
    metaText: { fontSize: 9, color: "#6B7280", fontWeight: 700, fontFamily: "Space Grotesk" },
    
    recipient: { marginBottom: 32 },
    label: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Space Grotesk", fontWeight: 700 },
    recipName: { fontSize: 13, fontWeight: 700, color: "#111827" },
    recipSub: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4, maxWidth: 300 },
    
    amountBox: { backgroundColor: "#F8FAFD", padding: "24 32", borderRadius: 8, margin: "24 0", borderLeftWidth: 4, borderLeftColor: T },
    amountRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    amountLabel: { fontSize: 10, fontWeight: 700, color: "#111827", textTransform: "uppercase", fontFamily: "Space Grotesk" },
    amountVal: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 700, color: T },
    amountWords: { fontSize: 10, color: "#374151", borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 12, fontWeight: 700, fontStyle: "italic" },
    
    detailsTable: { marginBottom: 32, padding: "16 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    detailLine: { flexDirection: "row", marginBottom: 10 },
    detailLabel: { width: 140, fontSize: 9, color: "#6B7280", textTransform: "uppercase", fontFamily: "Space Grotesk", fontWeight: 700 },
    detailValue: { flex: 1, fontSize: 10, fontWeight: 700, color: "#111827" },
    
    signatureArea: { marginTop: 48, flexDirection: "row", justifyContent: "flex-end" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 8, width: 160 },
    sigName: { fontSize: 11, fontWeight: 700, color: "#111827", textAlign: "center" },
    sigLabel: { fontSize: 8, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 70, right: 70, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Corporate-Receipt-${form.receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.orgName}>{form.fromName || "Organization Name"}</Text>
          <Text style={styles.docType}>Official Payment Acknowledgement</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <View>
                <Text style={{ fontSize: 9, color: "#6B7280", maxWidth: 250 }}>
                    {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState}` : ""}
                </Text>
                <Text style={{ fontSize: 9, color: "#9CA3AF", marginTop: 4 }}>
                    {form.fromPhone && `Ph: ${form.fromPhone} `}
                    {form.fromEmail && ` | ${form.fromEmail}`}
                </Text>
            </View>
            <View style={{ textAlign: "right" }}>
                <Text style={styles.metaText}>REF: #{form.receiptNumber}</Text>
                <Text style={styles.metaText}>DATE: {form.receiptDate}</Text>
            </View>
        </View>

        <View style={styles.recipient}>
          <Text style={styles.label}>Received From</Text>
          <Text style={styles.recipName}>{form.receivedFrom || "—"}</Text>
          {form.receivedFromAddress && <Text style={styles.recipSub}>{form.receivedFromAddress}</Text>}
        </View>

        <View style={styles.amountBox}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Total Amount Received</Text>
            <Text style={styles.amountVal}>₹ {amtFmt}</Text>
          </View>
          <Text style={styles.amountWords}>{numToWords(amount)}</Text>
        </View>

        <View style={styles.detailsTable}>
          <View style={styles.detailLine}>
            <Text style={styles.detailLabel}>Payment Mode</Text>
            <Text style={styles.detailValue}>{form.paymentMode}</Text>
          </View>
          <View style={styles.detailLine}>
            <Text style={styles.detailLabel}>Transaction Purpose</Text>
            <Text style={styles.detailValue}>{form.purpose || "—"}</Text>
          </View>
          <View style={styles.detailLine}>
            <Text style={styles.detailLabel}>Transaction Date</Text>
            <Text style={styles.detailValue}>{form.receiptDate}</Text>
          </View>
        </View>

        {form.notes && (
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.label}>Compliance Notes</Text>
            <Text style={{ fontSize: 9, color: "#6B7280", marginTop: 4, lineHeight: 1.5 }}>{form.notes}</Text>
          </View>
        )}

        <View style={styles.signatureArea}>
          <View>
            {form.signature ? (
                <Image src={form.signature} style={{ height: 40, marginBottom: 4, objectFit: "contain", alignSelf: "center" }} />
            ) : (
                <View style={{ height: 40 }} />
            )}
            <View style={styles.sigLine}>
              <Text style={styles.sigLabel}>Authorised Seal & Signature</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Digital Release via DocMinty Pro</Text>
        </View>
      </Page>
    </Document>
  );
}
