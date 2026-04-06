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

export default function RentMinimalTemplate({ form }) {
  const T = form.templateColor || "#111827";
  const amount = parseFloat(form.rentAmount) || 0;
  const amtFmt = amount.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const lState = INDIAN_STATES.find(s => s.code === form.landlordState)?.name || "";
  const tState = INDIAN_STATES.find(s => s.code === form.tenantState)?.name || "";

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
    
    amtHighlight: { margin: "16 0 32 0", borderTopWidth: 1, borderTopColor: "#F3F4F6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "24 0", alignItems: "center" },
    amtLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
    amtValue: { fontSize: 32, fontFamily: "Space Grotesk", fontWeight: 700, color: T },
    amtWords: { fontSize: 9, color: "#111827", marginTop: 12, fontWeight: 700, fontStyle: "italic" },
    
    table: { marginBottom: 32 },
    row: { flexDirection: "row", padding: "10 0", borderBottomWidth: 1, borderBottomColor: "#F9FAFB" },
    label: { width: 140, fontSize: 8, color: "#9CA3AF", textTransform: "uppercase" },
    value: { flex: 1, fontSize: 10, fontWeight: 700, color: "#111827" },
    
    signArea: { marginTop: 40, flexDirection: "row", justifyContent: "space-between", gap: 32, alignItems: "flex-end" },
    llBox: { flex: 1.5 },
    sigBox: { flex: 1, borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 8 },
    sigText: { fontSize: 9, fontWeight: 700, color: "#111827", textAlign: "center", textTransform: "uppercase" },
    
    footer: { position: "absolute", bottom: 48, left: 64, right: 64, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`RentReceipt-Minimal-${form.receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.top}>
          <Text style={styles.title}>Rent Receipt</Text>
          <Text style={styles.date}>{form.receiptDate}</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Tenant</Text>
            <Text style={styles.metaValue}>{form.tenantName || "—"}</Text>
            <Text style={styles.metaSub}>
                {form.tenantPhone && `Ph: ${form.tenantPhone}\n`}
                {form.tenantEmail}
            </Text>
          </View>
          <View style={[styles.metaBox, { textAlign: "right", alignItems: "flex-end" }]}>
            <Text style={styles.metaLabel}>Settlement Ref</Text>
            <Text style={styles.metaValue}>#{form.receiptNumber}</Text>
            <Text style={[styles.metaSub, { textAlign: "right", fontWeight: 700 }]}>{form.month} {form.year}</Text>
          </View>
        </View>

        <View style={styles.amtHighlight}>
          <Text style={styles.amtLabel}>Total Rent Paid</Text>
          <Text style={styles.amtValue}>₹ {amtFmt}</Text>
          <Text style={styles.amtWords}>{numToWords(amount)}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.label}>Tenant Name</Text>
            <Text style={styles.value}>{form.tenantName || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Period Coverage</Text>
            <Text style={styles.value}>{form.month} {form.year}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Property Address</Text>
            <Text style={[styles.value, { fontWeight: 400, color: "#6B7280" }]}>
                {form.propertyAddress}{form.tenantCity ? `, ${form.tenantCity}, ${tState}` : ""}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Mechanism</Text>
            <Text style={styles.value}>{form.paymentMode}</Text>
          </View>
        </View>

        <View style={styles.signArea}>
          <View style={styles.llBox}>
            <Text style={styles.metaLabel}>Property Owner</Text>
            <Text style={styles.metaValue}>{form.landlordName || "—"}</Text>
            {form.landlordPan && <Text style={styles.metaSub}>PAN: {form.landlordPan}</Text>}
            <Text style={[styles.metaSub, { fontSize: 8, marginTop: 12 }]}>Valid for HRA exemption claims under prevailing IT laws.</Text>
          </View>
          <View style={styles.sigBox}>
            {form.signature ? (
                <Image src={form.signature} style={{ height: 40, marginBottom: 4, objectFit: "contain", alignSelf: "center" }} />
            ) : (
                <View style={{ height: 40 }} />
            )}
            <Text style={styles.sigText}>Lessor Signature</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Digital Receipt via DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
