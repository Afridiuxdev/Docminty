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
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
    header: { backgroundColor: T, padding: "30 50", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    docType: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 800, color: "#ffffff", letterSpacing: 1 },
    logo: { height: 40, objectFit: "contain", filter: "brightness(0) invert(1)" },
    
    main: { padding: "40 50" },
    topMeta: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 15 },
    metaLabel: { fontSize: 9, color: "#6B7280", textTransform: "uppercase" },
    metaValue: { fontSize: 11, fontWeight: 700, color: "#111827" },
    
    infoGrid: { flexDirection: "row", gap: 40, marginBottom: 32 },
    infoCol: { flex: 1 },
    colLabel: { fontSize: 8, color: T, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontWeight: 700 },
    colName: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 5 },
    colAddr: { fontSize: 9, color: "#4B5563", lineHeight: 1.5 },
    
    table: { marginTop: 10 },
    tableHeader: { flexDirection: "row", borderBottomWidth: 2, borderBottomColor: T, padding: "8 0", marginBottom: 5 },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F9FAFB", padding: "10 0" },
    th: { fontSize: 8, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" },
    td: { fontSize: 9, color: "#111827" },
    
    colNo: { width: "5%" },
    colDesc: { width: "45%" },
    colSKU: { width: "15%" },
    colQty: { width: "10%", textAlign: "center" },
    colWeight: { width: "10%", textAlign: "center" },
    colNotes: { width: "15%" },
    
    summaryBar: { marginTop: 20, padding: "12 20", backgroundColor: "#F0FDFA", borderRadius: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    sumLabel: { fontSize: 10, color: "#6B7280" },
    sumVal: { fontSize: 13, fontWeight: 800, color: T, fontFamily: "Space Grotesk" },
    
    packagingArea: { marginTop: 24, padding: "12 16", borderAround: "1 solid #E5E7EB", borderRadius: 8, borderLeftWidth: 4, borderLeftColor: T },
    pLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 4 },
    pText: { fontSize: 11, color: "#374151", lineHeight: 1.4 },
    
    footer: { position: "absolute", bottom: 30, left: 50, right: 50, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    fText: { fontSize: 8, color: "#D1D5DB" },
    sigBox: { textAlign: "right" },
    signature: { height: 40, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 4, width: 140 },
    sigLabel: { fontSize: 9, color: "#9CA3AF", textAlign: "right" }
  });

  return (
    <Document title={`Packing-Modern-${form.slipNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.docType}>PACKING SLIP</Text>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
        </View>

        <View style={styles.main}>
          <View style={styles.topMeta}>
              <View>
                  <Text style={styles.metaLabel}>Packing Slip #</Text>
                  <Text style={styles.metaValue}>{form.slipNumber}</Text>
              </View>
              <View style={{ textAlign: "right" }}>
                  <Text style={styles.metaLabel}>Issued Date</Text>
                  <Text style={styles.metaValue}>{form.slipDate}</Text>
              </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.colLabel}>Sender Details</Text>
              <Text style={styles.colName}>{form.fromName || "—"}</Text>
              <Text style={styles.colAddr}>
                {form.fromAddress}{form.fromCity ? `, ${form.fromCity}, ${fromState}` : ""}
                {form.fromGSTIN && `\nGSTIN: ${form.fromGSTIN}`}
                {(form.fromPhone || form.fromEmail) && `\nPH: ${form.fromPhone || "—"}\nEM: ${form.fromEmail || "—"}`}
              </Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.colLabel}>Ship To</Text>
              <Text style={styles.colName}>{form.toName || "—"}</Text>
              <Text style={styles.colAddr}>
                {form.toAddress}{form.toCity ? `, ${form.toCity}, ${toState}` : ""}
                {form.toGSTIN && `\nGSTIN: ${form.toGSTIN}`}
                {(form.toPhone || form.toEmail) && `\nPH: ${form.toPhone || "—"}\nEM: ${form.toEmail || "—"}`}
              </Text>
            </View>
          </View>

          <View style={{ marginBottom: 30, padding: 15, background: "#F8FAFC", borderRadius: 8, flexDirection: "row", gap: 30 }}>
            <View>
                <Text style={styles.metaLabel}>Order Details</Text>
                <Text style={styles.metaValue}>{form.orderNumber || "—"}</Text>
            </View>
            <View>
                <Text style={styles.metaLabel}>Courier</Text>
                <Text style={styles.metaValue}>{form.courierName === "Other" ? form.customCourier : form.courierName || "—"}</Text>
            </View>
            <View>
                <Text style={styles.metaLabel}>Tracking ID</Text>
                <Text style={[styles.metaValue, { color: T }]}>{form.trackingNumber || "—"}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colNo]}>#</Text>
              <Text style={[styles.th, styles.colDesc]}>Product Description</Text>
              <Text style={[styles.th, styles.colSKU]}>SKU</Text>
              <Text style={[styles.th, styles.colQty]}>Qty</Text>
              <Text style={[styles.th, styles.colWeight]}>Weight</Text>
              <Text style={[styles.th, styles.colNotes]}>Notes</Text>
            </View>
            {form.items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.td, styles.colNo]}>{i + 1}</Text>
                <Text style={[styles.td, styles.colDesc, { fontWeight: 700 }]}>{item.description || "—"}</Text>
                <Text style={[styles.td, styles.colSKU]}>{item.sku || "—"}</Text>
                <Text style={[styles.td, styles.colQty, { fontWeight: 800, color: T }]}>{item.qty}</Text>
                <Text style={[styles.td, styles.colWeight]}>{item.weight || "—"}</Text>
                <Text style={[styles.td, styles.colNotes]}>{item.notes || "—"}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summaryBar}>
            <Text style={styles.sumVal}>Shipment Summary</Text>
            <View style={{ flexDirection: "row", gap: 20 }}>
                <Text style={styles.sumLabel}>Total Items: <Text style={styles.sumVal}>{form.items.length}</Text></Text>
                <Text style={styles.sumLabel}>Total Qty: <Text style={styles.sumVal}>{totalQty}</Text></Text>
            </View>
          </View>

          {form.packagingNotes && (
            <View style={styles.packagingArea}>
                <Text style={styles.pLabel}>Packaging Notes</Text>
                <Text style={styles.pText}>{form.packagingNotes}</Text>
            </View>
          )}

          <View style={styles.footer} fixed>
            <Text style={styles.fText}>Certified Digital Release via DocMinty.com</Text>
            <View style={styles.sigBox}>
              {form.signature && <Image src={form.signature} style={styles.signature} />}
              <View style={styles.sigLine}>
                <Text style={styles.sigLabel}>Authorised Signature</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
