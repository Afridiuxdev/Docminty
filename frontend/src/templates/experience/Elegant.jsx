"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation, and they consistently maintained a high standard of excellence in all their assignments.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member with a commendable level of professionalism.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout their employment with our organization.",
};

export default function ElegantTemplate({ form }) {
    const T = form.templateColor || "#D97706";
    const BG = "#FFFDF5";
    
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
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "40 60", backgroundColor: BG },
        topBorder: { height: 6, backgroundColor: T, position: "absolute", top: 0, left: 0, right: 0 },
        header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)", paddingBottom: 20, marginBottom: 32 },
        logo: { height: 45, objectFit: "contain", marginBottom: 8 },
        compName: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827" },
        compAddr: { fontSize: 8, color: "#9CA3AF", marginTop: 2 },
        
        titleSection: { textAlign: "right" },
        title: { fontSize: 22, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5 },
        refDate: { fontSize: 9, color: "#9CA3AF", marginTop: 4, fontFamily: "Inter" },
        
        body: { marginTop: 24 },
        salutation: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 20 },
        content: { fontSize: 11, color: "#374151", lineHeight: 2, textAlign: "justify", marginBottom: 18 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        signSection: { marginTop: 48, flexDirection: "row", justifyContent: "flex-end" },
        signatureImage: { height: 45, marginBottom: 4, objectFit: "contain", alignSelf: "flex-end" },
        signBox: { width: 180, textAlign: "right" },
        signLine: { borderTopWidth: 1.5, borderTopColor: T, paddingTop: 8, marginTop: 8 },
        signName: { fontSize: 11, fontWeight: 700, color: "#111827" },
        signDesig: { fontSize: 9, color: "#6B7280", marginTop: 2 },
        
        footer: { position: "absolute", bottom: 40, left: 60, right: 60, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)", paddingTop: 12 },
        footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center", fontStyle: "italic" }
    });

    return (
        <Document title={`Experience-Letter-${form.employeeName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.topBorder} />
                <View style={styles.header}>
                    <View>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.compName}>{form.companyName || "Organization Name"}</Text>
                        <View style={{ marginTop: 2 }}>
                             <Text style={styles.compAddr}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}</Text>
                             {form.companyWebsite && <Text style={styles.compAddr}>{form.companyWebsite}</Text>}
                        </View>
                    </View>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Relieving Letter</Text>
                        <Text style={styles.refDate}>Ref: {form.letterNumber}</Text>
                        <Text style={styles.refDate}>{form.letterDate}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.salutation}>To Whomsoever It May Concern,</Text>

                    <Text style={styles.content}>
                        {"This is to certify that "}
                        <Text style={styles.bold}>{empInfo}</Text>
                        {" has been in employment with "}
                        <Text style={styles.bold}>{form.companyName || "the organization"}</Text>
                        {form.designation ? " as " : ""}
                        <Text style={styles.bold}>{form.designation || ""}</Text>
                        {form.department ? " in the " + form.department + " department" : ""}
                        {" from "}
                        <Text style={styles.accent}>{joining}</Text>
                        {" until "}
                        <Text style={styles.accent}>{leaving}</Text>
                        {"."}
                    </Text>

                    <Text style={styles.content}>{perfText}</Text>
                    
                    {form.additionalNote && (
                        <Text style={styles.content}>{form.additionalNote}</Text>
                    )}

                    <Text style={styles.content}>
                        {"We wish "}
                        <Text style={styles.bold}>{form.employeeName || "the employee"}</Text>
                        {" the very best for all future professional and personal endeavors."}
                    </Text>

                    <View style={styles.signSection}>
                        <View style={styles.signBox}>
                            {form.signature ? (
                                <Image src={form.signature} style={styles.signatureImage} />
                            ) : (
                                <View style={{ height: 45 }} />
                            )}
                            <View style={styles.signLine}>
                                <Text style={styles.signName}>{form.signatoryName || "Authorised Signatory"}</Text>
                                <Text style={styles.signDesig}>{form.signatoryDesignation || "Designation"}{form.signatoryDept ? ` | ${form.signatoryDept}` : ""}</Text>
                                <Text style={styles.signDesig}>{form.companyName || ""}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>This document qualifies as a valid experience record. Issued via DocMinty Elegant.</Text>
                </View>
            </Page>
        </Document>
    );
}