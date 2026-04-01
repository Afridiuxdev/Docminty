"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
  excellent: "exceptional commitment, creativity, and technical skills",
  good: "good work ethic and contributed meaningfully to the team",
  satisfactory: "performed their assigned duties satisfactorily",
};

export default function InternshipMinimalTemplate({ form }) {
  const T = form.templateColor || "#111827";
  const perfText = PERF_TEXT[form.performance] || PERF_TEXT.good;
  const start = form.startDate ? new Date(form.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Start Date";
  const end = form.endDate ? new Date(form.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "End Date";

  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: "60 80" },
    borderTop: { height: 4, background: T, marginBottom: 40 },
    logo: { height: 35, objectFit: "contain", marginBottom: 20 },
    certTitle: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 },
    orgName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 30 },
    mainText: { fontSize: 11, color: "#374151", lineHeight: 1.8, marginBottom: 24 },
    internName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: T },
    project: { fontSize: 9, color: "#6B7280", fontStyle: "italic", marginBottom: 30 },
    sigRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 40 },
    sigImg: { height: 30, marginBottom: 5, objectFit: "contain" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#111827", paddingTop: 5, width: 140 },
    sigName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" },
    sigDesig: { fontSize: 8, color: "#9CA3AF", marginTop: 2 },
    qrBox: { width: 35, height: 35, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 4, alignItems: "center", justifyContent: "center" },
    verifId: { position: "absolute", bottom: 40, left: 80, fontSize: 7, color: "#D1D5DB", fontFamily: "Courier" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.borderTop} />
        {form.logo && <Image src={form.logo} style={styles.logo} />}
        <Text style={styles.certTitle}>Certificate of Internship</Text>
        <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
        <Text style={styles.mainText}>
          This is to certify that <Text style={styles.internName}>{form.internName || "Intern Name"}</Text> has successfully completed an internship as <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.role || "Intern"}</Text>{form.department ? ` in ${form.department}` : ""} from {start} to {end}.
        </Text>
        <Text style={styles.mainText}>During the internship, the candidate demonstrated {perfText}.</Text>
        {form.projectName && <Text style={styles.project}>Project: {form.projectName}</Text>}
        <Text style={{ fontSize: 9, color: "#9CA3AF" }}>Date: {form.issueDate}</Text>
        <View style={styles.sigRow}>
          <View>
            {form.signature && <Image src={form.signature} style={styles.sigImg} />}
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{form.signatoryName || "Signatory"}</Text>
              <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
            </View>
          </View>
          {form.enableQR && (
            <View style={{ alignItems: "center" }}>
              <View style={styles.qrBox}>
                {form.qrCodeDataUrl ? (
                  <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%", padding: 2 }} />
                ) : (
                  <Text style={{ fontSize: 6, color: "#9CA3AF" }}>VERIFY</Text>
                )}
              </View>
              <Text style={{ fontSize: 6, color: "#D1D5DB", marginTop: 4 }}>QR Verified</Text>
            </View>
          )}
        </View>
        {form.enableQR && <Text style={styles.verifId}>Verification ID: {form.verificationId}</Text>}
      </Page>
    </Document>
  );
}
