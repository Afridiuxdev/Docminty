"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PurchaseCorporateTemplate({ form }) {
  const T = form.templateColor || "#1E3A5F";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 9, color: "#111827", padding: "50 70", backgroundColor: "#ffffff" },
    header: { marginBottom: 32, textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 20 },
    logo: { height: 40, objectFit: "contain", marginBottom: 12, margin: "0 auto" },
    orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
    docType: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, fontFamily: "Space Grotesk" },
    
    dateRow: { marginTop: 24, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 12 },
    metaText: { fontSize: 9, color: "#6B7280", fontWeight: 700 },
    
    billingRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    billBox: { width: "45%" },
    billLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    billName: { fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 4 },
    billAddr: { fontSize: 9, color: "#6B7280", lineHeight: 1.4 },
    
    table: { marginBottom: 32 },
    tHeader: { flexDirection: "row", backgroundColor: T, padding: "8 6" },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "10 6", alignItems: "center" },
    th: { fontSize: 8, fontWeight: 700, color: "#ffffff", textTransform: "uppercase" },
    td: { fontSize: 9, color: "#111827" },
    
    summarySection: { flexDirection: "row", justifyContent: "flex-end" },
    totBox: { width: 220 },
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "6 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    totLabel: { fontSize: 9, color: "#6B7280" },
    totVal: { fontSize: 9, fontWeight: 700, color: "#111827" },
    grandRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#F8FAFD", padding: "12 16", borderRadius: 8, marginTop: 12 },
    grandLabel: { fontSize: 11, fontWeight: 700, color: T },
    grandVal: { fontSize: 13, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    conditionsSection: { marginTop: 32, flexDirection: "row", gap: 32 },
    condCol: { flex: 1 },
    condTitle: { fontSize: 8, fontWeight: 700, color: T, textTransform: "uppercase", marginBottom: 8, borderBottomWidth: 1, borderBottomColor: T, paddingBottom: 4 },
    condText: { fontSize: 9, color: "#374151", lineHeight: 1.5 },
    
    footer: { position: "absolute", bottom: 40, left: 70, right: 70, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 16 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" },
    sigBox: { width: 160, alignSelf: "flex-end", marginTop: 40 },
    signatureImage: { height: 40, marginBottom: 4, objectFit: "contain", alignSelf: "center" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 8, marginTop: 12 },
    sigText: { fontSize: 10, fontWeight: 700, color: "#111827", textAlign: "center" }
  });

  const fromStateName = fromState?.name || "";
  const toStateName = toState?.name || "";

  return (
    <Document title={`Corporate-PO-${form.poNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.orgName}>{form.fromName || "Organization Name"}</Text>
          <Text style={styles.docType}>Official Purchase Order</Text>
        </View>

        <View style={styles.dateRow}>
          <Text style={styles.metaText}>REF: #{form.poNumber}</Text>
          <Text style={styles.metaText}>DATE: {form.poDate}</Text>
        </View>

        <View style={styles.billingRow}>
          <View style={styles.billBox}>
            <Text style={styles.billLabel}>Vendor / Supplier</Text>
            <Text style={styles.billName}>{form.toName || "Supplier Name"}</Text>
            <View style={styles.billAddr}>
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
          <View style={[styles.billBox, { textAlign: "right" }]}>
            <Text style={styles.billLabel}>Ship To Address</Text>
            <Text style={styles.billAddr}>{form.deliveryAddress || "As Per Billing"}</Text>
            {form.deliveryDate && <Text style={{ fontSize: 9, color: T, fontWeight: 700, marginTop: 8 }}>Estimated Delivery: {form.deliveryDate}</Text>}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tHeader}>
            <View style={{ flex: 3 }}><Text style={styles.th}>Procurement Description</Text></View>
            <View style={{ flex: 0.8 }}><Text style={[styles.th, { textAlign: "center" }]}>Qty</Text></View>
            <View style={{ flex: 1 }}><Text style={[styles.th, { textAlign: "center" }]}>Unit</Text></View>
            <View style={{ flex: 1.2 }}><Text style={[styles.th, { textAlign: "right" }]}>Subtotal</Text></View>
          </View>
          {calc.items.map((item, i) => (
            <View key={i} style={styles.tRow} wrap={false}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.td, { fontWeight: 700 }]}>{item.description || "—"}</Text>
                <Text style={{ fontSize: 7, color: "#9CA3AF", marginTop: 2 }}>
                  {item.hsn ? `HSN ${item.hsn} | ` : ""}Rate ₹{item.rate}
                </Text>
              </View>
              <View style={{ flex: 0.8 }}><Text style={[styles.td, { textAlign: "center" }]}>{item.qty}</Text></View>
              <View style={{ flex: 1 }}><Text style={[styles.td, { textAlign: "center" }]}>{item.unit || "Nos"}</Text></View>
              <View style={{ flex: 1.2 }}><Text style={[styles.td, { textAlign: "right", fontWeight: 700 }]}>₹{item.amount}</Text></View>
            </View>
          ))}
        </View>

        <View style={styles.summarySection} wrap={false}>
          <View style={styles.totBox}>
            <View style={styles.totRow}>
              <Text style={styles.totLabel}>Subtotal</Text>
              <Text style={styles.totVal}>₹{calc.subtotal}</Text>
            </View>
            {form.taxType === "igst" ? (
              <View style={styles.totRow}>
                <Text style={styles.totLabel}>IGST Total</Text>
                <Text style={styles.totVal}>₹{calc.totalIGST}</Text>
              </View>
            ) : form.taxType === "cgst_sgst" ? (
              <>
                <View style={styles.totRow}>
                  <Text style={styles.totLabel}>CGST Total</Text>
                  <Text style={styles.totVal}>₹{calc.totalCGST}</Text>
                </View>
                <View style={styles.totRow}>
                  <Text style={styles.totLabel}>SGST Total</Text>
                  <Text style={styles.totVal}>₹{calc.totalSGST}</Text>
                </View>
              </>
            ) : null}
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Order Grand Total</Text>
              <Text style={styles.grandVal}>₹{calc.grandTotal}</Text>
            </View>
          </View>
        </View>

        <Text style={{ fontSize: 8.5, color: "#9CA3AF", marginTop: 12, textAlign: "right", textTransform: "uppercase" }} wrap={false}>{numberToWords(parseFloat(calc.grandTotal))}</Text>

        <View style={styles.conditionsSection} wrap={false}>
          <View style={styles.condCol}>
            <Text style={styles.condTitle}>Procurement Terms</Text>
            {form.paymentTerms && (
              <View style={{ marginBottom: 12 }}>
                <Text style={[styles.condText, { fontWeight: 700, color: T, fontSize: 8 }]}>Payment Schedule:</Text>
                <Text style={styles.condText}>{form.paymentTerms}</Text>
              </View>
            )}
            {form.shippingTerms && (
              <View>
                <Text style={[styles.condText, { fontWeight: 700, color: T, fontSize: 8 }]}>Logistics Protocol:</Text>
                <Text style={styles.condText}>{form.shippingTerms}</Text>
              </View>
            )}
          </View>
          <View style={styles.condCol}>
            <Text style={styles.condTitle}>Notes</Text>
            <Text style={styles.condText}>{form.notes || "Standard corporate procurement policies apply."}</Text>
          </View>
        </View>

        <View style={styles.sigBox} wrap={false}>
          {form.signature ? (
            <Image src={form.signature} style={styles.signatureImage} />
          ) : (
            <View style={{ height: 40 }} />
          )}
          <View style={styles.sigLine}>
            <Text style={styles.sigText}>Authorised Signatory</Text>
            <Text style={[styles.sigText, { fontSize: 8, color: "#9CA3AF", fontWeight: 400 }]}>Supply Chain & Logistics</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Digital Procurement — DocMinty Pro</Text>
        </View>
      </Page>
    </Document>
  );
}
