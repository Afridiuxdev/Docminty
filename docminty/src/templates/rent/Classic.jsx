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
    return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
  }
  return "Rupees " + convert(Math.floor(n)) + " Only";
}

export default function RentClassicTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const amount = parseFloat(form.rentAmount) || 0;
  const lState = INDIAN_STATES.find(s => s.code === form.landlordState)?.name || "";
  const tState = INDIAN_STATES.find(s => s.code === form.tenantState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "40 60", backgroundColor: "#ffffff" },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 15 },
    logo: { height: 48, objectFit: "contain", marginBottom: 5 },
    docType: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: T },
    receiptNo: { fontSize: 9, color: "#9CA3AF" },
    
    rightHead: { textAlign: "right" },
    period: { fontSize: 14, fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk" },
    date: { fontSize: 10, color: "#9CA3AF", marginTop: 4 },
    
    amountBox: { backgroundColor: "#F0FDFA", border: `2 solid ${T}`, padding: "20 30", borderRadius: 8, textAlign: "center", marginBottom: 24 },
    amtLabel: { fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    amtVal: { fontSize: 32, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    amtWords: { fontSize: 11, color: "#374151", fontStyle: "italic", marginTop: 8 },
    
    contacts: { flexDirection: "row", gap: 30, marginBottom: 24 },
    contactBox: { flex: 1 },
    label: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontWeight: 700 },
    name: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 4 },
    addr: { fontSize: 9, color: "#4B5563", lineHeight: 1.4 },
    pan: { fontSize: 10, fontWeight: 700, color: "#111827", marginTop: 8 },
    
    summary: { flexDirection: "row", padding: "12 0", borderTopWidth: 1, borderTopColor: "#F3F4F6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", marginBottom: 20 },
    sumItem: { flex: 1 },
    sumLabel: { fontSize: 9, color: "#9CA3AF", marginBottom: 2 },
    sumVal: { fontSize: 11, fontWeight: 600, color: "#111827" },
    
    hraNote: { padding: "8 12", backgroundColor: "#F0FDFA", borderLeft: `3 solid ${T}`, marginBottom: 24 },
    hraText: { fontSize: 9, color: "#065F46" },
    
    footer: { marginTop: "auto", borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    fText: { fontSize: 8, color: "#D1D5DB" },
    sigArea: { textAlign: "center" },
    signature: { height: 40, width: 120, objectFit: "contain", marginBottom: 4 },
    sigLabel: { fontSize: 9, color: "#9CA3AF" }
  });

  return (
    <Document title={`Rent-Receipt-${form.month}-${form.year}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.docType}>RENT RECEIPT</Text>
            <Text style={styles.receiptNo}>#{form.receiptNumber}</Text>
          </View>
          <View style={styles.rightHead}>
            <Text style={styles.period}>{form.month} {form.year}</Text>
            <Text style={styles.date}>Date: {form.receiptDate}</Text>
          </View>
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.amtLabel}>Confirmed Rent Payment</Text>
          <Text style={styles.amtVal}>Rs. {amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
          <Text style={styles.amtWords}>{numToWords(amount)}</Text>
        </View>

        <View style={styles.contacts}>
          <View style={styles.contactBox}>
            <Text style={styles.label}>Received From (Tenant)</Text>
            <Text style={styles.name}>{form.tenantName || "—"}</Text>
            <Text style={styles.addr}>
              {form.propertyAddress}{form.tenantCity ? `\n${form.tenantCity}, ${tState}` : ""}
              {(form.tenantPhone || form.tenantEmail) && `\n\n${form.tenantPhone ? "Ph: " + form.tenantPhone : ""}${form.tenantEmail ? "\nEm: " + form.tenantEmail : ""}`}
            </Text>
          </View>
          <View style={styles.contactBox}>
            <Text style={styles.label}>Landlord Details</Text>
            <Text style={styles.name}>{form.landlordName || "—"}</Text>
            <Text style={styles.addr}>
              {form.landlordAddress}{form.landlordCity ? `\n${form.landlordCity}, ${lState}` : ""}
              {(form.landlordPhone || form.landlordEmail) && `\n\n${form.landlordPhone ? "Ph: " + form.landlordPhone : ""}${form.landlordEmail ? "\nEm: " + form.landlordEmail : ""}`}
            </Text>
            {form.landlordPan && <Text style={styles.pan}>PAN: {form.landlordPan}</Text>}
          </View>
        </View>

        <View style={styles.summary}>
          <View style={styles.sumItem}>
            <Text style={styles.sumLabel}>Period</Text>
            <Text style={styles.sumVal}>{form.month} {form.year}</Text>
          </View>
          <View style={styles.sumItem}>
            <Text style={styles.sumLabel}>Payment Mode</Text>
            <Text style={styles.sumVal}>{form.paymentMode}</Text>
          </View>
        </View>

        <View style={styles.hraNote}>
          <Text style={styles.hraText}>This receipt is valid for HRA exemption claim under Section 10(13A) of Income Tax Act.</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.fText}>Generated by DocMinty.com</Text>
          <View style={styles.sigArea}>
            {form.signature ? (
              <Image src={form.signature} style={styles.signature} />
            ) : (
              <View style={{ height: 40 }} />
            )}
            <Text style={styles.sigLabel}>Landlord Signature</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
