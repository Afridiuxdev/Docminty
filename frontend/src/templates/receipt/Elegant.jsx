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
  const amtFmt = amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff", flexDirection: "row" },
    accentBar: { width: 5, backgroundColor: T, flexShrink: 0 },
    content: { flex: 1, padding: "24 30" },

    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 16, marginBottom: 20 },
    headerLeft: { maxWidth: "60%" },
    logo: { height: 40, objectFit: "contain", marginBottom: 8, alignSelf: "flex-start" },
    fromName: { fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 },
    fromAddr: { fontSize: 10, color: "#6B7280", lineHeight: 1.5 },
    fromContact: { fontSize: 10, color: "#9CA3AF", marginTop: 3, lineHeight: 1.5 },

    headerRight: { textAlign: "right" },
    title: { fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 28, color: T },
    receiptNum: { fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginTop: 6 },
    receiptDate: { fontSize: 10, color: "#9CA3AF", marginTop: 2 },

    amtBox: { backgroundColor: "#F0FDFA", borderWidth: 2, borderColor: T, borderRadius: 10, padding: "20 24", textAlign: "center", marginBottom: 20 },
    amtLabel: { fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    amtVal: { fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 36, color: T },
    amtWords: { fontSize: 12, color: "#374151", marginTop: 8, fontStyle: "italic" },

    table: { marginBottom: 16 },
    tableRow: { flexDirection: "row", padding: "8 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    tableLabel: { width: "40%", fontWeight: 700, color: "#6B7280" },
    tableVal: { flex: 1, color: "#111827" },
    modeTag: { backgroundColor: "#F0FDFA", color: T, paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8, borderRadius: 4, fontWeight: 700, fontSize: 11 },

    notes: { marginTop: 16, padding: "10 14", backgroundColor: "#F8F9FA", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: T },
    notesLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },

    footer: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    fText: { fontSize: 9, color: "#D1D5DB" },
    sigArea: { textAlign: "right", minWidth: 120 },
    signature: { height: 45, width: 140, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4 },
    sigLabel: { fontSize: 9, color: "#9CA3AF" }
  });

  return (
    <Document title={`Elegant-Receipt-${form.receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {form.logo && <Image src={form.logo} style={styles.logo} />}
              <Text style={styles.fromName}>{form.fromName || "Your Business Name"}</Text>
              {(form.fromAddress || fromState) && (
                <Text style={styles.fromAddr}>
                  {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState}` : ""}
                </Text>
              )}
              {(form.fromPhone || form.fromEmail) && (
                <Text style={styles.fromContact}>
                  {form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? "  |  " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}
                </Text>
              )}
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.title}>RECEIPT</Text>
              <Text style={styles.receiptNum}>#{form.receiptNumber}</Text>
              <Text style={styles.receiptDate}>{form.receiptDate}</Text>
            </View>
          </View>

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
              <Text>{form.notes}</Text>
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
