"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PackingModernTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  const totalQty = form.items.reduce((s, i) => s + (parseFloat(i.qty) || 0), 0);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, flexDirection: "row", backgroundColor: "#ffffff" },
    sidebar: { width: 140, backgroundColor: T, height: "100%", padding: "24 14", color: "#ffffff" },
    sideTitle: { fontSize: 15, fontFamily: "Space Grotesk", fontWeight: 800, textTransform: "uppercase", marginBottom: 4 },
    sideSub: { fontSize: 10, opacity: 0.75, marginBottom: 24 },
    sideLabel: { fontSize: 8, fontWeight: 700, opacity: 0.6, textTransform: "uppercase", marginBottom: 3, fontFamily: "Space Grotesk" },
    sideValue: { fontSize: 10, fontWeight: 700, color: "#ffffff", marginBottom: 4 },
    sideText: { fontSize: 9, opacity: 0.8, marginBottom: 16, lineHeight: 1.4 },
    
    main: { flex: 1, backgroundColor: "#ffffff" },
    header: { padding: "16 20 12", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    logo: { height: 32, objectFit: "contain" },
    metaText: { fontSize: 10, color: "#9CA3AF" },
    
    mainContent: { padding: "20 24" },
    grid: { flexDirection: "row", gap: 24, marginBottom: 20 },
    gridCol: { flex: 1 },
    label: { fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, fontFamily: "Space Grotesk" },
    name: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 },
    addrText: { fontSize: 11, color: "#6B7280", lineHeight: 1.4 },
    
    table: { marginBottom: 20 },
    tHeader: { flexDirection: "row", backgroundColor: "#F9FAFB", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", padding: "8 12", borderRadius: 4 },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "8 12", alignItems: "center" },
    th: { fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", fontFamily: "Space Grotesk" },
    td: { fontSize: 11, color: "#111827" },
    
    colNo: { width: "8%" },
    colDesc: { width: "52%" },
    colSKU: { width: "17%" },
    colQty: { width: "12%", textAlign: "center" },
    colWeight: { width: "11%", textAlign: "center" },
    
    summary: { marginTop: 12, padding: "12 16", backgroundColor: T + "10", borderRadius: 8, flexDirection: "row", justifyContent: "space-between" },
    sumText: { fontSize: 13, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    notesArea: { marginTop: 12, padding: "10 14", backgroundColor: "#F8F9FA", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: T },
    notesLabel: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 2, fontFamily: "Space Grotesk" },
    notesText: { fontSize: 12, color: "#374151" },
    
    footer: { position: "absolute", bottom: 20, left: 24, right: 24, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    footerText: { fontSize: 9, color: "#D1D5DB" },
    sigArea: { textAlign: "right", minWidth: 120 },
    signature: { height: 45, maxWidth: 140, objectFit: "contain", marginLeft: "auto", marginBottom: 4 },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4 },
    sigText: { fontSize: 10, color: "#9CA3AF" }
  });

  return (
    <Document title={`PackingSlip-${form.slipNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.sideTitle}>PACKING</Text>
          <Text style={styles.sideSub}>#{form.slipNumber}</Text>
          
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sideLabel}>From</Text>
            <Text style={styles.sideValue}>{form.fromName || "Your Company"}</Text>
            <View style={styles.sideText}>
                <Text>{form.fromAddress}</Text>
                <Text>{form.fromCity || ""}, {fromState}</Text>
                {form.fromGSTIN && <Text>GSTIN: {form.fromGSTIN}</Text>}
                {form.fromPhone && <Text>Ph: {form.fromPhone}</Text>}
                {form.fromEmail && <Text>Em: {form.fromEmail}</Text>}
            </View>
          </View>
          
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sideLabel}>To</Text>
            <Text style={styles.sideValue}>{form.toName || "Recipient"}</Text>
          </View>

          <View style={{ marginTop: "auto" }}>
            <Text style={styles.sideLabel}>Total Items</Text>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>{form.items.length}</Text>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.header}>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <View style={{ textAlign: "right" }}>
              <Text style={styles.metaText}>Date: {form.slipDate}</Text>
            </View>
          </View>

          <View style={styles.mainContent}>
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
              <View style={styles.tHeader}>
                <Text style={[styles.th, styles.colNo]}>#</Text>
                <Text style={[styles.th, styles.colDesc]}>Description</Text>
                <Text style={[styles.th, styles.colSKU]}>SKU</Text>
                <Text style={[styles.th, styles.colQty]}>Qty</Text>
                <Text style={[styles.th, styles.colWeight]}>Weight</Text>
              </View>
              {form.items.map((item, i) => (
                <View key={i} style={styles.tRow} wrap={false}>
                  <Text style={[styles.td, styles.colNo]}>{i + 1}</Text>
                  <Text style={[styles.td, styles.colDesc, { fontWeight: 700 }]}>{item.description || "—"}</Text>
                  <Text style={[styles.td, styles.colSKU]}>{item.sku || "—"}</Text>
                  <Text style={[styles.td, styles.colQty, { fontWeight: 700 }]}>{item.qty}</Text>
                  <Text style={[styles.td, styles.colWeight]}>{item.weight || "—"}</Text>
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
              <Text style={styles.footerText}>Generated by DocMinty.com</Text>
              <View style={styles.sigArea}>
                {form.signature && <Image src={form.signature} style={styles.signature} />}
                <View style={styles.sigLine}>
                  <Text style={styles.sigText}>Authorised Signatory</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
