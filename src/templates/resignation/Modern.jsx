"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const REASONS = {
  personal: "I have decided to pursue a new opportunity that aligns more closely with my personal and professional goals.",
  relocation: "Due to relocation constraints, I am unable to continue in my current position.",
  health: "Due to personal health reasons, I am unable to continue in my current role.",
  higher: "I have been offered an opportunity to pursue higher education, which requires my full commitment.",
};

export default function ResignationModernTemplate({ form }) {
  const T = form.templateColor || "#6366F1";
  
  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0, flexDirection: "row" },
    sidebar: { width: "160pt", background: T, height: "100%", padding: "40 24", color: "#fff" },
    sideTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 2, marginBottom: 30 },
    sideLabel: { fontSize: 8, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    sideValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#fff", marginBottom: 20 },
    main: { flex: 1, padding: "50 40", background: "#fff" },
    header: { marginBottom: 30 },
    date: { fontSize: 9, color: "#9CA3AF", marginBottom: 16 },
    manager: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#111827" },
    managerDesig: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    body: { fontSize: 10, color: "#374151", lineHeight: 1.8, marginBottom: 12 },
    lastDay: { color: T, fontFamily: "Helvetica-Bold" },
    signImg: { height: 40, marginBottom: 5, objectFit: "contain" },
    signLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 6, width: 150 },
    signName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    signDesig: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
    footer: { position: "absolute", bottom: 40, left: 40, borderTopWidth: 1, borderTopColor: "#E5E7EB", width: "100%", paddingTop: 10 },
    footerGen: { fontSize: 7, color: "#D1D5DB" },
  });

  const reasonText = form.reason === "custom" ? form.customReason : REASONS[form.reason] || "";
  const gratitude = form.gratitudeNote || "I am grateful for the opportunities for professional and personal development provided during my tenure. I have enjoyed working with the team and value the experience gained here.";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.sideTitle}>Letter of Resignation</Text>
          <View>
            <Text style={styles.sideLabel}>From</Text>
            <Text style={styles.sideValue}>{form.employeeName || "Employee Name"}</Text>
          </View>
          <View>
            <Text style={styles.sideLabel}>Last Day</Text>
            <Text style={styles.sideValue}>{form.lastWorkingDate || "—"}</Text>
          </View>
          <View>
            <Text style={styles.sideLabel}>Notice</Text>
            <Text style={styles.sideValue}>{form.noticePeriod || "30"} Days</Text>
          </View>
        </View>
        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.date}>{"Dated: " + form.letterDate}</Text>
            <Text style={styles.manager}>{form.managerName || "Manager Name"}</Text>
            <Text style={styles.managerDesig}>{form.managerDesignation || "Designation"}{form.companyName ? ", " + form.companyName : ""}</Text>
          </View>
          <Text style={styles.body}>Dear {form.managerName ? form.managerName.split(" ")[0] : "Sir/Madam"},</Text>
          <Text style={styles.body}>
            This is to formally notify you of my resignation from the position of <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.designation || "[Designation]"}</Text> 
            {form.department ? " in the " + form.department + " department" : ""}. 
            My last day of employment will be <Text style={styles.lastDay}>{form.lastWorkingDate || "[Last Working Date]"}</Text>.
          </Text>
          {reasonText !== "" && <Text style={styles.body}>{reasonText}</Text>}
          <Text style={styles.body}>{gratitude}</Text>
          <Text style={styles.body}>I will ensured all pending tasks are completed and a smooth handover is facilitated. Thank you for the support.</Text>
          <Text style={styles.body}>Yours sincerely,</Text>
          <View style={{ marginTop: 24 }}>
            {form.signature && <Image src={form.signature} style={styles.signImg} />}
            <View style={styles.signLine}>
              <Text style={styles.signName}>{form.employeeName || "Employee Name"}</Text>
              <Text style={styles.signDesig}>{form.designation || ""}</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerGen}>Generated by DocMinty.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
