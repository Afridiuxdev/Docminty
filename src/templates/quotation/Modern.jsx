"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function QuotationModernTemplate({ form }) {
  const A = form.templateColor || "#6366F1";
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);

  const s = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
    sidebar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 110, backgroundColor: A },
    sideT: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#fff", padding: "36 12 4", lineHeight: 1.2 },
    sideN: { fontSize: 8, color: "rgba(255,255,255,0.7)", padding: "0 12", marginBottom: 3 },
    sideL: { fontSize: 7, color: "rgba(255,255,255,0.5)", padding: "16 12 3", textTransform: "uppercase", letterSpacing: 1 },
    sideI: { fontSize: 8, color: "#fff", padding: "0 12", marginBottom: 2 },
    main: { marginLeft: 120, padding: "28 22 22 0" },
    logo: { width: 45, height: 32, objectFit: "contain", marginBottom: 6 },
    from: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 2 },
    small: { fontSize: 8, color: "#6B7280", marginBottom: 2 },
    tH: { flexDirection: "row", backgroundColor: A, padding: "5 5", marginTop: 10 },
    tR: { flexDirection: "row", padding: "5 5", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    thT: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#fff", textTransform: "uppercase" },
    tdT: { fontSize: 9, color: "#374151" },
    totB: { alignSelf: "flex-end", width: 170, marginTop: 8 },
    totR: { flexDirection: "row", justifyContent: "space-between", padding: "3 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    totL: { fontSize: 9, color: "#6B7280" },
    totV: { fontSize: 9, color: "#374151" },
    totF: { flexDirection: "row", justifyContent: "space-between", backgroundColor: A + "10", padding: "6 8", borderRadius: 3, marginTop: 4 },
    totFT: { fontSize: 10, fontFamily: "Helvetica-Bold", color: A },
    foot: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footG: { fontSize: 7, color: "#D1D5DB" },
    signB: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 100, textAlign: "center" },
    signT: { fontSize: 7, color: "#9CA3AF" },
  });

  return (
    <Document><Page size="A4" style={s.page}>
      <View style={s.sidebar}>
        <Text style={s.sideT}>QUOTATION</Text>
        <Text style={s.sideN}>{"#" + form.quoteNumber}</Text>
        <Text style={s.sideN}>{"Date: " + form.quoteDate}</Text>
        {form.validUntil && <Text style={s.sideN}>{"Valid: " + form.validUntil}</Text>}
        <Text style={s.sideL}>Quote For</Text>
        <Text style={s.sideI}>{form.toName || "Client"}</Text>
        {toState && <Text style={s.sideI}>{toState.name}</Text>}
        <Text style={s.sideL}>Tax Type</Text>
        <Text style={s.sideI}>{form.taxType === "cgst_sgst" ? "CGST+SGST" : form.taxType === "igst" ? "IGST" : "None"}</Text>
      </View>
      <View style={s.main}>
        {form.logo && <Image src={form.logo} style={s.logo} />}
        <Text style={s.from}>{form.fromName || "Your Business"}</Text>
        {form.fromGSTIN && <Text style={s.small}>{"GSTIN: " + form.fromGSTIN}</Text>}
        {fromState && <Text style={s.small}>{fromState.name}</Text>}
        <View style={s.tH}>
          <View style={{ flex: 0.3 }}><Text style={s.thT}>#</Text></View>
          <View style={{ flex: 2.5 }}><Text style={s.thT}>Description</Text></View>
          <View style={{ flex: 0.5 }}><Text style={s.thT}>Qty</Text></View>
          <View style={{ flex: 0.8 }}><Text style={s.thT}>Rate</Text></View>
          <View style={{ flex: 0.6 }}><Text style={s.thT}>GST%</Text></View>
          <View style={{ flex: 0.8 }}><Text style={[s.thT, { textAlign: "right" }]}>Amt</Text></View>
        </View>
        {calc.items.map((item, i) => (
          <View key={i} style={s.tR}>
            <View style={{ flex: 0.3 }}><Text style={s.tdT}>{i + 1}</Text></View>
            <View style={{ flex: 2.5 }}><Text style={s.tdT}>{item.description || "-"}</Text></View>
            <View style={{ flex: 0.5 }}><Text style={s.tdT}>{item.qty}</Text></View>
            <View style={{ flex: 0.8 }}><Text style={s.tdT}>{"Rs. " + item.rate}</Text></View>
            <View style={{ flex: 0.6 }}><Text style={s.tdT}>{item.gstRate + "%"}</Text></View>
            <View style={{ flex: 0.8 }}><Text style={[s.tdT, { textAlign: "right", fontFamily: "Helvetica-Bold" }]}>{"Rs. " + item.amount}</Text></View>
          </View>
        ))}
        <View style={s.totB}>
          <View style={s.totR}><Text style={s.totL}>Subtotal</Text><Text style={s.totV}>{"Rs. " + calc.subtotal}</Text></View>
          {form.taxType === "cgst_sgst" && <><View style={s.totR}><Text style={s.totL}>CGST</Text><Text style={s.totV}>{"Rs. " + calc.totalCGST}</Text></View><View style={s.totR}><Text style={s.totL}>SGST</Text><Text style={s.totV}>{"Rs. " + calc.totalSGST}</Text></View></>}
          {form.taxType === "igst" && <View style={s.totR}><Text style={s.totL}>IGST</Text><Text style={s.totV}>{"Rs. " + calc.totalIGST}</Text></View>}
          <View style={s.totF}><Text style={s.totFT}>Total</Text><Text style={s.totFT}>{"Rs. " + calc.grandTotal}</Text></View>
        </View>
        <View style={s.foot}><Text style={s.footG}>Generated by DocMinty.com</Text><View style={s.signB}><Text style={s.signT}>Authorised Signatory</Text></View></View>
      </View>
    </Page></Document>
  );
}
