"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function JobOfferModernTemplate({ form }) {
  const T = form.templateColor || "#6366F1";
  
  const ctc = parseFloat(form.ctcAmount) || 0;
  const monthly = ctc / 12;
  const basic = (monthly * (parseFloat(form.basicPercent) || 40)) / 100;
  const hra = (monthly * (parseFloat(form.hra) || 20)) / 100;
  const other = monthly - basic - hra;

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, flexDirection: "row", backgroundColor: "#ffffff" },
    sidebar: { width: 140, backgroundColor: T, height: "100%", padding: "24 16", color: "#ffffff" },
    sideLogo: { height: 36, objectFit: "contain", filter: "brightness(0) invert(1)", marginBottom: 20 },
    
    sideGroup: { marginBottom: 20 },
    sideLabel: { fontSize: 9, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 2 },
    sideVal: { fontSize: 10, color: "#ffffff" },
    sideCompName: { fontSize: 12, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff" },
    
    sideTitle: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 800, textTransform: "uppercase", marginTop: "auto", marginBottom: 0 },
    
    main: { flex: 1, padding: "40 40 40 40" },
    body: { flex: 1 },
    candName: { fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 2 },
    candAddr: { fontSize: 11, color: "#6B7280", marginBottom: 16 },
    salutation: { fontSize: 12, color: "#374151", marginBottom: 12 },
    content: { fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 12 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontWeight: 700, color: T },
    
    table: { marginTop: 12, marginBottom: 16 },
    tableRow: { flexDirection: "row", padding: "6 0" },
    tableLabel: { width: "40%", fontWeight: 600, color: "#6B7280", fontSize: 11 },
    tableVal: { width: "60%", color: T, fontWeight: 600, fontSize: 11 },
    
    ctcBox: { marginTop: 16, padding: "12 16", backgroundColor: "#F0FDFA", border: `1px solid ${T}`, borderRadius: 8 },
    ctcTitle: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "#9CA3AF", marginBottom: 8, fontFamily: "Space Grotesk" },
    ctcHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, borderBottom: "1px solid #D1FAF0", paddingBottom: 8 },
    ctcMainLabel: { fontSize: 12, color: "#6B7280" },
    ctcMainVal: { fontSize: 14, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    ctcGrid: { flexDirection: "row", justifyContent: "space-between", paddingTop: 8 },
    ctcItem: { width: "23%" },
    itemLabel: { fontSize: 10, color: "#9CA3AF", marginBottom: 2 },
    itemVal: { fontSize: 12, fontWeight: 600, color: "#111827", fontFamily: "Space Grotesk" },
    
    termsTitle: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "#9CA3AF", marginBottom: 6, marginTop: 12, fontFamily: "Space Grotesk" },
    
    signatureArea: { marginTop: 32, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    sigBlock: { width: 140 },
    signatureImage: { maxHeight: 40, maxWidth: 120, marginBottom: 4, objectFit: "contain" },
    sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 6 },
    sigName: { fontSize: 12, fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk" },
    sigDesig: { fontSize: 11, color: "#6B7280", marginTop: 2 },
    sigComp: { fontSize: 11, color: "#9CA3AF", marginTop: 2, minHeight: 14 },
    
    footer: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footerText: { fontSize: 10, color: "#D1D5DB" }
  });

  return (
    <Document title={`Offer-Letter-${form.candidateName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          {form.logo && <Image src={form.logo} style={styles.sideLogo} />}
          
          <View style={styles.sideGroup}>
            <Text style={styles.sideLabel}>Company</Text>
            <Text style={styles.sideCompName}>{form.companyName || "Company Name"}</Text>
            {form.companyAddress && <Text style={[styles.sideVal, { fontSize: 9, marginTop: 2, color: "rgba(255,255,255,0.7)" }]}>{form.companyAddress}</Text>}
          </View>
          
          <View style={styles.sideGroup}>
            <Text style={styles.sideLabel}>Ref</Text>
            <Text style={styles.sideVal}>{form.letterNumber}</Text>
          </View>
          
          <View style={styles.sideGroup}>
            <Text style={styles.sideLabel}>Date</Text>
            <Text style={styles.sideVal}>{form.letterDate}</Text>
          </View>
          
          <View style={{ marginTop: "auto" }}>
            <Text style={styles.sideTitle}>OFFER</Text>
            <Text style={styles.sideTitle}>LETTER</Text>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.body}>
            <Text style={styles.candName}>{form.candidateName || "Candidate Name"}</Text>
            {form.candidateAddress && <Text style={styles.candAddr}>{form.candidateAddress}</Text>}
            
            <Text style={styles.salutation}>Dear {form.candidateName ? form.candidateName.split(" ")[0] : "Candidate"},</Text>
            
            <Text style={styles.content}>
              {"We are pleased to offer you the position of "}
              <Text style={styles.bold}>{form.designation || "[Designation]"}</Text>
              {form.department ? ` in the ${form.department} department` : ""}
              {form.companyName ? ` at ${form.companyName}` : ""}.
              {" Your employment type will be "}
              <Text style={styles.bold}>{form.employmentType}</Text>
              {form.reportingTo ? ` and you will be reporting to ${form.reportingTo}` : ""}.
            </Text>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Date of Joining</Text>
                <Text style={styles.tableVal}>{form.dateOfJoining || "—"}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Employment Type</Text>
                <Text style={[styles.tableVal, { color: "#111827" }]}>{form.employmentType}</Text>
              </View>
              {form.probationPeriod && (
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Probation Period</Text>
                  <Text style={[styles.tableVal, { color: "#111827" }]}>{form.probationPeriod} months</Text>
                </View>
              )}
              <View style={styles.tableRow}>
                <Text style={styles.tableLabel}>Working Hours</Text>
                <Text style={[styles.tableVal, { color: "#111827" }]}>{form.workingHours} hours/day, {form.workingDays} days/week</Text>
              </View>
            </View>

            {ctc > 0 && (
              <View style={styles.ctcBox} wrap={false}>
                <Text style={styles.ctcTitle}>Compensation (Annual CTC)</Text>
                <View style={styles.ctcHead}>
                  <Text style={styles.ctcMainLabel}>Annual CTC</Text>
                  <Text style={styles.ctcMainVal}>Rs.{ctc.toLocaleString("en-IN")}</Text>
                </View>
                <View style={styles.ctcGrid}>
                  <View style={styles.ctcItem}>
                    <Text style={styles.itemLabel}>Basic/mo</Text>
                    <Text style={styles.itemVal}>Rs.{Math.round(basic).toLocaleString("en-IN")}</Text>
                  </View>
                  <View style={styles.ctcItem}>
                    <Text style={styles.itemLabel}>HRA/mo</Text>
                    <Text style={styles.itemVal}>Rs.{Math.round(hra).toLocaleString("en-IN")}</Text>
                  </View>
                  <View style={styles.ctcItem}>
                    <Text style={styles.itemLabel}>Other/mo</Text>
                    <Text style={styles.itemVal}>Rs.{Math.round(other).toLocaleString("en-IN")}</Text>
                  </View>
                  <View style={styles.ctcItem}>
                    <Text style={styles.itemLabel}>Total/mo</Text>
                    <Text style={styles.itemVal}>Rs.{Math.round(monthly).toLocaleString("en-IN")}</Text>
                  </View>
                </View>
              </View>
            )}

            {form.additionalTerms && (
              <View style={{ marginTop: 12 }}>
                  <Text style={styles.termsTitle}>Additional Terms</Text>
                  <Text style={[styles.content, { fontSize: 12, lineHeight: 1.7, margin: 0 }]}>{form.additionalTerms}</Text>
              </View>
            )}

            <Text style={[styles.content, { marginTop: 16 }]}>
              {form.acceptanceDeadline ? `Please confirm your acceptance of this offer by ${form.acceptanceDeadline}. ` : "Please confirm your acceptance of this offer at the earliest. "}
              We look forward to having you on our team.
            </Text>

            <View style={styles.signatureArea} wrap={false}>
              <View style={styles.sigBlock}>
                {form.signature ? (
                  <Image src={form.signature} style={styles.signatureImage} />
                ) : (
                  <View style={{ height: 36 }} />
                )}
                <View style={styles.sigLine}>
                  <Text style={styles.sigName}>{form.signatoryName || "HR Manager"}</Text>
                  <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                  <Text style={styles.sigComp}>{form.companyName}</Text>
                </View>
              </View>
              <View style={[styles.sigBlock, { textAlign: "right" }]}>
                <View style={{ height: 36 }} />
                <View style={[styles.sigLine, { textAlign: "right" }]}>
                  <Text style={styles.sigName}>{form.candidateName || "Candidate"}</Text>
                  <Text style={styles.sigDesig}>Candidate Signature</Text>
                  <Text style={styles.sigComp}></Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer} wrap={false}>
            <Text style={styles.footerText}>Generated by DocMinty.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
