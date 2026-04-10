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
  const T = form.templateColor || "#0D9488";
  const amount = parseFloat(form.amount) || 0;
  const cState = INDIAN_STATES.find(s => s.code === form.companyState)?.name || "";
  const pState = INDIAN_STATES.find(s => s.code === form.paidToState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "40 50", backgroundColor: "#ffffff" },
    headerSection: { paddingBottom: 12, marginBottom: 0 },
    headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 },
    logo: { height: 36, objectFit: "contain", marginBottom: 6 },
    compName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827" },
    compDetails: { fontSize: 10, color: "#6B7280", lineHeight: 1.4 },
    
    title: { fontSize: 22, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    metaText: { fontSize: 11, color: "#6B7280", textAlign: "right" },
    accentBar: { height: 4, backgroundColor: T, borderRadius: 2, marginBottom: 24 },
    
    body: { marginTop: 20 },
    amtBox: { backgroundColor: T + "10", border: `2 solid ${T}`, padding: "16 20", borderRadius: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    amtLabel: { fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2, fontFamily: "Space Grotesk" },
    amtVal: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    modeTag: { backgroundColor: T, color: "#ffffff", padding: "4 12", borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "Space Grotesk" },
    
    words: { fontSize: 12, color: "#374151", marginBottom: 16 },
    
    table: { marginBottom: 32 },
    row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "8 0" },
    label: { width: "35%", fontSize: 11, color: "#6B7280", fontWeight: 700, fontFamily: "Space Grotesk" },
    value: { flex: 1, fontSize: 11, color: "#111827", lineHeight: 1.4 },
    
    signatures: { flexDirection: "row", gap: 16, marginTop: 32 },
    sigCol: { flex: 1, textAlign: "center" },
    sigImg: { height: 40, maxWidth: 100, objectFit: "contain", marginBottom: 2, margin: "0 auto" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 6 },
    sigName: { fontSize: 11, fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk" },
    sigLabel: { fontSize: 10, color: "#9CA3AF" },
    
    footer: { position: "absolute", bottom: 40, left: 50, right: 50, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 10 },
    fText: { fontSize: 10, color: "#D1D5DB" }
  });

  return (
    <Document title={`Voucher-${form.voucherNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              {form.logo && <Image src={form.logo} style={styles.logo} />}
              <Text style={styles.compName}>{form.companyName || "Business Name"}</Text>
              <Text style={styles.compDetails}>
                {form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}, {cState}
                {(form.companyPhone || form.companyEmail) && `\n${form.companyPhone || ""} | ${form.companyEmail || ""}`}
              </Text>
            </View>
            <View style={{ textAlign: "right" }}>
              <Text style={styles.title}>PAYMENT VOUCHER</Text>
              <Text style={styles.metaText}>#{form.voucherNumber}</Text>
            </View>
          </View>
          <View style={styles.accentBar} />
        </View>

        <View style={styles.body}>
          <View style={styles.amtBox}>
            <View>
              <Text style={styles.amtLabel}>Amount Paid</Text>
              <Text style={styles.amtVal}>Rs.{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
            </View>
            <Text style={styles.modeTag}>{form.paymentMode}</Text>
          </View>

          <Text style={styles.words}>
            <Text style={{ fontStyle: "italic" }}>In words: </Text>
            <Text style={{ fontWeight: 700 }}>{numToWords(amount)}</Text>
          </Text>

          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.label}>Paid To</Text>
              <Text style={[styles.value, { fontWeight: 700 }]}>{form.paidTo || "—"}</Text>
            </View>
            {(form.paidToAddress || form.paidToCity) && (
              <View style={styles.row}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>
                    {form.paidToAddress}{form.paidToCity ? `, ${form.paidToCity}` : ""}{pState ? `, ${pState}` : ""}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Purpose</Text>
              <Text style={styles.value}>{form.purpose || "—"}</Text>
            </View>
            {form.accountHead && (
              <View style={styles.row}>
                <Text style={styles.label}>Account Head</Text>
                <Text style={styles.value}>{form.accountHead}</Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Payment Mode</Text>
              <Text style={styles.value}>{form.paymentMode}</Text>
            </View>
            {form.paymentMode === "Cheque" && form.chequeNumber && (
              <View style={styles.row}>
                  <Text style={styles.label}>Cheque Details</Text>
                  <Text style={styles.value}>#{form.chequeNumber} {form.bankName ? `— ${form.bankName}` : ""} {form.chequeDate ? `(${form.chequeDate})` : ""}</Text>
              </View>
            )}
            {form.narration && (
              <View style={styles.row}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{form.narration}</Text>
              </View>
            )}
          </View>

          <View style={styles.signatures} wrap={false}>
            <View style={styles.sigCol}>
              {form.signaturePrepared ? <Image src={form.signaturePrepared} style={styles.sigImg} /> : <View style={{ height: 42 }} />}
              <View style={styles.sigLine}>
                <Text style={styles.sigName}>{form.preparedBy || "—"}</Text>
                <Text style={styles.sigLabel}>Prepared By</Text>
              </View>
            </View>
            <View style={styles.sigCol}>
              {form.signatureApproved ? <Image src={form.signatureApproved} style={styles.sigImg} /> : <View style={{ height: 42 }} />}
              <View style={styles.sigLine}>
                <Text style={styles.sigName}>{form.approvedBy || "—"}</Text>
                <Text style={styles.sigLabel}>Approved By</Text>
              </View>
            </View>
            <View style={styles.sigCol}>
              <View style={{ height: 42 }} />
              <View style={styles.sigLine}>
                <Text style={styles.sigName}> </Text>
                <Text style={styles.sigLabel}>Received By</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer} wrap={false}>
            <Text style={styles.fText}>Generated by DocMinty.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
