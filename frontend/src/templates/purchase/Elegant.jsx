"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PurchaseElegantTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);

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
    
    table: { marginBottom: 20 },
    tHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 8, marginBottom: 8 },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "8 0", alignItems: "center" },
    th: { fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" },
    td: { fontSize: 11, color: "#111827" },
    
    bottomGrid: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
    totBox: { width: 220 },
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "4 0" },
    totLabel: { fontSize: 11, color: "#6B7280" },
    totVal: { fontSize: 11, fontWeight: 700, color: "#111827" },
    grandBox: { marginTop: 8, padding: "10 12", backgroundColor: T + "10", borderRadius: 6, flexDirection: "row", justifyContent: "space-between" },
    grandLabel: { fontSize: 12, fontWeight: 700, color: T },
    grandVal: { fontSize: 12, fontWeight: 800, color: T },
    
    wordsBox: { marginTop: 16, padding: "10 14", backgroundColor: "#F8F9FA", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: T },
    wordsLabel: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 2 },
    wordsText: { fontSize: 12, color: "#374151", fontStyle: "italic" },
    
    footer: { position: "absolute", bottom: 40, left: 50, right: 50, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    footerText: { fontSize: 10, color: "#D1D5DB" },
    sigBox: { textAlign: "right", minWidth: 120, marginTop: 24 },
    signatureImage: { height: 45, maxWidth: 140, objectFit: "contain", marginLeft: "auto", marginBottom: 4 },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4 },
    sigText: { fontSize: 10, color: "#9CA3AF" }
  });

  const fromStateName = fromState?.name || "";
  const toStateName = toState?.name || "";

  return (
    <Document title={`PO-${form.poNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              {form.logo && <Image src={form.logo} style={styles.logo} />}
              <Text style={styles.fromName}>{form.fromName || "Business Name"}</Text>
              <Text style={styles.fromDetails}>{form.fromCity || ""}, {fromStateName}</Text>
            </View>
            <View style={{ textAlign: "right" }}>
              <Text style={styles.title}>PURCHASE ORDER</Text>
              <Text style={styles.metaText}>#{form.poNumber}</Text>
            </View>
          </View>
          <View style={styles.accentBar} />
        </View>

        <View style={styles.addressSection}>
           <View style={styles.addressBox}>
             <Text style={styles.addressLabel}>Vendor / Supplier</Text>
             <Text style={styles.addressName}>{form.toName || "Vendor Name"}</Text>
             <View style={styles.addressDetails}>
               {form.toGSTIN && <Text>GSTIN: {form.toGSTIN}</Text>}
               <Text>{form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}</Text>
               {toStateName && <Text>{toStateName}</Text>}
             </View>
           </View>
           {form.deliveryAddress && (
             <View style={styles.addressBox}>
               <Text style={styles.addressLabel}>Delivery Address</Text>
               <Text style={styles.addressDetails}>{form.deliveryAddress}</Text>
             </View>
           )}
        </View>

        <View style={styles.table}>
          <View style={styles.tHeader}>
            <View style={{ flex: 0.5 }}><Text style={styles.th}>#</Text></View>
            <View style={{ flex: 3 }}><Text style={styles.th}>Description</Text></View>
            {form.showHSN && <View style={{ flex: 1 }}><Text style={styles.th}>HSN</Text></View>}
            <View style={{ flex: 1 }}><Text style={styles.th}>Qty</Text></View>
            <View style={{ flex: 1.2 }}><Text style={[styles.th, { textAlign: "right" }]}>Amount</Text></View>
          </View>
          {calc.items.map((item, i) => (
            <View key={i} style={styles.tRow} wrap={false}>
              <View style={{ flex: 0.5 }}><Text style={styles.td}>{i + 1}</Text></View>
              <View style={{ flex: 3 }}><Text style={styles.td}>{item.description || "—"}</Text></View>
              {form.showHSN && <View style={{ flex: 1 }}><Text style={styles.td}>{item.hsn || "—"}</Text></View>}
              <View style={{ flex: 1 }}><Text style={styles.td}>{item.qty} {item.unit}</Text></View>
              <View style={{ flex: 1.2 }}><Text style={[styles.td, { textAlign: "right", fontWeight: 700 }]}>₹{item.amount}</Text></View>
            </View>
          ))}
        </View>

        <View style={styles.bottomGrid} wrap={false}>
          <View style={styles.totBox}>
            <View style={styles.totRow}>
              <Text style={styles.totLabel}>Subtotal</Text>
              <Text style={styles.totVal}>₹{calc.subtotal}</Text>
            </View>
            {form.taxType === "cgst_sgst" && (
              <>
                <View style={styles.totRow}>
                  <Text style={styles.totLabel}>CGST</Text>
                  <Text style={styles.totVal}>₹{calc.totalCGST}</Text>
                </View>
                <View style={styles.totRow}>
                  <Text style={styles.totLabel}>SGST</Text>
                  <Text style={styles.totVal}>₹{calc.totalSGST}</Text>
                </View>
              </>
            )}
            {form.taxType === "igst" && (
              <View style={styles.totRow}>
                <Text style={styles.totLabel}>IGST</Text>
                <Text style={styles.totVal}>₹{calc.totalIGST}</Text>
              </View>
            )}
            <View style={styles.grandBox}>
              <Text style={styles.grandLabel}>Total</Text>
              <Text style={styles.grandVal}>₹{calc.grandTotal}</Text>
            </View>
          </View>
        </View>

        <View style={styles.wordsBox} wrap={false}>
          <Text style={styles.wordsLabel}>Amount in Words</Text>
          <Text style={styles.wordsText}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
        </View>

        <View style={styles.sigBox} wrap={false}>
            {form.signature && <Image src={form.signature} style={styles.signatureImage} />}
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
