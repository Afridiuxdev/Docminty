"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout.",
};

export default function MinimalTemplate({ form }) {
    const T = form.templateColor || "#111827";
    
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
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "48 60", backgroundColor: "#ffffff" },
        header: { marginBottom: 40 },
        logo: { height: 35, objectFit: "contain", marginBottom: 12 },
        title: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1 },
        dateText: { fontSize: 10, color: "#9CA3AF", marginTop: 4 },
        accentBar: { height: 2, backgroundColor: T, width: 40, marginTop: 12 },
        
        body: { marginTop: 32 },
        salutation: { fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 20 },
        content: { fontSize: 11, color: "#374151", lineHeight: 1.8, textAlign: "justify", marginBottom: 16 },
        bold: { fontWeight: 700, color: "#111827" },
        
        signatureSection: { marginTop: 48 },
        signatureImage: { height: 40, marginBottom: 5, objectFit: "contain" },
        signatureLine: { borderTopWidth: 1, borderTopColor: "#111827", paddingTop: 8, width: 150 },
        signatoryName: { fontSize: 11, fontWeight: 700, color: "#111827" },
        signatoryDetails: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
        
        footer: { position: "absolute", bottom: 48, left: 60, right: 60, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
        footerText: { fontSize: 9, color: "#D1D5DB" }
    });

    return (
        <Document title={`Experience-Letter-${form.employeeName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.title}>EXPERIENCE CERTIFICATE</Text>
                    <Text style={styles.dateText}>Issued Date: {form.letterDate}</Text>
                    <View style={styles.accentBar} />
                </View>

                <View style={styles.body}>
                    <Text style={styles.salutation}>To Whom It May Concern,</Text>

                    <Text style={styles.content}>
                        {"This serves to certify that "}
                        <Text style={styles.bold}>{empInfo}</Text>
                        {" was an employee of "}
                        <Text style={styles.bold}>{form.companyName || "the organization"}</Text>
                        {form.designation ? " serving as " : ""}
                        <Text style={styles.bold}>{form.designation || ""}</Text>
                        {form.department ? " within the " + form.department + " department" : ""}
                        {" from "}
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
                        {"We wish "}
                        <Text style={styles.bold}>{form.employeeName || "them"}</Text>
                        {" the very best in their future endeavors."}
                    </Text>
                </View>

                <View style={styles.signatureSection}>
                    {form.signature ? (
                        <Image src={form.signature} style={styles.signatureImage} />
                    ) : (
                        <View style={{ height: 40 }} />
                    )}
                    <View style={styles.signatureLine}>
                        <Text style={styles.signatoryName}>{form.signatoryName || "Authorized Signatory"}</Text>
                        <Text style={styles.signatoryDetails}>{form.signatoryDesignation || "Designation"}{form.signatoryDept ? ` | ${form.signatoryDept}` : ""}</Text>
                        <Text style={[styles.signatoryDetails, { marginTop: 1 }]}>{form.companyName || ""}</Text>
                    </View>
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Certified Digital Release via DocMinty.com</Text>
                    <View style={{ marginTop: 4 }}>
                        <Text style={{ fontSize: 8, color: "#F3F4F6" }}>
                            {form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""} {form.companyPhone && `| Ph: ${form.companyPhone}`} {form.companyWebsite && `| ${form.companyWebsite}`}
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}