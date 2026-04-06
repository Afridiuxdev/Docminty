"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function JobOfferElegantTemplate({ form }) {
  const T = form.templateColor || "#D97706";
  const ctc = parseFloat(form.ctcAmount) || 0;
  
  const fmt = (n) => {
    return Math.round(n).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
      useGrouping: true,
    });
  };

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "60 80", backgroundColor: "#FFFDFA" },
    header: { marginBottom: 40, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)", paddingBottom: 24, alignItems: "flex-start" },
    title: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 700, color: T, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" },
    subtitle: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 3, fontFamily: "Space Grotesk" },
    
    dateLine: { fontSize: 9, color: "#9CA3AF", marginBottom: 32, textAlign: "right", fontFamily: "Inter" },
    
    recipient: { marginBottom: 32 },
    recipLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    recipName: { fontSize: 13, fontWeight: 700, color: "#111827" },
    recipAddr: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
    
    body: { fontSize: 11, color: "#374151", lineHeight: 2, marginBottom: 18, textAlign: "justify" },
    salutation: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 20 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontWeight: 700, color: T },
    
    ctcBox: { margin: "24 0", padding: "16 0", borderAroundWidth: 1, borderAroundColor: T, borderTopWidth: 1, borderTopColor: T, borderBottomWidth: 1, borderBottomColor: T },
    ctcLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    ctcVal: { fontSize: 24, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    sigSection: { marginTop: 48, flexDirection: "row", justifyContent: "space-between" },
    sigBox: { width: 180 },
    signatureImage: { height: 45, marginBottom: 4, objectFit: "contain" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: T, paddingTop: 8, marginTop: 12 },
    sigName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    sigDesig: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 80, right: 80, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center", fontStyle: "italic" },
    sidebarLine: { position: "absolute", left: 40, top: 60, bottom: 60, width: 2, backgroundColor: T }
  });

  return (
    <Document title={`Elegant-Offer-Letter-${form.candidateName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebarLine} />
        <View style={styles.header}>
          <Text style={styles.title}>OFFER LETTER</Text>
          <Text style={styles.subtitle}>{form.companyName || "Professional Employment Offer"}</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 32 }}>
            <View>
                {form.logo && <Image src={form.logo} style={{ height: 40, objectFit: "contain", marginBottom: 8 }} />}
                {form.companyAddress && <Text style={{ fontSize: 9, color: "#9CA3AF", maxWidth: 250 }}>{form.companyAddress}</Text>}
            </View>
            <View style={{ textAlign: "right" }}>
                <Text style={styles.dateLine}>REF: {form.letterNumber}</Text>
                <Text style={styles.dateLine}>DATE: {form.letterDate}</Text>
            </View>
        </View>

        <View style={styles.recipient}>
          <Text style={styles.recipLabel}>Presented To</Text>
          <Text style={styles.recipName}>{form.candidateName || "Candidate Name"}</Text>
          {form.candidateAddress && <Text style={styles.recipAddr}>{form.candidateAddress}</Text>}
        </View>

        <View>
          <Text style={styles.salutation}>Dear {form.candidateName ? form.candidateName.split(" ")[0] : "Candidate"},</Text>
          
          <Text style={styles.body}>
            {"It is with great pleasure that we extend this formal offer of employment for the position of "}
            <Text style={styles.accent}>{form.designation || "[Designation]"}</Text> 
            {form.department ? " in the " + form.department + " department" : ""}
            {" at "}
            <Text style={styles.bold}>{form.companyName || "[Company Name]"}</Text>
            {". We are truly excited about the prospect of you joining our organization."}
          </Text>

          <Text style={styles.body}>
            {"Your professional journey with us is scheduled to commence on "}
            <Text style={styles.bold}>{form.dateOfJoining || "the specified date"}</Text>
            {". Your employment status will be deemed as "}
            <Text style={styles.bold}>{form.employmentType || "Regular Full-Time"}</Text>
            {". You will be reporting to "}
            <Text style={styles.bold}>{form.reportingTo || "the designated manager"}</Text>
            {"."}
          </Text>

          {ctc > 0 && (
            <View style={styles.ctcBox}>
              <Text style={styles.ctcLabel}>Total Annual Compensation (Gross CTC)</Text>
              <Text style={styles.ctcVal}>INR {fmt(ctc)}</Text>
              <Text style={{ fontSize: 7, color: "#9CA3AF", marginTop: 4 }}>This compensation is inclusive of all base and variable components.</Text>
            </View>
          )}

          {form.additionalTerms && (
            <Text style={styles.body}>{form.additionalTerms}</Text>
          )}

          <Text style={[styles.body, { marginTop: 12 }]}>
            {form.acceptanceDeadline ? `We would appreciate it if you could confirm your acceptance of this offer by ${form.acceptanceDeadline}. ` : "We would appreciate it if you could confirm your acceptance of this offer at the earliest. "}
            We look forward to a successful and elegant professional career ahead.
          </Text>
        </View>

        <View style={styles.sigSection}>
          <View style={styles.sigBox}>
            {form.signature ? (
              <Image src={form.signature} style={styles.signatureImage} />
            ) : (
              <View style={{ height: 45 }} />
            )}
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{form.signatoryName || "Authorized Signatory"}</Text>
              <Text style={styles.sigDesig}>{form.signatoryDesignation || "HR Leadership"}</Text>
              <Text style={styles.sigDesig}>{form.companyName || ""}</Text>
            </View>
          </View>
          <View style={styles.sigBox}>
            <View style={{ height: 45 }} />
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{form.candidateName || "Candidate Name"}</Text>
              <Text style={styles.sigDesig}>Signature of Acceptance</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Secure Digital Document — DocMinty Elegant</Text>
        </View>
      </Page>
    </Document>
  );
}
