"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout.",
};

export default function ElegantTemplate({ form }) {
    const T = form.templateColor || "#D97706";
    
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

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "40 50", backgroundColor: "#ffffff" },
        headerSection: { paddingBottom: 12, marginBottom: 0 },
        headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 },
        logo: { height: 36, objectFit: "contain", marginBottom: 6 },
        compName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827" },
        compDetails: { fontSize: 10, color: "#6B7280", lineHeight: 1.4 },
        
        title: { fontSize: 22, fontFamily: "Space Grotesk", fontWeight: 800, color: T },
        metaText: { fontSize: 11, color: "#6B7280", textAlign: "right", fontFamily: "Space Grotesk" },
        accentBar: { height: 4, backgroundColor: T, borderRadius: 2, marginBottom: 24 },
        
        body: { marginTop: 20 },
        salutation: { fontSize: 12, color: "#374151", marginBottom: 16 },
        content: { fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 12 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        signatureSection: { marginTop: 32 },
        signatureImage: { maxHeight: 45, maxWidth: 140, marginBottom: 4, objectFit: "contain" },
        signatureLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 140 },
        signatoryName: { fontSize: 12, fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk" },
        signatoryDetails: { fontSize: 11, color: "#6B7280", marginTop: 2, lineHeight: 1.3 },
        
        footer: { position: "absolute", bottom: 40, left: 50, right: 50, borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 10 },
        footerText: { fontSize: 10, color: "#D1D5DB" }
    });

    return (
        <Document title={`Experience-Letter-${form.employeeName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerSection}>
                    <View style={styles.headerTop}>
                        <View>
                            {form.logo && <Image src={form.logo} style={styles.logo} />}
                            <Text style={styles.compName}>{form.companyName || "Company Name"}</Text>
                            <View style={styles.compDetails}>
                                <Text>{[form.companyAddress, form.companyCity].filter(Boolean).join(", ")}</Text>
                                {(form.companyPhone || form.companyEmail) && (
                                    <Text>{[form.companyPhone && `Ph: ${form.companyPhone}`, form.companyEmail && `Em: ${form.companyEmail}`].filter(Boolean).join(" | ")}</Text>
                                )}
                                {form.companyWebsite && <Text>{form.companyWebsite}</Text>}
                            </View>
                        </View>
                        <View style={{ textAlign: "right" }}>
                            <Text style={styles.title}>EXPERIENCE LETTER</Text>
                            <Text style={styles.metaText}>Ref: {form.letterNumber}</Text>
                            <Text style={styles.metaText}>{form.letterDate}</Text>
                        </View>
                    </View>
                    <View style={styles.accentBar} />
                </View>

                <View style={styles.body}>
                    <Text style={styles.salutation}>To Whomsoever It May Concern,</Text>

                    <Text style={styles.content}>
                        {"This is to certify that "}
                        <Text style={styles.bold}>{form.employeeName || "[Employee Name]"}</Text>
                        {form.employeeId ? ` (Employee ID: ${form.employeeId})` : ""}
                        {" was employed with "}
                        <Text style={styles.bold}>{form.companyName || "[Company Name]"}</Text>
                        {form.designation ? " as " + form.designation : ""}
                        {form.department ? " in the " + form.department + " department" : ""}
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
                        {"We wish "}
                        <Text style={styles.bold}>{form.employeeName || "them"}</Text>
                        {" all the best in their future endeavours."}
                    </Text>

                    <View style={styles.signatureSection} wrap={false}>
                        {form.signature ? (
                            <Image src={form.signature} style={styles.signatureImage} />
                        ) : (
                            <View style={{ height: 40 }} />
                        )}
                        <View style={styles.signatureLine}>
                            <Text style={styles.signatoryName}>{form.signatoryName || "Authorised Signatory"}</Text>
                            <Text style={styles.signatoryDetails}>{form.signatoryDesignation || "Designation"}</Text>
                            {form.signatoryDept && <Text style={styles.signatoryDetails}>{form.signatoryDept}</Text>}
                            <Text style={styles.signatoryDetails}>{form.companyName}</Text>
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