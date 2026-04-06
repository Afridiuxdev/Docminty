"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const REASONS = {
  personal: "I have decided to pursue a new opportunity that aligns more closely with my personal and professional goals.",
  relocation: "Due to relocation constraints, I am unable to continue in my current position at this time.",
  health: "Due to personal health reasons, I am unable to continue in my current role effectively.",
  higher: "I have been offered an opportunity to pursue higher education, which requires my full-time commitment.",
};

export default function ResignationElegantTemplate({ form }) {
  const T = form.templateColor || "#D97706";
  const reasonText = form.reason === "custom" ? form.customReason : REASONS[form.reason] || "";
  const gratitude = form.gratitudeNote || "I am sincerely grateful for the opportunities for professional and personal development provided during my tenure. I have enjoyed working with the team and deeply value the experience I have gained here.";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "60 80", backgroundColor: "#FFFDFA" },
    header: { marginBottom: 40, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)", paddingBottom: 24, alignItems: "flex-start" },
    title: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 700, color: T, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" },
    subtitle: { fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 3, fontFamily: "Space Grotesk" },
    
    dateLine: { fontSize: 9, color: "#9CA3AF", marginBottom: 32, textAlign: "right" },
    
    recipient: { marginBottom: 32 },
    recipLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    recipName: { fontSize: 13, fontWeight: 700, color: "#111827" },
    recipDesig: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
    
    body: { fontSize: 11, color: "#374151", lineHeight: 2, marginBottom: 18, textAlign: "justify" },
    salutation: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 20 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontWeight: 700, color: T },
    
    infoBox: { margin: "24 0", padding: "16 0", borderTopWidth: 1, borderTopColor: T, borderBottomWidth: 1, borderBottomColor: T },
    infoLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    infoVal: { fontSize: 20, fontWeight: 700, color: T, fontFamily: "Space Grotesk" },
    
    signatureSection: { marginTop: 48 },
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
    <Document title={`Elegant-Resignation-${form.employeeName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebarLine} />
        <View style={styles.header}>
          <Text style={styles.title}>RESIGNATION</Text>
          <Text style={styles.subtitle}>Formal Notification Letter</Text>
        </View>

        <Text style={styles.dateLine}>DATE: {form.letterDate}</Text>

        <View style={styles.recipient}>
          <Text style={styles.recipLabel}>To</Text>
          <Text style={styles.recipName}>{form.managerName || "Reporting Manager"}</Text>
          <Text style={styles.recipDesig}>{form.managerDesignation || "Designation"}</Text>
          {form.companyName && <Text style={styles.recipDesig}>{form.companyName}</Text>}
        </View>

        <Text style={styles.salutation}>Dear {form.managerName ? form.managerName.split(" ")[0] : "Sir/Madam"},</Text>
        
        <Text style={styles.body}>
          {"I am writing to formally submit my resignation from the position of "}
          <Text style={styles.bold}>{form.designation || "[Designation]"}</Text> 
          {form.department ? " in the " + form.department + " department" : ""}
          {form.companyName ? " at " + form.companyName : ""}
          {". It has been a pleasure to be a part of "}
          <Text style={styles.bold}>{form.companyName || "the organization"}</Text>
          {"."}
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Final Working Date</Text>
          <Text style={styles.infoVal}>{form.lastWorkingDate || "To be confirmed"}</Text>
          <Text style={{ fontSize: 7, color: "#9CA3AF", marginTop: 4 }}>Notice period of {form.noticePeriod || "30"} days is being fulfilled.</Text>
        </View>

        {reasonText !== "" && <Text style={styles.body}>{reasonText}</Text>}
        
        <Text style={styles.body}>{gratitude}</Text>
        
        <Text style={[styles.body, { marginTop: 12 }]}>
          {"I will ensure a smooth transition of my duties during this period. Please let me know how I can further assist in the handover process. I wish the organization continued success."}
        </Text>

        <Text style={styles.body}>Yours sincerely,</Text>

        <View style={styles.signatureSection}>
          <View style={styles.sigBox}>
            {form.signature ? (
              <Image src={form.signature} style={styles.signatureImage} />
            ) : (
              <View style={{ height: 45 }} />
            )}
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{form.employeeName || "Employee Name"}</Text>
              <Text style={styles.sigDesig}>{form.designation || ""}{form.department ? ` — ${form.department}` : ""}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Secure Resignation Document — DocMinty Elegant</Text>
        </View>
      </Page>
    </Document>
  );
}
