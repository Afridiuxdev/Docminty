"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const REASONS = {
  personal: "I have decided to pursue a new opportunity that aligns more closely with my personal and professional goals.",
  relocation: "Due to relocation constraints, I am unable to continue in my current position.",
  health: "Due to personal health reasons, I am unable to continue in my current role.",
  higher: "I have been offered an opportunity to pursue higher education, which requires my full commitment.",
};

export default function ResignationCorporateTemplate({ form }) {
  const T = form.templateColor || "#1E3A5F";
  
  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: "50 60" },
    header: { marginBottom: 30, textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 15 },
    orgName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: T, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
    docType: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 },
    dateRow: { marginTop: 24, marginBottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    dateText: { fontSize: 9, color: "#6B7280" },
    meta: { marginBottom: 20 },
    metaL: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
    metaV: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    metaS: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    bodyText: { fontSize: 10, color: "#374151", lineHeight: 1.8, marginBottom: 12, textAlign: "justify" },
    lastDay: { color: T, fontFamily: "Helvetica-Bold" },
    signRow: { marginTop: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    signImg: { height: 40, marginBottom: 5, objectFit: "contain" },
    signLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 6, width: 150 },
    signName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    signDesig: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
    footer: { position: "absolute", bottom: 40, left: 60, right: 60, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 10 },
    footerGen: { fontSize: 8, color: "#D1D5DB", textAlign: "center" },
  });

  const reasonText = form.reason === "custom" ? form.customReason : REASONS[form.reason] || "";
  const gratitude = form.gratitudeNote || "I am grateful for the opportunities for professional and personal development provided during my tenure. I have enjoyed working with the team and value the experience gained here.";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.orgName}>{form.companyName || "Company Name"}</Text>
          <Text style={styles.docType}>Resignation Letter</Text>
        </View>
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{"Reference: RL-" + form.letterDate.replace(/-/g, "")}</Text>
          <Text style={styles.dateText}>{"Date: " + form.letterDate}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaL}>To</Text>
          <Text style={styles.metaV}>{form.managerName || "Manager Name"}</Text>
          <Text style={styles.metaS}>{form.managerDesignation || "Designation"}</Text>
        </View>
        <Text style={styles.bodyText}>Dear {form.managerName ? form.managerName.split(" ")[0] : "Sir/Madam"},</Text>
        <Text style={styles.bodyText}>
          I am writing to formally notify you of my resignation from the position of <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.designation || "[Designation]"}</Text> 
          {form.department ? " in the " + form.department + " department" : ""}. 
          My last working day will be <Text style={styles.lastDay}>{form.lastWorkingDate || "[Last Working Date]"}</Text>, 
          serving a notice period of {form.noticePeriod || "30"} days.
        </Text>
        {reasonText !== "" && <Text style={styles.bodyText}>{reasonText}</Text>}
        <Text style={styles.bodyText}>{gratitude}</Text>
        <Text style={styles.bodyText}>I will ensure a smooth transition and will complete all pending tasks before my last working day. Please let me know how I can assist during this transition period. Thank you for your support and guidance.</Text>
        <Text style={styles.bodyText}>Yours sincerely,</Text>
        <View style={styles.signRow}>
          <View>
            {form.signature && <Image src={form.signature} style={styles.signImg} />}
            <View style={styles.signLine}>
              <Text style={styles.signName}>{form.employeeName || "Employee Name"}</Text>
              <Text style={styles.signDesig}>{form.designation || ""}</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerGen}>Generated by DocMinty.com</Text>
        </View>
      </Page>
    </Document>
  );
}
