"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function ReceiptClassicTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const amount = parseFloat(form.amount) || 0;
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";

  function numToWords(n) {
    if (n === 0) return "Zero";
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

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "40 60", backgroundColor: "#ffffff" },
    header: { backgroundColor: T, padding: "20 30", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30, borderRadius: 4 },
    logo: { height: 40, objectFit: "contain", marginBottom: 5 },
    title: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 900, color: "#ffffff", letterSpacing: 1 },
    compName: { fontSize: 14, fontWeight: 700, color: "#ffffff" },
    compInfo: { fontSize: 9, color: "rgba(255,255,255,0.85)", marginTop: 2, maxWidth: 250, lineHeight: 1.4 },
    
    metaSection: { textAlign: "right", color: "#ffffff" },
    metaText: { fontSize: 10, marginBottom: 4 },
    
    body: { padding: "0 10" },
    amountBox: { backgroundColor: "#F0FDFA", border: `2 solid ${T}`, padding: "20 30", borderRadius: 8, textAlign: "center", marginBottom: 30 },
    amountLabel: { fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5, fontFamily: "Space Grotesk", fontWeight: 700 },
    amountVal: { fontSize: 32, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    amountWords: { fontSize: 11, color: "#374151", marginTop: 8, fontStyle: "italic" },
    
    table: { marginTop: 10 },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "10 0" },
    tableLabel: { width: "35%", fontWeight: 700, color: "#6B7280", fontFamily: "Space Grotesk" },
    tableVal: { width: "65%", color: "#111827" },
    modeTag: { backgroundColor: "#F0FDFA", color: T, padding: "2 8", borderRadius: 4, fontWeight: 700 },
    
    notes: { marginTop: 20, padding: 12, backgroundColor: "#F8F9FA", borderLeft: `3 solid ${T}`, borderRadius: 4 },
    notesLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    
    footer: { marginTop: 40, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    footerLeft: { fontSize: 9, color: "#D1D5DB" },
    sigBox: { textAlign: "right", minWidth: 140 },
    signature: { height: 40, width: 120, objectFit: "contain", marginBottom: 5, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 5 },
    sigLabel: { fontSize: 9, color: "#9CA3AF" }
  });

  return (
    <Document title={`Receipt-${form.receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.compName}>{form.fromName || "Your Business Name"}</Text>
            <Text style={styles.compInfo}>
              {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState}` : ""}
              {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? "Ph: " + form.fromPhone : ""}${form.fromEmail ? " | Em: " + form.fromEmail : ""}`}
            </Text>
          </View>
          <View style={styles.metaSection}>
            <Text style={styles.title}>RECEIPT</Text>
            <Text style={styles.metaText}>#{form.receiptNumber}</Text>
            <Text style={styles.metaText}>Date: {form.receiptDate}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total Amount Received</Text>
            <Text style={styles.amountVal}>Rs. {amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.amountWords}>{numToWords(amount)}</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Received From</Text>
              <Text style={styles.tableVal}>{form.receivedFrom || "—"}</Text>
            </View>
            {form.receivedFromAddress && (
                <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Address</Text>
                    <Text style={styles.tableVal}>{form.receivedFromAddress}</Text>
                </View>
            )}
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Payment Mode</Text>
              <Text style={styles.tableVal}><Text style={styles.modeTag}>{form.paymentMode}</Text></Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Purpose</Text>
              <Text style={styles.tableVal}>{form.purpose || "—"}</Text>
            </View>
          </View>

          {form.notes && (
            <View style={styles.notes}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text>{form.notes}</Text>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerLeft}>Generated via DocMinty.com</Text>
            <View style={styles.sigBox}>
              {form.signature ? (
                <Image src={form.signature} style={styles.signature} />
              ) : (
                <View style={{ height: 40 }} />
              )}
              <View style={styles.sigLine}>
                <Text style={styles.sigLabel}>Authorised Signatory</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
