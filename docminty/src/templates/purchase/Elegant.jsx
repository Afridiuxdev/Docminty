"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PurchaseElegantTemplate({ form }) {
  const T = form.templateColor || "#D97706";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 9, color: "#111827", padding: "60 80", backgroundColor: "#FFFDFA" },
    header: { marginBottom: 40, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)", paddingBottom: 24, alignItems: "flex-start" },
    title: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 700, color: T, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" },
    subtitle: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 3, fontFamily: "Space Grotesk" },
    
    dateLine: { fontSize: 9, color: "#9CA3AF", marginBottom: 32, textAlign: "right", fontFamily: "Inter" },
    
    addressSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40 },
    addressBox: { width: "45%" },
    addressLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    addressName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    addressDetails: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
    
    table: { marginBottom: 32, borderTopWidth: 1, borderTopColor: T },
    tHeader: { flexDirection: "row", backgroundColor: T + "05", padding: "10 8", borderBottomWidth: 1, borderBottomColor: T },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.03)", padding: "12 8", alignItems: "center" },
    th: { fontSize: 8, fontWeight: 700, color: T, textTransform: "uppercase" },
    td: { fontSize: 9, color: "#111827" },
    
    summarySection: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
    leftCol: { width: "55%" },
    rightCol: { width: "40%" },
    
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "6 0" },
    totLabel: { fontSize: 9, color: "#9CA3AF" },
    totVal: { fontSize: 9, fontWeight: 700, color: "#374151" },
    grandBox: { marginTop: 12, padding: "16 0", borderTopWidth: 2, borderTopColor: T, borderBottomWidth: 2, borderBottomColor: T, alignItems: "center" },
    grandLabel: { fontSize: 9, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    grandVal: { fontSize: 22, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    conditionsSection: { marginTop: 32, padding: 16, backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 8 },
    condTitle: { fontSize: 7, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
    condItem: { marginBottom: 12 },
    condKey: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase" },
    condValue: { fontSize: 9, color: "#111827", lineHeight: 1.4 },
    
    footer: { position: "absolute", bottom: 40, left: 80, right: 80, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)", paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    footerText: { fontSize: 8, color: "#D1D5DB", fontStyle: "italic" },
    sidebarLine: { position: "absolute", left: 40, top: 60, bottom: 60, width: 2, backgroundColor: T },
    signatureImage: { height: 40, marginBottom: 4, objectFit: "contain", alignSelf: "center" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120 },
    sigText: { fontSize: 8, color: "#9CA3AF", textAlign: "center" }
  });

  const fromStateName = fromState?.name || "";
  const toStateName = toState?.name || "";

  return (
    <Document title={`Elegant-PO-${form.poNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebarLine} />
        <View style={styles.header}>
          {form.logo && <Image src={form.logo} style={{ height: 40, marginBottom: 12, objectFit: "contain" }} />}
          <Text style={styles.title}>PURCHASE ORDER</Text>
          <Text style={styles.subtitle}>{form.fromName || "Commercial Procurement Request"}</Text>
          <View style={{ marginTop: 8 }}>
                 {form.fromGSTIN && <Text style={styles.addressDetails}>GSTIN: {form.fromGSTIN}</Text>}
                 <Text style={styles.addressDetails}>{form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}</Text>
                 {fromStateName && <Text style={styles.addressDetails}>{fromStateName}</Text>}
          </View>
        </View>

        <Text style={styles.dateLine}>REF: #{form.poNumber}   |   DATE: {form.poDate}</Text>

        <View style={styles.addressSection}>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>Vendor / Supplier</Text>
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
          <View style={[styles.addressBox, { textAlign: "right" }]}>
            <Text style={styles.addressLabel}>Ship To / Consignee</Text>
            <Text style={styles.addressDetails}>{form.deliveryAddress || "Same as Billing"}</Text>
            {form.deliveryDate && <Text style={{ fontSize: 9, color: T, fontWeight: 700, marginTop: 8, textTransform: "uppercase" }}>Estimated Delivery: {form.deliveryDate}</Text>}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tHeader}>
            <View style={{ flex: 3 }}><Text style={styles.th}>Procurement Description</Text></View>
            <View style={{ flex: 1.2 }}><Text style={[styles.th, { textAlign: "right" }]}>Total Amount</Text></View>
          </View>
          {calc.items.map((item, i) => (
            <View key={i} style={styles.tRow} wrap={false}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.td, { fontWeight: 700 }]}>{item.description || "—"}</Text>
                <Text style={{ fontSize: 7.5, color: "#9CA3AF", marginTop: 2 }}>{item.qty} {item.unit || "Nos"} | {item.hsn ? `HSN ${item.hsn} | ` : ""}₹{item.rate} unit rate</Text>
              </View>
              <View style={{ flex: 1.2 }}><Text style={[styles.td, { textAlign: "right", fontWeight: 700 }]}>₹{item.amount}</Text></View>
            </View>
          ))}
        </View>

        <View style={styles.summarySection} wrap={false}>
          <View style={styles.leftCol}>
            <View style={styles.conditionsSection}>
              <Text style={styles.condTitle}>Order Specifics</Text>
              {form.paymentTerms && (
                <View style={styles.condItem}>
                  <Text style={styles.condKey}>Payment Obligations</Text>
                  <Text style={styles.condValue}>{form.paymentTerms}</Text>
                </View>
              )}
              {form.shippingTerms && (
                <View style={styles.condItem}>
                  <Text style={styles.condKey}>Shipping & Dispatch</Text>
                  <Text style={styles.condValue}>{form.shippingTerms}</Text>
                </View>
              )}
              {form.notes && (
                <View style={styles.condItem}>
                  <Text style={styles.condKey}>Notes</Text>
                  <Text style={styles.condValue}>{form.notes}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.totRow}><Text style={styles.totLabel}>Subtotal</Text><Text style={styles.totVal}>₹{calc.subtotal}</Text></View>
            {form.taxType === "igst" ? (
              <View style={styles.totRow}><Text style={styles.totLabel}>IGST Total</Text><Text style={styles.totVal}>₹{calc.totalIGST}</Text></View>
            ) : form.taxType === "cgst_sgst" ? (
              <>
                <View style={styles.totRow}><Text style={styles.totLabel}>CGST Total</Text><Text style={styles.totVal}>₹{calc.totalCGST}</Text></View>
                <View style={styles.totRow}><Text style={styles.totLabel}>SGST Total</Text><Text style={styles.totVal}>₹{calc.totalSGST}</Text></View>
              </>
            ) : null}
            <View style={styles.grandBox}>
              <Text style={styles.grandLabel}>Total Order Value</Text>
              <Text style={styles.grandVal}>₹{calc.grandTotal}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 24 }} wrap={false}>
          <Text style={{ fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 }}>Valuation in Words</Text>
          <Text style={{ fontSize: 10, fontWeight: 700, color: T, marginTop: 4, fontStyle: "italic" }}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Secure Purchase Release — Powered by DocMinty.com</Text>
          <View style={{ alignItems: "center" }}>
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
