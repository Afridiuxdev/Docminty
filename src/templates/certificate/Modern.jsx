"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function CertificateModernTemplate({ form }) {
  const T = form.templateColor || "#6366F1";

  const s = StyleSheet.create({
    page:   { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
    top:    { backgroundColor: T, padding: "28 40", alignItems: "center" },
    logo:   { width: 48, height: 34, objectFit: "contain", marginBottom: 8 },
    org:    { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#fff", textTransform: "uppercase", letterSpacing: 2, textAlign: "center" },
    orgSub: { fontSize: 8, color: "rgba(255,255,255,0.7)", textAlign: "center", marginTop: 2 },
    body:   { padding: "28 40", alignItems: "center" },
    badge:  { backgroundColor: T + "10", borderWidth: 1, borderColor: T, padding: "4 20", borderRadius: 2, marginBottom: 16 },
    badgeT: { fontSize: 10, fontFamily: "Helvetica-Bold", color: T, textTransform: "uppercase", letterSpacing: 2, textAlign: "center" },
    cert:   { fontSize: 11, color: "#6B7280", textAlign: "center", marginBottom: 6 },
    name:   { fontSize: 28, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 8, marginBottom: 10 },
    desc:   { fontSize: 11, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 340, marginBottom: 8 },
    course: { fontSize: 14, fontFamily: "Helvetica-Bold", color: T, textAlign: "center", marginBottom: 12 },
    meta:   { flexDirection: "row", gap: 28, justifyContent: "center", marginBottom: 20 },
    metaI:  { alignItems: "center" },
    metaL:  { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
    metaV:  { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    sigs:   { flexDirection: "row", gap: 40, justifyContent: "center", alignItems: "flex-end" },
    sigB:   { alignItems: "center" },
    sigL:   { borderTopWidth: 1.5, borderTopColor: "#374151", paddingTop: 5, width: 120, alignItems: "center", marginTop: 5 },
    sigN:   { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center" },
    sigD:   { fontSize: 8, color: "#9CA3AF", textAlign: "center" },
    verifId:{ fontSize: 7, color: "#D1D5DB", textAlign: "center", marginTop: 12, fontFamily: "Courier" },
    bottom: { backgroundColor: T, height: 5, position: "absolute", bottom: 0, left: 0, right: 0 },
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.top}>
          {form.logo && <Image src={form.logo} style={[s.logo, { filter: "brightness(0) invert(1)" }]} />}
          <Text style={s.org}>{form.orgName || "Organisation"}</Text>
          {form.orgAddress && <Text style={s.orgSub}>{form.orgAddress}</Text>}
        </View>
        <View style={s.body}>
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
          <View style={s.sigs}>
            <View style={s.sigB}>
              {form.signature && <Image src={form.signature} style={{ height: 35, marginBottom: 5, objectFit: "contain" }} />}
              <View style={s.sigL}>
                <Text style={s.sigN}>{form.signatoryName || "Signatory"}</Text>
                <Text style={s.sigD}>{form.signatoryDesignation || "Designation"}</Text>
              </View>
            </View>
          </View>
          {form.enableQR && <Text style={s.verifId}>{"ID: " + form.verificationId}</Text>}
        </View>
        <View style={s.bottom} />
      </Page>
    </Document>
  );
}
