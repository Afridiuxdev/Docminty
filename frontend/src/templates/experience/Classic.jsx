"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation, and they consistently exceeded expectations in their role.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member with a positive attitude.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout their employment with us.",
};

export default function ExperienceLetterTemplate({ form }) {
    const T = form.templateColor || "#0D9488";
    
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
    const empInfo = (form.employeeName || "[Employee Name]") + (form.employeeId ? ` (Employee ID: ${form.employeeId})` : "");

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "48 60", backgroundColor: "#ffffff" },
        header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 16, marginBottom: 32 },
        logo: { height: 40, objectFit: "contain", marginBottom: 8 },
        companyName: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827" },
        companyDetails: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
        
        titleSection: { textAlign: "right" },
        title: { fontSize: 20, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1 },
        metaText: { fontSize: 9, color: "#9CA3AF", marginTop: 4, fontFamily: "Inter" },
        
        body: { marginTop: 32 },
        salutation: { fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 16 },
        content: { fontSize: 11, color: "#374151", lineHeight: 1.8, textAlign: "justify", marginBottom: 16 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        signatureSection: { marginTop: 48, width: 220 },
        signatureImage: { height: 45, marginBottom: 4, objectFit: "contain" },
        signatureLine: { borderTopWidth: 1.5, borderTopColor: "#374151", paddingTop: 8, marginTop: 12 },
        signatoryName: { fontSize: 11, fontWeight: 700, color: "#111827" },
        signatoryDetails: { fontSize: 9, color: "#6B7280", marginTop: 2, lineHeight: 1.3 },
        
        footer: { position: "absolute", bottom: 40, left: 60, right: 60, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 10 },
        footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
    });

    return (
        <Document title={`Experience-Letter-${form.employeeName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.companyName}>{form.companyName || "Your Company"}</Text>
                        <View style={styles.companyDetails}>
                            <Text>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}</Text>
                            {(form.companyPhone || form.companyEmail) && (
                                <Text>{form.companyPhone && `Ph: ${form.companyPhone} `}{form.companyEmail && `Em: ${form.companyEmail}`}</Text>
                            )}
                            {form.companyWebsite && <Text>{form.companyWebsite}</Text>}
                        </View>
                    </View>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>EXPERIENCE LETTER</Text>
                        <Text style={styles.metaText}>Ref: {form.letterNumber}</Text>
                        <Text style={styles.metaText}>Date: {form.letterDate}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.salutation}>To Whomsoever It May Concern,</Text>

                    <Text style={styles.content}>
                        {"This is to formally certify that "}
                        <Text style={styles.bold}>{empInfo}</Text>
                        {" was an integral part of our team at "}
                        <Text style={styles.bold}>{form.companyName || "[Company Name]"}</Text>
                        {form.designation ? " in the capacity of " : ""}
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
                        {"We would like to express our appreciation for their contributions and wish "}
                        <Text style={styles.bold}>{form.employeeName || "them"}</Text>
                        {" the very best for all future professional and personal endeavors."}
                    </Text>
                </View>

                <View style={styles.signatureSection}>
                    {form.signature ? (
                        <Image src={form.signature} style={styles.signatureImage} />
                    ) : (
                        <View style={{ height: 45 }} />
                    )}
                    <View style={styles.signatureLine}>
                        <Text style={styles.signatoryName}>{form.signatoryName || "Authorised Signatory"}</Text>
                        <View style={styles.signatoryDetails}>
                            <Text>{form.signatoryDesignation || "Designation"}{form.signatoryDept ? ` — ${form.signatoryDept}` : ""}</Text>
                            <Text>{form.companyName || "Organization"}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Certified Digital Experience Letter — Generated via DocMinty.com</Text>
                </View>
            </Page>
        </Document>
    );
}