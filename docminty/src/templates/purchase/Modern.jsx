"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PurchaseModernTemplate({ form }) {
  const T = form.templateColor || "#6366F1";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, flexDirection: "row", backgroundColor: "#ffffff" },
    sidebar: { width: 180, backgroundColor: T, height: "100%", padding: "40 24", color: "#ffffff" },
    logo: { width: 50, objectFit: "contain", marginBottom: 32, filter: "brightness(0) invert(1)" },
    sideTitle: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 40 },
    sideItem: { marginBottom: 24 },
    sideLabel: { fontSize: 8, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    sideValue: { fontSize: 11, fontWeight: 700, color: "#ffffff", lineHeight: 1.4 },
    
    main: { flex: 1, padding: "40 40", backgroundColor: "#ffffff" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 },
    title: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    metaText: { fontSize: 10, color: "#9CA3AF", textAlign: "right", marginTop: 4 },
    
    addressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 24 },
    addressBox: { width: "48%" },
    addressLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
    addressName: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 4 },
    addressDetails: { fontSize: 9, color: "#6B7280", lineHeight: 1.4 },
    
    table: { marginBottom: 32 },
    tHeader: { flexDirection: "row", borderBottomWidth: 2, borderBottomColor: T, padding: "8 0" },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "10 0", alignItems: "center" },
    th: { fontSize: 8, fontWeight: 700, color: T, textTransform: "uppercase" },
    td: { fontSize: 9, color: "#111827" },
    
    bottomGrid: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
    leftCol: { width: "55%" },
    rightCol: { width: "40%" },
    
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "6 0" },
    totLabel: { fontSize: 9, color: "#6B7280" },
    totVal: { fontSize: 9, fontWeight: 700, color: "#111827" },
    grandBox: { marginTop: 12, padding: "12 16", backgroundColor: T, borderRadius: 12 },
    grandLabel: { fontSize: 10, fontWeight: 700, color: "#ffffff", textTransform: "uppercase" },
    grandVal: { fontSize: 16, fontWeight: 800, color: "#ffffff", fontFamily: "Space Grotesk" },
    
    termsBox: { backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, marginBottom: 24 },
    termsLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 },
    termItem: { marginBottom: 12 },
    termTitle: { fontSize: 8, fontWeight: 800, color: T, textTransform: "uppercase", marginBottom: 2 },
    termText: { fontSize: 10, color: "#6B7280", lineHeight: 1.4 },
    
    footer: { position: "absolute", bottom: 40, left: 40, right: 40, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
    footerText: { fontSize: 9, color: "#D1D5DB", textAlign: "center" },
    signatureImage: { height: 40, marginBottom: 4, objectFit: "contain", alignSelf: "center" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#374151", paddingTop: 4, width: 120, alignSelf: "flex-end" },
    sigText: { fontSize: 9, color: "#9CA3AF", textAlign: "center" }
  });

  const fromStateName = fromState?.name || "";
  const toStateName = toState?.name || "";

  return (
    <Document title={`PO-${form.poNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.sideTitle}>PURCHASE</Text>
          
          <View style={styles.sideItem}>
            <Text style={styles.sideLabel}>Sender</Text>
            <Text style={styles.sideValue}>{form.fromName || "Your Company"}</Text>
            <Text style={[styles.sideValue, { fontWeight: 400, fontSize: 8, color: "rgba(255,255,255,0.7)" }]}>
              {form.fromGSTIN && `GSTIN: ${form.fromGSTIN}\n`}
              {form.fromPhone && `Ph: ${form.fromPhone}\n`}
              {form.fromEmail && `Em: ${form.fromEmail}`}
            </Text>
          </View>
          
          <View style={styles.sideItem}>
            <Text style={styles.sideLabel}>Order ID</Text>
            <Text style={styles.sideValue}>#{form.poNumber || "PO-001"}</Text>
          </View>
          
          <View style={styles.sideItem}>
            <Text style={styles.sideLabel}>Order Date</Text>
            <Text style={styles.sideValue}>{form.poDate}</Text>
          </View>

          {form.deliveryDate && (
            <View style={styles.sideItem}>
              <Text style={styles.sideLabel}>Expected Delivery</Text>
              <Text style={styles.sideValue}>{form.deliveryDate}</Text>
            </View>
          )}

          <View style={{ marginTop: "auto" }}>
            <Text style={styles.sideLabel}>Grand Total Amount</Text>
            <Text style={{ fontSize: 18, fontWeight: 800 }}>₹{calc.grandTotal}</Text>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Purchase Requisition</Text>
              <Text style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>Official Commercial Document</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
                   {form.signature && (
                       <View style={{ alignItems: "center", marginBottom: 8 }}>
                           <Image src={form.signature} style={styles.signatureImage} />
                           <View style={styles.sigLine}>
                               <Text style={styles.sigText}>Authorised Signatory</Text>
                           </View>
                       </View>
                   )}
            </View>
          </View>

          <View style={styles.addressRow}>
            <View style={styles.addressBox}>
              <Text style={styles.addressLabel}>Vendor Information</Text>
              <Text style={styles.addressName}>{form.toName || "Supplier Business"}</Text>
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
              <View style={[styles.addressBox, { textAlign: "right" }]}>
                <Text style={styles.addressLabel}>Delivery Destination</Text>
                <Text style={[styles.addressDetails, { textAlign: "right" }]}>{form.deliveryAddress}</Text>
              </View>
            )}
          </View>

          <View style={styles.table}>
            <View style={styles.tHeader}>
              <View style={{ flex: 3 }}><Text style={styles.th}>Line Item</Text></View>
              <View style={{ flex: 1.2 }}><Text style={[styles.th, { textAlign: "center" }]}>Qty / Unit</Text></View>
              <View style={{ flex: 1.5 }}><Text style={[styles.th, { textAlign: "right" }]}>Subtotal</Text></View>
            </View>
            {calc.items.map((item, i) => (
              <View key={i} style={styles.tRow} wrap={false}>
                <View style={{ flex: 3 }}>
                  <Text style={[styles.td, { fontWeight: 700 }]}>{item.description || "—"}</Text>
                  <Text style={{ fontSize: 7, color: "#9CA3AF", marginTop: 2 }}>
                    {item.hsn ? `HSN ${item.hsn}` : ""} {item.rate ? `| Rate ₹${item.rate}` : ""}
                  </Text>
                </View>
                <View style={{ flex: 1.2 }}>
                  <Text style={[styles.td, { textAlign: "center" }]}>{item.qty} {item.unit || "Nos"}</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text style={[styles.td, { textAlign: "right", fontWeight: 700 }]}>₹{item.amount}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.bottomGrid}>
            <View style={styles.leftCol}>
              <View style={styles.termsBox}>
                <Text style={styles.termsLabel}>Order Conditions</Text>
                {form.paymentTerms && (
                  <View style={styles.termItem}>
                    <Text style={styles.termTitle}>Payment Terms</Text>
                    <Text style={styles.termText}>{form.paymentTerms}</Text>
                  </View>
                )}
                {form.shippingTerms && (
                  <View style={styles.termItem}>
                    <Text style={styles.termTitle}>Shipping terms</Text>
                    <Text style={styles.termText}>{form.shippingTerms}</Text>
                  </View>
                )}
                {form.notes && (
                  <View style={styles.termItem}>
                    <Text style={styles.termTitle}>Internal Notes</Text>
                    <Text style={styles.termText}>{form.notes}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.rightCol}>
              <View style={styles.totRow}>
                <Text style={styles.totLabel}>Subtotal</Text>
                <Text style={styles.totVal}>₹{calc.subtotal}</Text>
              </View>
              {form.taxType === "igst" ? (
                <View style={styles.totRow}>
                  <Text style={styles.totLabel}>IGST</Text>
                  <Text style={styles.totVal}>₹{calc.totalIGST}</Text>
                </View>
              ) : form.taxType === "cgst_sgst" ? (
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
              ) : null}
              <View style={styles.grandBox}>
                <Text style={styles.grandLabel}>Grand Total Value</Text>
                <Text style={styles.grandVal}>₹{calc.grandTotal}</Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 24 }} wrap={false}>
            <Text style={{ fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 }}>Amount in Words</Text>
            <Text style={{ fontSize: 11, fontWeight: 700, color: T, marginTop: 4 }}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Official Purchase Order — Powered by DocMinty.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
