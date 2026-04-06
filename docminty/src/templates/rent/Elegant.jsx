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

export default function RentElegantTemplate({ form }) {
  const T = form.templateColor || "#D97706";
  const amount = parseFloat(form.rentAmount) || 0;
  const amtFmt = amount.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const lState = INDIAN_STATES.find(s => s.code === form.landlordState)?.name || "";
  const tState = INDIAN_STATES.find(s => s.code === form.tenantState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 9, color: "#111827", padding: "60 80", backgroundColor: "#FFFDFA" },
    header: { marginBottom: 40, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)", paddingBottom: 24, alignItems: "flex-start" },
    title: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 700, color: T, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" },
    subtitle: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 3, fontFamily: "Space Grotesk" },
    logo: { height: 40, objectFit: "contain", marginTop: 10 },
    
    dateLine: { fontSize: 9, color: "#9CA3AF", marginBottom: 32, textAlign: "right", fontFamily: "Inter" },
    
    amtBox: { margin: "24 0", padding: "24 0", borderTopWidth: 1, borderTopColor: T, borderBottomWidth: 1, borderBottomColor: T, alignItems: "center" },
    amtLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 },
    amtVal: { fontSize: 36, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    amtWords: { fontSize: 10, color: "#374151", marginTop: 16, fontWeight: 700, fontStyle: "italic" },
    
    detailsSection: { marginBottom: 32, padding: "16 0", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" },
    row: { flexDirection: "row", marginBottom: 12 },
    label: { width: 140, fontSize: 8, color: "#9CA3AF", textTransform: "uppercase" },
    value: { flex: 1, fontSize: 10, fontWeight: 700, color: "#111827" },
    
    sigArea: { marginTop: 48, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    llBox: { flex: 1 },
    llName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    llInfo: { fontSize: 8, color: "#6B7280", marginTop: 4, lineHeight: 1.5, maxWidth: 250 },
    
    signBox: { width: 160, borderTopWidth: 1.5, borderTopColor: T, paddingTop: 8 },
    signText: { fontSize: 8, color: T, textAlign: "center", textTransform: "uppercase", letterSpacing: 1 },
    
    footer: { position: "absolute", bottom: 40, left: 80, right: 80, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center", fontStyle: "italic" },
    sidebarLine: { position: "absolute", left: 40, top: 60, bottom: 60, width: 2, backgroundColor: T }
  });

  return (
    <Document title={`Elegant-RentReceipt-${form.receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebarLine} />
        <View style={styles.header}>
          <Text style={styles.title}>RENT RECEIPT</Text>
          <Text style={styles.subtitle}>OFFICIAL RESIDENTIAL LEASE ACKNOWLEDGMENT</Text>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
        </View>

        <Text style={styles.dateLine}>REF: #{form.receiptNumber}   |   PERIOD: {form.month} {form.year}   |   DATE: {form.receiptDate}</Text>

        <View style={styles.amtBox}>
          <Text style={styles.amtLabel}>Total Settlement Value</Text>
          <Text style={styles.amtVal}>₹ {amtFmt}</Text>
          <Text style={styles.amtWords}>{numToWords(amount)}</Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Tenant / Occupier</Text>
            <Text style={styles.value}>{form.tenantName || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Property Address</Text>
            <Text style={[styles.value, { fontWeight: 400, color: "#6B7280" }]}>
                {form.propertyAddress}{form.tenantCity ? `, ${form.tenantCity}, ${tState}` : ""}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tenant Contact</Text>
            <Text style={[styles.value, { fontWeight: 400, color: "#6B7280" }]}>
                {form.tenantPhone && `Ph: ${form.tenantPhone} `}
                {form.tenantEmail && ` | ${form.tenantEmail}`}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Settlement Mode</Text>
            <Text style={styles.value}>{form.paymentMode}</Text>
          </View>
        </View>

        <View style={styles.sigArea}>
          <View style={styles.llBox}>
            <Text style={styles.llName}>{form.landlordName || "Owner"}</Text>
            {form.landlordPan && <Text style={[styles.llInfo, { fontWeight: 700, color: "#111827" }]}>PAN Reference: {form.landlordPan}</Text>}
            <Text style={styles.llInfo}>
                {form.landlordAddress}{form.landlordCity ? `\n${form.landlordCity}, ${lState}` : ""}
                {form.landlordPhone && `\nPh: ${form.landlordPhone}`}
                {form.landlordEmail && `\nEm: ${form.landlordEmail}`}
            </Text>
            <Text style={[styles.llInfo, { marginTop: 12, fontStyle: "italic", color: "#0D9488" }]}>Valid for statutory HRA claims under Section 10(13A).</Text>
          </View>
          <View style={styles.signBox}>
            {form.signature ? (
                <Image src={form.signature} style={{ height: 40, marginBottom: 4, objectFit: "contain", alignSelf: "center" }} />
            ) : (
                <View style={{ height: 40 }} />
            )}
            <Text style={styles.signText}>Lessor Acknowledgment</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Secure Rent Release — Powered by DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
