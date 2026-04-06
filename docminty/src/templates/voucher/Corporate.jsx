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

export default function VoucherCorporateTemplate({ form }) {
  const T = form.templateColor || "#1E3A5F";
  const amount = parseFloat(form.amount) || 0;
  const amtFmt = amount.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const cState = INDIAN_STATES.find(s => s.code === form.companyState)?.name || "";
  const pState = INDIAN_STATES.find(s => s.code === form.paidToState)?.name || "";

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
    
    signArea: { marginTop: 40, flexDirection: "row", justifyContent: "space-between", gap: 20 },
    signBox: { flex: 1, borderTopWidth: 1, borderTopColor: "#111827", paddingTop: 8, textAlign: "center" },
    sigImg: { height: 40, objectFit: "contain", marginBottom: 4, margin: "0 auto" },
    signName: { fontSize: 10, fontWeight: 700, color: "#111827" },
    signRole: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 70, right: 70, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Corporate-Voucher-${form.voucherNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.orgName}>{form.companyName || "Organization Name"}</Text>
          <Text style={styles.docType}>Official Internal Disbursement Voucher</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <View>
                <Text style={{ fontSize: 9, color: "#6B7280", maxWidth: 300 }}>
                    {form.companyAddress}{form.companyCity ? `, ${form.companyCity}, ${cState}` : ""}
                    {form.companyPhone && `\nPH: ${form.companyPhone}`}
                </Text>
            </View>
            <View style={{ textAlign: "right" }}>
                <Text style={styles.metaText}>VOUCHER REF: #{form.voucherNumber}</Text>
                <Text style={styles.metaText}>DATE: {form.voucherDate}</Text>
            </View>
        </View>

        <View style={styles.amtBox}>
          <View style={styles.amtRow}>
            <Text style={styles.amtLabel}>Total Disbursed Amount</Text>
            <Text style={styles.amtVal}>₹ {amtFmt}</Text>
          </View>
          <Text style={styles.amtWords}>{numToWords(amount)}</Text>
        </View>

        <View style={styles.detailsTable}>
          <View style={styles.row}>
            <Text style={styles.label}>Paid To / Recipient</Text>
            <Text style={styles.value}>{form.paidTo || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction Purpose</Text>
            <Text style={styles.value}>{form.purpose || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Account Head / GL</Text>
            <Text style={styles.value}>{form.accountHead || "GENERAL FUND"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{form.paymentMode}</Text>
          </View>
          {form.paymentMode === "Cheque" && form.chequeNumber && (
            <View style={styles.row}>
              <Text style={styles.label}>Cheque Reference</Text>
              <Text style={styles.value}>#{form.chequeNumber} {form.bankName ? `| ${form.bankName}` : ""}</Text>
            </View>
          )}
        </View>

        {form.narration && (
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.label}>Administrative Narration</Text>
            <Text style={{ fontSize: 9, color: "#6B7280", marginTop: 4, lineHeight: 1.5 }}>{form.narration}</Text>
          </View>
        )}

        <View style={styles.signArea}>
          <View style={styles.signBox}>
            {form.signaturePrepared && <Image src={form.signaturePrepared} style={styles.sigImg} />}
            <Text style={styles.signName}>{form.preparedBy || "—"}</Text>
            <Text style={styles.signRole}>Prepared By</Text>
          </View>
          <View style={styles.signBox}>
            {form.signatureApproved && <Image src={form.signatureApproved} style={styles.sigImg} />}
            <Text style={styles.signName}>{form.approvedBy || "—"}</Text>
            <Text style={styles.signRole}>Approved By</Text>
          </View>
          <View style={styles.signBox}>
            <View style={{ height: form.signaturePrepared || form.signatureApproved ? 40 : 0 }} />
            <Text style={styles.signRole}>Receiver Signature</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Digital Release — DocMinty Pro</Text>
        </View>
      </Page>
    </Document>
  );
}
