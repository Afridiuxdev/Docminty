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

export default function ReceiptMinimalTemplate({ form }) {
  const T = form.templateColor || "#111827";
  const amount = parseFloat(form.amount) || 0;
  const amtFmt = amount.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "48 64", backgroundColor: "#ffffff" },
    top: { borderBottomWidth: 1.5, borderBottomColor: T, paddingBottom: 12, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    title: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1 },
    date: { fontSize: 10, color: "#9CA3AF" },
    
    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    metaBox: { flex: 1 },
    metaLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    metaValue: { fontSize: 11, fontWeight: 700, color: "#111827" },
    metaSub: { fontSize: 9, color: "#6B7280", marginTop: 2, maxWidth: 180, lineHeight: 1.4 },
    
    amountHighlight: { margin: "16 0 32 0", borderTopWidth: 1, borderTopColor: "#F3F4F6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "24 0", alignItems: "center" },
    amountLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
    amountValue: { fontSize: 32, fontFamily: "Space Grotesk", fontWeight: 700, color: T },
    amountWords: { fontSize: 9, color: "#111827", marginTop: 12, fontWeight: 700, fontStyle: "italic" },
    
    detailsSection: { marginBottom: 32 },
    detailLine: { flexDirection: "row", marginBottom: 12 },
    detailLabel: { width: 140, fontSize: 9, color: "#9CA3AF", textTransform: "uppercase" },
    detailValue: { flex: 1, fontSize: 10.5, fontWeight: 700, color: "#111827" },
    
    signatureArea: { marginTop: 40, flexDirection: "row", justifyContent: "flex-end" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 8, width: 150 },
    sigName: { fontSize: 10, fontWeight: 700, color: "#111827", textAlign: "center" },
    
    footer: { position: "absolute", bottom: 48, left: 64, right: 64, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Receipt-Minimal-${form.receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.top}>
          <Text style={styles.title}>Payment Receipt</Text>
          <Text style={styles.date}>{form.receiptDate}</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Organization</Text>
            <Text style={styles.metaValue}>{form.fromName || "Organization Name"}</Text>
            <Text style={styles.metaSub}>
                {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState}` : ""}
                {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? "Ph: " + form.fromPhone : ""}${form.fromEmail ? " | Em: " + form.fromEmail : ""}`}
            </Text>
          </View>
          <View style={[styles.metaBox, { textAlign: "right", alignItems: "flex-end" }]}>
            <Text style={styles.metaLabel}>Receipt Details</Text>
            <Text style={styles.metaValue}>#{form.receiptNumber}</Text>
            <Text style={[styles.metaSub, { textAlign: "right" }]}>{form.receivedFrom || "Valued Customer"}</Text>
          </View>
        </View>

        <View style={styles.amountHighlight}>
          <Text style={styles.amountLabel}>Total Amount Collected</Text>
          <Text style={styles.amountValue}>₹{amtFmt}</Text>
          <Text style={styles.amountWords}>{numToWords(amount)}</Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailLine}>
            <Text style={styles.detailLabel}>Received From</Text>
            <Text style={styles.detailValue}>{form.receivedFrom || "—"}</Text>
          </View>
          {form.receivedFromAddress && (
              <View style={styles.detailLine}>
                  <Text style={styles.detailLabel}>Payer Address</Text>
                  <Text style={styles.detailValue}>{form.receivedFromAddress}</Text>
              </View>
          )}
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
            <Text style={styles.metaLabel}>Notes</Text>
            <Text style={{ fontSize: 9, color: "#6B7280", marginTop: 4 }}>{form.notes}</Text>
          </View>
        )}

        <View style={styles.signatureArea}>
          <View>
            {form.signature ? (
              <Image src={form.signature} style={{ height: 35, marginBottom: 4, objectFit: "contain", alignSelf: "center" }} />
            ) : (
              <View style={{ height: 35 }} />
            )}
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>Authorised Signatory</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Digital Receipt via DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
