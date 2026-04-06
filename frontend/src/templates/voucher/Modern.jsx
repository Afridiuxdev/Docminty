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

export default function VoucherModernTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const amount = parseFloat(form.amount) || 0;
  const cState = INDIAN_STATES.find(s => s.code === form.companyState)?.name || "";
  const pState = INDIAN_STATES.find(s => s.code === form.paidToState)?.name || "";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
    header: { backgroundColor: T, padding: "30 50", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    docType: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 800, color: "#ffffff", letterSpacing: 1 },
    logo: { height: 40, objectFit: "contain", filter: "brightness(0) invert(1)" },
    
    main: { padding: "40 50" },
    companyLine: { marginBottom: 30, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 15 },
    compName: { fontSize: 14, fontWeight: 700, color: T },
    compAddr: { fontSize: 9, color: "#6B7280", marginTop: 2, maxWidth: 300 },
    
    metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
    metaItem: { fontSize: 10, color: "#6B7280" },
    metaVal: { fontWeight: 700, color: "#111827" },
    
    amountHighlight: { backgroundColor: "#F0FDFA", borderAround: `1 solid #E5E7EB`, padding: "20 30", borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
    amtLabel: { fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 },
    amtVal: { fontSize: 32, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    modeTag: { backgroundColor: T, color: "#ffffff", padding: "4 12", borderRadius: 20, fontSize: 10, fontWeight: 700 },
    
    words: { fontSize: 11, fontStyle: "italic", marginBottom: 30, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 15 },
    
    infoGrid: { flexDirection: "row", gap: 40, marginBottom: 32 },
    infoCol: { flex: 1 },
    colLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontWeight: 700 },
    colName: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 5 },
    colAddr: { fontSize: 9, color: "#4B5563", lineHeight: 1.5 },
    
    extraDetails: { marginBottom: 32 },
    detailLine: { flexDirection: "row", marginBottom: 10 },
    detailLabel: { width: 120, fontSize: 9, color: "#9CA3AF", textTransform: "uppercase" },
    detailValue: { flex: 1, fontSize: 10, fontWeight: 700 },
    
    signGrid: { flexDirection: "row", gap: 30, marginTop: "auto", paddingBottom: 40 },
    signCol: { flex: 1, textAlign: "center" },
    sigImg: { height: 40, objectFit: "contain", marginBottom: 4, margin: "0 auto" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 6 },
    sigLabel: { fontSize: 9, color: "#9CA3AF" },
    
    footer: { position: "absolute", bottom: 20, left: 50, right: 50, textAlign: "center" },
    fText: { fontSize: 8, color: "#D1D5DB" }
  });

  return (
    <Document title={`Voucher-Modern-${form.voucherNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.docType}>PAYMENT VOUCHER</Text>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
        </View>

        <View style={styles.main}>
          <View style={styles.companyLine}>
              <Text style={styles.compName}>{form.companyName || "Organization Name"}</Text>
              <Text style={styles.compAddr}>
                  {form.companyAddress}{form.companyCity ? `, ${form.companyCity}, ${cState}` : ""}
                  {form.companyPhone && ` | Ph: ${form.companyPhone}`}
              </Text>
          </View>

          <View style={styles.metaRow}>
              <Text style={styles.metaItem}>Voucher #: <Text style={styles.metaVal}>{form.voucherNumber}</Text></Text>
              <Text style={styles.metaItem}>Date: <Text style={styles.metaVal}>{form.voucherDate}</Text></Text>
          </View>

          <View style={styles.amountHighlight}>
            <View>
                <Text style={styles.amtLabel}>Total Disbursed</Text>
                <Text style={styles.amtVal}>₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
            </View>
            <Text style={styles.modeTag}>{form.paymentMode}</Text>
          </View>

          <Text style={styles.words}>Amount In Words: <Text style={{ fontWeight: 700, color: T }}>{numToWords(amount)}</Text></Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.colLabel}>Beneficiary Details</Text>
              <Text style={styles.colName}>{form.paidTo || "—"}</Text>
              <Text style={styles.colAddr}>
                {form.paidToAddress}{form.paidToCity ? `, ${form.paidToCity}, ${pState}` : ""}
                {(form.paidToPhone || form.paidToEmail) && `\n\n${form.paidToPhone ? "Ph: " + form.paidToPhone : ""}${form.paidToEmail ? "\nEm: " + form.paidToEmail : ""}`}
              </Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.colLabel}>Transaction Info</Text>
              <View style={styles.extraDetails}>
                <View style={styles.detailLine}>
                    <Text style={styles.detailLabel}>Purpose</Text>
                    <Text style={styles.detailValue}>{form.purpose || "—"}</Text>
                </View>
                {form.accountHead && (
                    <View style={styles.detailLine}>
                        <Text style={styles.detailLabel}>Account Head</Text>
                        <Text style={styles.detailValue}>{form.accountHead}</Text>
                    </View>
                )}
                {form.paymentMode === "Cheque" && form.chequeNumber && (
                    <View style={styles.detailLine}>
                        <Text style={styles.detailLabel}>Cheque Ref</Text>
                        <Text style={styles.detailValue}>#{form.chequeNumber} {form.bankName ? `(${form.bankName})` : ""}</Text>
                    </View>
                )}
              </View>
            </View>
          </View>

          {form.narration && (
            <View style={{ marginBottom: 32 }}>
                <Text style={styles.colLabel}>Description / Notes</Text>
                <Text style={{ fontSize: 9, color: "#6B7280", lineHeight: 1.4 }}>{form.narration}</Text>
            </View>
          )}

          <View style={styles.signGrid}>
            <View style={styles.signCol}>
              {form.signaturePrepared ? <Image src={form.signaturePrepared} style={styles.sigImg} /> : <View style={{ height: 40 }} />}
              <View style={styles.sigLine}>
                <Text style={{ fontSize: 10, fontWeight: 700 }}>{form.preparedBy || "—"}</Text>
                <Text style={styles.sigLabel}>Prepared By</Text>
              </View>
            </View>
            <View style={styles.signCol}>
              {form.signatureApproved ? <Image src={form.signatureApproved} style={styles.sigImg} /> : <View style={{ height: 40 }} />}
              <View style={styles.sigLine}>
                <Text style={{ fontSize: 10, fontWeight: 700 }}>{form.approvedBy || "—"}</Text>
                <Text style={styles.sigLabel}>Approved By</Text>
              </View>
            </View>
            <View style={styles.signCol}>
              <View style={{ height: 40 }} />
              <View style={styles.sigLine}>
                <Text style={{ fontSize: 10, fontWeight: 700 }}> </Text>
                <Text style={styles.sigLabel}>Receiver Signature</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.fText}>Certified Digital Voucher via DocMinty.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
