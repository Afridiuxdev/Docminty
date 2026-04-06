"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation and they consistently exceeded performance expectations.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member with a positive attitude.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout their employment.",
};

export default function ModernTemplate({ form }) {
    const T = form.templateColor || "#6366F1";
    
    const formatDate = (dateStr) => {
        if (!dateStr) return "DD Month YYYY";
        try {
            return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        } catch (e) {
            return dateStr;
        }
    };

    const joining = formatDate(form.dateOfJoining);
    const leaving = formatDate(form.dateOfLeaving);
    const perfText = PERF_TEXT[form.performance] || PERF_TEXT.good;
    const empInfo = (form.employeeName || "[Employee Name]") + (form.employeeId ? ` (ID: ${form.employeeId})` : "");

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, flexDirection: "row", backgroundColor: "#ffffff" },
        sidebar: { width: 140, backgroundColor: T, padding: "40 20", color: "#ffffff", height: "100%" },
        logo: { width: 45, objectFit: "contain", marginBottom: 24, filter: "brightness(0) invert(1)" },
        sideTitle: { fontSize: 13, fontFamily: "Space Grotesk", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 },
        sideRef: { fontSize: 8, color: "rgba(255,255,255,0.7)", marginBottom: 20 },
        sideLabel: { fontSize: 7, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
        sideVal: { fontSize: 9, color: "#ffffff", marginBottom: 12 },
        sideCompany: { fontSize: 10, fontWeight: 700, color: "#ffffff", marginBottom: 12 },
        
        main: { flex: 1, padding: "60 40" },
        body: { marginTop: 10 },
        salutation: { fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 20 },
        content: { fontSize: 11, color: "#374151", lineHeight: 1.8, textAlign: "justify", marginBottom: 16 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        signatureSection: { marginTop: 40 },
        signatureImage: { height: 45, marginBottom: 5, objectFit: "contain" },
        signatureLine: { borderTopWidth: 1.5, borderTopColor: "#374151", paddingTop: 8, width: 160 },
        signatoryName: { fontSize: 11, fontWeight: 700, color: "#111827" },
        signatoryDetails: { fontSize: 9, color: "#6B7280", marginTop: 2 },
        
        footer: { position: "absolute", bottom: 40, left: 40, right: 40, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
        footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
    });

    return (
        <Document title={`Experience-Letter-${form.employeeName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.sidebar}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.sideTitle}>EXPERIENCE LETTER</Text>
                    <Text style={styles.sideRef}>Ref: {form.letterNumber}</Text>
                    
                    <Text style={styles.sideLabel}>Date</Text>
                    <Text style={styles.sideVal}>{form.letterDate}</Text>
                    
                    <Text style={styles.sideLabel}>Company</Text>
                    <Text style={styles.sideCompany}>{form.companyName || "Your Company"}</Text>
                    
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.sideLabel}>Contact Details</Text>
                        <Text style={styles.sideVal}>{form.companyPhone}</Text>
                        <Text style={styles.sideVal}>{form.companyEmail}</Text>
                        {form.companyWebsite && <Text style={styles.sideVal}>{form.companyWebsite}</Text>}
                    </View>
                </View>

                <View style={styles.main}>
                    <View style={styles.body}>
                        <Text style={styles.salutation}>To Whomsoever It May Concern,</Text>

                        <Text style={styles.content}>
                            {"This is to certify that "}
                            <Text style={styles.bold}>{empInfo}</Text>
                            {" was employed with "}
                            <Text style={[styles.bold, { color: T }]}>{form.companyName || "our organization"}</Text>
                            {form.designation ? " as " : ""}
                            <Text style={styles.bold}>{form.designation || ""}</Text>
                            {form.department ? " in the " + form.department + " department" : ""}
                            {" for the duration of "}
                            <Text style={styles.bold}>{joining}</Text>
                            {" to "}
                            <Text style={styles.bold}>{leaving}</Text>
                            {"."}
                        </Text>

                        <Text style={styles.content}>{perfText}</Text>
                        
                        {form.additionalNote && (
                            <Text style={styles.content}>{form.additionalNote}</Text>
                        )}

                        <Text style={styles.content}>
                            {"We appreciate their hard work during their tenure and wish "}
                            <Text style={styles.bold}>{form.employeeName || "them"}</Text>
                            {" success in all their future endeavors."}
                        </Text>
                    </View>

                    <View style={styles.signatureSection}>
                        {form.signature ? (
                            <Image src={form.signature} style={styles.signatureImage} />
                        ) : (
                            <View style={{ height: 45 }} />
                        )}
                        <View style={styles.signatureLine}>
                            <Text style={styles.signatoryName}>{form.signatoryName || "Authorized Official"}</Text>
                            <Text style={styles.signatoryDetails}>
                                {form.signatoryDesignation || "Designation"}
                                {form.signatoryDept ? ` | ${form.signatoryDept}` : ""}
                            </Text>
                            <Text style={styles.signatoryDetails}>{form.companyName || ""}</Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Secure Digital Experience Letter — DocMinty.com</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}