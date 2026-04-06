"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PackingElegantTemplate({ form }) {
  const T = form.templateColor || "#D97706";
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  const totalQty = form.items.reduce((acc, i) => acc + (parseFloat(i.qty) || 0), 0);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 9, color: "#111827", padding: "60 80", backgroundColor: "#FFFDFA" },
    header: { marginBottom: 40, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)", paddingBottom: 24, alignItems: "flex-start" },
    title: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 700, color: T, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" },
    subtitle: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 3, fontFamily: "Space Grotesk" },
    logo: { height: 40, objectFit: "contain", marginTop: 10 },
    
    dateLine: { fontSize: 9, color: "#9CA3AF", marginBottom: 32, textAlign: "right", fontFamily: "Inter" },
    
    addressSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    addressBox: { width: "45%" },
    addressLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    addressName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    addressDetails: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
    
    table: { marginBottom: 32, borderTopWidth: 1, borderTopColor: T },
    tHeader: { flexDirection: "row", backgroundColor: T + "05", padding: "10 8", borderBottomWidth: 1, borderBottomColor: T },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.03)", padding: "12 8" },
    th: { fontSize: 8, fontWeight: 700, color: T, textTransform: "uppercase" },
    td: { fontSize: 9, color: "#111827" },
    
    colNo: { width: "8%" },
    colDesc: { width: "42%" },
    colSKU: { width: "15%" },
    colQty: { width: "10%", textAlign: "center" },
    colWeight: { width: "10%", textAlign: "center" },
    colNotes: { width: "15%" },
    
    summarySection: { marginTop: 16, padding: "16 0", borderTopWidth: 2, borderTopColor: T, borderBottomWidth: 2, borderBottomColor: T, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    summaryL: { fontSize: 9, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1 },
    summaryV: { fontSize: 18, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    shipmentDetails: { marginTop: 32, padding: 16, backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 8 },
    shipTitle: { fontSize: 7, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
    shipGrid: { flexDirection: "row", flexWrap: "wrap", gap: "16 32" },
    shipItem: { width: "45%" },
    shipK: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 2 },
    shipV: { fontSize: 9, fontWeight: 700, color: "#111827" },
    
    footer: { position: "absolute", bottom: 40, left: 80, right: 80, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)", paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    footerText: { fontSize: 8, color: "#D1D5DB", fontStyle: "italic" },
    sidebarLine: { position: "absolute", left: 40, top: 60, bottom: 60, width: 2, backgroundColor: T },
    sigArea: { textAlign: "right" },
    signature: { height: 35, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120 },
    sigText: { fontSize: 8, color: "#9CA3AF" }
  });

  return (
    <Document title={`Elegant-PackingSlip-${form.slipNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebarLine} />
        <View style={styles.header}>
          <Text style={styles.title}>PACKING SLIP</Text>
          <Text style={styles.subtitle}>Logistical Movement Manifest</Text>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <View>
                <Text style={styles.addressLabel}>Consignor</Text>
                <Text style={styles.addressName}>{form.fromName || "—"}</Text>
                <Text style={styles.addressDetails}>
                    {form.fromAddress}{form.fromCity ? `, ${form.fromCity}, ${fromState}` : ""}
                    {form.fromGSTIN && `\nGSTIN: ${form.fromGSTIN}`}
                </Text>
            </View>
            <View style={{ textAlign: "right" }}>
                <Text style={styles.dateLine}>REF: {form.slipNumber}</Text>
                <Text style={styles.dateLine}>DATE: {form.slipDate}</Text>
            </View>
        </View>

        <View style={styles.addressSection}>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>Ship To</Text>
            <Text style={styles.addressName}>{form.toName || "—"}</Text>
            <View style={styles.addressDetails}>
                {form.toAddress}{form.toCity ? `, ${form.toCity}, ${toState}` : ""}
                {form.toGSTIN && `\nGSTIN: ${form.toGSTIN}`}
                {form.toPhone && `\nPh: ${form.toPhone}`}
            </View>
          </View>
          <View style={[styles.addressBox, { textAlign: "right" }]}>
            <Text style={styles.addressLabel}>Order Reference</Text>
            <Text style={[styles.addressName, { color: T }]}>{form.orderNumber || "—"}</Text>
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
              <Text style={[styles.td, styles.colDesc, { fontWeight: 700 }]}>{item.description || "—"}</Text>
              <Text style={[styles.td, styles.colSKU]}>{item.sku || "—"}</Text>
              <Text style={[styles.td, styles.colQty, { fontWeight: 700 }]}>{item.qty}</Text>
              <Text style={[styles.td, styles.colWeight]}>{item.weight || "—"}</Text>
              <Text style={[styles.td, styles.colNotes]}>{item.notes || "—"}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryL}>Cumulative Inventory Units</Text>
          <Text style={styles.summaryV}>{totalQty}</Text>
        </View>

        <View style={styles.shipmentDetails}>
          <Text style={styles.shipTitle}>Logistical Intelligence</Text>
          <View style={styles.shipGrid}>
            <View style={styles.shipItem}>
              <Text style={styles.shipK}>Courier Service</Text>
              <Text style={styles.shipV}>{form.courierName === "Other" ? form.customCourier : form.courierName || "—"}</Text>
            </View>
            <View style={styles.shipItem}>
              <Text style={styles.shipK}>Tracking Reference</Text>
              <Text style={[styles.shipV, { color: T }]}>{form.trackingNumber || "—"}</Text>
            </View>
            <View style={styles.shipItem}>
              <Text style={styles.shipK}>Movement Method</Text>
              <Text style={styles.shipV}>{form.shippingMethod || "—"}</Text>
            </View>
            {form.deliveryDate && (
              <View style={styles.shipItem}>
                <Text style={styles.shipK}>Estimated Transit Finish</Text>
                <Text style={styles.shipV}>{form.deliveryDate}</Text>
              </View>
            )}
          </View>
        </View>

        {form.packagingNotes && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.addressLabel}>Packaging Annotations</Text>
            <Text style={{ fontSize: 9, color: "#6B7280", marginTop: 4, lineHeight: 1.5 }}>{form.packagingNotes}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Secure Packing Release via DocMinty.com</Text>
          <View style={styles.sigArea}>
            {form.signature && <Image src={form.signature} style={styles.signature} />}
            <View style={styles.sigLine}>
              <Text style={styles.sigText}>Authorized Signatory</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
