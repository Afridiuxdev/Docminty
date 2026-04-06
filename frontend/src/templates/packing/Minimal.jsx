"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PackingMinimalTemplate({ form }) {
  const T = form.templateColor || "#111827";
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  const totalQty = form.items.reduce((acc, i) => acc + (parseFloat(i.qty) || 0), 0);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "48 64", backgroundColor: "#ffffff" },
    top: { borderBottomWidth: 1.5, borderBottomColor: T, paddingBottom: 12, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    title: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1 },
    date: { fontSize: 10, color: "#9CA3AF" },
    
    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    metaBox: { flex: 1 },
    metaLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    metaValue: { fontSize: 11, fontWeight: 700, color: "#111827" },
    metaSub: { fontSize: 9, color: "#6B7280", marginTop: 2, maxWidth: 200, lineHeight: 1.4 },
    
    table: { marginBottom: 32 },
    tHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: T, padding: "8 0" },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "10 0" },
    th: { fontSize: 8, fontWeight: 700, color: "#111827", textTransform: "uppercase" },
    td: { fontSize: 9, color: "#374151" },
    
    colNo: { width: "8%" },
    colDesc: { width: "42%" },
    colSKU: { width: "15%" },
    colQty: { width: "10%", textAlign: "center" },
    colWeight: { width: "10%", textAlign: "center" },
    colNotes: { width: "15%" },
    
    summaryFrame: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
    sumCol: { width: "48%" },
    
    shippingBox: { padding: "12 16", backgroundColor: "#F9FAFB", borderRadius: 4, marginBottom: 20, borderLeftWidth: 2, borderLeftColor: T },
    shippingLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 6 },
    shippingText: { fontSize: 9, color: "#374151", marginBottom: 3 },
    
    footer: { position: "absolute", bottom: 48, left: 64, right: 64, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    footerText: { fontSize: 8, color: "#D1D5DB" },
    signature: { height: 35, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120 },
    sigLabel: { fontSize: 8, color: "#9CA3AF", textAlign: "right" }
  });

  return (
    <Document title={`PackingSlip-Minimal-${form.slipNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.top}>
          <Text style={styles.title}>Packing Slip</Text>
          <Text style={styles.date}>{form.slipDate}</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Consignor</Text>
            <Text style={styles.metaValue}>{form.fromName || "—"}</Text>
            <Text style={styles.metaSub}>
                {form.fromAddress}{form.fromCity ? `, ${form.fromCity}, ${fromState}` : ""}
                {form.fromGSTIN && `\nGSTIN: ${form.fromGSTIN}`}
                {form.fromPhone && `\nPH: ${form.fromPhone}`}
            </Text>
          </View>
          <View style={[styles.metaBox, { textAlign: "right", alignItems: "flex-end" }]}>
            <Text style={styles.metaLabel}>Consignee</Text>
            <Text style={styles.metaValue}>{form.toName || "—"}</Text>
            <Text style={[styles.metaSub, { textAlign: "right" }]}>
                {form.toAddress}{form.toCity ? `, ${form.toCity}, ${toState}` : ""}
                {form.toGSTIN && `\nGSTIN: ${form.toGSTIN}`}
                {form.toPhone && `\nPH: ${form.toPhone}`}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tHeader}>
            <Text style={[styles.th, styles.colNo]}>#</Text>
            <Text style={[styles.th, styles.colDesc]}>Description</Text>
            <Text style={[styles.th, styles.colSKU]}>SKU</Text>
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colWeight]}>Wgt</Text>
            <Text style={[styles.th, styles.colNotes]}>Notes</Text>
          </View>
          {form.items.map((item, i) => (
            <View key={i} style={styles.tRow}>
              <Text style={[styles.td, styles.colNo]}>{i + 1}</Text>
              <Text style={[styles.td, styles.colDesc, { fontWeight: 700, color: "#111827" }]}>{item.description || "—"}</Text>
              <Text style={[styles.td, styles.colSKU]}>{item.sku || "—"}</Text>
              <Text style={[styles.td, styles.colQty, { fontWeight: 700 }]}>{item.qty}</Text>
              <Text style={[styles.td, styles.colWeight]}>{item.weight || "—"}</Text>
              <Text style={[styles.td, styles.colNotes]}>{item.notes || "—"}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryFrame}>
          <View style={styles.sumCol}>
            <View style={styles.shippingBox}>
              <Text style={styles.shippingLabel}>Shipment Intelligence</Text>
              <Text style={styles.shippingText}>Slip ID: {form.slipNumber}</Text>
              {form.orderNumber && <Text style={styles.shippingText}>Order: #{form.orderNumber}</Text>}
              {(form.courierName || form.customCourier) && <Text style={styles.shippingText}>Carrier: {form.courierName === "Other" ? form.customCourier : form.courierName}</Text>}
              {form.trackingNumber && <Text style={styles.shippingText}>Track: {form.trackingNumber}</Text>}
              {form.deliveryDate && <Text style={styles.shippingText}>Expected: {form.deliveryDate}</Text>}
            </View>
          </View>

          <View style={[styles.sumCol, { textAlign: "right" }]}>
            <Text style={styles.shippingLabel}>Totals</Text>
            <Text style={{ fontSize: 13, fontWeight: 700, color: T }}>Items: {form.items.length}</Text>
            <Text style={{ fontSize: 13, fontWeight: 700, color: T }}>Units: {totalQty}</Text>
            
            {form.packagingNotes && (
              <View style={{ marginTop: 15 }}>
                <Text style={styles.shippingLabel}>Remarks</Text>
                <Text style={{ fontSize: 9, color: "#6B7280" }}>{form.packagingNotes}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Packing Release via DocMinty.com</Text>
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
