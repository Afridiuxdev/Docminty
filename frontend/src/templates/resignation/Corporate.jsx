"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const REASONS = {
  personal: "I have decided to pursue a new opportunity that aligns more closely with my personal and professional goals.",
  relocation: "Due to relocation constraints, I am unable to continue in my current position at this time.",
  health: "Due to personal health reasons, I am unable to continue in my current role effectively.",
  higher: "I have been offered an opportunity to pursue higher education, which requires my full-time commitment.",
};

export default function ResignationCorporateTemplate({ form }) {
  const T = form.templateColor || "#1E3A5F";
  const reasonText = form.reason === "custom" ? form.customReason : REASONS[form.reason] || "";
  const gratitude = form.gratitudeNote || "I am sincerely grateful for the opportunities for professional and personal development provided during my tenure. I have enjoyed working with the team and deeply value the experience I have gained here.";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "50 70", backgroundColor: "#ffffff" },
    header: { marginBottom: 32, textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 20 },
    orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
    docType: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 2, fontFamily: "Space Grotesk" },
    
    dateRow: { marginTop: 24, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 12 },
    metaText: { fontSize: 9, color: "#6B7280", fontWeight: 700 },
    
    recipient: { marginBottom: 32 },
    label: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    recipName: { fontSize: 13, fontWeight: 700, color: "#111827" },
    recipDesig: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
    
    body: { fontSize: 11, color: "#374151", lineHeight: 1.8, marginBottom: 16, textAlign: "justify" },
    salutation: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 24 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontWeight: 700, color: T },
    
    infoBox: { backgroundColor: "#F8FAFD", padding: "20 24", borderRadius: 8, margin: "24 0", borderLeftWidth: 4, borderLeftColor: T },
    infoLabel: { fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    infoValue: { fontSize: 14, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    signatureSection: { marginTop: 48 },
    sigBox: { width: 180 },
    signatureImage: { height: 40, marginBottom: 4, objectFit: "contain" },
    sigLine: { borderTopWidth: 2, borderTopColor: "#111827", paddingTop: 8, marginTop: 12 },
    sigName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    sigDesig: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 70, right: 70, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Corporate-Resignation-${form.employeeName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.orgName}>{form.companyName || "Organization Name"}</Text>
          <Text style={styles.docType}>Official Resignation Notice</Text>
        </View>

        <View style={styles.dateRow}>
          <Text style={styles.metaText}>Ref: RESIGN/{new Date().getFullYear()}/001</Text>
          <Text style={styles.metaText}>Date: {form.letterDate}</Text>
        </View>

        <View style={styles.recipient}>
          <Text style={styles.label}>To</Text>
          <Text style={styles.recipName}>{form.managerName || "Reporting Manager"}</Text>
          <Text style={styles.recipDesig}>{form.managerDesignation || "Designation"}</Text>
          {form.companyName && <Text style={styles.recipDesig}>{form.companyName}</Text>}
        </View>

        <View>
          <Text style={styles.salutation}>Dear {form.managerName ? form.managerName.split(" ")[0] : "Sir/Madam"},</Text>
          
          <Text style={styles.body}>
            {"I am writing to formally submit my resignation from the position of "}
            <Text style={styles.bold}>{form.designation || "[Designation]"}</Text> 
            {form.department ? " in the " + form.department + " department" : ""}
            {form.companyName ? " at " + form.companyName : ""}
            {". I have decided to move on to the next chapter of my professional career."}
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Last Working Date</Text>
            <Text style={styles.infoValue}>{form.lastWorkingDate || "To be confirmed"}</Text>
            <Text style={{ fontSize: 8, color: "#9CA3AF", marginTop: 4 }}>Standard notice period of {form.noticePeriod || "30"} days is being observed.</Text>
          </View>

          {reasonText !== "" && <Text style={styles.body}>{reasonText}</Text>}
          
          <Text style={styles.body}>{gratitude}</Text>
          
          <Text style={styles.body}>
            {"During my remaining time here, I am committed to ensuring a seamless transition of my responsibilities and will complete all my outstanding deliverables."}
          </Text>

          <Text style={styles.body}>Yours sincerely,</Text>

          <View style={styles.signatureSection}>
            <View style={styles.sigBox}>
              {form.signature ? (
                <Image src={form.signature} style={styles.signatureImage} />
              ) : (
                <View style={{ height: 40 }} />
              )}
              <View style={styles.sigLine}>
                <Text style={styles.sigName}>{form.employeeName || "Employee Name"}</Text>
                <Text style={styles.sigDesig}>{form.designation || ""}{form.department ? ` — ${form.department}` : ""}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Authorized Corporate Release — DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
