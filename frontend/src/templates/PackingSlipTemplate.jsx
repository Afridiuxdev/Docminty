"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

const T = "#0D9488";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: T,
    paddingBottom: 14,
    marginBottom: 16,
  },
  logo: {
    width: 55,
    height: 38,
    objectFit: "contain",
    marginBottom: 5,
  },
  fromName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  small: {
    fontSize: 9,
    color: "#6B7280",
    marginTop: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: T,
    textAlign: "right",
  },
  num: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "right",
    marginTop: 3,
  },
  meta: {
    fontSize: 9,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 2,
  },
  section: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  sectionHalf: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F0F4F3",
    padding: "5 6",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableRow: {
    flexDirection: "row",
    padding: "5 6",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  thText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  tdText: {
    fontSize: 9,
    color: "#374151",
  },
  summaryBox: {
    backgroundColor: "#F0FDFA",
    padding: "10 14",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: T,
  },
  notesBox: {
    backgroundColor: "#F8F9FA",
    padding: "7 10",
    borderLeftWidth: 3,
    borderLeftColor: T,
    marginTop: 10,
  },
  notesLabel: {
    fontSize: 8,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  notesText: {
    fontSize: 9,
    color: "#374151",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  footerGen: {
    fontSize: 8,
    color: "#D1D5DB",
  },
  signBox: {
    borderTopWidth: 1,
    borderTopColor: "#374151",
    paddingTop: 4,
    width: 120,
    textAlign: "center",
  },
  signText: {
    fontSize: 8,
    color: "#9CA3AF",
  },
});

const COL = {
  num: { flex: 0.4 },
  desc: { flex: 2.5 },
  sku: { flex: 0.8 },
  qty: { flex: 0.6 },
  wt: { flex: 0.7 },
};

export default function PackingSlipTemplate({ form }) {
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);
  const totalQty = form.items.reduce(
    (acc, i) => acc + (parseFloat(i.qty) || 0), 0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            {form.logo && (
              <Image src={form.logo} style={styles.logo} />
            )}
            <Text style={styles.fromName}>
              {form.fromName || "Your Company"}
            </Text>
            {form.fromAddress && (
              <Text style={styles.small}>
                {form.fromAddress}
                {form.fromCity ? ", " + form.fromCity : ""}
              </Text>
            )}
            {fromState && (
              <Text style={styles.small}>{fromState.name}</Text>
            )}
            {form.fromPhone && (
              <Text style={styles.small}>{"Ph: " + form.fromPhone}</Text>
            )}
          </View>
          <View>
            <Text style={styles.title}>PACKING SLIP</Text>
            <Text style={styles.num}>{"#" + form.slipNumber}</Text>
            <Text style={styles.meta}>{"Date: " + form.slipDate}</Text>
            {form.deliveryDate && (
              <Text style={styles.meta}>
                {"Expected: " + form.deliveryDate}
              </Text>
            )}
          </View>
        </View>

        {/* Ship To + Shipment Info */}
        <View style={styles.section}>
          <View style={styles.sectionHalf}>
            <Text style={styles.sectionLabel}>Ship To</Text>
            <Text style={styles.sectionName}>
              {form.toName || "Recipient"}
            </Text>
            {form.toAddress && (
              <Text style={styles.small}>
                {form.toAddress}
                {form.toCity ? ", " + form.toCity : ""}
              </Text>
            )}
            {toState && (
              <Text style={styles.small}>{toState.name}</Text>
            )}
            {form.toPhone && (
              <Text style={styles.small}>{"Ph: " + form.toPhone}</Text>
            )}
          </View>

          <View style={styles.sectionHalf}>
            <Text style={styles.sectionLabel}>Shipment Info</Text>
            {form.orderNumber && (
              <Text style={styles.small}>
                {"Order: " + form.orderNumber}
              </Text>
            )}
            {form.shippingMethod && (
              <Text style={styles.small}>
                {"Method: " + form.shippingMethod}
              </Text>
            )}
            {form.courierName && (
              <Text style={styles.small}>
                {"Courier: " + form.courierName}
              </Text>
            )}
            {form.trackingNumber && (
              <Text style={[styles.small, {
                color: T, fontFamily: "Helvetica-Bold",
              }]}>
                {"Tracking: " + form.trackingNumber}
              </Text>
            )}
          </View>
        </View>

        {/* Items table */}
        <View style={{ marginBottom: 10 }}>
          <View style={styles.tableHeader}>
            <View style={COL.num}>
              <Text style={styles.thText}>#</Text>
            </View>
            <View style={COL.desc}>
              <Text style={styles.thText}>Description</Text>
            </View>
            <View style={COL.sku}>
              <Text style={styles.thText}>SKU</Text>
            </View>
            <View style={COL.qty}>
              <Text style={styles.thText}>Qty</Text>
            </View>
            <View style={COL.wt}>
              <Text style={styles.thText}>Weight</Text>
            </View>
          </View>

          {form.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={COL.num}>
                <Text style={styles.tdText}>{i + 1}</Text>
              </View>
              <View style={COL.desc}>
                <Text style={styles.tdText}>
                  {item.description || "—"}
                </Text>
              </View>
              <View style={COL.sku}>
                <Text style={styles.tdText}>{item.sku || "—"}</Text>
              </View>
              <View style={COL.qty}>
                <Text style={[styles.tdText, {
                  fontFamily: "Helvetica-Bold",
                }]}>
                  {item.qty}
                </Text>
              </View>
              <View style={COL.wt}>
                <Text style={styles.tdText}>{item.weight || "—"}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            {"Total Items: " + form.items.length}
          </Text>
          <Text style={styles.summaryText}>
            {"Total Qty: " + totalQty}
          </Text>
        </View>

        {/* Packaging notes */}
        {form.packagingNotes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Packaging Notes</Text>
            <Text style={styles.notesText}>{form.packagingNotes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerGen}>Generated by DocMinty.com</Text>
          <View style={styles.signBox}>
            <Text style={styles.signText}>Authorised Signatory</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}