"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const T = "#0D9488";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
    padding: 0,
  },
  outer: {
    margin: 20,
    borderWidth: 6,
    borderColor: "#F0F4F3",
    borderStyle: "solid",
  },
  inner: {
    borderWidth: 2,
    borderColor: T,
    borderStyle: "solid",
    margin: 8,
    padding: "28 36",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 35,
    objectFit: "contain",
    marginBottom: 8,
  },
  orgName: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 3,
  },
  orgAddr: {
    fontSize: 9,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: T,
    padding: "4 20",
    borderRadius: 2,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
  },
  certify: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: T,
    paddingBottom: 6,
    marginBottom: 10,
  },
  body: {
    fontSize: 10,
    color: "#374151",
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 360,
    marginBottom: 6,
  },
  project: {
    fontSize: 9,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 9,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 16,
  },
  sigRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 40,
  },
  sigLine: {
    borderTopWidth: 1.5,
    borderTopColor: "#374151",
    paddingTop: 4,
    width: 110,
    alignItems: "center",
    marginTop: 16,
  },
  sigName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "center",
  },
  sigDesig: {
    fontSize: 8,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 1,
  },
  qrBox: {
    width: 46,
    height: 46,
    backgroundColor: "#F0FDFA",
    borderWidth: 2,
    borderColor: T,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  qrLabel: {
    fontSize: 8,
    color: T,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  qrSub: {
    fontSize: 7,
    color: "#9CA3AF",
    marginTop: 3,
    textAlign: "center",
  },
  verifId: {
    fontSize: 7,
    color: "#D1D5DB",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "Courier",
  },
});

const PERF_TEXT = {
  excellent: "demonstrated exceptional commitment, creativity, and technical skills",
  good: "showed good work ethic and contributed meaningfully to the team",
  satisfactory: "performed their assigned duties satisfactorily",
};

export default function InternshipTemplate({ form }) {
  const start = form.startDate
    ? new Date(form.startDate).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    })
    : "Start Date";

  const end = form.endDate
    ? new Date(form.endDate).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    })
    : "End Date";

  const perfText = PERF_TEXT[form.performance] || PERF_TEXT.good;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outer}>
          <View style={styles.inner}>

            {/* Logo */}
            {form.logo && (
              <Image src={form.logo} style={styles.logo} />
            )}

            {/* Org name */}
            <Text style={styles.orgName}>
              {form.orgName || "Organisation Name"}
            </Text>
            {form.orgAddress && (
              <Text style={styles.orgAddr}>{form.orgAddress}</Text>
            )}

            {/* Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>INTERNSHIP CERTIFICATE</Text>
            </View>

            {/* Certify */}
            <Text style={styles.certify}>This is to certify that</Text>

            {/* Intern name */}
            <Text style={styles.name}>
              {form.internName || "Intern Name"}
            </Text>

            {/* Body */}
            <Text style={styles.body}>
              {"has successfully completed an internship as "}
              <Text style={{ fontFamily: "Helvetica-Bold", color: T }}>
                {form.role || "[Role]"}
              </Text>
              {form.department ? ` in ${form.department}` : ""}
              {` from ${start} to ${end} and ${perfText}.`}
            </Text>

            {/* Project */}
            {form.projectName && (
              <Text style={styles.project}>
                Project: {form.projectName}
              </Text>
            )}

            {/* Date */}
            <Text style={styles.dateText}>
              Issue Date: {form.issueDate}
            </Text>

            {/* Signatures */}
            <View style={styles.sigRow}>
              <View style={styles.sigLine}>
                <Text style={styles.sigName}>
                  {form.signatoryName || "Signatory"}
                </Text>
                <Text style={styles.sigDesig}>
                  {form.signatoryDesignation || "Designation"}
                </Text>
              </View>

              {form.enableQR && (
                <View style={{ alignItems: "center" }}>
                  <View style={styles.qrBox}>
                    <Text style={styles.qrLabel}>QR CODE</Text>
                  </View>
                  <Text style={styles.qrSub}>Scan to Verify</Text>
                </View>
              )}
            </View>

            {/* Verification ID */}
            {form.enableQR && (
              <Text style={styles.verifId}>
                ID: {form.verificationId}
              </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}