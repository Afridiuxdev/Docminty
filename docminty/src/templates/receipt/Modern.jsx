"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function ReceiptModernTemplate({ form }) {
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
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, flexDirection: "row", backgroundColor: "#ffffff" },
    sidebar: { width: 140, backgroundColor: T, height: "100%", padding: "40 16", color: "#ffffff" },
    logo: { width: 45, objectFit: "contain", marginBottom: 24, filter: "brightness(0) invert(1)" },
    sideTitle: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginBottom: 40 },
    sideItem: { marginBottom: 24 },
    sideLabel: { fontSize: 8, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    sideValue: { fontSize: 11, fontWeight: 700, color: "#ffffff", lineHeight: 1.4 },
    
    main: { flex: 1, padding: "40 40 40 40" },
    amountBox: { backgroundColor: "#F0FDFA", borderAround: `2 solid ${T}`, padding: "24 30", borderRadius: 12, textAlign: "center", marginBottom: 30 },
    amountLabel: { fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
    amountVal: { fontSize: 36, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    amountWords: { fontSize: 12, color: "#374151", marginTop: 8, fontStyle: "italic" },
    
    table: { marginTop: 10 },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "12 0" },
    tableLabel: { width: "35%", fontWeight: 700, color: "#6B7280" },
    tableVal: { width: "65%", color: "#111827" },
    modeTag: { backgroundColor: "#F0FDFA", color: T, padding: "2 8", borderRadius: 4, fontWeight: 700 },
    
    notes: { marginTop: 20, padding: 12, backgroundColor: "#F8F9FA", borderAround: `1 solid #E5E7EB`, borderRadius: 6 },
    notesLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    
    footer: { position: "absolute", bottom: 40, left: 40, right: 40, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    footerText: { fontSize: 8, color: "#D1D5DB" },
    sigBox: { textAlign: "right", minWidth: 140 },
    signature: { height: 45, width: 140, objectFit: "contain", marginBottom: 5, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 6 },
    sigLabel: { fontSize: 10, color: "#9CA3AF" }
  });

  return (
    <Document title={`Receipt-${form.receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.sideTitle}>RECEIPT</Text>
          
          <View style={styles.sideItem}>
            <Text style={styles.sideLabel}>From</Text>
            <Text style={styles.sideValue}>{form.fromName || "Company"}</Text>
            <Text style={{ fontSize: 9, opacity: 0.8, marginTop: 4 }}>
              {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState}` : ""}
              {form.fromPhone && `\nPh: ${form.fromPhone}`}
              {form.fromEmail && `\n${form.fromEmail}`}
            </Text>
          </View>
          
          <View style={styles.sideItem}>
              <Text style={styles.sideLabel}>Receipt No</Text>
              <Text style={styles.sideValue}>#{form.receiptNumber}</Text>
          </View>
          
          <View style={styles.sideItem}>
              <Text style={styles.sideLabel}>Date</Text>
              <Text style={styles.sideValue}>{form.receiptDate}</Text>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total Amount Paid</Text>
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

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Certified Digital Receipt — DocMinty.com</Text>
            <View style={styles.sigBox}>
              {form.signature ? (
                <Image src={form.signature} style={styles.signature} />
              ) : (
                <View style={{ height: 45 }} />
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
