"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function CertificateElegantTemplate({ form }) {
  const T = form.templateColor || "#7C3AED";
  const BG = "#FAFAFE";

  const s = StyleSheet.create({
    page:   { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: "28 44", backgroundColor: BG },
    strips: { position: "absolute", top: 0, left: 0, right: 0, height: 10, backgroundColor: T },
    stripsB:{ position: "absolute", bottom: 0, left: 0, right: 0, height: 10, backgroundColor: T },
    sideL:  { position: "absolute", top: 0, left: 0, bottom: 0, width: 10, backgroundColor: T },
    sideR:  { position: "absolute", top: 0, right: 0, bottom: 0, width: 10, backgroundColor: T },
    inner:  { margin: 20, alignItems: "center" },
    logo:   { width: 48, height: 34, objectFit: "contain", marginBottom: 8, marginTop: 10 },
    org:    { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 2 },
    orgSub: { fontSize: 8, color: "#9CA3AF", textAlign: "center", marginBottom: 12 },
    badge:  { backgroundColor: T, padding: "4 22", marginBottom: 14 },
    badgeT: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#fff", textTransform: "uppercase", letterSpacing: 2, textAlign: "center" },
    cert:   { fontSize: 11, color: "#6B7280", textAlign: "center", marginBottom: 6 },
    name:   { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 8, marginBottom: 10 },
    desc:   { fontSize: 11, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 360, marginBottom: 8 },
    course: { fontSize: 13, fontFamily: "Helvetica-Bold", color: T, textAlign: "center", marginBottom: 12 },
    meta:   { flexDirection: "row", gap: 28, justifyContent: "center", marginBottom: 16 },
    metaI:  { alignItems: "center" },
    metaL:  { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
    metaV:  { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    sigCol: { alignItems: "center" },
    sigL:   { borderTopWidth: 1.5, borderTopColor: T, paddingTop: 5, width: 120, alignItems: "center", marginTop: 5 },
    sigN:   { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center" },
    sigD:   { fontSize: 8, color: "#9CA3AF", textAlign: "center" },
    verifId:{ fontSize: 7, color: "#D1D5DB", textAlign: "center", marginTop: 10, fontFamily: "Courier" },
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.strips} /><View style={s.stripsB} /><View style={s.sideL} /><View style={s.sideR} />
        <View style={s.inner}>
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
            {form.grade && <View style={s.metaI}><Text style={s.metaL}>Grade</Text><Text style={[s.metaV, { color: T }]}>{form.grade}</Text></View>}
            <View style={s.metaI}><Text style={s.metaL}>Date</Text><Text style={s.metaV}>{form.issueDate}</Text></View>
          </View>
          <View style={s.sigCol}>
            {form.signature && <Image src={form.signature} style={{ height: 35, marginBottom: 5, objectFit: "contain" }} />}
            <View style={s.sigL}>
              <Text style={s.sigN}>{form.signatoryName || "Signatory"}</Text>
              <Text style={s.sigD}>{form.signatoryDesignation}</Text>
            </View>
          </View>
          {form.enableQR && <Text style={s.verifId}>{"ID: " + form.verificationId}</Text>}
        </View>
      </Page>
    </Document>
  );
}
