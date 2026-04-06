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

export default function VoucherElegantTemplate({ form }) {
  const T = form.templateColor || "#D97706";
  const amount = parseFloat(form.amount) || 0;
  const amtFmt = amount.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const cState = INDIAN_STATES.find(s => s.code === form.companyState)?.name || "";
  const pState = INDIAN_STATES.find(s => s.code === form.paidToState)?.name || "";

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
    
    infoGrid: { flexDirection: "row", gap: 40, marginBottom: 32 },
    infoCol: { flex: 1 },
    colLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 },
    colName: { fontSize: 12, fontWeight: 700, marginBottom: 4 },
    colAddr: { fontSize: 9, color: "#6B7280", lineHeight: 1.4 },
    
    signArea: { marginTop: 40, flexDirection: "row", justifyContent: "space-between", gap: 20 },
    signBox: { flex: 1, borderTopWidth: 1, borderTopColor: T, paddingTop: 8, textAlign: "center" },
    sigImg: { height: 35, objectFit: "contain", marginBottom: 4, margin: "0 auto" },
    signName: { fontSize: 10, fontWeight: 700, color: "#111827" },
    signRole: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 80, right: 80, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center", fontStyle: "italic" },
    sidebarLine: { position: "absolute", left: 40, top: 60, bottom: 60, width: 2, backgroundColor: T }
  });

  return (
    <Document title={`Elegant-Voucher-${form.voucherNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebarLine} />
        <View style={styles.header}>
          <Text style={styles.title}>VOUCHER</Text>
          <Text style={styles.subtitle}>OFFICIAL DISBURSEMENT ACKNOWLEDGMENT</Text>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <View>
                <Text style={styles.colLabel}>Issuing Entity</Text>
                <Text style={styles.colName}>{form.companyName || "—"}</Text>
                <Text style={styles.colAddr}>
                    {form.companyAddress}{form.companyCity ? `, ${form.companyCity}, ${cState}` : ""}
                    {form.companyPhone && `\nPH: ${form.companyPhone}`}
                </Text>
            </View>
            <View style={{ textAlign: "right" }}>
                <Text style={styles.dateLine}>REF: #{form.voucherNumber}</Text>
                <Text style={styles.dateLine}>DATE: {form.voucherDate}</Text>
            </View>
        </View>

        <View style={styles.amtBox}>
          <Text style={styles.amtLabel}>Total Settlement Value</Text>
          <Text style={styles.amtVal}>₹ {amtFmt}</Text>
          <Text style={styles.amtWords}>{numToWords(amount)}</Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Beneficiary / Paid To</Text>
            <Text style={styles.value}>{form.paidTo || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction Purpose</Text>
            <Text style={styles.value}>{form.purpose || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Account Head</Text>
            <Text style={styles.value}>{form.accountHead || "GENERAL LEDGER"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{form.paymentMode}</Text>
          </View>
        </View>

        {form.narration && (
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.colLabel}>Transaction Narration</Text>
            <Text style={{ fontSize: 9, color: "#6B7280", marginTop: 4, lineHeight: 1.5 }}>{form.narration}</Text>
          </View>
        )}

        <View style={styles.signArea}>
          <View style={styles.signBox}>
            {form.signaturePrepared && <Image src={form.signaturePrepared} style={styles.sigImg} />}
            <Text style={styles.signName}>{form.preparedBy || "—"}</Text>
            <Text style={styles.signRole}>Preparer</Text>
          </View>
          <View style={styles.signBox}>
            {form.signatureApproved && <Image src={form.signatureApproved} style={styles.sigImg} />}
            <Text style={styles.signName}>{form.approvedBy || "—"}</Text>
            <Text style={styles.signRole}>Approval</Text>
          </View>
          <View style={styles.signBox}>
            <View style={{ height: form.signaturePrepared || form.signatureApproved ? 35 : 0 }} />
            <Text style={styles.signRole}>Receiver</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Secure Voucher Release — Powered by DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
