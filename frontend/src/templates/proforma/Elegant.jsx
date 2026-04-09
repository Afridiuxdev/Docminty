"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function ProformaElegantTemplate({ form }) {
  const T = form.templateColor || "#D97706";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  
  const advAmt = (parseFloat(calc.grandTotal) * (parseFloat(form.advancePercent) || 0) / 100);
  const advFmt = advAmt.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 9, color: "#111827", padding: "60 80", backgroundColor: "#FFFDFA" },
    badge: { backgroundColor: "#FEF9C3", borderBottomWidth: 1, borderBottomColor: "#F59E0B", padding: "4 0", margin: "-60 -80 32 -80", textAlign: "center" },
    badgeText: { fontSize: 9, fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "Space Grotesk" },
    
    header: { marginBottom: 40, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)", paddingBottom: 24, alignItems: "flex-start" },
    title: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 700, color: T, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" },
    subtitle: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 3, fontFamily: "Space Grotesk", fontWeight: 700 },
    logo: { height: 40, objectFit: "contain", marginTop: 10 },
    
    dateLine: { fontSize: 9, color: "#9CA3AF", marginBottom: 32, textAlign: "right", fontFamily: "Inter" },
    
    billingSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    billBox: { width: "45%" },
    billLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "Space Grotesk", fontWeight: 700 },
    billName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    billAddr: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
    
    table: { marginBottom: 32, borderTopWidth: 1, borderTopColor: T },
    tHeader: { flexDirection: "row", backgroundColor: T + "05", padding: "10 8", borderBottomWidth: 1, borderBottomColor: T },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.03)", padding: "12 8" },
    th: { fontSize: 8, fontWeight: 700, color: T, textTransform: "uppercase", fontFamily: "Space Grotesk" },
    td: { fontSize: 9, color: "#111827" },
    
    colNo: { width: "5%" },
    colDesc: { width: "40%" },
    colHSN: { width: "10%", textAlign: "center" },
    colQty: { width: "8%", textAlign: "center" },
    colRate: { width: "12%", textAlign: "right" },
    colGST: { width: "10%", textAlign: "right" },
    colAmt: { width: "15%", textAlign: "right" },
    
    summarySection: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, gap: 20 },
    leftCol: { width: "55%" },
    rightCol: { width: "40%" },
    
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "4 0" },
    totLabel: { fontSize: 8, color: "#9CA3AF" },
    totVal: { fontSize: 9, fontWeight: 700, color: "#374151" },
    grandBox: { marginTop: 12, padding: "12 0", borderTopWidth: 2, borderTopColor: T, borderBottomWidth: 2, borderBottomColor: T, alignItems: "center" },
    grandLabel: { fontSize: 8, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Space Grotesk" },
    grandVal: { fontSize: 20, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    advBox: { backgroundColor: "#FEF9C3", padding: "12 16", borderRadius: 8, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: "#F59E0B" },
    advLabel: { fontSize: 7, fontWeight: 700, color: "#92400E", textTransform: "uppercase", marginBottom: 4, fontFamily: "Space Grotesk" },
    advValue: { fontSize: 16, fontWeight: 700, color: "#92400E", fontFamily: "Space Grotesk" },
    
    bankBox: { backgroundColor: "rgba(0,0,0,0.02)", padding: 12, borderRadius: 8 },
    bankLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 6 },
    bankValue: { fontSize: 9, fontWeight: 700, color: "#111827" },
    
    footer: { position: "absolute", bottom: 40, left: 80, right: 80, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)", paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    footerText: { fontSize: 8, color: "#D1D5DB", fontStyle: "italic" },
    sidebarLine: { position: "absolute", left: 40, top: 60, bottom: 60, width: 2, backgroundColor: T },
    signature: { height: 40, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120 },
    sigLabel: { fontSize: 8, color: "#9CA3AF", textAlign: "right" }
  });

  return (
    <Document title={`Elegant-Proforma-${form.proformaNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>⚠ PROFORMA INVOICE — NOT A TAX INVOICE</Text>
        </View>
        <View style={styles.sidebarLine} />
        <View style={styles.header}>
          <Text style={styles.title}>PROFORMA</Text>
          <Text style={styles.subtitle}>OFFICIAL DISBURSEMENT ESTIMATE</Text>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <View>
                <Text style={styles.billLabel}>Settlement Origin</Text>
                <Text style={styles.billName}>{form.fromName || "—"}</Text>
                <Text style={styles.billAddr}>
                    {form.fromAddress}{form.fromCity ? `, ${form.fromCity}, ${fromState}` : ""}
                    {form.fromGSTIN && `\nGSTIN: ${form.fromGSTIN}`}
                    {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? "Ph: " + form.fromPhone : ""}${form.fromPhone && form.fromEmail ? " | " : ""}${form.fromEmail ? "Em: " + form.fromEmail : ""}`}
                </Text>
            </View>
            <View style={{ textAlign: "right" }}>
                <Text style={styles.dateLine}>REF: #{form.proformaNumber}</Text>
                <Text style={styles.dateLine}>DATE: {form.proformaDate}</Text>
            </View>
        </View>

        <View style={styles.billingSection}>
          <View style={styles.billBox}>
            <Text style={styles.billLabel}>Client Information</Text>
            <Text style={styles.billName}>{form.toName || "—"}</Text>
            <View style={styles.billAddr}>
                {form.toAddress}{form.toCity ? `, ${form.toCity}, ${toState}` : ""}
                {form.toGSTIN && `\nGSTIN: ${form.toGSTIN}`}
            </View>
          </View>
          <View style={[styles.billBox, { textAlign: "right" }]}>
            <Text style={styles.billLabel}>Quotation Scope</Text>
            <Text style={styles.billName}>{form.taxType === "igst" ? "Inter-state IGST" : "Intra-state Tax"}</Text>
            {form.validUntil && <Text style={{ fontSize: 9, color: "#9CA3AF", marginTop: 4 }}>Quote Valid Unit: {form.validUntil}</Text>}
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
              <Text style={[styles.td, styles.colDesc, { fontWeight: 700 }]}>{item.description || "—"}</Text>
              {form.showHSN && <Text style={[styles.td, styles.colHSN]}>{item.hsn || "—"}</Text>}
              <Text style={[styles.td, styles.colQty]}>{item.qty}</Text>
              <Text style={[styles.td, styles.colRate]}>{item.rate}</Text>
              <Text style={[styles.td, styles.colGST]}>{item.gstRate}%</Text>
              <Text style={[styles.td, styles.colAmt, { fontWeight: 700, color: T }]}>{item.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summarySection}>
          <View style={styles.leftCol}>
            {parseFloat(form.advancePercent) > 0 && (
              <View style={styles.advBox}>
                <Text style={styles.advLabel}>Payable Advance ({form.advancePercent}%)</Text>
                <Text style={styles.advValue}>₹{advFmt}</Text>
              </View>
            )}
            {form.bankName && (
              <View style={styles.bankBox}>
                <Text style={styles.bankLabel}>Remittance Details</Text>
                <Text style={styles.bankValue}>{form.bankName} | {form.accountNumber}</Text>
                {form.accountName && <Text style={styles.bankValue}>{form.accountName}</Text>}
                <Text style={{ fontSize: 8, color: "#9CA3AF" }}>IFSC: {form.ifscCode} | {form.accountName}</Text>
              </View>
            )}
            <View style={{ marginTop: 15 }}>
                <Text style={styles.billLabel}>Total In Words</Text>
                <Text style={{ fontSize: 8, color: T, fontWeight: 700, fontStyle: "italic" }}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
            </View>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.totRow}><Text style={styles.totLabel}>Subtotal</Text><Text style={styles.totVal}>₹{calc.subtotal}</Text></View>
            {form.taxType === "igst" ? (
              <View style={styles.totRow}><Text style={styles.totLabel}>IGST Total</Text><Text style={styles.totVal}>₹{calc.totalIGST}</Text></View>
            ) : (
              <>
                <View style={styles.totRow}><Text style={styles.totLabel}>CGST Total</Text><Text style={styles.totVal}>₹{calc.totalCGST}</Text></View>
                <View style={styles.totRow}><Text style={styles.totLabel}>SGST Total</Text><Text style={styles.totVal}>₹{calc.totalSGST}</Text></View>
              </>
            )}
            <View style={styles.grandBox}>
              <Text style={styles.grandLabel}>Total Estimation</Text>
              <Text style={styles.grandVal}>₹{calc.grandTotal}</Text>
            </View>
          </View>
        </View>

        {(form.notes || form.terms) && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.billLabel}>Contractual Annotations</Text>
            <Text style={{ fontSize: 9, color: "#6B7280", marginTop: 4, lineHeight: 1.5 }}>{form.notes && `${form.notes}\n`}{form.terms}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Secure Proforma Quote via DocMinty.com</Text>
          <View>
            {form.signature && <Image src={form.signature} style={styles.signature} />}
            <View style={styles.sigLine}>
              <Text style={styles.sigLabel}>Authorized Signatory</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
