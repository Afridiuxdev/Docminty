"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation, reflecting a high degree of commitment and proactive problem-solving.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member with a positive contribution to our projects.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout their duration of employment.",
};

export default function BoldTemplate({ form }) {
    const T = form.templateColor || "#EF4444";
    
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
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "48 60" },
        header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 3, borderBottomColor: T, paddingBottom: 16, marginBottom: 32 },
        logo: { height: 40, objectFit: "contain", marginBottom: 8 },
        companyName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase" },
        companyDetails: { fontSize: 9, color: "#6B7280", marginTop: 4, lineHeight: 1.4 },
        
        titleSection: { textAlign: "right" },
        title: { fontSize: 22, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2 },
        metaText: { fontSize: 9, color: "#9CA3AF", marginTop: 4, fontFamily: "Inter", fontWeight: 700 },
        
        body: { marginTop: 32 },
        salutation: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 20 },
        content: { fontSize: 11, color: "#374151", lineHeight: 2, textAlign: "justify", marginBottom: 16 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        signatureSection: { marginTop: 48, width: 220, alignSelf: "flex-start" },
        signatureImage: { height: 45, marginBottom: 6, objectFit: "contain" },
        signatureBox: { padding: "16 0 0 0", borderTopWidth: 2, borderTopColor: "#374151" },
        signatoryName: { fontSize: 11, fontWeight: 700, color: "#111827" },
        signatoryDetails: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
        
        footer: { position: "absolute", bottom: 40, left: 60, right: 60, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
        footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }
    });

    return (
        <Document title={`Experience-Letter-Bold-${form.employeeName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.companyName}>{form.companyName || "Organization"}</Text>
                        <View style={styles.companyDetails}>
                            <Text>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}</Text>
                            {(form.companyPhone || form.companyEmail) && (
                                <Text>{form.companyPhone && `Ph: ${form.companyPhone} `} {form.companyEmail && `• ${form.companyEmail}`}</Text>
                            )}
                            {form.companyWebsite && <Text>{form.companyWebsite}</Text>}
                        </View>
                    </View>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>EXPERIENCE RECORD</Text>
                        <Text style={styles.metaText}>REF: {form.letterNumber}</Text>
                        <Text style={styles.metaText}>DATE: {form.letterDate}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.salutation}>To Whom It May Concern,</Text>

                    <Text style={styles.content}>
                        {"This is to formally certify that "}
                        <Text style={styles.bold}>{empInfo}</Text>
                        {" was an employee of "}
                        <Text style={styles.bold}>{form.companyName || "the organization"}</Text>
                        {form.designation ? " as " : ""}
                        <Text style={styles.bold}>{form.designation || ""}</Text>
                        {form.department ? " within the " + form.department + " department" : ""}
                        {" from "}
                        <Text style={styles.accent}>{joining}</Text>
                        {" to "}
                        <Text style={styles.accent}>{leaving}</Text>
                        {"."}
                    </Text>

                    <Text style={styles.content}>{perfText}</Text>
                    
                    {form.additionalNote && (
                        <Text style={styles.content}>{form.additionalNote}</Text>
                    )}

                    <Text style={styles.content}>
                        {"We value their contribution during their tenure and wish "}
                        <Text style={styles.bold}>{form.employeeName || "them"}</Text>
                        {" continued success in all their future professional endeavors."}
                    </Text>
                </View>

                <View style={styles.signatureSection}>
                    {form.signature ? (
                        <Image src={form.signature} style={styles.signatureImage} />
                    ) : (
                        <View style={{ height: 45 }} />
                    )}
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatoryName}>{form.signatoryName || "Authorized Signatory"}</Text>
                        <Text style={styles.signatoryDetails}>{form.signatoryDesignation || "Designation"}{form.signatoryDept ? ` — ${form.signatoryDept}` : ""}</Text>
                        <Text style={styles.signatoryDetails}>{form.companyName || ""}</Text>
                    </View>
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Official Document Release — Verified via DocMinty.com</Text>
                </View>
            </Page>
        </Document>
    );
}