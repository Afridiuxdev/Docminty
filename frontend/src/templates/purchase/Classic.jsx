"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PurchaseClassicTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 9, color: "#111827", padding: "40 50", backgroundColor: "#ffffff" },
    header: { backgroundColor: T, padding: "20 24", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
    logo: { height: 36, objectFit: "contain", marginBottom: 4 },
    fromName: { fontSize: 13, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff" },
    fromDetails: { fontSize: 9, color: "#ffffff", opacity: 0.8, marginTop: 2, lineHeight: 1.4 },
    
    titleSection: { textAlign: "right" },
    title: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff", textTransform: "uppercase" },
    num: { fontSize: 10, color: "#ffffff", opacity: 0.8, marginTop: 2 },
    meta: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
    
    addressSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    addressBox: { width: "45%" },
    addressLabel: { fontSize: 8, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    addressName: { fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 4 },
    addressDetails: { fontSize: 9, color: "#6B7280", lineHeight: 1.4 },
    
    table: { marginBottom: 24 },
    tHeader: { flexDirection: "row", backgroundColor: "#F9FAFB", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", padding: "8 4" },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "8 4", alignItems: "center" },
    th: { fontSize: 8, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" },
    td: { fontSize: 9, color: "#111827" },
    
    summarySection: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
    totBox: { width: 220 },
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "6 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    totLabel: { fontSize: 9, color: "#6B7280" },
    totVal: { fontSize: 9, fontWeight: 700, color: "#111827" },
    grandRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: T + "08", padding: "10 12", borderRadius: 6, marginTop: 8 },
    grandLabel: { fontSize: 11, fontWeight: 700, color: T },
    grandVal: { fontSize: 11, fontWeight: 700, color: T },
    
    wordsBox: { marginTop: 24, padding: "10 16", backgroundColor: "#F9FAFB", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: T },
    wordsLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 4 },
    wordsText: { fontSize: 9, color: "#374151", fontWeight: 700, fontStyle: "italic" },
    
    termsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginTop: 32 },
    termBox: { width: "30%", minWidth: 150 },
    termL: { fontSize: 8, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 4 },
    termT: { fontSize: 9, color: "#6B7280", lineHeight: 1.5 },
    
    footer: { position: "absolute", bottom: 40, left: 50, right: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 16 },
    footerGen: { fontSize: 8, color: "#D1D5DB" },
    sigBox: { width: 140 },
    signatureImage: { height: 40, marginBottom: 4, objectFit: "contain", alignSelf: "center" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#374151", paddingTop: 8 },
    sigText: { fontSize: 9, fontWeight: 700, color: "#111827", textAlign: "center" }
  });

  const fromStateName = fromState?.name || "";
  const toStateName = toState?.name || "";

  return (
    <Document title={`PO-${form.poNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.fromName}>{form.fromName || "Your Company"}</Text>
            <View style={styles.fromDetails}>
              {form.fromGSTIN && <Text>GSTIN: {form.fromGSTIN}</Text>}
              <Text>{form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}</Text>
              {fromStateName && <Text>{fromStateName}</Text>}
              {(form.fromPhone || form.fromEmail) && (
                <Text style={{ marginTop: 4 }}>
                  {form.fromPhone && `Ph: ${form.fromPhone} `}
                  {form.fromEmail && `Em: ${form.fromEmail}`}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.title}>PURCHASE ORDER</Text>
            <Text style={styles.num}>#{form.poNumber || "PO-001"}</Text>
            <Text style={styles.meta}>DATE: {form.poDate}</Text>
            {form.deliveryDate && <Text style={styles.meta}>DELIVERY BY: {form.deliveryDate}</Text>}
          </View>
        </View>

        <View style={styles.addressSection}>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>Vendor / Supplier</Text>
            <Text style={styles.addressName}>{form.toName || "Vendor Name"}</Text>
            <View style={styles.addressDetails}>
              {form.toGSTIN && <Text>GSTIN: {form.toGSTIN}</Text>}
              <Text>{form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}</Text>
              {toStateName && <Text>{toStateName}</Text>}
              {(form.toPhone || form.toEmail) && (
                <Text style={{ marginTop: 4 }}>
                  {form.toPhone && `Ph: ${form.toPhone} `}
                  {form.toEmail && `Em: ${form.toEmail}`}
                </Text>
              )}
            </View>
          </View>
          {form.deliveryAddress && (
            <View style={styles.addressBox}>
              <Text style={styles.addressLabel}>Ship To / Delivery Address</Text>
              <Text style={styles.addressDetails}>{form.deliveryAddress}</Text>
            </View>
          )}
        </View>

        <View style={styles.table}>
          <View style={styles.tHeader}>
            <View style={{ flex: 3 }}><Text style={styles.th}>Description</Text></View>
            {form.showHSN && <View style={{ flex: 1 }}><Text style={[styles.th, { textAlign: "center" }]}>HSN</Text></View>}
            <View style={{ flex: 1 }}><Text style={[styles.th, { textAlign: "center" }]}>Qty</Text></View>
            <View style={{ flex: 1 }}><Text style={[styles.th, { textAlign: "center" }]}>Unit</Text></View>
            <View style={{ flex: 1.2 }}><Text style={[styles.th, { textAlign: "right" }]}>Rate</Text></View>
            <View style={{ flex: 1.2 }}><Text style={[styles.th, { textAlign: "right" }]}>Amount</Text></View>
          </View>
          {calc.items.map((item, i) => (
            <View key={i} style={styles.tRow} wrap={false}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.td, { fontWeight: 700 }]}>{item.description || "—"}</Text>
              </View>
              {form.showHSN && (
                <View style={{ flex: 1 }}>
                  <Text style={[styles.td, { textAlign: "center" }]}>{item.hsn || "—"}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.td, { textAlign: "center" }]}>{item.qty}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.td, { textAlign: "center" }]}>{item.unit || "Nos"}</Text>
              </View>
              <View style={{ flex: 1.2 }}><Text style={[styles.td, { textAlign: "right" }]}>₹{item.rate}</Text></View>
              <View style={{ flex: 1.2 }}><Text style={[styles.td, { textAlign: "right", fontWeight: 700 }]}>₹{item.amount}</Text></View>
            </View>
          ))}
        </View>

        <View style={styles.summarySection}>
          <View style={styles.totBox}>
            <View style={styles.totRow}>
              <Text style={styles.totLabel}>Subtotal</Text>
              <Text style={styles.totVal}>₹{calc.subtotal}</Text>
            </View>
            {form.taxType === "cgst_sgst" && (
              <>
                <View style={styles.totRow}>
                  <Text style={styles.totLabel}>CGST</Text>
                  <Text style={styles.totVal}>₹{calc.totalCGST}</Text>
                </View>
                <View style={styles.totRow}>
                  <Text style={styles.totLabel}>SGST</Text>
                  <Text style={styles.totVal}>₹{calc.totalSGST}</Text>
                </View>
              </>
            )}
            {form.taxType === "igst" && (
              <View style={styles.totRow}>
                <Text style={styles.totLabel}>IGST</Text>
                <Text style={styles.totVal}>₹{calc.totalIGST}</Text>
              </View>
            )}
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Total Amount</Text>
              <Text style={styles.grandVal}>₹{calc.grandTotal}</Text>
            </View>
          </View>
        </View>

        <View style={styles.wordsBox} wrap={false}>
          <Text style={styles.wordsLabel}>Amount in Words</Text>
          <Text style={styles.wordsText}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
        </View>

        <View style={styles.termsGrid} wrap={false}>
          {form.paymentTerms && (
            <View style={styles.termBox}>
              <Text style={styles.termL}>Payment Terms</Text>
              <Text style={styles.termT}>{form.paymentTerms}</Text>
            </View>
          )}
          {form.shippingTerms && (
            <View style={styles.termBox}>
              <Text style={styles.termL}>Shipping Terms</Text>
              <Text style={styles.termT}>{form.shippingTerms}</Text>
            </View>
          )}
          {form.notes && (
            <View style={styles.termBox}>
              <Text style={styles.termL}>Notes</Text>
              <Text style={styles.termT}>{form.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerGen}>Generated by DocMinty.com</Text>
          <View style={styles.sigBox}>
            {form.signature ? (
              <Image src={form.signature} style={styles.signatureImage} />
            ) : (
              <View style={{ height: 40 }} />
            )}
            <View style={styles.sigLine}>
              <Text style={styles.sigText}>Authorised Signatory</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
