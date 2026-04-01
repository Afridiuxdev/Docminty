"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function JobOfferClassicTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  
  const ctc = parseFloat(form.ctcAmount) || 0;
  const monthly = ctc / 12;
  const basic = monthly * (parseFloat(form.basicPercent) || 40) / 100;
  const hra = monthly * (parseFloat(form.hraPercent) || 20) / 100;
  const other = monthly - basic - hra;
  const fmt = (n) => Math.round(n).toLocaleString("en-IN");

  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 40 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 14, marginBottom: 16 },
    logo: { width: 55, height: 38, objectFit: "contain", marginBottom: 5 },
    fromName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827" },
    small: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: T, textAlign: "right" },
    ref: { fontSize: 10, color: "#6B7280", textAlign: "right", marginTop: 3 },
    dateText: { fontSize: 9, color: "#9CA3AF", textAlign: "right", marginTop: 2 },
    body: { fontSize: 10, color: "#374151", lineHeight: 1.8, marginBottom: 12 },
    tableRow: { flexDirection: "row", padding: "6 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    tLabel: { flex: 1, fontSize: 9, color: "#6B7280" },
    tValue: { flex: 2, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
    ctcBox: { backgroundColor: "#F0FDFA", borderWidth: 1, borderColor: T, borderRadius: 6, padding: "10 14", marginTop: 12, marginBottom: 12 },
    ctcTitle: { fontSize: 9, color: "#065F46", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "Helvetica-Bold" },
    ctcMain: { fontSize: 16, fontFamily: "Helvetica-Bold", color: T, marginBottom: 6 },
    ctcGrid: { flexDirection: "row", gap: 12 },
    ctcItem: { flex: 1 },
    ctcKey: { fontSize: 8, color: "#9CA3AF", marginBottom: 2 },
    ctcVal: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" },
    sigRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 32 },
    sigImg: { height: 35, marginBottom: 5, objectFit: "contain" },
    sigBox: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 5, width: 140 },
    sigName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" },
    sigDesig: { fontSize: 8, color: "#6B7280", marginTop: 2 },
    footer: { marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footerG: { fontSize: 8, color: "#D1D5DB" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.fromName}>{form.companyName || "Company Name"}</Text>
            {form.companyAddress && <Text style={styles.small}>{form.companyAddress}</Text>}
          </View>
          <View>
            <Text style={styles.title}>OFFER LETTER</Text>
            <Text style={styles.ref}>Ref: {form.letterNumber}</Text>
            <Text style={styles.dateText}>Date: {form.letterDate}</Text>
          </View>
        </View>
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#374151", marginBottom: 2 }}>{form.candidateName || "Candidate Name"}</Text>
          {form.candidateAddress && <Text style={{ fontSize: 9, color: "#6B7280" }}>{form.candidateAddress}</Text>}
        </View>
        <Text style={styles.body}>Dear {form.candidateName ? form.candidateName.split(" ")[0] : "Candidate"},</Text>
        <Text style={styles.body}>
          We are pleased to offer you the position of <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.designation || "[Designation]"}</Text> 
          {form.department ? " in the " + form.department + " department" : ""} at <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.companyName || "[Company]"}</Text>.
        </Text>
        <View style={{ marginBottom: 12 }}>
          <View style={styles.tableRow}><Text style={styles.tLabel}>Date of Joining</Text><Text style={[styles.tValue, { color: T }]}>{form.dateOfJoining || "To be confirmed"}</Text></View>
          <View style={styles.tableRow}><Text style={styles.tLabel}>Employment Type</Text><Text style={styles.tValue}>{form.employmentType}</Text></View>
          <View style={styles.tableRow}><Text style={styles.tLabel}>Probation Period</Text><Text style={styles.tValue}>{form.probationPeriod || "None"} Months</Text></View>
        </View>
        {ctc > 0 && (
          <View style={styles.ctcBox}>
            <Text style={styles.ctcTitle}>Compensation (Annual CTC)</Text>
            <Text style={styles.ctcMain}>{"Rs. " + fmt(ctc)}</Text>
            <View style={styles.ctcGrid}>
              <View style={styles.ctcItem}><Text style={styles.ctcKey}>Basic/mo</Text><Text style={styles.ctcVal}>{"Rs. " + fmt(basic)}</Text></View>
              <View style={styles.ctcItem}><Text style={styles.ctcKey}>HRA/mo</Text><Text style={styles.ctcVal}>{"Rs. " + fmt(hra)}</Text></View>
              <View style={styles.ctcItem}><Text style={styles.ctcKey}>Other/mo</Text><Text style={styles.ctcVal}>{"Rs. " + fmt(other)}</Text></View>
            </View>
          </View>
        )}
        {form.additionalTerms && <Text style={styles.body}>{form.additionalTerms}</Text>}
        <Text style={styles.body}>Please confirm your acceptance of this offer by {form.acceptanceDeadline || "the earliest"}. We look forward to having you on our team.</Text>
        <View style={styles.sigRow}>
          <View>
            {form.signature && <Image src={form.signature} style={styles.sigImg} />}
            <View style={styles.sigBox}>
              <Text style={styles.sigName}>{form.signatoryName || "HR Manager"}</Text>
              <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
            </View>
          </View>
          <View style={styles.sigBox}>
            <Text style={styles.sigName}>{form.candidateName || "Candidate"}</Text>
            <Text style={styles.sigDesig}>Candidate Signature</Text>
          </View>
        </View>
        <View style={styles.footer}><Text style={styles.footerG}>Generated by DocMinty.com</Text></View>
      </Page>
    </Document>
  );
}
