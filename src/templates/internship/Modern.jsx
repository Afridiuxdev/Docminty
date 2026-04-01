"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
  excellent: "exceptional commitment, creativity, and technical skills",
  good: "good work ethic and contributed meaningfully to the team",
  satisfactory: "performed their assigned duties satisfactorily",
};

export default function InternshipModernTemplate({ form }) {
  const T = form.templateColor || "#6366F1";
  const perfText = PERF_TEXT[form.performance] || PERF_TEXT.good;
  const start = form.startDate ? new Date(form.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Start Date";
  const end = form.endDate ? new Date(form.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "End Date";

  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
    header: { background: T, height: 120, alignItems: "center", justifyContent: "center", padding: "0 40" },
    title: { fontSize: 24, fontFamily: "Helvetica-Bold", color: "#fff", textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 },
    subtitle: { fontSize: 10, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: 1.5 },
    content: { padding: "40 60", alignItems: "center" },
    logo: { height: 40, objectFit: "contain", marginBottom: 30 },
    certify: { fontSize: 11, color: "#6B7280", marginBottom: 12, textAlign: "center" },
    name: { fontSize: 28, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 20, textAlign: "center" },
    body: { fontSize: 11, color: "#374151", lineHeight: 1.8, marginBottom: 24, textAlign: "center", maxWidth: 440 },
    projectName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: T, marginBottom: 40 },
    sigRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "flex-end" },
    sigImg: { height: 35, marginBottom: 5, objectFit: "contain" },
    sigLine: { borderTopWidth: 2, borderTopColor: T, paddingTop: 8, width: 150 },
    sigName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    sigDesig: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
    qrBox: { width: 44, height: 44, background: "#F5F3FF", borderWidth: 2, borderColor: T, borderRadius: 6, alignItems: "center", justifyContent: "center" },
    verifId: { position: "absolute", bottom: 20, left: 60, fontSize: 8, color: "#D1D5DB" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>CERTIFICATE</Text>
          <Text style={styles.subtitle}>of Internship Completion</Text>
        </View>
        <View style={styles.content}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.certify}>This is to certify that</Text>
          <Text style={styles.name}>{form.internName || "Intern Name"}</Text>
          <Text style={styles.body}>has successfully completed an internship as <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.role || "Intern"}</Text>{form.department ? ` in ${form.department}` : ""} at <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.orgName || "Organisation Name"}</Text> from {start} to {end}. During the internship, the candidate demonstrated {perfText}.</Text>
          {form.projectName && <Text style={styles.projectName}>Project: {form.projectName}</Text>}
          <View style={styles.sigRow}>
            {form.enableQR && (
              <View style={{ alignItems: "center" }}>
                <View style={styles.qrBox}><Text style={{ fontSize: 8, color: T, fontFamily: "Helvetica-Bold" }}>V</Text></View>
                <Text style={{ fontSize: 7, color: T, marginTop: 4 }}>Verified</Text>
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
        </View>
        {form.enableQR && <Text style={styles.verifId}>Verification ID: {form.verificationId} | Date: {form.issueDate}</Text>}
      </Page>
    </Document>
  );
}
