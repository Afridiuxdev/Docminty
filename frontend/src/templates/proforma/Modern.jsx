"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";

export default function ProformaModernTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  const advanceAmt = (parseFloat(calc.grandTotal) * (parseFloat(form.advancePercent) || 0) / 100).toFixed(2);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
    badge: { backgroundColor: "#FEF9C3", borderBottomWidth: 2, borderBottomColor: "#F59E0B", padding: "6 0", textAlign: "center" },
    badgeText: { fontSize: 10, fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: 1, fontFamily: "Space Grotesk" },
    
    header: { backgroundColor: T, padding: "30 50", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    docType: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 800, color: "#ffffff", letterSpacing: 1 },
    logo: { height: 40, objectFit: "contain", filter: "brightness(0) invert(1)" },
    
    main: { padding: "40 50" },
    topMeta: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 15 },
    metaLabel: { fontSize: 9, color: "#6B7280", textTransform: "uppercase", fontFamily: "Space Grotesk", fontWeight: 700 },
    metaValue: { fontSize: 11, fontWeight: 700, color: "#111827" },
    
    infoGrid: { flexDirection: "row", gap: 40, marginBottom: 32 },
    infoCol: { flex: 1 },
    colLabel: { fontSize: 8, color: T, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontWeight: 700, fontFamily: "Space Grotesk" },
    colName: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 5 },
    colAddr: { fontSize: 9, color: "#4B5563", lineHeight: 1.5 },
    
    table: { marginTop: 10 },
    tableHeader: { flexDirection: "row", backgroundColor: "#F9FAFB", borderBottomWidth: 2, borderBottomColor: T, padding: "8 12", marginBottom: 5, borderRadius: 4 },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F9FAFB", padding: "8 12", alignItems: "center" },
    th: { fontSize: 8, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontFamily: "Space Grotesk" },
    td: { fontSize: 9, color: "#111827" },
    
    colNo: { width: "5%" },
    colDesc: { width: "40%" },
    colHSN: { width: "10%", textAlign: "center" },
    colQty: { width: "8%", textAlign: "center" },
    colRate: { width: "12%", textAlign: "right" },
    colGST: { width: "10%", textAlign: "right" },
    colAmt: { width: "15%", textAlign: "right" },
    
    summaryArea: { flexDirection: "row", justifyContent: "space-between", marginTop: 24, gap: 30 },
    sumLeft: { flex: 1 },
    sumRight: { width: 220 },
    totalFinal: { marginTop: 10, padding: "12 16", backgroundColor: T, borderRadius: 10, flexDirection: "row", justifyContent: "space-between" },
    totalFT: { fontSize: 13, fontWeight: 800, color: "#ffffff", fontFamily: "Space Grotesk" },
    
    advSection: { marginTop: 24, flexDirection: "row", gap: 20 },
    advCard: { flex: 1, padding: "12 20", borderRadius: 12 },
    advYellow: { backgroundColor: "#FEF9C3", borderAround: "1 solid #F59E0B" },
    advAqua: { backgroundColor: "#F0FDFA", borderAround: `1 solid ${T}` },
    advL: { fontSize: 8, fontWeight: 700, color: "#92400E", textTransform: "uppercase", marginBottom: 4, fontFamily: "Space Grotesk" },
    advV: { fontSize: 20, fontWeight: 800, color: "#92400E", fontFamily: "Space Grotesk" },
    
    fNote: { marginTop: 20, padding: "10 14", background: "#F8FAFC", borderRadius: 8, borderLeftWidth: 4, borderLeftColor: T },
    fLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 4 },
    fText: { fontSize: 10, color: "#475569", fontStyle: "italic" },
    
    footer: { position: "absolute", bottom: 30, left: 50, right: 50, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    sigCol: { textAlign: "right" },
    signature: { height: 45, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 4, width: 140 },
    sigLabel: { fontSize: 9, color: "#9CA3AF", textAlign: "right" }
  });

  return (
    <Document title={`Proforma-Modern-${form.proformaNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>⚠ PROFORMA INVOICE — NOT A TAX INVOICE</Text>
        </View>

        <View style={styles.header}>
            <Text style={styles.docType}>PROFORMA INVOICE</Text>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
        </View>

        <View style={styles.main}>
          <View style={styles.topMeta}>
              <View>
                  <Text style={styles.metaLabel}>Proforma #</Text>
                  <Text style={styles.metaValue}>{form.proformaNumber}</Text>
              </View>
              <View style={{ textAlign: "center" }}>
                  <Text style={styles.metaLabel}>Issued Date</Text>
                  <Text style={styles.metaValue}>{form.proformaDate}</Text>
              </View>
              <View style={{ textAlign: "right" }}>
                  <Text style={styles.metaLabel}>Valid Until</Text>
                  <Text style={styles.metaValue}>{form.validUntil || "—"}</Text>
              </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.colLabel}>Sender Information</Text>
              <Text style={styles.colName}>{form.fromName || "—"}</Text>
              <Text style={styles.colAddr}>
                {form.fromAddress}{form.fromCity ? `, ${form.fromCity}, ${fromState}` : ""}
                {form.fromGSTIN && `\nGSTIN: ${form.fromGSTIN}`}
                {(form.fromPhone || form.fromEmail) && `\nPH: ${form.fromPhone || "—"}\nEM: ${form.fromEmail || "—"}`}
              </Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.colLabel}>Billing To</Text>
              <Text style={styles.colName}>{form.toName || "—"}</Text>
              <Text style={styles.colAddr}>
                {form.toAddress}{form.toCity ? `, ${form.toCity}, ${toState}` : ""}
                {form.toGSTIN && `\nGSTIN: ${form.toGSTIN}`}
                {(form.toPhone || form.toEmail) && `\nPH: ${form.toPhone || "—"}\nEM: ${form.toEmail || "—"}`}
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
                <Text style={[styles.td, styles.colDesc, { fontWeight: 700 }]}>{item.description || "—"}</Text>
                {form.showHSN && <Text style={[styles.td, styles.colHSN]}>{item.hsn || "—"}</Text>}
                <Text style={[styles.td, styles.colQty]}>{item.qty}</Text>
                <Text style={[styles.td, styles.colRate]}>{item.rate}</Text>
                <Text style={[styles.td, styles.colGST]}>{item.gstRate}%</Text>
                <Text style={[styles.td, styles.colAmt, { fontWeight: 800, color: T }]}>{item.amount}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summaryArea}>
            <View style={styles.sumLeft}>
              <View style={styles.fNote}>
                <Text style={styles.fLabel}>Total In Words</Text>
                <Text style={styles.fText}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
              </View>
              {(form.notes || form.terms) && (
                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.colLabel, { fontSize: 7 }]}>Notes & Terms</Text>
                    <Text style={{ fontSize: 9, color: "#64748B", lineHeight: 1.4 }}>{form.notes && `${form.notes}\n`}{form.terms}</Text>
                </View>
              )}
            </View>

            <View style={styles.sumRight}>
              <View style={{ gap: 6, marginBottom: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: "#64748B" }}>Subtotal</Text><Text style={{ fontWeight: 700 }}>₹{calc.subtotal}</Text></View>
                {form.taxType === "cgst_sgst" && (
                    <>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: "#64748B" }}>CGST</Text><Text style={{ fontWeight: 700 }}>₹{calc.totalCGST}</Text></View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: "#64748B" }}>SGST</Text><Text style={{ fontWeight: 700 }}>₹{calc.totalSGST}</Text></View>
                    </>
                )}
                {form.taxType === "igst" && <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: "#64748B" }}>IGST</Text><Text style={{ fontWeight: 700 }}>₹{calc.totalIGST}</Text></View>}
              </View>
              <View style={styles.totalFinal}>
                <Text style={styles.totalFT}>Grand Total</Text>
                <Text style={styles.totalFT}>₹{calc.grandTotal}</Text>
              </View>
            </View>
          </View>

          {parseFloat(form.advancePercent) > 0 && (
            <View style={styles.advSection}>
              <View style={[styles.advCard, styles.advYellow]}>
                <Text style={styles.advL}>Advance Required ({form.advancePercent}%)</Text>
                <Text style={styles.advV}>₹{parseFloat(advanceAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
              </View>
              {form.bankName && (
                <View style={[styles.advCard, styles.advAqua]}>
                    <Text style={[styles.advL, { color: "#0D9488" }]}>Settlement Routing</Text>
                    <Text style={{ fontSize: 10, fontWeight: 700, color: "#111827" }}>{form.bankName} | {form.accountNumber}</Text>
                    {form.accountName && <Text style={{ fontSize: 10, color: "#4B5563" }}>{form.accountName}</Text>}
                    <Text style={{ fontSize: 8, color: "#64748B" }}>IFSC: {form.ifscCode} | {form.accountName}</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.footer} fixed>
            <Text style={{ fontSize: 8, color: "#D1D5DB" }}>Certified Digital Release via DocMinty.com</Text>
            <View style={styles.sigCol}>
              {form.signature && <Image src={form.signature} style={styles.signature} />}
              <View style={styles.sigLine}>
                <Text style={styles.sigLabel}>Authorised Signature</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
