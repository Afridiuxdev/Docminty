"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function JobOfferCorporateTemplate({ form }) {
  const T = form.templateColor || "#1E3A5F";
  const ctc = parseFloat(form.ctcAmount) || 0;
  const monthly = ctc / 12;
  const basic = monthly * (parseFloat(form.basicPercent) || 40) / 100;
  const hra = monthly * (parseFloat(form.hraPercent) || 20) / 100;
  const other = monthly - basic - hra;
  const fmt = (n) => Math.round(n).toLocaleString("en-IN");

  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: "50 60" },
    header: { marginBottom: 30, textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 15 },
    orgName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: T, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
    docType: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 },
    dateRow: { marginTop: 24, marginBottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    dateText: { fontSize: 9, color: "#6B7280" },
    meta: { marginBottom: 20 },
    metaL: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
    metaV: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    metaS: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    bodyText: { fontSize: 10, color: "#374151", lineHeight: 1.8, marginBottom: 12, textAlign: "justify" },
    lastDay: { color: T, fontFamily: "Helvetica-Bold" },
    ctcBox: { borderTopWidth: 1, borderTopColor: "#E5E7EB", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", padding: "12 0", margin: "14 0" },
    ctcRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    ctcLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
    ctcVal: { fontSize: 9, fontFamily: "Helvetica-Bold", color: T },
    signRow: { marginTop: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    signImg: { height: 40, marginBottom: 5, objectFit: "contain" },
    signLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 6, width: 150 },
    signName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    signDesig: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
    footer: { position: "absolute", bottom: 40, left: 60, right: 60, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 10 },
    footerGen: { fontSize: 8, color: "#D1D5DB", textAlign: "center" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.orgName}>{form.companyName || "Company Name"}</Text>
          <Text style={styles.docType}>Offer of Employment</Text>
        </View>
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{"Reference: OFR-" + form.letterNumber}</Text>
          <Text style={styles.dateText}>{"Date: " + form.letterDate}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaL}>To</Text>
          <Text style={styles.metaV}>{form.candidateName || "Candidate Name"}</Text>
          <Text style={styles.metaS}>{form.candidateAddress || ""}</Text>
        </View>
        <Text style={styles.bodyText}>Dear {form.candidateName ? form.candidateName.split(" ")[0] : "Candidate"},</Text>
        <Text style={styles.bodyText}>
          We are pleased to offer you the position of <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.designation || "[Designation]"}</Text> 
          {form.department ? " in the " + form.department + " department" : ""} at <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.companyName || "[Company]"}</Text>.
        </Text>
        <Text style={styles.bodyText}>
          We are impressed with your background and skills, and we believe you will be a valuable addition to our team. 
          The terms of your employment are as follows:
        </Text>
        <View>
          <Text style={styles.bodyText}>- Date of Joining: <Text style={styles.lastDay}>{form.dateOfJoining || "TBD"}</Text></Text>
          <Text style={styles.bodyText}>- Employment Type: {form.employmentType}</Text>
          <Text style={styles.bodyText}>- Reporting to: {form.reportingTo || "Management"}</Text>
        </View>
        {ctc > 0 && (
          <View style={styles.ctcBox}>
            <View style={styles.ctcRow}><Text style={styles.ctcLabel}>Annual CTC</Text><Text style={[styles.ctcVal, { fontSize: 11 }]}>{"Rs. " + fmt(ctc)}</Text></View>
            <View style={styles.ctcRow}><Text style={{ fontSize: 8, color: "#9CA3AF" }}>Basic/mo</Text><Text style={{ fontSize: 8 }}>{"Rs. " + fmt(basic)}</Text></View>
            <View style={styles.ctcRow}><Text style={{ fontSize: 8, color: "#9CA3AF" }}>HRA/mo</Text><Text style={{ fontSize: 8 }}>{"Rs. " + fmt(hra)}</Text></View>
            <View style={styles.ctcRow}><Text style={{ fontSize: 8, color: "#9CA3AF" }}>Other/mo</Text><Text style={{ fontSize: 8 }}>{"Rs. " + fmt(other)}</Text></View>
          </View>
        )}
        {form.additionalTerms && <Text style={styles.bodyText}>{form.additionalTerms}</Text>}
        <Text style={styles.bodyText}>Please confirm your acceptance of this offer by {form.acceptanceDeadline || "the earliest"}.</Text>
        <View style={styles.signRow}>
          <View>
            {form.signature && <Image src={form.signature} style={styles.signImg} />}
            <View style={styles.signLine}>
              <Text style={styles.signName}>{form.signatoryName || "HR Manager"}</Text>
              <Text style={styles.signDesig}>{form.signatoryDesignation || ""}</Text>
            </View>
          </View>
          <View style={styles.signLine}><Text style={styles.signName}>Candidate Signature</Text></View>
        </View>
        <View style={styles.footer}><Text style={styles.footerGen}>Generated by DocMinty.com</Text></View>
      </Page>
    </Document>
  );
}
