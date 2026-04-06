"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const REASONS = {
  personal: "I have decided to pursue a new opportunity that aligns more closely with my personal and professional goals.",
  relocation: "Due to relocation constraints, I am unable to continue in my current position at this time.",
  health: "Due to personal health reasons, I am unable to continue in my current role effectively.",
  higher: "I have been offered an opportunity to pursue higher education, which requires my full-time commitment.",
};

export default function ResignationMinimalTemplate({ form }) {
  const T = form.templateColor || "#111827";
  const reasonText = form.reason === "custom" ? form.customReason : REASONS[form.reason] || "";
  const gratitude = form.gratitudeNote || "I am grateful for the opportunities for professional and personal development provided during my tenure. I have enjoyed working with the team and value the experience gained here.";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#374151", padding: "48 64", backgroundColor: "#ffffff" },
    header: { borderBottomWidth: 1.5, borderBottomColor: T, paddingBottom: 12, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    title: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1 },
    date: { fontSize: 10, color: "#9CA3AF" },
    
    recipientSection: { marginBottom: 32 },
    label: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
    value: { fontSize: 11, fontWeight: 700, color: "#111827" },
    subValue: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
    
    salutation: { fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 16 },
    bodyText: { fontSize: 10.5, color: "#374151", lineHeight: 1.8, marginBottom: 16, textAlign: "justify" },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontWeight: 700, color: T },
    
    signatureSection: { marginTop: 48 },
    signatureImage: { height: 35, marginBottom: 4, objectFit: "contain" },
    sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 8, width: 160 },
    sigName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    sigInfo: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 48, left: 64, right: 64, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Resignation-Minimal-${form.employeeName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Letter of Resignation</Text>
          <Text style={styles.date}>{form.letterDate}</Text>
        </View>

        <View style={styles.recipientSection}>
          <Text style={styles.label}>To</Text>
          <Text style={styles.value}>{form.managerName || "Reporting Manager"}</Text>
          <View style={styles.subValue}>
            <Text>{form.managerDesignation || "Designation"}</Text>
            {form.companyName && <Text>{form.companyName}</Text>}
          </View>
        </View>

        <View>
          <Text style={styles.salutation}>Dear {form.managerName ? form.managerName.split(" ")[0] : "Sir/Madam"},</Text>
          
          <Text style={styles.bodyText}>
            {"Please accept this letter as formal notification that I am resigning from my position as "}
            <Text style={styles.bold}>{form.designation || "[Designation]"}</Text> 
            {form.department ? " in the " + form.department + " department" : ""}
            {form.companyName ? " at " + form.companyName : ""}
            {". My last working day will be "}
            <Text style={styles.accent}>{form.lastWorkingDate || "[Date]"}</Text>
            {", serving my notice period of " + (form.noticePeriod || "30") + " days."}
          </Text>

          {reasonText !== "" && <Text style={styles.bodyText}>{reasonText}</Text>}
          
          <Text style={styles.bodyText}>{gratitude}</Text>
          
          <Text style={styles.bodyText}>
            {"I will ensure all pending tasks are completed and a smooth handover is facilitated before my departure. Thank you for your guidance."}
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.label}>Sincerely,</Text>
          {form.signature ? (
            <Image src={form.signature} style={styles.signatureImage} />
          ) : (
            <View style={{ height: 35 }} />
          )}
          <View style={styles.sigLine}>
            <Text style={styles.sigName}>{form.employeeName || "Employee Name"}</Text>
            <Text style={styles.sigInfo}>{form.designation || ""}{form.department ? ` — ${form.department}` : ""}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Certified Digital Notice Release — DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
