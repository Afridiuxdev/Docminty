"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PackingElegantTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  const totalQty = form.items.reduce((acc, i) => acc + (parseFloat(i.qty) || 0), 0);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "40 50", backgroundColor: "#ffffff" },
    headerSection: { paddingBottom: 12, marginBottom: 0 },
    headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 },
    logo: { height: 36, objectFit: "contain", marginBottom: 6 },
    fromName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827" },
    fromDetails: { fontSize: 10, color: "#6B7280" },
    
    title: { fontSize: 22, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    metaText: { fontSize: 11, color: "#6B7280", textAlign: "right" },
    accentBar: { height: 4, backgroundColor: T, borderRadius: 2, marginBottom: 24 },
    
    addressSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    addressBox: { width: "48%" },
    addressLabel: { fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 },
    addressName: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 },
    addressDetails: { fontSize: 11, color: "#6B7280", lineHeight: 1.4 },
    
    shipmentInfo: { width: "48%" },
    shipmentItem: { marginBottom: 4, flexDirection: "row", fontSize: 10 },
    shipmentLabel: { color: "#9CA3AF" },
    shipmentValue: { fontWeight: 600, color: "#111827" },

    table: { marginBottom: 20 },
    tHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 8, marginBottom: 8 },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "8 0", alignItems: "center" },
    th: { fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" },
    td: { fontSize: 11, color: "#111827" },
    
    colNo: { width: "8%" },
    colDesc: { width: "42%" },
    colSKU: { width: "15%" },
    colQty: { width: "10%", textAlign: "center" },
    colWgt: { width: "10%", textAlign: "center" },
    colNotes: { width: "15%" },
    
    summary: { marginTop: 12, padding: "12 16", backgroundColor: T + "10", borderRadius: 8, flexDirection: "row", justifyContent: "space-between" },
    sumText: { fontSize: 13, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    notesArea: { marginTop: 12, padding: "10 14", backgroundColor: "#F8F9FA", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: T },
    notesLabel: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 2 },
    notesText: { fontSize: 12, color: "#374151" },
    
    footer: { position: "absolute", bottom: 40, left: 50, right: 50, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    footerText: { fontSize: 10, color: "#D1D5DB" },
    sigArea: { textAlign: "right", minWidth: 120, marginTop: 24 },
    signature: { height: 45, maxWidth: 140, objectFit: "contain", marginLeft: "auto", marginBottom: 4 },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4 },
    sigText: { fontSize: 10, color: "#9CA3AF" }
  });

  const fromStateName = fromState || "";
  const toStateName = toState || "";

  return (
    <Document title={`PackingSlip-${form.slipNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              {form.logo && <Image src={form.logo} style={styles.logo} />}
              <Text style={styles.fromName}>{form.fromName || "Business Name"}</Text>
              <Text style={styles.fromDetails}>{form.fromCity || ""}, {fromStateName}</Text>
            </View>
            <View style={{ textAlign: "right" }}>
              <Text style={styles.title}>PACKING SLIP</Text>
              <Text style={styles.metaText}>#{form.slipNumber}</Text>
            </View>
          </View>
          <View style={styles.accentBar} />
        </View>

        <View style={styles.addressSection}>
           <View style={styles.addressBox}>
             <Text style={styles.addressLabel}>Ship To</Text>
             <Text style={styles.addressName}>{form.toName || "Recipient"}</Text>
             {form.toGSTIN && <Text style={styles.addressDetails}>GSTIN: {form.toGSTIN}</Text>}
             <Text style={styles.addressDetails}>
               {form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}{toStateName ? `, ${toStateName}` : ""}
             </Text>
           </View>
           <View style={styles.shipmentInfo}>
             <Text style={styles.addressLabel}>Shipment Info</Text>
             {form.orderNumber && (
               <View style={styles.shipmentItem}>
                 <Text style={styles.shipmentLabel}>Order #: </Text>
                 <Text style={styles.shipmentValue}>{form.orderNumber}</Text>
               </View>
             )}
             {form.shippingMethod && (
               <View style={styles.shipmentItem}>
                 <Text style={styles.shipmentLabel}>Method: </Text>
                 <Text style={styles.shipmentValue}>{form.shippingMethod}</Text>
               </View>
             )}
             {(form.courierName || form.customCourier) && (
               <View style={styles.shipmentItem}>
                 <Text style={styles.shipmentLabel}>Courier: </Text>
                 <Text style={styles.shipmentValue}>{form.courierName === "Other" ? form.customCourier : form.courierName}</Text>
               </View>
             )}
             {form.trackingNumber && (
               <View style={styles.shipmentItem}>
                 <Text style={styles.shipmentLabel}>Tracking #: </Text>
                 <Text style={[styles.shipmentValue, { color: T }]}>{form.trackingNumber}</Text>
               </View>
             )}
           </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tHeader}>
            <Text style={[styles.th, styles.colNo]}>#</Text>
            <Text style={[styles.th, styles.colDesc]}>Description</Text>
            <Text style={[styles.th, styles.colSKU]}>SKU</Text>
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colWgt]}>Weight</Text>
            <Text style={[styles.th, styles.colNotes]}>Notes</Text>
          </View>
          {form.items.map((item, i) => (
            <View key={i} style={styles.tRow} wrap={false}>
              <Text style={[styles.td, styles.colNo]}>{i + 1}</Text>
              <Text style={[styles.td, styles.colDesc, { fontWeight: 700 }]}>{item.description || "—"}</Text>
              <Text style={[styles.td, styles.colSKU]}>{item.sku || "—"}</Text>
              <Text style={[styles.td, styles.colQty, { fontWeight: 700 }]}>{item.qty}</Text>
              <Text style={[styles.td, styles.colWgt]}>{item.weight || "—"}</Text>
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

        <View style={styles.sigArea} wrap={false}>
            {form.signature && <Image src={form.signature} style={styles.signature} />}
            <View style={styles.sigLine}>
              <Text style={styles.sigText}>Authorised Signatory</Text>
            </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
