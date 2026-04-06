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

export default function RentModernTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const amount = parseFloat(form.rentAmount) || 0;
  const lState = INDIAN_STATES.find(s => s.code === form.landlordState)?.name || "";
  const tState = INDIAN_STATES.find(s => s.code === form.tenantState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
    header: { backgroundColor: T, padding: "30 50", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    docType: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 800, color: "#ffffff", letterSpacing: 1 },
    headerPeriod: { fontSize: 14, fontWeight: 700, color: "#ffffff", fontFamily: "Space Grotesk" },
    logo: { height: 40, objectFit: "contain", filter: "brightness(0) invert(1)" },
    
    main: { padding: "40 50" },
    metaRow: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 15, marginBottom: 30 },
    metaItem: { fontSize: 10, color: "#6B7280" },
    metaVal: { fontWeight: 700, color: "#111827" },
    
    amountHighlight: { backgroundColor: "#F0FDFA", borderAround: `1 solid #E5E7EB`, padding: "20 30", borderRadius: 12, textAlign: "center", marginBottom: 32 },
    amtLabel: { fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 },
    amtVal: { fontSize: 36, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    amtWords: { fontSize: 12, color: "#374151", fontStyle: "italic", marginTop: 10 },
    
    infoGrid: { flexDirection: "row", gap: 40, marginBottom: 32 },
    infoCol: { flex: 1 },
    colLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontWeight: 700 },
    colName: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 5 },
    colAddr: { fontSize: 9, color: "#4B5563", lineHeight: 1.5 },
    pan: { fontSize: 10, fontWeight: 700, color: T, marginTop: 10 },
    
    payDetails: { flexDirection: "row", padding: "15 0", borderTopWidth: 1, borderTopColor: "#F3F4F6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", marginBottom: 24 },
    payItem: { flex: 1 },
    payLabel: { fontSize: 9, color: "#9CA3AF", marginBottom: 3 },
    payVal: { fontSize: 12, fontWeight: 700, color: "#111827" },
    
    hraFooter: { padding: "10 15", backgroundColor: "#F0FDFA", borderLeft: `4 solid ${T}`, marginBottom: 30 },
    hraText: { fontSize: 10, color: "#0D9488", fontWeight: 600 },
    
    footer: { position: "absolute", bottom: 40, left: 50, right: 50, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    fText: { fontSize: 9, color: "#D1D5DB" },
    sigBox: { textAlign: "right", minWidth: 140 },
    signature: { height: 45, width: 140, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 6 },
    sigLabel: { fontSize: 10, color: "#9CA3AF" }
  });

  return (
    <Document title={`Rent-Receipt-Modern-${form.month}-${form.year}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <View>
                <Text style={styles.docType}>RENTAL RECEIPT</Text>
                <Text style={styles.headerPeriod}>{form.month} {form.year}</Text>
            </View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
        </View>

        <View style={styles.main}>
          <View style={styles.metaRow}>
              <Text style={styles.metaItem}>Receipt Number: <Text style={styles.metaVal}>#{form.receiptNumber}</Text></Text>
              <Text style={styles.metaItem}>Date: <Text style={styles.metaVal}>{form.receiptDate}</Text></Text>
          </View>

          <View style={styles.amountHighlight}>
            <Text style={styles.amtLabel}>Total Rent Paid</Text>
            <Text style={styles.amtVal}>Rs. {amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.amtWords}>{numToWords(amount)}</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.colLabel}>Tenant Information</Text>
              <Text style={styles.colName}>{form.tenantName || "—"}</Text>
              <Text style={styles.colAddr}>
                {form.propertyAddress}{form.tenantCity ? `\n${form.tenantCity}, ${tState}` : ""}
                {(form.tenantPhone || form.tenantEmail) && `\n\n${form.tenantPhone ? "Ph: " + form.tenantPhone : ""}${form.tenantEmail ? "\nEm: " + form.tenantEmail : ""}`}
              </Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.colLabel}>Landlord Information</Text>
              <Text style={styles.colName}>{form.landlordName || "—"}</Text>
              <Text style={styles.colAddr}>
                {form.landlordAddress}{form.landlordCity ? `\n${form.landlordCity}, ${lState}` : ""}
                {(form.landlordPhone || form.landlordEmail) && `\n\n${form.landlordPhone ? "Ph: " + form.landlordPhone : ""}${form.landlordEmail ? "\nEm: " + form.landlordEmail : ""}`}
              </Text>
              {form.landlordPan && <Text style={styles.pan}>PAN: {form.landlordPan}</Text>}
            </View>
          </View>

          <View style={styles.payDetails}>
            <View style={styles.payItem}>
              <Text style={styles.payLabel}>Rental Period</Text>
              <Text style={styles.payVal}>{form.month} {form.year}</Text>
            </View>
            <View style={styles.payItem}>
              <Text style={styles.payLabel}>Payment Method</Text>
              <Text style={styles.payVal}>{form.paymentMode}</Text>
            </View>
          </View>

          <View style={styles.hraFooter}>
            <Text style={styles.hraText}>Valid documentation for HRA exemption claims as per income tax regulations.</Text>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.fText}>Certified Digital Release via DocMinty.com</Text>
            <View style={styles.sigBox}>
              {form.signature ? (
                <Image src={form.signature} style={styles.signature} />
              ) : (
                <View style={{ height: 45 }} />
              )}
              <View style={styles.sigLine}>
                <Text style={styles.sigLabel}>Landlord Signature</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
