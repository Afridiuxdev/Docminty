"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const REASONS = {
  personal: "I have decided to pursue a new opportunity that aligns more closely with my personal and professional goals.",
  relocation: "Due to relocation constraints, I am unable to continue in my current position.",
  health: "Due to personal health reasons, I am unable to continue in my current role.",
  higher: "I have been offered an opportunity to pursue higher education, which requires my full commitment.",
  custom: "",
};

export default function ResignationClassicTemplate({ form }) {
  const T = form.templateColor || "#0D9488";
  const reasonText = form.reason === "custom" ? form.customReason : REASONS[form.reason];

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 11, color: "#374151", padding: "60 70", backgroundColor: "#ffffff" },
    header: { borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 16, marginBottom: 32, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    title: { fontSize: 20, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1 },
    date: { fontSize: 10, color: "#9CA3AF" },
    
    addressSection: { marginBottom: 32 },
    managerName: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 2 },
    managerInfo: { fontSize: 11, color: "#6B7280", marginBottom: 12 },
    
    body: { lineHeight: 1.8, textAlign: "justify" },
    salutation: { marginBottom: 16 },
    paragraph: { marginBottom: 14 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontWeight: 700, color: T },
    
    closing: { marginTop: 40 },
    signatureImage: { height: 45, marginBottom: 4, objectFit: "contain" },
    signatureLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 8, width: 180 },
    employeeName: { fontSize: 13, fontWeight: 700, color: "#111827" },
    employeeInfo: { fontSize: 10, color: "#9CA3AF", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 70, right: 70, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Resignation-Letter-${form.employeeName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Resignation Letter</Text>
          <Text style={styles.date}>Date: {form.letterDate}</Text>
        </View>

        <View style={styles.addressSection}>
          <Text style={styles.managerName}>{form.managerName || "To Manager"}</Text>
          <Text style={styles.managerInfo}>
            {form.managerDesignation || "Reporting Manager"}
            {form.companyName ? `, ${form.companyName}` : ""}
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.salutation}>Dear {form.managerName ? form.managerName.split(" ")[0] : "Sir/Madam"},</Text>
          
          <Text style={styles.paragraph}>
            {"I am writing to formally notify you of my resignation from the position of "}
            <Text style={styles.bold}>{form.designation || "[Designation]"}</Text>
            {form.department ? " in the " + form.department + " department" : ""}
            {form.companyName ? " at " + form.companyName : ""}
            {"."}
          </Text>

          <Text style={styles.paragraph}>
            {"As per my contractual obligations, I am serving a notice period of "}
            <Text style={styles.bold}>{form.noticePeriod || "30"}</Text>
            {" days. Accordingly, my last working day will be "}
            <Text style={styles.accent}>{form.lastWorkingDate || "[Last Working Date]"}</Text>
            {"."}
          </Text>

          {reasonText && <Text style={styles.paragraph}>{reasonText}</Text>}

          <Text style={styles.paragraph}>
            {form.gratitudeNote || "I am grateful for the opportunities for professional and personal development provided during my tenure. I have enjoyed working with the team and value the experience gained here."}
          </Text>

          <Text style={styles.paragraph}>
            I will ensure a smooth transition of my responsibilities and complete all pending tasks before my departure.
          </Text>
        </View>

        <View style={styles.closing}>
          <Text style={{ marginBottom: 20 }}>Yours sincerely,</Text>
          {form.signature ? (
            <Image src={form.signature} style={styles.signatureImage} />
          ) : (
            <View style={{ height: 40 }} />
          )}
          <View style={styles.signatureLine}>
            <Text style={styles.employeeName}>{form.employeeName || "[Your Name]"}</Text>
            <Text style={styles.employeeInfo}>
                {form.designation || ""}
                {form.department ? ` - ${form.department}` : ""}
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Professional Document Release via DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
