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
    sidebar: { width: 140, backgroundColor: T, height: "100%", padding: "40 16", color: "#ffffff" },
    logo: { width: 45, objectFit: "contain", marginBottom: 24, filter: "brightness(0) invert(1)" },
    sideTitle: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginBottom: 40 },
    sideItem: { marginBottom: 24 },
    sideLabel: { fontSize: 8, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    sideValue: { fontSize: 11, fontWeight: 700, color: "#ffffff", lineHeight: 1.4 },
    
    main: { flex: 1, padding: "50 40 40 40" },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    dateRef: { textAlign: "right" },
    metaText: { fontSize: 9, color: "#9CA3AF", marginBottom: 4 },
    
    candidateSection: { marginBottom: 32 },
    candidateName: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827" },
    candidateAddr: { fontSize: 10, color: "#6B7280", marginTop: 4, maxWidth: 300, lineHeight: 1.4 },
    
    body: { fontSize: 11, color: "#374151", lineHeight: 1.8, textAlign: "justify" },
    salutation: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 20 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontWeight: 700, color: T },
    
    infoGrid: { marginTop: 24, marginBottom: 24, flexDirection: "row", flexWrap: "wrap", borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 16 },
    infoItem: { width: "33.33%", marginBottom: 16 },
    infoLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    infoVal: { fontSize: 11, fontWeight: 700, color: "#111827" },
    
    ctcBox: { backgroundColor: "#F9FAFB", padding: "20 24", borderRadius: 12, borderLeftWidth: 4, borderLeftColor: T, margin: "24 0" },
    ctcTitle: { fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
    ctcVal: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: T },
    
    ctcTable: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#E5E7EB", marginTop: 12, paddingTop: 10 },
    ctcTableItem: { width: "24%" },
    ctcTableLabel: { fontSize: 8, color: "#9CA3AF", marginBottom: 2 },
    ctcTableVal: { fontSize: 10, fontWeight: 700, color: "#374151" },
    
    signatureSection: { marginTop: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    signatureImage: { height: 40, marginBottom: 4, objectFit: "contain" },
    signatureLine: { borderTopWidth: 2, borderTopColor: "#111827", paddingTop: 8, width: 160 },
    signatoryName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    signatoryDetails: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 40, right: 40, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Job-Offer-${form.candidateName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.sideTitle}>OFFER LETTER</Text>
          
          <View style={styles.sideItem}>
            <Text style={styles.sideLabel}>Company</Text>
            <Text style={styles.sideValue}>{form.companyName || "Organization"}</Text>
            {form.companyAddress && <Text style={{ fontSize: 9, opacity: 0.8, marginTop: 4 }}>{form.companyAddress}</Text>}
            {form.companyWebsite && <Text style={{ fontSize: 9, opacity: 0.8, marginTop: 4 }}>{form.companyWebsite}</Text>}
          </View>
          
          <View style={styles.sideItem}>
              <Text style={styles.sideLabel}>Ref No</Text>
              <Text style={styles.sideValue}>{form.letterNumber}</Text>
          </View>
          
          <View style={styles.sideItem}>
              <Text style={styles.sideLabel}>Dated</Text>
              <Text style={styles.sideValue}>{form.letterDate}</Text>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.header}>
            <View style={styles.candidateSection}>
               <Text style={styles.candidateName}>{form.candidateName || "Candidate Name"}</Text>
               <Text style={styles.candidateAddr}>{form.candidateAddress}</Text>
            </View>
            <View style={styles.dateRef}>
                <Text style={styles.metaText}>Ref: {form.letterNumber}</Text>
                <Text style={styles.metaText}>{form.letterDate}</Text>
            </View>
          </View>

          <View style={styles.body}>
            <Text style={styles.salutation}>Dear {form.candidateName ? form.candidateName.split(" ")[0] : "Candidate"},</Text>
            <Text>
                {"We are pleased to offer you the position of "}
                <Text style={styles.bold}>{form.designation || "[Designation]"}</Text> 
                {form.department ? ` in the ${form.department} department` : ""}
                {" at "}
                <Text style={styles.bold}>{form.companyName || "our organization"}</Text>
                {". We were impressed by your skills and believe you will be a great addition to our team."}
            </Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Joining Date</Text>
                <Text style={[styles.infoVal, { color: T }]}>{form.dateOfJoining || "TBC"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Employment</Text>
                <Text style={styles.infoVal}>{form.employmentType}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Probation</Text>
                <Text style={styles.infoVal}>{form.probationPeriod || "0"} mo</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Work Hours</Text>
                <Text style={styles.infoVal}>{form.workingHours} hrs/day</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Reporting To</Text>
                <Text style={styles.infoVal}>{form.reportingTo || "Manager"}</Text>
              </View>
            </View>

            {ctc > 0 && (
              <View style={styles.ctcBox}>
                <Text style={styles.ctcTitle}>Total Annual CTC Package</Text>
                <Text style={styles.ctcVal}>Rs. {ctc.toLocaleString("en-IN")}</Text>
                <View style={styles.ctcTable}>
                   <View style={styles.ctcTableItem}>
                      <Text style={styles.ctcTableLabel}>Basic /mo</Text>
                      <Text style={styles.ctcTableVal}>Rs. {Math.round(basic).toLocaleString("en-IN")}</Text>
                   </View>
                   <View style={styles.ctcTableItem}>
                      <Text style={styles.ctcTableLabel}>HRA /mo</Text>
                      <Text style={styles.ctcTableVal}>Rs. {Math.round(hra).toLocaleString("en-IN")}</Text>
                   </View>
                   <View style={styles.ctcTableItem}>
                      <Text style={styles.ctcTableLabel}>Gross /mo</Text>
                      <Text style={styles.ctcTableVal}>Rs. {Math.round(monthly).toLocaleString("en-IN")}</Text>
                   </View>
                </View>
              </View>
            )}

            {form.additionalTerms && (
                <View style={{ marginBottom: 12 }}>
                    <Text style={[styles.infoLabel, { marginBottom: 6 }]}>Special Terms & Conditions</Text>
                    <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{form.additionalTerms}</Text>
                </View>
            )}

            <Text style={{ marginTop: 8 }}>
                {form.acceptanceDeadline ? `Please confirm your acceptance of this offer by ${form.acceptanceDeadline}. ` : "Please confirm your acceptance of this offer at the earliest. "}
                We look forward to having you on our team.
            </Text>
          </View>

          <View style={styles.signatureSection}>
            <View>
              {form.signature ? (
                <Image src={form.signature} style={styles.signatureImage} />
              ) : (
                <View style={{ height: 40 }} />
              )}
              <View style={styles.signatureLine}>
                <Text style={styles.signatoryName}>{form.signatoryName || "Authorized Official"}</Text>
                <Text style={styles.signatoryDetails}>{form.signatoryDesignation || "HR Manager"}</Text>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View style={{ height: 40 }} />
              <View style={[styles.signatureLine, { textAlign: "right" }]}>
                <Text style={styles.signatoryName}>{form.candidateName || "Candidate"}</Text>
                <Text style={styles.signatoryDetails}>(Digitally Accepted)</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Certified Digital Employment Offer Release — DocMinty.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
