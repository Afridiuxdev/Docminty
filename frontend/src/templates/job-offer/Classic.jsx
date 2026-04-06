"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function JobOfferClassicTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  
  const ctc = parseFloat(form.ctcAmount) || 0;
  const monthly = ctc / 12;
  const basic = (monthly * (parseFloat(form.basicPercent) || 40)) / 100;
  const hra = (monthly * (parseFloat(form.hra) || 20)) / 100;
  const other = monthly - basic - hra;

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "40 60", backgroundColor: "#ffffff" },
    header: { borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 16, marginBottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    logo: { height: 40, objectFit: "contain", marginBottom: 8 },
    title: { fontSize: 22, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1 },
    compName: { fontSize: 14, fontWeight: 700, color: "#111827" },
    compInfo: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    
    dateRef: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24, fontSize: 9, color: "#9CA3AF" },
    
    candidateSection: { marginBottom: 24 },
    candidateName: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 4 },
    candidateAddr: { fontSize: 10, color: "#6B7280", maxWidth: 300, lineHeight: 1.4 },
    
    body: { lineHeight: 1.6, textAlign: "justify" },
    salutation: { fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 12 },
    paragraph: { marginBottom: 10 },
    bold: { fontWeight: 700, color: "#111827" },
    
    table: { marginTop: 12, marginBottom: 16, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
    tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "6 0" },
    tableLabel: { width: "40%", fontWeight: 700, color: "#6B7280" },
    tableVal: { width: "60%", color: "#111827" },
    
    ctcBox: { marginTop: 16, padding: 12, backgroundColor: "#F0FDFA", borderAround: `1px solid ${T}`, borderRadius: 8 },
    ctcTitle: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#9CA3AF", marginBottom: 8 },
    ctcRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    ctcMain: { fontSize: 14, fontWeight: 700, color: T },
    ctcGrid: { borderTopWidth: 1, borderTopColor: "#D1FAF0", paddingTop: 8, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    ctcItem: { width: "24%", marginBottom: 4 },
    ctcLabel: { fontSize: 8, color: "#9CA3AF", marginBottom: 2 },
    ctcVal: { fontSize: 10, fontWeight: 700, color: "#111827" },
    
    signatureArea: { marginTop: 32, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 8, width: 160 },
    sigName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    sigDesig: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 60, right: 60, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Job-Offer-${form.candidateName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {form.logo && <Image src={form.logo} style={styles.logo} />}
            <Text style={styles.compName}>{form.companyName || "Organization Name"}</Text>
            {form.companyAddress && <Text style={styles.compInfo}>{form.companyAddress}</Text>}
            {(form.companyPhone || form.companyEmail) && (
                <Text style={styles.compInfo}>
                    {form.companyPhone && `Ph: ${form.companyPhone} `}
                    {form.companyEmail && `| Em: ${form.companyEmail}`}
                </Text>
            )}
          </View>
          <Text style={styles.title}>Offer Letter</Text>
        </View>

        <View style={styles.dateRef}>
          <Text>Ref: {form.letterNumber}</Text>
          <Text>Date: {form.letterDate}</Text>
        </View>

        <View style={styles.candidateSection}>
          <Text style={styles.candidateName}>{form.candidateName || "Candidate Name"}</Text>
          <Text style={styles.candidateAddr}>{form.candidateAddress}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.salutation}>Dear {form.candidateName ? form.candidateName.split(" ")[0] : "Candidate"},</Text>
          
          <Text style={styles.paragraph}>
            {"We are pleased to offer you the position of "}
            <Text style={styles.bold}>{form.designation || "[Designation]"}</Text>
            {form.department ? ` in the ${form.department} department` : ""}
            {form.companyName ? ` at ${form.companyName}` : ""}.
            {" Your specific terms of employment are outlined below:"}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Date of Joining</Text>
              <Text style={[styles.tableVal, { color: T, fontWeight: 700 }]}>{form.dateOfJoining || "To be confirmed"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Employment Type</Text>
              <Text style={styles.tableVal}>{form.employmentType}</Text>
            </View>
            {form.probationPeriod && (
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Probation Period</Text>
                <Text style={styles.tableVal}>{form.probationPeriod} months</Text>
              </View>
            )}
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Working Setup</Text>
              <Text style={styles.tableVal}>{form.workingHours} hrs/day, {form.workingDays} days/week</Text>
            </View>
            {form.reportingTo && (
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Reporting To</Text>
                <Text style={styles.tableVal}>{form.reportingTo}</Text>
              </View>
            )}
          </View>

          {ctc > 0 && (
            <View style={styles.ctcBox}>
              <Text style={styles.ctcTitle}>Annual Compensation (CTC)</Text>
              <View style={styles.ctcRow}>
                <Text style={{ fontSize: 11, color: "#6B7280" }}>Total Annual Package</Text>
                <Text style={styles.ctcMain}>Rs. {ctc.toLocaleString("en-IN")}</Text>
              </View>
              <View style={styles.ctcGrid}>
                <View style={styles.ctcItem}>
                  <Text style={styles.ctcLabel}>Basic/mo</Text>
                  <Text style={styles.ctcVal}>Rs. {Math.round(basic).toLocaleString("en-IN")}</Text>
                </View>
                <View style={styles.ctcItem}>
                  <Text style={styles.ctcLabel}>HRA/mo</Text>
                  <Text style={styles.ctcVal}>Rs. {Math.round(hra).toLocaleString("en-IN")}</Text>
                </View>
                <View style={styles.ctcItem}>
                  <Text style={styles.ctcLabel}>Other/mo</Text>
                  <Text style={styles.ctcVal}>Rs. {Math.round(other).toLocaleString("en-IN")}</Text>
                </View>
                <View style={styles.ctcItem}>
                  <Text style={styles.ctcLabel}>Total/mo</Text>
                  <Text style={styles.ctcVal}>Rs. {Math.round(monthly).toLocaleString("en-IN")}</Text>
                </View>
              </View>
            </View>
          )}

          {form.additionalTerms && (
            <View style={{ marginTop: 12 }}>
                <Text style={[styles.ctcTitle, { marginBottom: 4 }]}>Additional Terms</Text>
                <Text style={[styles.paragraph, { fontSize: 10, lineHeight: 1.5 }]}>{form.additionalTerms}</Text>
            </View>
          )}

          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            {form.acceptanceDeadline ? `Please confirm your acceptance of this offer by ${form.acceptanceDeadline}. ` : "Please confirm your acceptance of this offer at the earliest. "}
            We look forward to having you on our team.
          </Text>
        </View>

        <View style={styles.signatureArea}>
          <View>
            {form.signature ? (
              <Image src={form.signature} style={{ height: 40, width: 120, objectFit: "contain", marginBottom: 4 }} />
            ) : (
              <View style={{ height: 40 }} />
            )}
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{form.signatoryName || "Authorized Signatory"}</Text>
              <Text style={styles.sigDesig}>{form.signatoryDesignation || "HR Manager"}</Text>
              <Text style={styles.sigDesig}>{form.companyName || ""}</Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View style={{ height: 40 }} />
            <View style={[styles.sigLine, { textAlign: "right" }]}>
              <Text style={styles.sigName}>{form.candidateName || "Candidate"}</Text>
              <Text style={styles.sigDesig}>Candidate Signature</Text>
              <Text style={styles.sigDesig}>Date: ________________</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Digital Offer Release via DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
