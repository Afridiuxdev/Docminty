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
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", backgroundColor: "#ffffff" },
    topStripe: { height: 6, backgroundColor: T },
    header: { padding: "18 50 14", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
    logo: { height: 32, objectFit: "contain", marginBottom: 6 },
    compName: { fontFamily: "Space Grotesk", fontSize: 22, fontWeight: 700, color: "#111827" },
    compDetails: { fontSize: 9, color: "#9CA3AF", marginTop: 5, lineHeight: 1.6 },
    
    headerRight: { textAlign: "right", paddingTop: 4 },
    docType: { fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 },
    receiptNum: { fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 13, color: T, marginTop: 4 },
    receiptDate: { fontSize: 9, color: "#9CA3AF", marginTop: 3 },
    
    body: { padding: "24 50 40" },
    amtBox: { backgroundColor: "#F0FDFA", border: `2 solid ${T}`, borderRadius: 10, padding: "20 24", textAlign: "center", marginBottom: 20 },
    amtLabel: { fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    amtVal: { fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 36, color: T },
    amtWords: { fontSize: 12, color: "#374151", marginTop: 8, fontStyle: "italic" },
    
    table: { marginBottom: 16 },
    tableRow: { flexDirection: "row", padding: "8 0" },
    tableLabel: { width: "40%", fontWeight: 700, color: "#6B7280" },
    tableVal: { flex: 1, color: "#111827" },
    modeTag: { backgroundColor: "#F0FDFA", color: T, padding: "2 8", borderRadius: 4, fontWeight: 700, fontSize: 11 },
    
    notes: { marginTop: 16, padding: "10 14", backgroundColor: "#F8F9FA", borderRadius: 6, borderLeft: `3 solid ${T}` },
    notesLabel: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
    notesText: { fontSize: 12, color: "#374151" },
    
    footer: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    fText: { fontSize: 10, color: "#D1D5DB" },
    sigArea: { textAlign: "right", minWidth: 120 },
    signature: { height: 45, width: 140, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4 },
    sigLabel: { fontSize: 10, color: "#9CA3AF" }
  });

  return (
    <Document title={`Receipt-Minimal-${form.receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.topStripe} />
        
        <View style={styles.header}>
          <View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.compName}>{form.fromName || "Your Business Name"}</Text>
            {(form.fromAddress || fromState || form.fromPhone || form.fromEmail) && (
              <Text style={styles.compDetails}>
                {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState}` : ""}
                {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? "Ph: " + form.fromPhone : ""}${form.fromPhone && form.fromEmail ? "  ·  " : ""}${form.fromEmail ? "Em: " + form.fromEmail : ""}`}
              </Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docType}>Receipt</Text>
            <Text style={styles.receiptNum}>#{form.receiptNumber}</Text>
            <Text style={styles.receiptDate}>{form.receiptDate}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.amtBox}>
            <Text style={styles.amtLabel}>Amount Received</Text>
            <Text style={styles.amtVal}>Rs.{amtFmt}</Text>
            <Text style={styles.amtWords}>{numToWords(amount)}</Text>
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
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Date</Text>
              <Text style={styles.tableVal}>{form.receiptDate}</Text>
            </View>
          </View>

          {form.notes && (
            <View style={styles.notes}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{form.notes}</Text>
            </View>
          )}

          <View style={styles.footer} wrap={false}>
            <Text style={styles.fText}>Generated by DocMinty.com</Text>
            <View style={styles.sigArea}>
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
