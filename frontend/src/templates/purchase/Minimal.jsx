"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PurchaseMinimalTemplate({ form }) {
  const T = form.templateColor || "#111827";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "48 64", backgroundColor: "#ffffff" },
    top: { borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 16, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    title: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1 },
    date: { fontSize: 10, color: "#9CA3AF" },
    
    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    metaBox: { flex: 1 },
    metaLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    metaValue: { fontSize: 11, fontWeight: 700, color: "#111827" },
    metaSub: { fontSize: 9, color: "#6B7280", marginTop: 2, maxWidth: 180, lineHeight: 1.4 },
    
    table: { marginBottom: 32 },
    tHeader: { flexDirection: "row", borderBottomWidth: 1.5, borderBottomColor: T, padding: "8 0" },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "10 0", alignItems: "center" },
    th: { fontSize: 8, fontWeight: 700, color: "#111827", textTransform: "uppercase" },
    td: { fontSize: 9, color: "#374151" },
    
    summaryFrame: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
    sumCol: { width: "45%" },
    
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "6 0" },
    totLabel: { fontSize: 9, color: "#6B7280" },
    totVal: { fontSize: 9, fontWeight: 700, color: "#111827" },
    grandRow: { flexDirection: "row", justifyContent: "space-between", padding: "12 0", borderTopWidth: 1, borderTopColor: T, marginTop: 8 },
    grandLabel: { fontSize: 11, fontWeight: 700, color: "#111827" },
    grandVal: { fontSize: 11, fontWeight: 700, color: T },
    
    termsContainer: { padding: "12 16", backgroundColor: "#F9FAFB", borderRadius: 4, marginBottom: 12, borderLeftWidth: 2, borderLeftColor: T },
    termsLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 4 },
    termsText: { fontSize: 9, color: "#374151", lineHeight: 1.4 },
    
    wordsText: { fontSize: 8.5, color: "#9CA3AF", fontStyle: "italic", marginTop: 16, textAlign: "right" },
    
    footer: { position: "absolute", bottom: 48, left: 64, right: 64, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    footerText: { fontSize: 8, color: "#D1D5DB" },
    signatureImage: { height: 40, marginBottom: 4, objectFit: "contain", alignSelf: "center" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#374151", paddingTop: 4, width: 120 },
    sigText: { fontSize: 9, color: "#9CA3AF", textAlign: "center" }
  });

  const fromStateName = fromState?.name || "";
  const toStateName = toState?.name || "";

  return (
    <Document title={`PO-Minimal-${form.poNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.top}>
          <Text style={styles.title}>Purchase Order</Text>
          <Text style={styles.date}>{form.poDate}</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Order From</Text>
            <Text style={styles.metaValue}>{form.fromName || "Your Company"}</Text>
            {form.fromGSTIN && <Text style={styles.metaSub}>GSTIN: {form.fromGSTIN}</Text>}
            <Text style={styles.metaSub}>{form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}</Text>
            {fromStateName && <Text style={styles.metaSub}>{fromStateName}</Text>}
            {(form.fromPhone || form.fromEmail) && (
              <Text style={[styles.metaSub, { marginTop: 4 }]}>
                {form.fromPhone && `Ph: ${form.fromPhone} `}
                {form.fromEmail && `Em: ${form.fromEmail}`}
              </Text>
            )}
          </View>
          <View style={[styles.metaBox, { textAlign: "right", alignItems: "flex-end" }]}>
            <Text style={styles.metaLabel}>Order Information</Text>
            <Text style={styles.metaValue}>#{form.poNumber || "PO-001"}</Text>
            <Text style={[styles.metaSub, { textAlign: "right", fontWeight: 700, color: "#111827" }]}>{form.toName || "Vendor Name"}</Text>
            {form.toGSTIN && <Text style={[styles.metaSub, { textAlign: "right" }]}>GSTIN: {form.toGSTIN}</Text>}
            <Text style={[styles.metaSub, { textAlign: "right" }]}>{form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}</Text>
            {toStateName && <Text style={[styles.metaSub, { textAlign: "right" }]}>{toStateName}</Text>}
            {form.deliveryDate && <Text style={[styles.metaSub, { textAlign: "right", color: T, fontWeight: 700 }]}>Deliver By: {form.deliveryDate}</Text>}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tHeader}>
            <View style={{ flex: 4 }}><Text style={styles.th}>Description</Text></View>
            <View style={{ flex: 1.5 }}><Text style={[styles.th, { textAlign: "center" }]}>Qty / Unit</Text></View>
            <View style={{ flex: 1.5 }}><Text style={[styles.th, { textAlign: "right" }]}>Subtotal</Text></View>
          </View>
          {calc.items.map((item, i) => (
            <View key={i} style={styles.tRow} wrap={false}>
              <View style={{ flex: 4 }}>
                <Text style={[styles.td, { fontWeight: 700, color: "#111827" }]}>{item.description || "—"}</Text>
                <Text style={{ fontSize: 7.5, color: "#9CA3AF", marginTop: 2 }}>
                  {item.hsn ? `HSN ${item.hsn} | ` : ""}Rate ₹{item.rate}
                </Text>
              </View>
              <View style={{ flex: 1.5 }}>
                <Text style={[styles.td, { textAlign: "center" }]}>{item.qty} {item.unit || "Nos"}</Text>
              </View>
              <View style={{ flex: 1.5 }}><Text style={[styles.td, { textAlign: "right", fontWeight: 700 }]}>₹{item.amount}</Text></View>
            </View>
          ))}
        </View>

        <View style={styles.summaryFrame} wrap={false}>
          <View style={styles.sumCol}>
            {form.deliveryAddress && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.metaLabel}>Ship To Location</Text>
                <Text style={styles.metaSub}>{form.deliveryAddress}</Text>
              </View>
            )}
            <View>
              <Text style={styles.metaLabel}>Quote Ref</Text>
              <Text style={{ fontSize: 9, color: "#6B7280", marginTop: 2 }}>PO Request #{form.poNumber}</Text>
            </View>
          </View>

          <View style={styles.sumCol}>
            <View style={styles.totRow}><Text style={styles.totLabel}>Subtotal</Text><Text style={styles.totVal}>₹{calc.subtotal}</Text></View>
            {form.taxType === "igst" ? (
              <View style={styles.totRow}><Text style={styles.totLabel}>IGST</Text><Text style={styles.totVal}>₹{calc.totalIGST}</Text></View>
            ) : form.taxType === "cgst_sgst" ? (
              <>
                <View style={styles.totRow}><Text style={styles.totLabel}>CGST</Text><Text style={styles.totVal}>₹{calc.totalCGST}</Text></View>
                <View style={styles.totRow}><Text style={styles.totLabel}>SGST</Text><Text style={styles.totVal}>₹{calc.totalSGST}</Text></View>
              </>
            ) : null}
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Total Amount</Text>
              <Text style={styles.grandVal}>₹{calc.grandTotal}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.wordsText} wrap={false}>{numberToWords(parseFloat(calc.grandTotal))}</Text>

        <View style={{ marginTop: 24 }} wrap={false}>
          {form.paymentTerms && (
            <View style={styles.termsContainer}>
              <Text style={styles.termsLabel}>Payment Stipulation</Text>
              <Text style={styles.termsText}>{form.paymentTerms}</Text>
            </View>
          )}
          {form.shippingTerms && (
            <View style={styles.termsContainer}>
              <Text style={styles.termsLabel}>Dispatch Conditions</Text>
              <Text style={styles.termsText}>{form.shippingTerms}</Text>
            </View>
          )}
          {form.notes && (
            <View style={styles.termsContainer}>
              <Text style={styles.termsLabel}>Notes</Text>
              <Text style={styles.termsText}>{form.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Digital PO Release by DocMinty.com</Text>
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
