"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function JobOfferCorporateTemplate({ form }) {
  const T = form.templateColor || "#1E3A5F";
  const ctc = parseFloat(form.ctcAmount) || 0;
  const monthly = ctc / 12;
  const basic = monthly * (parseFloat(form.basicPercent) || 40) / 100;
  const hra = monthly * (parseFloat(form.hra) || 20) / 100;
  const other = monthly - basic - hra;
  
  const fmt = (n) => {
    return Math.round(n).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
      useGrouping: true,
    });
  };

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "50 70", backgroundColor: "#ffffff" },
    header: { marginBottom: 32, textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 20 },
    logo: { height: 40, objectFit: "contain", marginBottom: 12, margin: "0 auto" },
    orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
    docType: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, fontFamily: "Space Grotesk" },
    
    dateRow: { marginTop: 24, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 12 },
    metaText: { fontSize: 9, color: "#6B7280", fontWeight: 700 },
    
    recipient: { marginBottom: 32 },
    label: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    recipName: { fontSize: 13, fontWeight: 700, color: "#111827" },
    recipAddr: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4, maxWidth: 300 },
    
    body: { fontSize: 11, color: "#374151", lineHeight: 1.8, marginBottom: 20, textAlign: "justify" },
    salutation: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 24 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontWeight: 700, color: T },
    
    detailsBox: { marginBottom: 24, padding: "16 0", borderTopWidth: 1, borderTopColor: "#F3F4F6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    detailLine: { flexDirection: "row", marginBottom: 8 },
    detailLabel: { width: 140, fontSize: 9, color: "#6B7280", textTransform: "uppercase" },
    detailValue: { flex: 1, fontSize: 10, fontWeight: 700, color: "#111827" },
    
    ctcBox: { backgroundColor: "#F8FAFD", padding: "20 24", borderRadius: 8, margin: "8 0 24 0", borderLeftWidth: 4, borderLeftColor: T },
    ctcRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    ctcHeader: { fontSize: 10, fontWeight: 700, color: T, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 },
    ctcLabel: { fontSize: 9, color: "#6B7280" },
    ctcVal: { fontSize: 10, fontWeight: 700, color: "#111827" },
    totalLabel: { fontSize: 11, fontWeight: 700, color: "#111827" },
    totalVal: { fontSize: 14, fontWeight: 700, color: T },
    
    sigSection: { marginTop: 48, flexDirection: "row", justifyContent: "space-between" },
    sigBox: { width: 180 },
    signatureImage: { height: 40, marginBottom: 4, objectFit: "contain" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 8, marginTop: 12 },
    sigName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    sigDesig: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 70, right: 70, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Corporate-Offer-${form.candidateName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {form.logo && <Image src={form.logo} style={styles.logo} />}
          <Text style={styles.orgName}>{form.companyName || "Organization Name"}</Text>
          <Text style={styles.docType}>Official Letter of Engagement</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <View>
                {form.companyAddress && <Text style={{ fontSize: 9, color: "#6B7280", maxWidth: 250 }}>{form.companyAddress}</Text>}
                {(form.companyPhone || form.companyEmail) && (
                    <Text style={{ fontSize: 9, color: "#6B7280" }}>
                        {form.companyPhone && `Ph: ${form.companyPhone} `}
                        {form.companyEmail && `| Em: ${form.companyEmail}`}
                    </Text>
                )}
            </View>
            <View style={{ textAlign: "right" }}>
                <Text style={styles.metaText}>Ref: {form.letterNumber}</Text>
                <Text style={styles.metaText}>Date: {form.letterDate}</Text>
            </View>
        </View>

        <View style={styles.recipient}>
          <Text style={styles.label}>Prospective Employee</Text>
          <Text style={styles.recipName}>{form.candidateName || "Candidate Name"}</Text>
          {form.candidateAddress && <Text style={styles.recipAddr}>{form.candidateAddress}</Text>}
        </View>

        <View>
          <Text style={styles.salutation}>Dear {form.candidateName ? form.candidateName.split(" ")[0] : "Candidate"},</Text>
          
          <Text style={styles.body}>
            {"With reference to your recent application and subsequent interviews, we are pleased to offer you the following position at "}
            <Text style={styles.bold}>{form.companyName || "our organization"}</Text>
            {". We are confident that you will find the work environment professionally rewarding."}
          </Text>

          <View style={styles.detailsBox}>
            <View style={styles.detailLine}>
              <Text style={styles.detailLabel}>Designation</Text>
              <Text style={styles.detailValue}>{form.designation || "[Designation]"}</Text>
            </View>
            <View style={styles.detailLine}>
              <Text style={styles.detailLabel}>Department</Text>
              <Text style={styles.detailValue}>{form.department || "Operations"}</Text>
            </View>
            <View style={styles.detailLine}>
              <Text style={styles.detailLabel}>Reporting To</Text>
              <Text style={styles.detailValue}>{form.reportingTo || "Management"}</Text>
            </View>
            <View style={styles.detailLine}>
              <Text style={styles.detailLabel}>Working Days</Text>
              <Text style={styles.detailValue}>{form.workingDays} Days/Week</Text>
            </View>
            <View style={styles.detailLine}>
              <Text style={styles.detailLabel}>Date of Joining</Text>
              <Text style={[styles.detailValue, { color: T }]}>{form.dateOfJoining || "To be mutually agreed"}</Text>
            </View>
          </View>

          {ctc > 0 && (
            <View style={styles.ctcBox}>
              <Text style={styles.ctcHeader}>Compensation Details</Text>
              <View style={styles.ctcRow}>
                <Text style={styles.ctcLabel}>Basic Salary (Per Month)</Text>
                <Text style={styles.ctcVal}>₹ {fmt(basic)}</Text>
              </View>
              <View style={styles.ctcRow}>
                <Text style={styles.ctcLabel}>House Rent Allowance (Per Month)</Text>
                <Text style={styles.ctcVal}>₹ {fmt(hra)}</Text>
              </View>
              <View style={styles.ctcRow}>
                <Text style={styles.ctcLabel}>Other Benefits (Per Month)</Text>
                <Text style={styles.ctcVal}>₹ {fmt(other)}</Text>
              </View>
              <View style={[styles.ctcRow, { marginTop: 12, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 12 }]}>
                <Text style={styles.totalLabel}>Total Annualized CTC</Text>
                <Text style={styles.totalVal}>INR {fmt(ctc)}</Text>
              </View>
            </View>
          )}

          {form.additionalTerms && (
            <View style={{ marginBottom: 12 }}>
                <Text style={[styles.ctcHeader, { fontSize: 8, marginBottom: 4 }]}>Additional Condition</Text>
                <Text style={[styles.body, { marginBottom: 0 }]}>{form.additionalTerms}</Text>
            </View>
          )}

          <Text style={[styles.body, { marginTop: 12 }]}>
            {form.acceptanceDeadline ? `Kindly confirm your acceptance of this offer by the end of business on ${form.acceptanceDeadline}. ` : "Kindly confirm your acceptance of this offer at the earliest. "}
            We look forward to a successful professional association.
          </Text>
        </View>

        <View style={styles.sigSection}>
          <View style={styles.sigBox}>
            {form.signature ? (
              <Image src={form.signature} style={styles.signatureImage} />
            ) : (
              <View style={{ height: 40 }} />
            )}
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{form.signatoryName || "Authorized Official"}</Text>
              <Text style={styles.sigDesig}>{form.signatoryDesignation || "Human Resources"}</Text>
              <Text style={styles.sigDesig}>{form.companyName || ""}</Text>
            </View>
          </View>
          <View style={styles.sigBox}>
            <View style={{ height: 40 }} />
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{form.candidateName || "Candidate Name"}</Text>
              <Text style={styles.sigDesig}>Signature of Acceptance</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Corporate Document Release — DocMinty Pro</Text>
        </View>
      </Page>
    </Document>
  );
}
