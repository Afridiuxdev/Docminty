"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PackingCorporateTemplate({ form }) {
  const T = form.templateColor || "#1E3A5F";
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState)?.name || "";
  const toState = INDIAN_STATES.find(s => s.code === form.toState)?.name || "";
  const totalQty = form.items.reduce((acc, i) => acc + (parseFloat(i.qty) || 0), 0);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 9, color: "#111827", padding: "50 70", backgroundColor: "#ffffff" },
    header: { marginBottom: 32, textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 20 },
    logo: { height: 40, objectFit: "contain", marginBottom: 12, margin: "0 auto" },
    orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
    docType: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, fontFamily: "Space Grotesk" },
    
    dateRow: { marginTop: 24, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 12 },
    metaText: { fontSize: 9, color: "#6B7280", fontWeight: 700 },
    
    addressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    addressBox: { width: "45%" },
    addressLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    addressName: { fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 4 },
    addressDetails: { fontSize: 9, color: "#6B7280", lineHeight: 1.4 },
    
    shipInfoTable: { width: "50%", padding: 12, borderTopWidth: 1, borderTopColor: "#F3F4F6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", marginBottom: 32 },
    shipLine: { flexDirection: "row", marginBottom: 6 },
    shipKey: { width: 100, fontSize: 8, color: "#9CA3AF", textTransform: "uppercase" },
    shipVal: { flex: 1, fontSize: 9, fontWeight: 700, color: "#111827" },
    
    table: { marginBottom: 32 },
    tHeader: { flexDirection: "row", backgroundColor: T, padding: "8 6" },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "10 6" },
    th: { fontSize: 8, fontWeight: 700, color: "#ffffff", textTransform: "uppercase" },
    td: { fontSize: 9, color: "#111827" },
    
    colNo: { width: "8%" },
    colDesc: { width: "42%" },
    colSKU: { width: "15%" },
    colQty: { width: "10%", textAlign: "center" },
    colWeight: { width: "10%", textAlign: "center" },
    colNotes: { width: "15%" },
    
    summaryBox: { alignSelf: "flex-end", width: 220, backgroundColor: "#F8FAFD", padding: "12 16", borderRadius: 8, marginTop: 12 },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    summaryLabel: { fontSize: 9, color: "#6B7280" },
    summaryValue: { fontSize: 11, fontWeight: 700, color: T },
    
    notesBox: { marginTop: 24 },
    notesLabel: { fontSize: 8, fontWeight: 700, color: T, textTransform: "uppercase", marginBottom: 8, borderBottomWidth: 1, borderBottomColor: T, paddingBottom: 4 },
    notesText: { fontSize: 9, color: "#374151", lineHeight: 1.5 },
    
    footer: { position: "absolute", bottom: 40, left: 70, right: 70, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    footerText: { fontSize: 8, color: "#D1D5DB" },
    sigBox: { textAlign: "right" },
    signature: { height: 40, objectFit: "contain", marginBottom: 4, marginLeft: "auto" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 8, width: 140 },
    sigText: { fontSize: 10, fontWeight: 700, color: "#111827", textAlign: "center" }
  });

  return (
    <Document title={`Corporate-PackingSlip-${form.slipNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.orgName}>{form.fromName || "—"}</Text>
          <Text style={styles.docType}>Official Internal Packing Manifest</Text>
        </View>

        <View style={styles.dateRow}>
          <Text style={styles.metaText}>SLIP REF: {form.slipNumber}</Text>
          <Text style={styles.metaText}>DATE: {form.slipDate}</Text>
        </View>

        <View style={styles.addressRow}>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>Ship To Recipient</Text>
            <Text style={styles.addressName}>{form.toName || "—"}</Text>
            <View style={styles.addressDetails}>
                {form.toAddress}{form.toCity ? `, ${form.toCity}, ${toState}` : ""}
                {form.toGSTIN && `\nGSTIN: ${form.toGSTIN}`}
                {form.toPhone && `\nPh: ${form.toPhone}`}
            </View>
          </View>
          <View style={[styles.addressBox, { textAlign: "right" }]}>
            <Text style={styles.addressLabel}>Inventory Origin</Text>
            <Text style={styles.addressName}>{form.fromName || "—"}</Text>
            <Text style={styles.addressDetails}>
                {form.fromAddress}{form.fromCity ? `, ${form.fromCity}, ${fromState}` : ""}
                {form.fromGSTIN && `\nGSTIN: ${form.fromGSTIN}`}
            </Text>
          </View>
        </View>

        <View style={styles.shipInfoTable}>
          <View style={styles.shipLine}><Text style={styles.shipKey}>Order #:</Text><Text style={styles.shipVal}>{form.orderNumber || "—"}</Text></View>
          <View style={styles.shipLine}><Text style={styles.shipKey}>Carrier:</Text><Text style={styles.shipVal}>{form.courierName === "Other" ? form.customCourier : form.courierName || "—"}</Text></View>
          <View style={styles.shipLine}><Text style={styles.shipKey}>Tracking #:</Text><Text style={[styles.shipVal, { color: T }]}>{form.trackingNumber || "—"}</Text></View>
          <View style={styles.shipLine}><Text style={styles.shipKey}>Method:</Text><Text style={styles.shipVal}>{form.shippingMethod || "—"}</Text></View>
          {form.deliveryDate && <View style={styles.shipLine}><Text style={styles.shipKey}>Expected:</Text><Text style={styles.shipVal}>{form.deliveryDate}</Text></View>}
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

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Unique Line Items:</Text><Text style={styles.summaryValue}>{form.items.length}</Text></View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 6, marginTop: 4 }]}>
            <Text style={[styles.summaryLabel, { fontWeight: 700 }]}>Total Logistics Units:</Text>
            <Text style={[styles.summaryValue, { fontSize: 13 }]}>{totalQty}</Text>
          </View>
        </View>

        {form.packagingNotes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Compliance & Handling Notes</Text>
            <Text style={styles.notesText}>{form.packagingNotes}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Packing Manifest — DocMinty Pro</Text>
          <View style={styles.sigBox}>
            {form.signature && <Image src={form.signature} style={styles.signature} />}
            <View style={styles.sigLine}>
              <Text style={styles.sigText}>Dispatcher Verification</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
