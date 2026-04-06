"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

const T = "#0D9488";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
  badge: { backgroundColor: "#FEF9C3", borderBottomWidth: 2, borderBottomColor: "#F59E0B", padding: "5 40" },
  badgeText: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#92400E", textTransform: "uppercase", letterSpacing: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: T, padding: "14 40", marginBottom: 0 },
  logo: { width: 55, height: 38, objectFit: "contain", marginBottom: 5 },
  fromName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827" },
  small: { fontSize: 9, color: "#6B7280", marginTop: 2 },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: T, textAlign: "right" },
  num: { fontSize: 10, color: "#6B7280", textAlign: "right", marginTop: 3 },
  meta: { fontSize: 9, color: "#9CA3AF", textAlign: "right", marginTop: 2 },
  body: { padding: "16 40" },
  billSec: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  billLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  billName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
  tHeader: { flexDirection: "row", backgroundColor: "#F0F4F3", padding: "5 6", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  tRow: { flexDirection: "row", padding: "5 6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  thText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#6B7280", textTransform: "uppercase" },
  tdText: { fontSize: 9, color: "#374151" },
  totBox: { alignSelf: "flex-end", width: 200, marginTop: 8 },
  totRow: { flexDirection: "row", justifyContent: "space-between", padding: "4 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  totL: { fontSize: 9, color: "#6B7280" },
  totV: { fontSize: 9, color: "#374151" },
  totFinal: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#F0FDFA", padding: "7 10", borderRadius: 4, marginTop: 4 },
  totFT: { fontSize: 10, fontFamily: "Helvetica-Bold", color: T },
  advRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  advBox: { flex: 1, backgroundColor: "#FEF9C3", borderWidth: 1, borderColor: "#F59E0B", borderRadius: 6, padding: "10 12" },
  advLabel: { fontSize: 8, color: "#92400E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  advValue: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#92400E" },
  bankBox: { flex: 1, backgroundColor: "#F0FDFA", borderWidth: 1, borderColor: T, borderRadius: 6, padding: "10 12" },
  bankLabel: { fontSize: 8, color: "#065F46", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  bankRow: { flexDirection: "row", gap: 6, marginBottom: 3 },
  bankKey: { fontSize: 8, color: "#6B7280", width: 50 },
  bankVal: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#111827" },
  wordsBox: { backgroundColor: "#F8F9FA", padding: "7 10", borderLeftWidth: 3, borderLeftColor: T, marginTop: 10, marginBottom: 10 },
  wordsL: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
  wordsT: { fontSize: 9, color: "#374151", fontStyle: "italic" },
  notesGrid: { flexDirection: "row", gap: 16, marginTop: 10 },
  noteBox: { flex: 1 },
  noteL: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
  noteT: { fontSize: 9, color: "#6B7280", lineHeight: 1.5 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  footerG: { fontSize: 8, color: "#D1D5DB" },
  signBox: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 120, textAlign: "center" },
  signT: { fontSize: 8, color: "#9CA3AF" },
});

export default function ProformaInvoiceTemplate({ form }) {
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);
  const advAmt = (parseFloat(calc.grandTotal) * (parseFloat(form.advancePercent) || 0) / 100).toFixed(2);
  const advFmt = parseFloat(advAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Proforma Invoice - Not a Tax Invoice</Text>
        </View>

        <View style={styles.header}>
          <View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.fromName}>{form.fromName || "Your Business"}</Text>
            {form.fromGSTIN && <Text style={styles.small}>{"GSTIN: " + form.fromGSTIN}</Text>}
            {form.fromAddress && <Text style={styles.small}>{form.fromAddress + (form.fromCity ? ", " + form.fromCity : "")}</Text>}
            {fromState && <Text style={styles.small}>{fromState.name}</Text>}
          </View>
          <View>
            <Text style={styles.title}>PROFORMA INVOICE</Text>
            <Text style={styles.num}>{"#" + form.proformaNumber}</Text>
            <Text style={styles.meta}>{"Date: " + form.proformaDate}</Text>
            {form.validUntil && <Text style={styles.meta}>{"Valid Until: " + form.validUntil}</Text>}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.billSec}>
            <View>
              <Text style={styles.billLabel}>Bill To</Text>
              <Text style={styles.billName}>{form.toName || "Client"}</Text>
              {form.toGSTIN && <Text style={styles.small}>{"GSTIN: " + form.toGSTIN}</Text>}
              {form.toAddress && <Text style={styles.small}>{form.toAddress + (form.toCity ? ", " + form.toCity : "")}</Text>}
              {toState && <Text style={styles.small}>{toState.name}</Text>}
            </View>
            <View>
              <Text style={styles.billLabel}>Tax Type</Text>
              <Text style={{ fontSize: 9, color: "#374151" }}>
                {form.taxType === "cgst_sgst" ? "CGST + SGST" : form.taxType === "igst" ? "IGST" : "No Tax"}
              </Text>
            </View>
          </View>

          <View style={{ marginBottom: 10 }}>
            <View style={styles.tHeader}>
              <View style={{ flex: 0.4 }}><Text style={styles.thText}>#</Text></View>
              <View style={{ flex: 2.5 }}><Text style={styles.thText}>Description</Text></View>
              <View style={{ flex: 0.5 }}><Text style={styles.thText}>Qty</Text></View>
              <View style={{ flex: 0.8 }}><Text style={styles.thText}>Rate</Text></View>
              <View style={{ flex: 0.6 }}><Text style={styles.thText}>GST%</Text></View>
              <View style={{ flex: 0.9 }}><Text style={[styles.thText, { textAlign: "right" }]}>Amount</Text></View>
            </View>
            {calc.items.map((item, i) => (
              <View key={i} style={styles.tRow}>
                <View style={{ flex: 0.4 }}><Text style={styles.tdText}>{i + 1}</Text></View>
                <View style={{ flex: 2.5 }}><Text style={styles.tdText}>{item.description || "—"}</Text></View>
                <View style={{ flex: 0.5 }}><Text style={styles.tdText}>{item.qty}</Text></View>
                <View style={{ flex: 0.8 }}><Text style={styles.tdText}>{"Rs. " + item.rate}</Text></View>
                <View style={{ flex: 0.6 }}><Text style={styles.tdText}>{item.gstRate + "%"}</Text></View>
                <View style={{ flex: 0.9 }}><Text style={[styles.tdText, { textAlign: "right", fontFamily: "Helvetica-Bold" }]}>{"Rs. " + item.amount}</Text></View>
              </View>
            ))}
          </View>

          <View style={styles.totBox}>
            <View style={styles.totRow}><Text style={styles.totL}>Subtotal</Text><Text style={styles.totV}>{"Rs. " + calc.subtotal}</Text></View>
            {form.taxType === "cgst_sgst" && <>
              <View style={styles.totRow}><Text style={styles.totL}>CGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalCGST}</Text></View>
              <View style={styles.totRow}><Text style={styles.totL}>SGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalSGST}</Text></View>
            </>}
            {form.taxType === "igst" && <View style={styles.totRow}><Text style={styles.totL}>IGST</Text><Text style={styles.totV}>{"Rs. " + calc.totalIGST}</Text></View>}
            <View style={styles.totFinal}>
              <Text style={styles.totFT}>Grand Total</Text>
              <Text style={styles.totFT}>{"Rs. " + calc.grandTotal}</Text>
            </View>
          </View>

          <View style={styles.advRow}>
            <View style={styles.advBox}>
              <Text style={styles.advLabel}>{"Advance Required (" + form.advancePercent + "%)"}</Text>
              <Text style={styles.advValue}>{"Rs. " + advFmt}</Text>
            </View>
            {form.bankName && (
              <View style={styles.bankBox}>
                <Text style={styles.bankLabel}>Bank Details</Text>
                {[["Bank", form.bankName], ["Acct", form.accountNumber], ["IFSC", form.ifscCode], ["Name", form.accountName]].filter(([, v]) => v).map(([l, v]) => (
                  <View key={l} style={styles.bankRow}>
                    <Text style={styles.bankKey}>{l + ":"}</Text>
                    <Text style={styles.bankVal}>{v}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.wordsBox}>
            <Text style={styles.wordsL}>Amount in Words</Text>
            <Text style={styles.wordsT}>{numberToWords(parseFloat(calc.grandTotal))}</Text>
          </View>

          {(form.notes || form.terms) && (
            <View style={styles.notesGrid}>
              {form.notes && <View style={styles.noteBox}><Text style={styles.noteL}>Notes</Text><Text style={styles.noteT}>{form.notes}</Text></View>}
              {form.terms && <View style={styles.noteBox}><Text style={styles.noteL}>Terms</Text><Text style={styles.noteT}>{form.terms}</Text></View>}
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerG}>Generated by DocMinty.com</Text>
            <View style={styles.signBox}><Text style={styles.signT}>Authorised Signatory</Text></View>
          </View>
        </View>
      </Page>
    </Document>
  );
}