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
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "40 50", backgroundColor: "#ffffff" },
    badge: { backgroundColor: "#FEF9C3", borderBottomWidth: 2, borderBottomColor: "#F59E0B", padding: "6 0", margin: "-40 -50 30 -50", textAlign: "center" },
    badgeText: { fontSize: 10, fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: 1 },
    
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 15 },
    logo: { height: 48, objectFit: "contain", marginBottom: 8 },
    compName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827" },
    compAddr: { fontSize: 9, color: "#6B7280", marginTop: 2, maxWidth: 250 },
    
    rightHead: { textAlign: "right" },
    docType: { fontSize: 20, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    metaText: { fontSize: 10, color: "#6B7280", marginTop: 4 },
    
    grid: { flexDirection: "row", gap: 30, marginBottom: 20 },
    gridCol: { flex: 1 },
    label: { fontSize: 8, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    name: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 4 },
    addrText: { fontSize: 9, color: "#6B7280", lineHeight: 1.4 },
    
    table: { marginTop: 20 },
    tableHeader: { flexDirection: "row", backgroundColor: "#F9FAFB", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", padding: "8 4" },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "8 4" },
    th: { fontSize: 8, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" },
    td: { fontSize: 9, color: "#374151" },
    
    colNo: { width: "5%" },
    colDesc: { width: "45%" },
    colHSN: { width: "10%" },
    colQty: { width: "8%", textAlign: "center" },
    colRate: { width: "12%", textAlign: "right" },
    colGST: { width: "8%", textAlign: "center" },
    colAmt: { width: "12%", textAlign: "right" },
    
    totalsArea: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20 },
    totalsTable: { width: 220 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", padding: "4 0" },
    totalFinal: { borderTopWidth: 2, borderTopColor: T, marginTop: 8, paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
    
    advanceBox: { marginTop: 20, flexDirection: "row", gap: 15 },
    advItem: { flex: 1, padding: "12 16", borderRadius: 8 },
    advYellow: { backgroundColor: "#FEF9C3", borderAround: "1 solid #F59E0B" },
    advGreen: { backgroundColor: "#F0FDFA", borderAround: `1 solid ${T}` },
    advLabel: { fontSize: 8, fontWeight: 700, color: "#92400E", textTransform: "uppercase", marginBottom: 4 },
    advVal: { fontSize: 18, fontWeight: 800, color: "#92400E", fontFamily: "Space Grotesk" },
    
    infoBox: { marginTop: 20, padding: "10 14", backgroundColor: "#F8F9FA", borderLeftWidth: 3, borderLeftColor: T },
    infoText: { fontSize: 10, color: "#374151", fontStyle: "italic" },
    
    footer: { marginTop: "auto", borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    fText: { fontSize: 9, color: "#D1D5DB" },
    sigArea: { textAlign: "right" },
    signature: { height: 45, objectFit: "contain", marginBottom: 4 },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 140 },
    sigText: { fontSize: 9, color: "#9CA3AF" }
  });

  return (
    <Document title={`Proforma-${form.proformaNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>⚠ PROFORMA INVOICE — NOT A TAX INVOICE</Text>
        </View>

        <View style={styles.header}>
          <View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.compName}>{form.fromName || "Company Name"}</Text>
            {form.fromGSTIN && <Text style={styles.addrText}>GSTIN: {form.fromGSTIN}</Text>}
            <Text style={styles.compAddr}>
                {form.fromAddress}{form.fromCity ? `, ${form.fromCity}, ${fromState}` : ""}
                {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? "Ph: " + form.fromPhone : ""}${form.fromEmail ? " | Em: " + form.fromEmail : ""}`}
            </Text>
          </View>
          <View style={styles.rightHead}>
            <Text style={styles.docType}>PROFORMA INVOICE</Text>
            <Text style={styles.metaText}>#{form.proformaNumber}</Text>
            <Text style={styles.metaText}>Date: {form.proformaDate}</Text>
            {form.validUntil && <Text style={styles.metaText}>Valid Until: {form.validUntil}</Text>}
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.name}>{form.toName || "—"}</Text>
            {form.toGSTIN && <Text style={styles.addrText}>GSTIN: {form.toGSTIN}</Text>}
            <Text style={styles.addrText}>
                {form.toAddress}{form.toCity ? `, ${form.toCity}, ${toState}` : ""}
                {(form.toPhone || form.toEmail) && `\nPh: ${form.toPhone || "—"}\nEm: ${form.toEmail || "—"}`}
            </Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Taxation Detail</Text>
            <Text style={styles.addrText}>
                {form.taxType === "cgst_sgst" ? "CGST + SGST (Intrastate)" :
                 form.taxType === "igst" ? "IGST (Interstate)" : "Exempt / No Tax"}
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
              <Text style={[styles.td, styles.colAmt, { fontWeight: 700 }]}>{item.amount}</Text>
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
                <Text style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>Grand Total</Text>
                <Text style={{ fontSize: 13, fontWeight: 800, color: T }}>₹{calc.grandTotal}</Text>
            </View>
          </View>
        </View>

        {parseFloat(form.advancePercent) > 0 && (
          <View style={styles.advanceBox}>
            <View style={[styles.advItem, styles.advYellow]}>
                <Text style={styles.advLabel}>Advance Required ({form.advancePercent}%)</Text>
                <Text style={styles.advVal}>₹{parseFloat(advanceAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
            </View>
            {form.bankName && (
                <View style={[styles.advItem, styles.advGreen]}>
                    <Text style={[styles.advLabel, { color: "#065F46" }]}>Bank Details</Text>
                    <Text style={{ fontSize: 9, fontWeight: 700, color: "#111827" }}>{form.bankName} - {form.accountNumber}</Text>
                    <Text style={{ fontSize: 8, color: "#6B7280" }}>IFSC: {form.ifscCode} | {form.accountName}</Text>
                </View>
            )}
          </View>
        )}

        <View style={[styles.infoBox, { marginTop: 15 }]}>
            <Text style={styles.notesLabel}>Amount In Words</Text>
            <Text style={styles.infoText}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
        </View>

        {(form.notes || form.terms) && (
            <View style={{ flexDirection: "row", gap: 30, marginTop: 20 }}>
                {form.notes && <View style={{ flex: 1 }}><Text style={styles.label}>Notes</Text><Text style={styles.addrText}>{form.notes}</Text></View>}
                {form.terms && <View style={{ flex: 1 }}><Text style={styles.label}>Terms</Text><Text style={styles.addrText}>{form.terms}</Text></View>}
            </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.fText}>Generated by DocMinty.com</Text>
          <View style={styles.sigArea}>
            {form.signature && <Image src={form.signature} style={styles.signature} />}
            <View style={styles.sigLine}>
              <Text style={styles.sigText}>Authorised Signatory</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
