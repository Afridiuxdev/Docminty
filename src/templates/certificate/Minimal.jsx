"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function CertificateMinimalTemplate({ form }) {
  const T = form.templateColor || "#111827";

  const s = StyleSheet.create({
    page:   { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: "36 48", backgroundColor: "#fff" },
    head:   { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 1.5, borderBottomColor: T, paddingBottom: 10, marginBottom: 24 },
    logo:   { width: 40, height: 28, objectFit: "contain" },
    org:    { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    orgA:   { fontSize: 8, color: "#9CA3AF", marginTop: 1 },
    typeT:  { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, textAlign: "right" },
    body:   { alignItems: "center", paddingVertical: 20 },
    cert:   { fontSize: 11, color: "#9CA3AF", textAlign: "center", marginBottom: 8, letterSpacing: 1 },
    name:   { fontSize: 30, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center", marginBottom: 12 },
    line:   { width: 220, borderBottomWidth: 2, borderBottomColor: T, marginBottom: 15 },
    desc:   { fontSize: 11, color: "#6B7280", textAlign: "center", lineHeight: 1.6, maxWidth: 360, marginBottom: 8 },
    course: { fontSize: 13, fontFamily: "Helvetica-Bold", color: T, textAlign: "center", marginBottom: 16 },
    meta:   { flexDirection: "row", gap: 40, marginBottom: 24 },
    metaI:  { alignItems: "center" },
    metaL:  { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
    metaV:  { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" },
    sigCol: { alignItems: "center" },
    sigL:   { borderTopWidth: 1, borderTopColor: "#111827", paddingTop: 5, width: 140, alignItems: "center", marginTop: 5 },
    sigN:   { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center" },
    sigD:   { fontSize: 8, color: "#9CA3AF", textAlign: "center" },
    verifId:{ fontSize: 7, color: "#D1D5DB", textAlign: "center", marginTop: 12, fontFamily: "Courier" },
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.head}>
          <View>
            {form.logo && <Image src={form.logo} style={s.logo} />}
            <Text style={s.org}>{form.orgName || "Organisation"}</Text>
            {form.orgAddress && <Text style={s.orgA}>{form.orgAddress}</Text>}
          </View>
          <Text style={s.typeT}>{form.certType || "Certificate"}</Text>
        </View>
        <View style={s.body}>
          <Text style={s.cert}>This is to certify that</Text>
          <Text style={s.name}>{form.recipientName || "Recipient Name"}</Text>
          <View style={s.line} />
          <Text style={s.desc}>{form.description || "has successfully completed the course in"}</Text>
          {form.course && <Text style={s.course}>{form.course}</Text>}
          <View style={s.meta}>
            {form.duration && (
              <View style={s.metaI}>
                <Text style={s.metaL}>Duration</Text>
                <Text style={s.metaV}>{form.duration}</Text>
              </View>
            )}
            {form.grade && (
              <View style={s.metaI}>
                <Text style={s.metaL}>Grade</Text>
                <Text style={[s.metaV, { color: T }]}>{form.grade}</Text>
              </View>
            )}
            <View style={s.metaI}>
              <Text style={s.metaL}>Issued On</Text>
              <Text style={s.metaV}>{form.issueDate}</Text>
            </View>
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
