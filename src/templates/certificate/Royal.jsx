"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
const A = "#D97706";
const BG = "#FFFDF5";
const s = StyleSheet.create({
  page:   { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0, backgroundColor: BG },
  outer:  { margin: 14, borderWidth: 6, borderColor: A, padding: 0 },
  inner:  { borderWidth: 1.5, borderColor: A, margin: 6, padding: "24 36", alignItems: "center" },
  logo:   { width: 48, height: 34, objectFit: "contain", marginBottom: 8 },
  org:    { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#111827", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 2 },
  orgSub: { fontSize: 8, color: "#9CA3AF", textAlign: "center", marginBottom: 14 },
  badge:  { backgroundColor: A, padding: "5 24", borderRadius: 1, marginBottom: 14 },
  badgeT: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#fff", textTransform: "uppercase", letterSpacing: 2, textAlign: "center" },
  cert:   { fontSize: 11, color: "#6B7280", textAlign: "center", marginBottom: 6 },
  name:   { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: A, paddingBottom: 8, marginBottom: 10 },
  desc:   { fontSize: 11, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 360, marginBottom: 8 },
  course: { fontSize: 14, fontFamily: "Helvetica-Bold", color: A, textAlign: "center", marginBottom: 10 },
  meta:   { flexDirection: "row", gap: 28, justifyContent: "center", marginBottom: 16 },
  metaI:  { alignItems: "center" },
  metaL:  { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
  metaV:  { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
  sigs:   { flexDirection: "row", gap: 40, justifyContent: "center" },
  sigL:   { borderTopWidth: 1.5, borderTopColor: A, paddingTop: 5, width: 120, alignItems: "center", marginTop: 16 },
  sigN:   { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center" },
  sigD:   { fontSize: 8, color: "#9CA3AF", textAlign: "center" },
  verifId:{ fontSize: 7, color: "#D1D5DB", textAlign: "center", marginTop: 10, fontFamily: "Courier" },
});
export default function CertificateRoyalTemplate({ form }) {
  return (
    <Document><Page size="A4" orientation="landscape" style={s.page}>
      <View style={s.outer}><View style={s.inner}>
        {form.logo && <Image src={form.logo} style={s.logo} />}
        <Text style={s.org}>{form.orgName || "Organisation"}</Text>
        {form.orgAddress && <Text style={s.orgSub}>{form.orgAddress}</Text>}
        <View style={s.badge}><Text style={s.badgeT}>{form.certType || "Certificate"}</Text></View>
        <Text style={s.cert}>This is to certify that</Text>
        <Text style={s.name}>{form.recipientName || "Recipient Name"}</Text>
        <Text style={s.desc}>{form.description || "has successfully completed the course in"}</Text>
        {form.course && <Text style={s.course}>{form.course}</Text>}
        <View style={s.meta}>
          {form.duration && <View style={s.metaI}><Text style={s.metaL}>Duration</Text><Text style={s.metaV}>{form.duration}</Text></View>}
          {form.grade && <View style={s.metaI}><Text style={s.metaL}>Grade</Text><Text style={[s.metaV, { color: A }]}>{form.grade}</Text></View>}
          <View style={s.metaI}><Text style={s.metaL}>Date</Text><Text style={s.metaV}>{form.issueDate}</Text></View>
        </View>
        <View style={s.sigs}><View style={s.sigL}><Text style={s.sigN}>{form.signatoryName || "Signatory"}</Text><Text style={s.sigD}>{form.signatoryDesignation}</Text></View></View>
        {form.enableQR && <Text style={s.verifId}>{"ID: " + form.verificationId}</Text>}
      </View></View>
    </Page></Document>
  );
}
