"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

function numToWords(n) {
  if (!n || n === 0) return "Zero Rupees Only";
  var ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  var tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
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
  const amtFmt = amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const lState = INDIAN_STATES.find(s => s.code === form.landlordState)?.name || "";
  const tState = INDIAN_STATES.find(s => s.code === form.tenantState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "0 0 40", backgroundColor: "#ffffff" },
    banner: { backgroundColor: T, padding: "18 24", flexDirection: "row", justifyContent: "space-between", alignItems: "center", color: "#ffffff" },
    bannerLeft: { flex: 1 },
    landlordHeader: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff" },
    landlordSub: { fontSize: 10, color: "#ffffff", opacity: 0.8, marginTop: 2, lineHeight: 1.4 },
    
    bannerRight: { textAlign: "right" },
    docType: { fontSize: 20, fontFamily: "Space Grotesk", fontWeight: 800, color: "#ffffff" },
    receiptNum: { fontSize: 11, color: "#ffffff", opacity: 0.8, marginTop: 2 },
    
    body: { padding: "24 24" },
    amtBox: { backgroundColor: T + "10", border: `2 solid ${T}`, padding: "16 20", borderRadius: 8, textAlign: "center", marginBottom: 16 },
    amtLabel: { fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4, fontFamily: "Space Grotesk" },
    amtVal: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 800, color: T, marginBottom: 4 },
    amtWords: { fontSize: 11, color: "#374151", fontStyle: "italic" },
    
    infoGrid: { flexDirection: "row", gap: 24, marginBottom: 20 },
    infoCol: { flex: 1 },
    colLabel: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700, marginBottom: 6, fontFamily: "Space Grotesk" },
    colName: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 },
    colText: { fontSize: 11, color: "#4B5563", lineHeight: 1.4 },
    pan: { fontSize: 11, fontWeight: 600, color: "#111827", marginTop: 6 },
    
    summaryRow: { flexDirection: "row", gap: 24, padding: "12 0", borderTopWidth: 1, borderTopColor: "#F3F4F6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", marginBottom: 20 },
    sumItem: { flex: 1 },
    sumLabel: { fontSize: 11, color: "#9CA3AF", marginBottom: 2, fontFamily: "Space Grotesk" },
    sumVal: { fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk" },
    
    hraNote: { marginTop: 16, padding: "8 12", backgroundColor: T + "08", borderLeft: `3 solid ${T}` },
    hraText: { fontSize: 10, color: T },
    
    footer: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    fText: { fontSize: 10, color: "#D1D5DB" },
    sigArea: { textAlign: "center" },
    signature: { height: 40, width: 120, objectFit: "contain", marginBottom: 4 },
    sigLabel: { fontSize: 10, color: "#9CA3AF" }
  });

  return (
    <Document title={`RentReceipt-${form.month}-${form.year}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.landlordHeader}>{form.landlordName || "Landlord"}</Text>
            <Text style={styles.landlordSub}>
              {form.landlordAddress} {form.landlordCity && `${form.landlordCity}, `} {lState}
              {(form.landlordPhone || form.landlordEmail) && `\nPH: ${form.landlordPhone || "—"} | EM: ${form.landlordEmail || "—"}`}
            </Text>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.docType}>RENT RECEIPT</Text>
            <Text style={styles.receiptNum}>#{form.receiptNumber}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.amtBox}>
            <Text style={styles.amtLabel}>Rent Amount</Text>
            <Text style={styles.amtVal}>Rs. {amtFmt}</Text>
            <Text style={styles.amtWords}>{numToWords(amount)}</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.colLabel}>Received From (Tenant)</Text>
              <Text style={styles.colName}>{form.tenantName || "—"}</Text>
              <View style={styles.colText}>
                <Text>{form.propertyAddress}</Text>
                <Text>{form.tenantCity ? form.tenantCity + ", " : ""}{tState}</Text>
                {form.tenantPhone && <Text>Ph: {form.tenantPhone}</Text>}
                {form.tenantEmail && <Text>Em: {form.tenantEmail}</Text>}
              </View>
            </View>
            
            <View style={styles.infoCol}>
              <Text style={styles.colLabel}>Landlord Details</Text>
              <Text style={styles.colName}>{form.landlordName || "—"}</Text>
              <View style={styles.colText}>
                <Text>{form.landlordAddress}</Text>
                <Text>{form.landlordCity ? form.landlordCity + ", " : ""}{lState}</Text>
                {form.landlordPhone && <Text>Ph: {form.landlordPhone}</Text>}
                {form.landlordEmail && <Text>Em: {form.landlordEmail}</Text>}
              </View>
              {form.landlordPan && <Text style={styles.pan}>PAN: {form.landlordPan}</Text>}
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.sumItem}>
              <Text style={styles.sumLabel}>Rent Period</Text>
              <Text style={styles.sumVal}>{form.month + " " + form.year}</Text>
            </View>
            <View style={styles.sumItem}>
              <Text style={styles.sumLabel}>Payment Mode</Text>
              <Text style={styles.sumVal}>{form.paymentMode || "—"}</Text>
            </View>
          </View>

          <View style={styles.hraNote}>
            <Text style={styles.hraText}>Valid for HRA exemption claim under Section 10(13A) of Income Tax Act.</Text>
          </View>

          <View style={styles.footer} wrap={false}>
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
        </View>
      </Page>
    </Document>
  );
}
