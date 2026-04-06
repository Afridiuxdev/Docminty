"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const REASONS = {
  personal: "I have decided to pursue a new opportunity that aligns more closely with my personal and professional goals.",
  relocation: "Due to relocation constraints, I am unable to continue in my current position at this time.",
  health: "Due to personal health reasons, I am unable to continue in my current role effectively.",
  higher: "I have been offered an opportunity to pursue higher education, which requires my full-time commitment.",
};

export default function ResignationModernTemplate({ form }) {
  const T = form.templateColor || "#6366F1";
  const reasonText = form.reason === "custom" ? form.customReason : REASONS[form.reason] || "";
  const gratitude = form.gratitudeNote || "I am sincerely grateful for the opportunities for professional and personal development provided during my tenure. I have enjoyed working with the team and deeply value the experience I have gained here.";

  const styles = StyleSheet.create({
    page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, flexDirection: "row", backgroundColor: "#ffffff" },
    sidebar: { width: 180, backgroundColor: T, height: "100%", padding: "40 24", color: "#ffffff" },
    sideTitle: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginBottom: 40 },
    sideItem: { marginBottom: 24 },
    sideLabel: { fontSize: 8, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    sideValue: { fontSize: 11, fontWeight: 700, color: "#ffffff", lineHeight: 1.4 },
    
    main: { flex: 1, padding: "60 48 40 48", backgroundColor: "#ffffff" },
    date: { fontSize: 9, color: "#9CA3AF", marginBottom: 24, textAlign: "right" },
    managerHeader: { marginBottom: 32 },
    managerName: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827" },
    managerDesig: { fontSize: 9, color: "#6B7280", marginTop: 4, lineHeight: 1.4, maxWidth: 300 },
    
    body: { fontSize: 11, color: "#374151", lineHeight: 1.8, marginBottom: 16, textAlign: "justify" },
    salutation: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 20 },
    bold: { fontWeight: 700, color: "#111827" },
    accent: { fontWeight: 700, color: T },
    
    infoBox: { backgroundColor: "#F8FAFD", padding: "20 24", borderRadius: 12, margin: "24 0", borderLeftWidth: 4, borderLeftColor: T },
    infoLabel: { fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
    infoValue: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T },
    
    signatureSection: { marginTop: 48 },
    sigBox: { width: 180 },
    signatureImage: { height: 40, marginBottom: 4, objectFit: "contain" },
    sigLine: { borderTopWidth: 2, borderTopColor: "#111827", paddingTop: 8, marginTop: 12 },
    sigName: { fontSize: 11, fontWeight: 700, color: "#111827" },
    sigDesig: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
    
    footer: { position: "absolute", bottom: 40, left: 48, right: 48, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
    footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
  });

  return (
    <Document title={`Resignation-${form.employeeName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.sideTitle}>Letter of Resignation</Text>
          
          <View style={styles.sideItem}>
            <Text style={styles.sideLabel}>From</Text>
            <Text style={styles.sideValue}>{form.employeeName || "Employee Name"}</Text>
          </View>
          
          <View style={styles.sideItem}>
            <Text style={styles.sideLabel}>Dated</Text>
            <Text style={styles.sideValue}>{form.letterDate}</Text>
          </View>
          
          <View style={styles.sideItem}>
            <Text style={styles.sideLabel}>Last Working Day</Text>
            <Text style={styles.sideValue}>{form.lastWorkingDate || "To be confirmed"}</Text>
          </View>
          
          <View style={styles.sideItem}>
            <Text style={styles.sideLabel}>Notice Period</Text>
            <Text style={styles.sideValue}>{form.noticePeriod || "30"} Days</Text>
          </View>
        </View>

        <View style={styles.main}>
          <Text style={styles.date}>Dated: {form.letterDate}</Text>
          
          <View style={styles.managerHeader}>
            <Text style={styles.managerName}>{form.managerName || "Reporting Manager"}</Text>
            <View style={styles.managerDesig}>
              <Text>{form.managerDesignation || "Designation"}</Text>
              {form.companyName && <Text>{form.companyName}</Text>}
            </View>
          </View>

          <Text style={styles.salutation}>Dear {form.managerName ? form.managerName.split(" ")[0] : "Sir/Madam"},</Text>
          
          <Text style={styles.body}>
            {"This is to formally notify you of my resignation from the position of "}
            <Text style={styles.bold}>{form.designation || "[Designation]"}</Text> 
            {form.department ? " in the " + form.department + " department" : ""}
            {" at "}
            <Text style={styles.bold}>{form.companyName || "the organization"}</Text>
            {". This decision was not an easy one, but I feel it is the right time for me to move forward."}
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Official Separation Date</Text>
            <Text style={styles.infoValue}>{form.lastWorkingDate || "To be confirmed"}</Text>
            <Text style={{ fontSize: 8, color: "#9CA3AF", marginTop: 4 }}>Standard notice period of {form.noticePeriod || "30"} days applies.</Text>
          </View>

          {reasonText !== "" && <Text style={styles.body}>{reasonText}</Text>}
          
          <Text style={styles.body}>{gratitude}</Text>

          <Text style={styles.body}>
            {"I intend to make this transition as smooth as possible. I will provide a comprehensive handover and will complete all outstanding assignments before my final day."}
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

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Secure Digital Resignation — DocMinty.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
