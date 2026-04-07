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

export default function ResignationElegantTemplate({ form }) {
  const T = form.templateColor || "#D97706";
  const reasonText = form.reason === "custom" ? form.customReason : REASONS[form.reason];

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "40 50", backgroundColor: "#ffffff" },
    headerSection: { paddingBottom: 12, marginBottom: 0 },
    headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 },
    
    leftHead: { textAlign: "left" },
    title: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
    metaText: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },
    
    rightHead: { textAlign: "right" },
    empName: { fontSize: 15, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827" },
    empDetails: { fontSize: 11, color: "#6B7280", marginTop: 2 },
    
    accentBar: { height: 4, backgroundColor: T, borderRadius: 2, marginBottom: 24 },
    
    body: { marginTop: 20 },
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
    
    footer: { position: "absolute", bottom: 40, left: 50, right: 50, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 10 },
    footerText: { fontSize: 10, color: "#D1D5DB" },
    bottomBar: { height: 4, backgroundColor: T, position: "absolute", bottom: 0, left: 0, right: 0 }
  });

  return (
    <Document title={`Resignation-Letter-${form.employeeName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerSection}>
            <View style={styles.headerTop}>
                <View style={styles.leftHead}>
                    <Text style={styles.title}>RESIGNATION LETTER</Text>
                    <Text style={styles.metaText}>Date: {form.letterDate}</Text>
                </View>
                <View style={styles.rightHead}>
                    <Text style={styles.empName}>{form.employeeName || "Employee Name"}</Text>
                    {(form.designation || form.department) && (
                        <Text style={styles.empDetails}>{[form.designation, form.department].filter(Boolean).join(" - ")}</Text>
                    )}
                </View>
            </View>
            <View style={styles.accentBar} />
        </View>

        <View style={styles.body}>
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
        <View style={styles.bottomBar} />
      </Page>
    </Document>
  );
}
