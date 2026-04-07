"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PackingClassicTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  const totalQty = form.items.reduce((s, i) => s + (parseFloat(i.qty) || 0), 0);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "0 0 40", backgroundColor: "#ffffff" },
    banner: { backgroundColor: T, padding: "18 24", flexDirection: "row", justifyContent: "space-between", alignItems: "center", color: "#ffffff" },
    bannerLeft: { flex: 1 },
    compName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff" },
    compAddr: { fontSize: 10, color: "#ffffff", opacity: 0.8, marginTop: 2 },
    
    bannerRight: { textAlign: "right" },
    docType: { fontSize: 20, fontFamily: "Space Grotesk", fontWeight: 800, color: "#ffffff" },
    slipNum: { fontSize: 11, color: "#ffffff", opacity: 0.8, marginTop: 2 },
    
    body: { padding: "24 24" },
    grid: { flexDirection: "row", gap: 24, marginBottom: 20 },
    gridCol: { flex: 1 },
    label: { fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 },
    name: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 },
    addrText: { fontSize: 11, color: "#6B7280", lineHeight: 1.4 },
    
    table: { marginTop: 20 },
    tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 8, marginBottom: 8 },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "8 0" },
    th: { fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" },
    td: { fontSize: 11, color: "#374151" },
    
    colNo: { width: "8%" },
    colDesc: { width: "42%" },
    colSKU: { width: "15%" },
    colQty: { width: "10%", textAlign: "center" },
    colWeight: { width: "10%", textAlign: "center" },
    colNotes: { width: "15%" },
    
    summary: { marginTop: 12, padding: "12 16", backgroundColor: T + "10", borderRadius: 8, flexDirection: "row", justifyContent: "space-between" },
    sumText: { fontSize: 13, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    notesArea: { marginTop: 12, padding: "10 14", backgroundColor: "#F8F9FA", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: T },
    notesLabel: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 2 },
    notesText: { fontSize: 12, color: "#374151" },
    
    footer: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    fText: { fontSize: 10, color: "#D1D5DB" },
    sigArea: { textAlign: "right", minWidth: 120 },
    signature: { height: 45, maxWidth: 140, objectFit: "contain", marginLeft: "auto", marginBottom: 4 },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4 },
    sigText: { fontSize: 10, color: "#9CA3AF" }
  });

  return (
    <Document title={`PackingSlip-${form.slipNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.compName}>{form.fromName || "Business Name"}</Text>
            <Text style={styles.compAddr}>{form.fromAddress}</Text>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.docType}>PACKING SLIP</Text>
            <Text style={styles.slipNum}>#{form.slipNumber}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Ship To</Text>
              <Text style={styles.name}>{form.toName || "Recipient"}</Text>
              {form.toGSTIN && <Text style={styles.addrText}>GSTIN: {form.toGSTIN}</Text>}
              <Text style={styles.addrText}>
                  {form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}{toState ? `, ${toState}` : ""}
              </Text>
              {(form.toPhone || form.toEmail) && (
                <View style={{ marginTop: 4 }}>
                   {form.toPhone && <Text style={styles.addrText}>Ph: {form.toPhone}</Text>}
                   {form.toEmail && <Text style={styles.addrText}>Em: {form.toEmail}</Text>}
                </View>
              )}
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Shipment Info</Text>
              {form.orderNumber && <Text style={styles.addrText}>Order #: <Text style={{ color: "#111827", fontWeight: 700 }}>{form.orderNumber}</Text></Text>}
              {form.shippingMethod && <Text style={styles.addrText}>Method: {form.shippingMethod}</Text>}
              {(form.courierName || form.customCourier) && <Text style={styles.addrText}>Courier: {form.courierName === "Other" ? form.customCourier : form.courierName}</Text>}
              {form.trackingNumber && <Text style={styles.addrText}>Tracking #: <Text style={{ color: T, fontWeight: 700 }}>{form.trackingNumber}</Text></Text>}
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colNo]}>#</Text>
              <Text style={[styles.th, styles.colDesc]}>Description</Text>
              <Text style={[styles.th, styles.colSKU]}>SKU</Text>
              <Text style={[styles.th, styles.colQty]}>Qty</Text>
              <Text style={[styles.th, styles.colWeight]}>Weight</Text>
              <Text style={[styles.th, styles.colNotes]}>Notes</Text>
            </View>
            {form.items.map((item, i) => (
              <View key={i} style={styles.tableRow} wrap={false}>
                <Text style={[styles.td, styles.colNo]}>{i + 1}</Text>
                <Text style={[styles.td, styles.colDesc]}>{item.description || "—"}</Text>
                <Text style={[styles.td, styles.colSKU]}>{item.sku || "—"}</Text>
                <Text style={[styles.td, styles.colQty, { fontWeight: 700 }]}>{item.qty}</Text>
                <Text style={[styles.td, styles.colWeight]}>{item.weight || "—"}</Text>
                <Text style={[styles.td, styles.colNotes]}>{item.notes || "—"}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summary} wrap={false}>
            <Text style={styles.sumText}>Total Items: {form.items.length}</Text>
            <Text style={styles.sumText}>Total Qty: {totalQty}</Text>
          </View>

          {form.packagingNotes && (
            <View style={styles.notesArea} wrap={false}>
              <Text style={styles.notesLabel}>Packaging Notes</Text>
              <Text style={styles.notesText}>{form.packagingNotes}</Text>
            </View>
          )}

          <View style={styles.footer} wrap={false}>
            <Text style={styles.fText}>Generated by DocMinty.com</Text>
            <View style={styles.sigArea}>
              {form.signature && <Image src={form.signature} style={styles.signature} />}
              <View style={styles.sigLine}>
                <Text style={styles.sigText}>Authorised Signatory</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
