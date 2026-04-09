"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";

export default function ProformaClassicTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  const advanceAmt = (parseFloat(calc.grandTotal) * (parseFloat(form.advancePercent) || 0) / 100).toFixed(2);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", backgroundColor: "#ffffff" },
    
    header: { backgroundColor: T, padding: "24 32", flexDirection: "row", justifyContent: "space-between", color: "#ffffff", alignItems: "center" },
    compName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff", marginBottom: 4 },
    compDetails: { fontSize: 9, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 },
    
    rightHead: { textAlign: "right", maxWidth: "45%" },
    docType: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 800, color: "#ffffff", letterSpacing: 1 },
    metaText: { fontSize: 10, color: "rgba(255,255,255,0.85)", marginTop: 4 },
    
    body: { padding: "32 32 40" },
    
    billToBox: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
    billCol: { width: "45%" },
    label: { fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "Space Grotesk" },
    name: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", marginBottom: 2 },
    addrText: { fontSize: 10, color: "#6B7280", lineHeight: 1.4 },
    
    table: { marginBottom: 24 },
    tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 8, marginBottom: 8 },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingVertical: 8 },
    th: { fontSize: 9, fontWeight: 700, color: "#111827", textTransform: "uppercase", fontFamily: "Space Grotesk" },
    td: { fontSize: 9, color: "#374151" },
    
    colNo: { width: "5%" },
    colDesc: { flex: 1 },
    colHSN: { width: "10%", textAlign: "center" },
    colQty: { width: "8%", textAlign: "center" },
    colRate: { width: "12%", textAlign: "right" },
    colGST: { width: "10%", textAlign: "right" },
    colAmt: { width: "15%", textAlign: "right" },
    
    totalsArea: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 24 },
    totalsTable: { width: 220 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
    totalFinal: { backgroundColor: T + "15", borderAround: `1 solid ${T}30`, padding: "8 12", borderRadius: 4, marginTop: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    
    wordsBox: { marginTop: 16, padding: "10 14", backgroundColor: "#F8F9FA", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: T },
    wordsLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
    wordsText: { fontSize: 10, color: "#374151", fontStyle: "italic" },
    
    advBox: { marginTop: 16, backgroundColor: "#FEF9C3", borderAround: "1 solid #F59E0B", padding: "12 16", borderRadius: 8, marginBottom: 12 },
    advLabel: { fontSize: 9, fontWeight: 700, color: "#92400E", textTransform: "uppercase", marginBottom: 4, fontFamily: "Space Grotesk" },
    advVal: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 800, color: "#92400E" },
    
    bankBox: { backgroundColor: "#F3F4F6", padding: "10 14", borderRadius: 8 },
    bankLabel: { fontSize: 8, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 },
    
    footer: { marginTop: "auto", borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    fText: { fontSize: 9, color: "#D1D5DB" },
    sigArea: { textAlign: "right", minWidth: 120 },
    signature: { height: 40, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4 },
    sigText: { fontSize: 9, fontWeight: 700, color: "#111827" }
  });

  return (
    <Document title={`Proforma-${form.proformaNumber}`}>
      <Page size="A4" style={styles.page}>

        <View style={styles.header}>
          <View style={{ flex: 1, paddingRight: 20 }}>
            {form.logo && <Image src={form.logo} style={{ height: 36, objectFit: "contain", marginBottom: 8 }} />}
            <Text style={styles.compName}>{form.fromName || "Business Name"}</Text>
            <Text style={styles.compDetails}>
              {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState ? `, ${fromState}` : ""}
              {form.fromGSTIN && `\nGSTIN: ${form.fromGSTIN}`}
              {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? "Ph: " + form.fromPhone : ""}${form.fromPhone && form.fromEmail ? " | " : ""}${form.fromEmail ? "Em: " + form.fromEmail : ""}`}
            </Text>
          </View>
          <View style={styles.rightHead}>
            <Text style={styles.docType}>PROFORMA</Text>
            <Text style={styles.metaText}>#{form.proformaNumber}</Text>
            <Text style={styles.metaText}>Date: {form.proformaDate}</Text>
            {form.validUntil && <Text style={styles.metaText}>Valid Until: {form.validUntil}</Text>}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.billToBox}>
            <View style={styles.billCol}>
              <Text style={styles.label}>Bill To</Text>
              <Text style={styles.name}>{form.toName || "Client Name"}</Text>
              {form.toGSTIN && <Text style={styles.addrText}>GSTIN: {form.toGSTIN}</Text>}
              <Text style={styles.addrText}>
                  {form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}{toState ? `, ${toState}` : ""}
                  {(form.toPhone || form.toEmail) && `\n${form.toPhone ? "Ph: " + form.toPhone : ""}${form.toPhone && form.toEmail ? " | " : ""}${form.toEmail ? "Em: " + form.toEmail : ""}`}
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text style={styles.label}>Tax Type</Text>
              <Text style={styles.addrText}>
                  {form.taxType === "cgst_sgst" ? "CGST + SGST (Intrastate)" : form.taxType === "igst" ? "IGST (Interstate)" : "No Tax"}
              </Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colNo]}>#</Text>
              <Text style={[styles.th, styles.colDesc]}>Description</Text>
              {form.showHSN && <Text style={[styles.th, styles.colHSN]}>HSN</Text>}
              <Text style={[styles.th, styles.colQty]}>Qty</Text>
              <Text style={[styles.th, styles.colRate]}>Rate</Text>
              <Text style={[styles.th, styles.colGST]}>GST</Text>
              <Text style={[styles.th, styles.colAmt]}>Amount</Text>
            </View>
            {calc.items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.td, styles.colNo]}>{i + 1}</Text>
                <Text style={[styles.td, styles.colDesc]}>{item.description || "—"}</Text>
                {form.showHSN && <Text style={[styles.td, styles.colHSN]}>{item.hsn || "—"}</Text>}
                <Text style={[styles.td, styles.colQty]}>{item.qty}</Text>
                <Text style={[styles.td, styles.colRate]}>₹{item.rate}</Text>
                <Text style={[styles.td, styles.colGST]}>{item.gstRate}%</Text>
                <Text style={[styles.td, styles.colAmt, { fontWeight: 700 }]}>₹{item.amount}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalsArea}>
            <View style={styles.totalsTable}>
              <View style={styles.totalRow}><Text style={{ color: "#6B7280" }}>Subtotal</Text><Text>₹{calc.subtotal}</Text></View>
              {form.taxType === "cgst_sgst" && (
                  <>
                  <View style={styles.totalRow}><Text style={{ color: "#6B7280" }}>CGST</Text><Text>₹{calc.totalCGST}</Text></View>
                  <View style={styles.totalRow}><Text style={{ color: "#6B7280" }}>SGST</Text><Text>₹{calc.totalSGST}</Text></View>
                  </>
              )}
              {form.taxType === "igst" && <View style={styles.totalRow}><Text style={{ color: "#6B7280" }}>IGST</Text><Text>₹{calc.totalIGST}</Text></View>}
              <View style={styles.totalFinal}>
                  <Text style={{ fontSize: 11, fontWeight: 700, color: T }}>Grand Total</Text>
                  <Text style={{ fontSize: 13, fontWeight: 800, color: T }}>₹{calc.grandTotal}</Text>
              </View>
            </View>
          </View>

          <View style={styles.wordsBox}>
              <Text style={styles.wordsLabel}>Amount In Words</Text>
              <Text style={styles.wordsText}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 20, marginTop: 16 }}>
            <View style={{ flex: 1 }}>
              {parseFloat(form.advancePercent) > 0 && (
                <View style={styles.advBox}>
                    <Text style={styles.advLabel}>Advance Details ({form.advancePercent}%)</Text>
                    <Text style={styles.advVal}>₹{parseFloat(advanceAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
                </View>
              )}
              {form.bankName && (
                  <View style={styles.bankBox}>
                      <Text style={styles.bankLabel}>Bank Details</Text>
                      <Text style={{ fontSize: 10, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{form.bankName}</Text>
                      {form.accountName && <Text style={{ fontSize: 9, color: "#4B5563", marginBottom: 2 }}>{form.accountName}</Text>}
                      <Text style={{ fontSize: 9, color: "#6B7280", marginBottom: 2 }}>Acc: {form.accountNumber}</Text>
                      <Text style={{ fontSize: 9, color: "#6B7280" }}>IFSC: {form.ifscCode}</Text>
                  </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              {form.notes && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.bankLabel}>Notes</Text>
                  <Text style={{ fontSize: 9, color: "#6B7280" }}>{form.notes}</Text>
                </View>
              )}
              {form.terms && (
                <View>
                  <Text style={styles.bankLabel}>Terms</Text>
                  <Text style={{ fontSize: 9, color: "#6B7280" }}>{form.terms}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer} wrap={false}>
            <Text style={styles.fText}>Generated by DocMinty.com</Text>
            <View style={styles.sigArea}>
              {form.signature && <Image src={form.signature} style={styles.signature} />}
              <View style={styles.sigLine}>
                <Text style={styles.sigText}>Authorized Official</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
