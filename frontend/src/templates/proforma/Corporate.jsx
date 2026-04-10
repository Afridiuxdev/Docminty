"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function ProformaCorporateTemplate({ form }) {
  const T = form.templateColor || "#1E3A5F";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  
  const advAmt = (parseFloat(calc.grandTotal) * (parseFloat(form.advancePercent) || 0) / 100);
  const advFmt = advAmt.toLocaleString("en-IN", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 9, color: "#111827", padding: "50 70", backgroundColor: "#ffffff" },
    badge: { backgroundColor: "#FEF9C3", borderBottomWidth: 1.5, borderBottomColor: "#F59E0B", padding: "4 0", margin: "-50 -70 32 -70", textAlign: "center" },
    badgeText: { fontSize: 9, fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "Space Grotesk" },
    
    header: { marginBottom: 32, textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 20 },
    logo: { height: 40, objectFit: "contain", marginBottom: 12, margin: "0 auto" },
    orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
    docType: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, fontFamily: "Space Grotesk" },
    
    dateRow: { marginTop: 24, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 12 },
    metaText: { fontSize: 9, color: "#6B7280", fontWeight: 700, fontFamily: "Space Grotesk" },
    
    billingRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    billBox: { width: "45%" },
    billLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "Space Grotesk", fontWeight: 700 },
    billName: { fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 4 },
    billAddr: { fontSize: 9, color: "#6B7280", lineHeight: 1.4 },
    
    table: { marginBottom: 32 },
    tHeader: { flexDirection: "row", backgroundColor: T, padding: "8 6" },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "10 6" },
    th: { fontSize: 8, fontWeight: 700, color: "#ffffff", textTransform: "uppercase", fontFamily: "Space Grotesk" },
    td: { fontSize: 9, color: "#111827" },
    
    colNo: { width: "5%" },
    colDesc: { width: "40%" },
    colHSN: { width: "10%", textAlign: "center" },
    colQty: { width: "8%", textAlign: "center" },
    colRate: { width: "12%", textAlign: "right" },
    colGST: { width: "10%", textAlign: "right" },
    colAmt: { width: "15%", textAlign: "right" },
    
    summarySection: { flexDirection: "row", justifyContent: "flex-end" },
    totBox: { width: 220 },
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "6 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    totLabel: { fontSize: 9, color: "#6B7280" },
    totVal: { fontSize: 9, fontWeight: 700, color: "#111827" },
    grandRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#F8FAFD", padding: "12 16", borderRadius: 8, marginTop: 12 },
    grandLabel: { fontSize: 11, fontWeight: 700, color: T },
    grandVal: { fontSize: 13, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    infoSection: { marginTop: 32, flexDirection: "row", gap: 32 },
    infoCol: { flex: 1 },
    infoTitle: { fontSize: 8, fontWeight: 700, color: T, textTransform: "uppercase", marginBottom: 8, borderBottomWidth: 1, borderBottomColor: T, paddingBottom: 4, fontFamily: "Space Grotesk" },
    infoText: { fontSize: 9, color: "#374151", lineHeight: 1.5 },
    
    bankGrid: { marginTop: 8 },
    bankLine: { flexDirection: "row", marginBottom: 4 },
    bankKey: { width: 80, fontSize: 8, color: "#9CA3AF" },
    bankVal: { flex: 1, fontSize: 9, fontWeight: 700, color: "#111827" },
    
    footer: { position: "absolute", bottom: 40, left: 70, right: 70, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    footerText: { fontSize: 8, color: "#D1D5DB" },
    signature: { height: 40, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 8, width: 140 },
    sigText: { fontSize: 10, fontWeight: 700, color: "#111827", textAlign: "right" }
  });

  return (
    <Document title={`Corporate-Proforma-${form.proformaNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>PROFORMA INVOICE — NOT A TAX INVOICE</Text>
        </View>
        <View style={styles.header}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.orgName}>{form.fromName || "—"}</Text>
          <Text style={styles.docType}>Official Commercial Proforma Quotation</Text>
        </View>

        <View style={styles.dateRow}>
          <Text style={styles.metaText}>QUOTATION REF: {form.proformaNumber}</Text>
          <Text style={styles.metaText}>DATE: {form.proformaDate}</Text>
          {form.validUntil && <Text style={styles.metaText}>VALID UNTIL: {form.validUntil}</Text>}
        </View>

        <View style={styles.billingRow}>
          <View style={styles.billBox}>
            <Text style={styles.billLabel}>Client Information</Text>
            <Text style={styles.billName}>{form.toName || "—"}</Text>
            <View style={styles.billAddr}>
                {form.toAddress}{form.toCity ? `, ${form.toCity}, ${toState}` : ""}
                {form.toGSTIN && `\nGSTIN: ${form.toGSTIN}`}
                {form.toPhone && `\nPH: ${form.toPhone}`}
            </View>
          </View>
          <View style={[styles.billBox, { textAlign: "right" }]}>
            <Text style={styles.billLabel}>Settlement Origin</Text>
            <Text style={styles.billName}>{form.fromName || "—"}</Text>
            <Text style={styles.billAddr}>
                {form.fromAddress}{form.fromCity ? `, ${form.fromCity}, ${fromState}` : ""}
                {form.fromGSTIN && `\nGSTIN: ${form.fromGSTIN}`}
                {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? "Ph: " + form.fromPhone : ""}${form.fromPhone && form.fromEmail ? " | " : ""}${form.fromEmail ? "Em: " + form.fromEmail : ""}`}
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
              <Text style={[styles.td, styles.colDesc, { fontWeight: 700 }]}>{item.description || "—"}</Text>
              {form.showHSN && <Text style={[styles.td, styles.colHSN]}>{item.hsn || "—"}</Text>}
              <Text style={[styles.td, styles.colQty]}>{item.qty}</Text>
              <Text style={[styles.td, styles.colRate]}>{item.rate}</Text>
              <Text style={[styles.td, styles.colGST]}>{item.gstRate}%</Text>
              <Text style={[styles.td, styles.colAmt, { fontWeight: 700 }]}>{item.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summarySection}>
          <View style={styles.totBox}>
            <View style={styles.totRow}>
              <Text style={styles.totLabel}>Subtotal</Text>
              <Text style={styles.totVal}>Rs.{calc.subtotal}</Text>
            </View>
            {form.taxType === "igst" ? (
              <View style={styles.totRow}>
                <Text style={styles.totLabel}>Tax (IGST)</Text>
                <Text style={styles.totVal}>Rs.{calc.totalIGST}</Text>
              </View>
            ) : (
              <>
                <View style={styles.totRow}>
                  <Text style={styles.totLabel}>Tax (CGST)</Text>
                  <Text style={styles.totVal}>Rs.{calc.totalCGST}</Text>
                </View>
                <View style={styles.totRow}>
                  <Text style={styles.totLabel}>Tax (SGST)</Text>
                  <Text style={styles.totVal}>Rs.{calc.totalSGST}</Text>
                </View>
              </>
            )}
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Quotational Total</Text>
              <Text style={styles.grandVal}>Rs.{calc.grandTotal}</Text>
            </View>
            <Text style={{ fontSize: 7, color: "#9CA3AF", marginTop: 8, textAlign: "right" }}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCol}>
            <Text style={styles.infoTitle}>Commercial Compliance</Text>
            {parseFloat(form.advancePercent) > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={[styles.infoText, { fontWeight: 700, color: T }]}>Commitment Advance: Rs.{advFmt} ({form.advancePercent}%)</Text>
                <Text style={styles.infoText}>This proforma validates the commercial intent. Order initiation requires advance settlement.</Text>
              </View>
            )}
            {form.bankName && (
              <View style={styles.bankGrid}>
                <View style={styles.bankLine}><Text style={styles.bankKey}>Bank:</Text><Text style={styles.bankVal}>{form.fromName.split(' ')[0]}</Text></View>
                {form.accountName && <View style={styles.bankLine}><Text style={styles.bankKey}>Name:</Text><Text style={styles.bankVal}>{form.accountName}</Text></View>}
                <View style={styles.bankLine}><Text style={styles.bankKey}>Account:</Text><Text style={styles.bankVal}>{form.accountNumber}</Text></View>
                <View style={styles.bankLine}><Text style={styles.bankKey}>IFSC:</Text><Text style={styles.bankVal}>{form.ifscCode}</Text></View>
              </View>
            )}
            {form.validUntil && <Text style={[styles.infoText, { marginTop: 8 }]}>Offer Validity: This quotation is valid until {form.validUntil}.</Text>}
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoTitle}>Terms of Settlement</Text>
            <Text style={styles.infoText}>{form.notes || "This is a proforma generated for settlement verification."}</Text>
            <Text style={[styles.infoText, { marginTop: 8 }]}>{form.terms || "Goods once estimated cannot be cancelled after production start."}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Proforma Release via DocMinty Pro</Text>
          <View>
            {form.signature && <Image src={form.signature} style={styles.signature} />}
            <View style={styles.sigLine}>
              <Text style={styles.sigText}>Verification Seal</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
