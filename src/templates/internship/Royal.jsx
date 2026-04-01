"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
  excellent: "exceptional commitment, creativity, and technical skills",
  good: "good work ethic and contributed meaningfully to the team",
  satisfactory: "performed their assigned duties satisfactorily",
};

export default function InternshipRoyalTemplate({ form }) {
  const T = form.templateColor || "#D97706";
  const perfText = PERF_TEXT[form.performance] || PERF_TEXT.good;
  const start = form.startDate ? new Date(form.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Start Date";
  const end = form.endDate ? new Date(form.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "End Date";

  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
    borderOuter: { margin: 15, border: `12px double ${T}`, height: "100%", padding: 10 },
    borderInner: { border: `2px solid ${T}`, padding: "40 60", height: "100%", alignItems: "center" },
    logo: { height: 45, objectFit: "contain", marginBottom: 20 },
    orgName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#111827", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
    orgAddr: { fontSize: 9, color: "#9CA3AF", marginBottom: 30 },
    certTitle: { fontSize: 32, fontFamily: "Helvetica-Bold", color: T, textTransform: "uppercase", letterSpacing: 4, marginBottom: 12 },
    certSub: { fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 40 },
    certify: { fontSize: 12, color: "#6B7280", marginBottom: 10 },
    name: { fontSize: 36, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 24, borderBottomWidth: 1, borderBottomColor: T, paddingBottom: 10 },
    body: { fontSize: 11, color: "#374151", lineHeight: 1.8, marginBottom: 24, textAlign: "center", maxWidth: 460 },
    project: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 40 },
    sigRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "flex-end" },
    sigImg: { height: 40, marginBottom: 5, objectFit: "contain" },
    sigLine: { borderTopWidth: 2, borderTopColor: "#111827", paddingTop: 8, width: 160 },
    sigName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    sigDesig: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
    qrBox: { width: 50, height: 50, border: `2px solid ${T}`, borderRadius: 4, alignItems: "center", justifyContent: "center" },
    verifId: { position: "absolute", bottom: 20, right: 60, fontSize: 8, color: "#D1D5DB", fontFamily: "Courier" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.borderOuter}>
          <View style={styles.borderInner}>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
            {form.orgAddress && <Text style={styles.orgAddr}>{form.orgAddress}</Text>}
            <Text style={styles.certTitle}>CERTIFICATE</Text>
            <Text style={styles.certSub}>of Professional Internship</Text>
            <Text style={styles.certify}>This is to certify that</Text>
            <Text style={styles.name}>{form.internName || "Intern Name"}</Text>
            <Text style={styles.body}>has successfully completed a professional internship program as <Text style={{ fontFamily: "Helvetica-Bold", color: T }}>{form.role || "Intern"}</Text>{form.department ? ` in ${form.department}` : ""} at <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.orgName || "Organisation"}</Text> from {start} to {end}.</Text>
            <Text style={styles.body}>During the program, the intern demonstrated {perfText}.</Text>
            {form.projectName && <Text style={styles.project}>Project Title: {form.projectName}</Text>}
            <View style={styles.sigRow}>
              {form.enableQR && (
                <View style={{ alignItems: "center" }}>
                  <View style={styles.qrBox}><Text style={{ fontSize: 10, color: T, fontFamily: "Helvetica-Bold" }}>QR</Text></View>
                  <Text style={{ fontSize: 7, color: T, marginTop: 4 }}>Verify Online</Text>
                </View>
              )}
              <View>
                {form.signature && <Image src={form.signature} style={styles.sigImg} />}
                <View style={styles.sigLine}>
                  <Text style={styles.sigName}>{form.signatoryName || "Signatory"}</Text>
                  <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                </View>
              </View>
            </View>
            {form.enableQR && <Text style={styles.verifId}>Verification ID: {form.verificationId} | Date: {form.issueDate}</Text>}
          </View>
        </View>
      </Page>
    </Document>
  );
}
