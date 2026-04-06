"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function JobOfferMinimalTemplate({ form }) {
  const T = form.templateColor || "#111827";
  const ctc = parseFloat(form.ctcAmount) || 0;
  
  const fmt = (n) => {
    return Math.round(n).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
      useGrouping: true,
    });
  };

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "48 64", backgroundColor: "#ffffff" },
    top: { borderBottomWidth: 1.5, borderBottomColor: T, paddingBottom: 12, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    title: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1 },
    date: { fontSize: 10, color: "#9CA3AF" },
    
    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
    metaBox: { flex: 1 },
    metaLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    metaValue: { fontSize: 11, fontWeight: 700, color: "#111827" },
    metaSub: { fontSize: 9, color: "#6B7280", marginTop: 2, maxWidth: 180, lineHeight: 1.4 },
    
    salutation: { fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 16 },
    bodyText: { fontSize: 10.5, color: "#374151", lineHeight: 1.8, marginBottom: 16, textAlign: "justify" },
    bold: { fontWeight: 700, color: "#111827" },
    
    infoSection: { margin: "16 0", padding: "16", backgroundColor: "#F9FAFB", borderRadius: 4 },
    infoLine: { flexDirection: "row", marginBottom: 8 },
    infoLabel: { fontSize: 9, color: "#6B7280", width: 140 },
    infoValue: { fontSize: 10, fontWeight: 700, color: "#111827" },
    
    ctcRow: { flexDirection: "row", justifyContent: "space-between", padding: "12 0", borderTopWidth: 1, borderTopColor: "#E5E7EB", marginTop: 8 },
    ctcLabel: { fontSize: 11, fontWeight: 700, color: "#111827" },
    ctcVal: { fontSize: 11, fontWeight: 700, color: T },
    
    signatureSection: { marginTop: 48, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    sigBox: { width: 180 },
    signatureImage: { height: 35, marginBottom: 4, objectFit: "contain" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 8, marginTop: 12 },
    sigName: { fontSize: 10, fontWeight: 700, color: "#111827" },
    sigDesig: { fontSize: 8, color: "#9CA3AF", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 64, right: 64, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Job-Offer-Minimal-${form.candidateName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.top}>
          <Text style={styles.title}>Letter of Offer</Text>
          <Text style={styles.date}>{form.letterDate}</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Candidate</Text>
            <Text style={styles.metaValue}>{form.candidateName || "Candidate Name"}</Text>
            {form.candidateAddress && <Text style={styles.metaSub}>{form.candidateAddress}</Text>}
          </View>
          <View style={[styles.metaBox, { textAlign: "right", alignItems: "flex-end" }]}>
            <Text style={styles.metaLabel}>Organization</Text>
            <Text style={styles.metaValue}>{form.companyName || "Organization Name"}</Text>
            <View style={{ textAlign: "right" }}>
                <Text style={styles.metaSub}>Ref: {form.letterNumber}</Text>
                {form.companyAddress && <Text style={styles.metaSub}>{form.companyAddress}</Text>}
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.salutation}>Dear {form.candidateName ? form.candidateName.split(" ")[0] : "Candidate"},</Text>
          
          <Text style={styles.bodyText}>
            {"We are pleased to offer you the position of "}
            <Text style={styles.bold}>{form.designation || "[Designation]"}</Text> 
            {form.department ? " in the " + form.department + " department" : ""}
            {" at "}
            <Text style={styles.bold}>{form.companyName || "[Company]"}</Text>
            {". Your skills and background are a great match for our current needs."}
          </Text>

          <View style={styles.infoSection}>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Joining Date</Text>
              <Text style={[styles.infoValue, { color: T }]}>{form.dateOfJoining || "To be confirmed"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Employment Type</Text>
              <Text style={styles.infoValue}>{form.employmentType || "Regular"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Probation Period</Text>
              <Text style={styles.infoValue}>{form.probationPeriod || "0"} Months</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Working Schedule</Text>
              <Text style={styles.infoValue}>{form.workingHours} hrs/day, {form.workingDays} days/week</Text>
            </View>
            {form.reportingTo && (
                <View style={styles.infoLine}>
                    <Text style={styles.infoLabel}>Reporting To</Text>
                    <Text style={styles.infoValue}>{form.reportingTo}</Text>
                </View>
            )}
            
            {ctc > 0 && (
              <View style={styles.ctcRow}>
                <Text style={styles.ctcLabel}>Annual CTC</Text>
                <Text style={styles.ctcVal}>INR {fmt(ctc)}</Text>
              </View>
            )}
          </View>

          {form.additionalTerms && (
            <View style={{ marginBottom: 12 }}>
                <Text style={[styles.metaLabel, { color: "#6B7280", marginBottom: 4 }]}>Additional Terms</Text>
                <Text style={[styles.bodyText, { fontSize: 9.5, marginTop: 0 }]}>{form.additionalTerms}</Text>
            </View>
          )}

          <Text style={styles.bodyText}>
            {form.acceptanceDeadline ? `We would like to have your confirmation by ${form.acceptanceDeadline}. ` : "We would like to have your confirmation at the earliest. "}
            We look forward to welcome you on board.
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.sigBox}>
            {form.signature ? (
              <Image src={form.signature} style={styles.signatureImage} />
            ) : (
              <View style={{ height: 35 }} />
            )}
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{form.signatoryName || "Authorized Official"}</Text>
              <Text style={styles.sigDesig}>{form.signatoryDesignation || "HR Manager"}</Text>
            </View>
          </View>
          <View style={styles.sigBox}>
            <View style={{ height: 35 }} />
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{form.candidateName || "Candidate Name"}</Text>
              <Text style={styles.sigDesig}>Signature & Date</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Digital Release via DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
