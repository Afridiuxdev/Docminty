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

export default function ReceiptElegantTemplate({ form }) {
  const T = form.templateColor || "#D97706";
  const amount = parseFloat(form.amount) || 0;
  const amtFmt = amount.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "60 80", backgroundColor: "#FFFDFA" },
    header: { marginBottom: 40, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)", paddingBottom: 24, alignItems: "flex-start" },
    title: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 700, color: T, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" },
    subtitle: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 3, fontFamily: "Space Grotesk", fontWeight: 700 },
    
    dateLine: { fontSize: 9, color: "#9CA3AF", marginBottom: 32, textAlign: "right", fontFamily: "Inter" },
    
    recipient: { marginBottom: 32 },
    recipLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Space Grotesk", fontWeight: 700 },
    recipName: { fontSize: 13, fontWeight: 700, color: "#111827" },
    recipSub: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
    
    amountBox: { margin: "24 0", padding: "24 0", borderTopWidth: 1, borderTopColor: T, borderBottomWidth: 1, borderBottomColor: T, alignItems: "center" },
    amountLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, fontFamily: "Space Grotesk", fontWeight: 700 },
    amountVal: { fontSize: 36, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    amountWords: { fontSize: 10, color: "#374151", marginTop: 16, fontWeight: 700, fontStyle: "italic" },
    
    detailsSection: { marginBottom: 32, padding: "16 0", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" },
    detailLine: { flexDirection: "row", marginBottom: 10 },
    detailLabel: { width: 140, fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", fontFamily: "Space Grotesk", fontWeight: 700 },
    detailValue: { flex: 1, fontSize: 10, fontWeight: 700, color: "#111827" },
    
    signatureSection: { marginTop: 48, flexDirection: "row", justifyContent: "flex-end" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: T, paddingTop: 8, width: 160 },
    sigName: { fontSize: 11, fontWeight: 700, color: "#111827", textAlign: "center" },
    sigLabel: { fontSize: 8, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 80, right: 80, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center", fontStyle: "italic" },
    sidebarLine: { position: "absolute", left: 40, top: 60, bottom: 60, width: 2, backgroundColor: T }
  });

  return (
    <Document title={`Elegant-Receipt-${form.receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebarLine} />
        <View style={styles.header}>
          <Text style={styles.title}>RECEIPT</Text>
          <Text style={styles.subtitle}>{form.fromName || "Professional Financial Release"}</Text>
          {form.logo && <Image src={form.logo} style={{ height: 35, objectFit: "contain", marginTop: 10 }} />}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 32 }}>
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
                <Text style={styles.dateLine}>REF: #{form.receiptNumber}</Text>
                <Text style={styles.dateLine}>DATE: {form.receiptDate}</Text>
            </View>
        </View>

        <View style={styles.recipient}>
          <Text style={styles.recipLabel}>Received From</Text>
          <Text style={styles.recipName}>{form.receivedFrom || "—"}</Text>
          {form.receivedFromAddress && <Text style={styles.recipSub}>{form.receivedFromAddress}</Text>}
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Total Payment Executed</Text>
          <Text style={styles.amountVal}>₹{amtFmt}</Text>
          <Text style={styles.amountWords}>{numToWords(amount)}</Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailLine}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{form.paymentMode}</Text>
          </View>
          <View style={styles.detailLine}>
            <Text style={styles.detailLabel}>Transaction Purpose</Text>
            <Text style={styles.detailValue}>{form.purpose || "—"}</Text>
          </View>
        </View>

        {form.notes && (
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.recipLabel}>Special Annotation</Text>
            <Text style={{ fontSize: 9, color: "#6B7280", marginTop: 4, lineHeight: 1.5 }}>{form.notes}</Text>
          </View>
        )}

        <View style={styles.signatureSection}>
          <View>
            {form.signature ? (
                <Image src={form.signature} style={{ height: 45, marginBottom: 4, objectFit: "contain", alignSelf: "center" }} />
            ) : (
                <View style={{ height: 45 }} />
            )}
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>Authorised Official</Text>
              <Text style={styles.sigLabel}>Seal & Confirmation</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Secure Digital Record — DocMinty Elegant</Text>
        </View>
      </Page>
    </Document>
  );
}
