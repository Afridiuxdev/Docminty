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
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "40 50", backgroundColor: "#ffffff" },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 15 },
    logo: { height: 48, objectFit: "contain", marginBottom: 8 },
    compName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827" },
    compAddr: { fontSize: 9, color: "#6B7280", marginTop: 2, maxWidth: 250 },
    
    rightHead: { textAlign: "right" },
    docType: { fontSize: 22, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    metaText: { fontSize: 10, color: "#6B7280", marginTop: 4 },
    
    grid: { flexDirection: "row", gap: 30, marginBottom: 20 },
    gridCol: { flex: 1 },
    label: { fontSize: 8, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    name: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 4 },
    addrText: { fontSize: 9, color: "#6B7280", lineHeight: 1.4 },
    
    table: { marginTop: 20 },
    tableHeader: { flexDirection: "row", backgroundColor: "#F9FAFB", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", padding: "8 4" },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "8 4" },
    th: { fontSize: 8, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" },
    td: { fontSize: 9, color: "#374151" },
    
    colNo: { width: "8%" },
    colDesc: { width: "42%" },
    colSKU: { width: "15%" },
    colQty: { width: "10%", textAlign: "center" },
    colWeight: { width: "10%", textAlign: "center" },
    colNotes: { width: "15%" },
    
    summary: { marginTop: 15, padding: "12 16", backgroundColor: "#F0FDFA", borderRadius: 8, flexDirection: "row", justifyContent: "space-between" },
    sumText: { fontSize: 11, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    notesArea: { marginTop: 20, padding: "10 14", backgroundColor: "#F8F9FA", borderLeftWidth: 3, borderLeftColor: T },
    notesLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 4 },
    notesText: { fontSize: 10, color: "#374151" },
    
    footer: { marginTop: "auto", borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    fText: { fontSize: 9, color: "#D1D5DB" },
    sigArea: { textAlign: "right" },
    signature: { height: 40, objectFit: "contain", marginBottom: 4 },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120 },
    sigText: { fontSize: 9, color: "#9CA3AF" }
  });

  return (
    <Document title={`PackingSlip-${form.slipNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.compName}>{form.fromName || "Company Name"}</Text>
            {form.fromGSTIN && <Text style={styles.addrText}>GSTIN: {form.fromGSTIN}</Text>}
            <Text style={styles.compAddr}>
                {form.fromAddress}{form.fromCity ? `, ${form.fromCity}, ${fromState}` : ""}
                {(form.fromPhone || form.fromEmail) && `\n${form.fromPhone ? "Ph: " + form.fromPhone : ""}${form.fromEmail ? " | Em: " + form.fromEmail : ""}`}
            </Text>
          </View>
          <View style={styles.rightHead}>
            <Text style={styles.docType}>PACKING SLIP</Text>
            <Text style={styles.metaText}>#{form.slipNumber}</Text>
            <Text style={styles.metaText}>Date: {form.slipDate}</Text>
            {form.deliveryDate && <Text style={styles.metaText}>Expected: {form.deliveryDate}</Text>}
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Ship To</Text>
            <Text style={styles.name}>{form.toName || "—"}</Text>
            {form.toGSTIN && <Text style={styles.addrText}>GSTIN: {form.toGSTIN}</Text>}
            <Text style={styles.addrText}>
                {form.toAddress}{form.toCity ? `, ${form.toCity}, ${toState}` : ""}
                {(form.toPhone || form.toEmail) && `\nPh: ${form.toPhone || "—"}\nEm: ${form.toEmail || "—"}`}
            </Text>
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
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.td, styles.colNo]}>{i + 1}</Text>
              <Text style={[styles.td, styles.colDesc]}>{item.description || "—"}</Text>
              <Text style={[styles.td, styles.colSKU]}>{item.sku || "—"}</Text>
              <Text style={[styles.td, styles.colQty, { fontWeight: 700 }]}>{item.qty}</Text>
              <Text style={[styles.td, styles.colWeight]}>{item.weight || "—"}</Text>
              <Text style={[styles.td, styles.colNotes]}>{item.notes || "—"}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.sumText}>Total Items: {form.items.length}</Text>
          <Text style={styles.sumText}>Total Qty: {totalQty}</Text>
        </View>

        {form.packagingNotes && (
          <View style={styles.notesArea}>
            <Text style={styles.notesLabel}>Packaging Notes</Text>
            <Text style={styles.notesText}>{form.packagingNotes}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.fText}>Generated by DocMinty.com</Text>
          <View style={styles.sigArea}>
            {form.signature && <Image src={form.signature} style={styles.signature} />}
            <View style={styles.sigLine}>
              <Text style={styles.sigText}>Authorised Signatory</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
