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

export default function ResignationModernTemplate({ form }) {
  const T = form.templateColor || "#6366F1";
  const reasonText = form.reason === "custom" ? form.customReason : REASONS[form.reason];

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, flexDirection: "row", backgroundColor: "#ffffff" },
    sidebar: { width: 140, backgroundColor: T, height: "100%", padding: "24 16", color: "#ffffff" },
    sideTitle: { fontSize: 13, fontFamily: "Space Grotesk", fontWeight: 800, textTransform: "uppercase", marginBottom: 20, lineHeight: 1.3 },
    
    sideGroup: { marginBottom: 20 },
    sideLabel: { fontSize: 9, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 2 },
    sideVal: { fontSize: 10, color: "#ffffff" },
    sideEmpName: { fontSize: 10, fontFamily: "Space Grotesk", fontWeight: 600, color: "#ffffff" },
    
    main: { flex: 1, padding: "40 50" },
    mgrName: { fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 2 },
    mgrDetails: { fontSize: 12, color: "#6B7280", marginBottom: 16 },
    salutation: { fontSize: 12, color: "#374151", marginBottom: 12 },
    content: { fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 12 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontWeight: 700, color: T },
    
    signatureSection: { marginTop: 32, width: 220 },
    signatureImage: { maxHeight: 45, maxWidth: 140, marginBottom: 4, objectFit: "contain" },
    signatureLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 8 },
    signName: { fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk" },
    signDetails: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 50, right: 50, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 12 },
    footerText: { fontSize: 10, color: "#D1D5DB" }
  });

  return (
    <Document title={`Resignation-Letter-${form.employeeName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sideTitle}>RESIGNATION</Text>
            <Text style={styles.sideTitle}>LETTER</Text>
          </View>
          
          <View style={styles.sideGroup}>
            <Text style={styles.sideLabel}>Date</Text>
            <Text style={styles.sideVal}>{form.letterDate}</Text>
          </View>
          
          <View style={styles.sideGroup}>
            <Text style={styles.sideLabel}>From</Text>
            <Text style={styles.sideEmpName}>{form.employeeName || "—"}</Text>
          </View>
          
          <View style={styles.sideGroup}>
            <Text style={styles.sideLabel}>Last Day</Text>
            <Text style={styles.sideVal}>{form.lastWorkingDate || "—"}</Text>
          </View>
        </View>

        <View style={styles.main}>
          <View>
            <Text style={styles.mgrName}>{form.managerName || "Manager Name"}</Text>
            <Text style={styles.mgrDetails}>{form.managerDesignation || "Designation"}{form.companyName ? ", " + form.companyName : ""}</Text>
            
            <Text style={styles.salutation}>Dear {form.managerName ? form.managerName.split(" ")[0] : "Sir/Madam"},</Text>
            
            <Text style={styles.content}>
              {"I am writing to formally notify you of my resignation from the position of "}
              <Text style={styles.bold}>{form.designation || "[Designation]"}</Text>
              {form.department ? " in the " + form.department + " department" : ""}
              {form.companyName ? " at " + form.companyName : ""}
              {"."}
              {" My last working day will be "}
              <Text style={styles.accent}>{form.lastWorkingDate || "[Last Working Date]"}</Text>
              {", serving a notice period of " + (form.noticePeriod || "30") + " days."}
            </Text>

            {reasonText && <Text style={styles.content}>{reasonText}</Text>}

            <Text style={styles.content}>
              {form.gratitudeNote || "I am grateful for the opportunities for professional and personal development provided during my tenure. I have enjoyed working with the team and value the experience gained here."}
            </Text>

            <Text style={styles.content}>
              I will ensure a smooth transition and complete all pending tasks before my last working day.
            </Text>

            <Text style={[styles.content, { marginBottom: 4, marginTop: 12 }]}>Yours sincerely,</Text>
            <View style={styles.signatureSection} wrap={false}>
              {form.signature ? (
                <Image src={form.signature} style={styles.signatureImage} />
              ) : (
                <View style={{ height: 40 }} />
              )}
              <View style={styles.signatureLine}>
                <Text style={styles.signName}>{form.employeeName || "[Your Name]"}</Text>
                <Text style={styles.signDetails}>{form.designation || ""}{form.department ? " - " + form.department : ""}</Text>
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
