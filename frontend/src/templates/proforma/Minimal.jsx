"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function ProformaMinimalTemplate({ form }) {
  const T = form.templateColor || "#111827";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  
  const advAmt = (parseFloat(calc.grandTotal) * (parseFloat(form.advancePercent) || 0) / 100);
  const advFmt = advAmt.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "48 64", backgroundColor: "#ffffff" },
    badge: { backgroundColor: "#FEF9C3", borderBottomWidth: 1, borderBottomColor: "#F59E0B", padding: "4 0", margin: "-48 -64 32 -64", textAlign: "center" },
    badgeText: { fontSize: 9, fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "Space Grotesk" },
    
    top: { borderBottomWidth: 1.5, borderBottomColor: T, paddingBottom: 12, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    title: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1 },
    date: { fontSize: 10, color: "#9CA3AF" },
    
    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    metaBox: { flex: 1 },
    metaLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Space Grotesk", fontWeight: 700 },
    metaValue: { fontSize: 11, fontWeight: 700, color: "#111827" },
    metaSub: { fontSize: 9, color: "#6B7280", marginTop: 2, maxWidth: 200, lineHeight: 1.4 },
    
    table: { marginBottom: 32 },
    tHeader: { flexDirection: "row", backgroundColor: "#F9FAFB", padding: "8 12", borderBottomWidth: 1, borderBottomColor: T, borderRadius: 4 },
    tRow: { flexDirection: "row", padding: "8 12", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", alignItems: "center" },
    th: { fontSize: 8, fontWeight: 700, color: "#111827", textTransform: "uppercase", fontFamily: "Space Grotesk" },
    td: { fontSize: 9, color: "#374151" },
    
    colNo: { width: "5%" },
    colDesc: { width: "40%" },
    colHSN: { width: "10%", textAlign: "center" },
    colQty: { width: "8%", textAlign: "center" },
    colRate: { width: "12%", textAlign: "right" },
    colGST: { width: "10%", textAlign: "right" },
    colAmt: { width: "15%", textAlign: "right" },
    
    summaryFrame: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
    sumCol: { width: "48%" },
    
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "4 0" },
    totLabel: { fontSize: 8, color: "#6B7280" },
    totVal: { fontSize: 9, fontWeight: 700, color: "#111827" },
    grandRow: { flexDirection: "row", justifyContent: "space-between", padding: "10 0", borderTopWidth: 1, borderTopColor: T, marginTop: 8 },
    grandLabel: { fontSize: 11, fontWeight: 700, color: "#111827" },
    grandVal: { fontSize: 11, fontWeight: 700, color: T },
    
    advBox: { backgroundColor: "#F9FAFB", padding: "12 16", borderRadius: 4, marginBottom: 20, borderLeftWidth: 2, borderLeftColor: T },
    advLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 3 },
    advText: { fontSize: 11, fontWeight: 700, color: "#111827" },
    
    footer: { position: "absolute", bottom: 48, left: 64, right: 64, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    footerText: { fontSize: 8, color: "#D1D5DB" },
    signature: { height: 35, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120 },
    sigLabel: { fontSize: 8, color: "#9CA3AF", textAlign: "right" }
  });

  return (
    <Document title={`Proforma-Minimal-${form.proformaNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>⚠ PROFORMA INVOICE — NOT A TAX INVOICE</Text>
        </View>

        <View style={styles.top}>
          <Text style={styles.title}>Proforma Quotation</Text>
          <Text style={styles.date}>{form.proformaDate}</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Organization</Text>
            <Text style={styles.metaValue}>{form.fromName || "—"}</Text>
            <Text style={styles.metaSub}>
                {form.fromAddress}{form.fromCity ? `, ${form.fromCity}, ${fromState}` : ""}
                {form.fromGSTIN && `\nGSTIN: ${form.fromGSTIN}`}
                {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? "Ph: " + form.fromPhone : ""}${form.fromPhone && form.fromEmail ? " | " : ""}${form.fromEmail ? "Em: " + form.fromEmail : ""}`}
            </Text>
          </View>
          <View style={[styles.metaBox, { textAlign: "right", alignItems: "flex-end" }]}>
            <Text style={styles.metaLabel}>Quotation Ref</Text>
            <Text style={styles.metaValue}>#{form.proformaNumber}</Text>
            <Text style={[styles.metaSub, { textAlign: "right" }]}>
                {form.toName || "—"}
                {form.toGSTIN && `\nGSTIN: ${form.toGSTIN}`}
                {form.validUntil && `\nValid Unit: ${form.validUntil}`}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tHeader}>
            <Text style={[styles.th, styles.colNo]}>#</Text>
            <Text style={[styles.th, styles.colDesc]}>Description</Text>
            {form.showHSN && <Text style={[styles.th, styles.colHSN]}>HSN</Text>}
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colRate]}>Rate</Text>
            <Text style={[styles.th, styles.colGST]}>GST</Text>
            <Text style={[styles.th, styles.colAmt]}>Amount</Text>
          </View>
          {calc.items.map((item, i) => (
            <View key={i} style={styles.tRow}>
              <Text style={[styles.td, styles.colNo]}>{i + 1}</Text>
              <Text style={[styles.td, styles.colDesc, { fontWeight: 700, color: "#111827" }]}>{item.description || "—"}</Text>
              {form.showHSN && <Text style={[styles.td, styles.colHSN]}>{item.hsn || "—"}</Text>}
              <Text style={[styles.td, styles.colQty]}>{item.qty}</Text>
              <Text style={[styles.td, styles.colRate]}>{item.rate}</Text>
              <Text style={[styles.td, styles.colGST]}>{item.gstRate}%</Text>
              <Text style={[styles.td, styles.colAmt, { fontWeight: 700 }]}>{item.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryFrame}>
          <View style={styles.sumCol}>
            {parseFloat(form.advancePercent) > 0 && (
              <View style={styles.advBox}>
                <Text style={styles.advLabel}>Advance Commitment ({form.advancePercent}%)</Text>
                <Text style={styles.advText}>₹{advFmt}</Text>
              </View>
            )}
            {form.bankName && (
              <View style={{ paddingLeft: 4 }}>
                <Text style={styles.metaLabel}>Settlement Routing</Text>
                <Text style={{ fontSize: 9, color: "#111827", fontWeight: 700 }}>{form.bankName} | {form.accountNumber}</Text>
                {form.accountName && <Text style={{ fontSize: 9, color: "#4B5563" }}>{form.accountName}</Text>}
                <Text style={{ fontSize: 8, color: "#6B7280" }}>IFSC: {form.ifscCode} | {form.accountName}</Text>
              </View>
            )}
            {(form.notes || form.terms) && (
              <View style={{ marginTop: 15, paddingLeft: 4 }}>
                <Text style={styles.metaLabel}>Remarks</Text>
                <Text style={{ fontSize: 8.5, color: "#6B7280" }}>{form.notes && `${form.notes}\n`}{form.terms}</Text>
              </View>
            )}
          </View>

          <View style={styles.sumCol}>
            <View style={styles.totRow}><Text style={styles.totLabel}>Subtotal</Text><Text style={styles.totVal}>₹{calc.subtotal}</Text></View>
            {form.taxType === "igst" ? (
              <View style={styles.totRow}><Text style={styles.totLabel}>IGST</Text><Text style={styles.totVal}>₹{calc.totalIGST}</Text></View>
            ) : (
              <>
                <View style={styles.totRow}><Text style={styles.totLabel}>CGST</Text><Text style={styles.totVal}>₹{calc.totalCGST}</Text></View>
                <View style={styles.totRow}><Text style={styles.totLabel}>SGST</Text><Text style={styles.totVal}>₹{calc.totalSGST}</Text></View>
              </>
            )}
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Final Quotation Total</Text>
              <Text style={styles.grandVal}>₹{calc.grandTotal}</Text>
            </View>
            <Text style={{ fontSize: 7, color: "#9CA3AF", fontStyle: "italic", textAlign: "right", marginTop: 4 }}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Digital Release via DocMinty.com</Text>
          <View>
            {form.signature && <Image src={form.signature} style={styles.signature} />}
            <View style={styles.sigLine}>
              <Text style={styles.sigLabel}>Authorized Official</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
