"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
const A = "#1E3A5F";
const s = StyleSheet.create({
  page:   { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
  topBar: { backgroundColor: A, height: 8 },
  header: { padding: "18 40 14", borderBottomWidth: 2, borderBottomColor: A, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo:   { width: 48, height: 34, objectFit: "contain" },
  org:    { fontSize: 13, fontFamily: "Helvetica-Bold", color: A },
  orgA:   { fontSize: 8, color: "#6B7280", marginTop: 2 },
  typeB:  { backgroundColor: A, padding: "5 18" },
  typeT:  { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#fff", textTransform: "uppercase", letterSpacing: 2 },
  body:   { padding: "24 40", alignItems: "center" },
  cert:   { fontSize: 11, color: "#6B7280", textAlign: "center", marginBottom: 8 },
  name:   { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: A, paddingBottom: 8, marginBottom: 10 },
  desc:   { fontSize: 11, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 360, marginBottom: 8 },
  course: { fontSize: 13, fontFamily: "Helvetica-Bold", color: A, textAlign: "center", marginBottom: 12 },
  meta:   { flexDirection: "row", gap: 28, backgroundColor: "#F8FAFD", padding: "10 20", borderRadius: 4, marginBottom: 16 },
  metaI:  { alignItems: "center" },
  metaL:  { fontSize: 7, color: A, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
  metaV:  { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
  sigL:   { borderTopWidth: 1.5, borderTopColor: A, paddingTop: 5, width: 130, alignItems: "center", marginTop: 16 },
  sigN:   { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center" },
  sigD:   { fontSize: 8, color: "#9CA3AF", textAlign: "center" },
  botBar: { backgroundColor: A, height: 8, position: "absolute", bottom: 0, left: 0, right: 0 },
  verifId:{ fontSize: 7, color: "#D1D5DB", textAlign: "center", marginTop: 10, fontFamily: "Courier" },
  qrBox:  { width: 44, height: 44, border: `1pt solid ${A}`, borderRadius: 2, alignItems: "center", justifyContent: "center", position: "absolute", bottom: 20, right: 40 },
});
export default function CertificateCorporateTemplate({ form }) {
  return (
    <Document><Page size="A4" orientation="landscape" style={s.page}>
      <View style={s.topBar} />
      <View style={s.header}>
        <View>{form.logo && <Image src={form.logo} style={s.logo} />}<Text style={s.org}>{form.orgName || "Organisation"}</Text>{form.orgAddress && <Text style={s.orgA}>{form.orgAddress}</Text>}</View>
        <View style={s.typeB}><Text style={s.typeT}>{form.certType || "Certificate"}</Text></View>
      </View>
      <View style={s.body}>
        <Text style={s.cert}>This is to certify that</Text>
        <Text style={s.name}>{form.recipientName || "Recipient Name"}</Text>
        <Text style={s.desc}>{form.description || "has successfully completed the course in"}</Text>
        {form.course && <Text style={s.course}>{form.course}</Text>}
        <View style={s.meta}>
          {form.duration && <View style={s.metaI}><Text style={s.metaL}>Duration</Text><Text style={s.metaV}>{form.duration}</Text></View>}
          {form.grade && <View style={s.metaI}><Text style={s.metaL}>Grade</Text><Text style={[s.metaV, { color: A }]}>{form.grade}</Text></View>}
          <View style={s.metaI}><Text style={s.metaL}>Issue Date</Text><Text style={s.metaV}>{form.issueDate}</Text></View>
        </View>
        <View style={s.sigL}><Text style={s.sigN}>{form.signatoryName || "Signatory"}</Text><Text style={s.sigD}>{form.signatoryDesignation}</Text></View>
        {form.enableQR && form.qrCodeDataUrl && (
          <View style={s.qrBox}>
            <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%", padding: 2 }} />
          </View>
        )}
        {form.enableQR && <Text style={s.verifId}>{"ID: " + form.verificationId}</Text>}
      </View>
      <View style={s.botBar} />
    </Page></Document>
  );
}
