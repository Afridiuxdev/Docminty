"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function PurchaseModernTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, flexDirection: "row", backgroundColor: "#ffffff" },
    sidebar: { width: 140, backgroundColor: T, height: "100%", padding: "24 14", color: "#ffffff" },
    logo: { height: 32, objectFit: "contain", marginBottom: 24, filter: "brightness(0) invert(1)" },
    sideTitle: { fontSize: 15, fontFamily: "Space Grotesk", fontWeight: 800, textTransform: "uppercase", marginBottom: 4 },
    sideSub: { fontSize: 10, opacity: 0.75, marginBottom: 24 },
    sideLabel: { fontSize: 8, fontWeight: 700, opacity: 0.6, textTransform: "uppercase", marginBottom: 3 },
    sideValue: { fontSize: 10, fontWeight: 600, color: "#ffffff", marginBottom: 4 },
    sideText: { fontSize: 9, opacity: 0.8, marginBottom: 16, lineHeight: 1.4 },
    
    main: { flex: 1, backgroundColor: "#ffffff" },
    header: { padding: "16 20 12", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    metaText: { fontSize: 10, color: "#9CA3AF" },
    
    mainContent: { padding: "20 24" },
    addressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
    addressBox: { width: "48%" },
    addressLabel: { fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 },
    addressName: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 },
    addressDetails: { fontSize: 11, color: "#6B7280", lineHeight: 1.4 },
    
    table: { marginBottom: 20 },
    tHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 8 },
    tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "10 0", alignItems: "center" },
    th: { fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" },
    td: { fontSize: 10, color: "#111827" },
    
    bottomGrid: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
    totBox: { width: 180 },
    totRow: { flexDirection: "row", justifyContent: "space-between", padding: "4 0" },
    totLabel: { fontSize: 10, color: "#6B7280" },
    totVal: { fontSize: 10, fontWeight: 700, color: "#111827" },
    grandBox: { marginTop: 8, padding: "10 12", backgroundColor: T + "10", borderRadius: 8, flexDirection: "row", justifyContent: "space-between" },
    grandLabel: { fontSize: 11, fontWeight: 700, color: T },
    grandVal: { fontSize: 11, fontWeight: 800, color: T },
    
    wordsBox: { marginTop: 24, padding: "12 16", backgroundColor: "#F9FAFB", borderRadius: 8, borderLeftWidth: 3, borderLeftColor: T },
    wordsLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 4 },
    wordsText: { fontSize: 10, color: "#111827", fontWeight: 700, fontStyle: "italic" },
    
    footer: { position: "absolute", bottom: 20, left: 24, right: 24, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10 },
    footerText: { fontSize: 9, color: "#D1D5DB" },
    sigBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 32 },
    signatureImage: { height: 40, width: 120, objectFit: "contain" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 100 },
    sigText: { fontSize: 9, color: "#9CA3AF" }
  });

  const fromStateName = fromState?.name || "";
  const toStateName = toState?.name || "";

  return (
    <Document title={`PO-${form.poNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.sideTitle}>PURCHASE</Text>
          <Text style={styles.sideSub}>#{form.poNumber}</Text>
          
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sideLabel}>From</Text>
            <Text style={styles.sideValue}>{form.fromName || "Your Company"}</Text>
            <Text style={styles.sideText}>
              {form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromStateName}
            </Text>
          </View>
          
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sideLabel}>Vendor</Text>
            <Text style={styles.sideValue}>{form.toName || "Vendor Name"}</Text>
          </View>

          <View style={{ marginTop: "auto" }}>
            <Text style={styles.sideLabel}>Total Amount</Text>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>₹{calc.grandTotal}</Text>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.header}>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <View style={{ textAlign: "right" }}>
              <Text style={styles.metaText}>Date: {form.poDate}</Text>
              {form.deliveryDate && <Text style={styles.metaText}>Deliv: {form.deliveryDate}</Text>}
            </View>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.addressRow}>
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
                 <View style={[styles.addressBox, { textAlign: "right" }]}>
                   <Text style={styles.addressLabel}>Delivery Address</Text>
                   <Text style={[styles.addressDetails, { textAlign: "right" }]}>{form.deliveryAddress}</Text>
                 </View>
               )}
            </View>

            <View style={styles.table}>
              <View style={styles.tHeader}>
                <View style={{ flex: 3 }}><Text style={styles.th}>Description</Text></View>
                {form.showHSN && <View style={{ flex: 1 }}><Text style={styles.th}>HSN</Text></View>}
                <View style={{ flex: 1 }}><Text style={styles.th}>Qty</Text></View>
                <View style={{ flex: 1.2 }}><Text style={[styles.th, { textAlign: "right" }]}>Amount</Text></View>
              </View>
              {calc.items.map((item, i) => (
                <View key={i} style={styles.tRow} wrap={false}>
                  <View style={{ flex: 3 }}>
                    <Text style={[styles.td, { fontWeight: 700 }]}>{item.description || "—"}</Text>
                    <Text style={{ fontSize: 8, color: "#9CA3AF", marginTop: 2 }}>
                       Rate: ₹{item.rate}
                    </Text>
                  </View>
                  {form.showHSN && <View style={{ flex: 1 }}><Text style={styles.td}>{item.hsn || "—"}</Text></View>}
                  <View style={{ flex: 1 }}><Text style={styles.td}>{item.qty} {item.unit}</Text></View>
                  <View style={{ flex: 1.2 }}><Text style={[styles.td, { textAlign: "right", fontWeight: 700 }]}>₹{item.amount}</Text></View>
                </View>
              ))}
            </View>

            <View style={styles.bottomGrid}>
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

            <View style={styles.sigBox}>
              <Text style={styles.footerText}>Generated by DocMinty.com</Text>
              <View style={{ alignItems: "flex-end" }}>
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
          </View>
        </View>
      </Page>
    </Document>
  );
}
