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

export default function RentCorporateTemplate({ form }) {
  const T = form.templateColor || "#1E3A5F";
  const amount = parseFloat(form.rentAmount) || 0;
  const amtFmt = amount.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const lState = INDIAN_STATES.find(s => s.code === form.landlordState)?.name || "";
  const tState = INDIAN_STATES.find(s => s.code === form.tenantState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 9, color: "#111827", padding: "50 70", backgroundColor: "#ffffff" },
    header: { marginBottom: 32, textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 20 },
    logo: { height: 40, objectFit: "contain", marginBottom: 12, margin: "0 auto" },
    orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
    docType: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, fontFamily: "Space Grotesk" },
    
    dateRow: { marginTop: 24, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 12 },
    metaText: { fontSize: 9, color: "#6B7280", fontWeight: 700 },
    
    amtBox: { backgroundColor: "#F8FAFD", padding: "24 32", borderRadius: 8, margin: "24 0", borderLeftWidth: 4, borderLeftColor: T },
    amtRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    amtLabel: { fontSize: 10, fontWeight: 700, color: "#111827", textTransform: "uppercase" },
    amtVal: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 700, color: T },
    amtWords: { fontSize: 10, color: "#374151", borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 12, fontWeight: 700, fontStyle: "italic" },
    
    detailsTable: { marginBottom: 32, padding: "16 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    row: { flexDirection: "row", marginBottom: 10 },
    label: { width: 140, fontSize: 9, color: "#6B7280", textTransform: "uppercase" },
    value: { flex: 1, fontSize: 10, fontWeight: 700, color: "#111827" },
    
    sigArea: { marginTop: 48, flexDirection: "row", justifyContent: "space-between", gap: 32 },
    signBox: { flex: 1, borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 8 },
    signName: { fontSize: 11, fontWeight: 700, color: "#111827", textAlign: "center" },
    signRole: { fontSize: 8, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 70, right: 70, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Corporate-RentReceipt-${form.receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.orgName}>RENTAL ACKNOWLEDGMENT</Text>
          <Text style={styles.docType}>Official Record of Property Lease Payment</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <View>
                <Text style={{ fontSize: 9, color: "#6B7280", maxWidth: 250 }}>
                    Landlord: {form.landlordName || "—"}
                    {form.landlordAddress && `\n${form.landlordAddress}${form.landlordCity ? `, ${form.landlordCity}` : ""}`}
                </Text>
                {form.landlordPan && <Text style={{ fontSize: 9, fontWeight: 700, color: T, marginTop: 4 }}>PAN: {form.landlordPan}</Text>}
            </View>
            <View style={{ textAlign: "right" }}>
                <Text style={styles.metaText}>REF: #{form.receiptNumber}</Text>
                <Text style={styles.metaText}>DATE: {form.receiptDate}</Text>
            </View>
        </View>

        <View style={styles.amtBox}>
          <View style={styles.amtRow}>
            <Text style={styles.amtLabel}>Confirmed Rent Value</Text>
            <Text style={styles.amtVal}>₹ {amtFmt}</Text>
          </View>
          <Text style={styles.amtWords}>{numToWords(amount)}</Text>
        </View>

        <View style={styles.detailsTable}>
          <View style={styles.row}>
            <Text style={styles.label}>Tenant Information</Text>
            <Text style={styles.value}>{form.tenantName || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rental Period</Text>
            <Text style={styles.value}>{form.month} {form.year}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Property Location</Text>
            <Text style={[styles.value, { fontWeight: 400, color: "#6B7280" }]}>
                {form.propertyAddress}{form.propertyCity ? `, ${form.propertyCity}` : ""}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Mechanism</Text>
            <Text style={styles.value}>{form.paymentMode}</Text>
          </View>
        </View>

        <View style={styles.sigArea}>
          <View>
            <Text style={{ fontSize: 7, color: "#9CA3AF", textTransform: "uppercase" }}>Compliance Declaration</Text>
            <Text style={{ fontSize: 9, color: "#6B7280", marginTop: 4, maxWidth: 240 }}>Certified for HRA income tax deductions under Section 10(13A). Issued in accordance with standard property rental protocols.</Text>
          </View>
          <View style={styles.signBox}>
            {form.signature ? (
                <Image src={form.signature} style={{ height: 40, marginBottom: 4, objectFit: "contain", alignSelf: "center" }} />
            ) : (
                <View style={{ height: 40 }} />
            )}
            <Text style={styles.signName}>{form.landlordName || "Owner"}</Text>
            <Text style={styles.signRole}>Lessor Signature</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Residential Release via DocMinty Pro</Text>
        </View>
      </Page>
    </Document>
  );
}
