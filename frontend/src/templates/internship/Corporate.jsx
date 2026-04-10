"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

const PERF_MAP = {
    excellent: "demonstrated exceptional commitment, creativity, and technical skills",
    good: "showed good work ethic and contributed meaningfully to the team",
    satisfactory: "performed their assigned duties satisfactorily"
};

export default function InternshipCorporateTemplate({ form }) {
    const T = form.templateColor || "#1E3A5F";

    const formatDate = (dateStr) => {
        if (!dateStr) return "DD Month YYYY";
        try {
            return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        } catch (e) {
            return dateStr;
        }
    };

    const start = formatDate(form.startDate);
    const end = formatDate(form.endDate);
    const issueDate = formatDate(form.issueDate);
    const perfText = PERF_MAP[form.performance] || PERF_MAP.excellent;

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 12, backgroundColor: "#ffffff" },
        outerBorder: { flex: 1, border: `3pt solid ${T}`, padding: 4 },
        midBorder: { flex: 1, border: "1px solid #D1D5DB", padding: "32 40", alignItems: "center", justifyContent: "center", position: "relative" },

        logo: { height: 44, marginBottom: 10, objectFit: "contain", alignSelf: "center" },
        orgName: { fontSize: 15, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2, textAlign: "center" },
        
        typeBadge: { backgroundColor: T, padding: "3 18", borderRadius: 2, marginTop: 10, marginBottom: 12, textAlign: "center", alignSelf: "center" },
        typeText: { color: "#ffffff", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, textAlign: "center" },
        
        intro: { fontSize: 10, color: "#6B7280", marginBottom: 5, textAlign: "center" },
        internName: { fontSize: 20, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", marginBottom: 8, borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 6, textAlign: "center", width: "100%" },
        
        content: { fontSize: 10, color: "#374151", textAlign: "center", lineHeight: 1.6, marginTop: 6, marginBottom: 6 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },

        sigArea: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", width: "100%", marginTop: 18 },
        sigBox: { minWidth: 110, textAlign: "left" },
        sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4 },
        sigName: { fontSize: 10, fontWeight: 700, color: "#111827" },
        sigDesig: { fontSize: 9, color: "#9CA3AF" },
 
        qrBox: { width: 40, height: 40, border: `2px solid ${T}`, borderRadius: 5, alignItems: "center", justifyContent: "center", overflow: "hidden" },
        verifyId: { fontSize: 8, color: "#D1D5DB", textAlign: "center", marginTop: 6, fontFamily: "Courier" },
        footer: { marginTop: 8, padding: "8 40", borderTopWidth: 1, borderTopColor: "#F3F4F6" },
        fText: { fontSize: 8, color: "#D1D5DB", textAlign: "center" }
    });

    return (
        <Document title={`Internship-Certificate-${form.internName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.outerBorder}>
                <View style={styles.midBorder}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>Internship Certificate</Text>
                    </View>

                    <View style={styles.body}>
                        <Text style={styles.intro}>This is to certify that</Text>
                        <Text style={styles.internName}>{form.internName || "Intern Name"}</Text>
 
                        <Text style={styles.content}>
                            {perfText} as <Text style={styles.bold}>{form.role || "Intern"}</Text>
                            {form.department ? ` in the ${form.department} department` : ""}
                            {" from "}
                            <Text style={styles.accent}>{start}</Text>
                            {" to "}
                            <Text style={styles.accent}>{end}</Text>.
                            {form.projectName ? <Text> Project: <Text style={styles.bold}>{form.projectName}</Text>.</Text> : null}
                        </Text>
                        <Text style={{ fontSize: 9, color: "#9CA3AF", marginTop: 6, textAlign: "center" }}>Date of Issue: {issueDate}</Text>

                    <View style={styles.sigArea}>
                        <View style={styles.sigBox}>
                            {form.signature ? (
                                <Image src={form.signature} style={{ height: 35, width: 100, objectFit: "contain", marginBottom: 2 }} />
                            ) : (
                                <View style={{ height: 28 }} />
                            )}
                            <View style={styles.sigLine}>
                                <Text style={styles.sigName}>{form.signatoryName || "Signatory Name"}</Text>
                                <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                            </View>
                        </View>

                        {form.enableQR && (
                            <View style={{ alignItems: "center" }}>
                                <View style={styles.qrBox}>
                                    {form.qrCodeDataUrl ? (
                                        <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%", padding: 2 }} />
                                    ) : (
                                        <View style={{ width: "100%", height: "100%", backgroundColor: "#F3F4F6" }} />
                                    )}
                                </View>
                                <Text style={{ fontSize: 8, color: "#9CA3AF", marginTop: 3 }}>Scan to Verify</Text>
                            </View>
                        )}
                    </View>

                    {form.enableQR && form.verificationId && (
                        <Text style={styles.verifyId}>Verification ID: {form.verificationId}</Text>
                    )}
                </View>
                </View>
                </View>
            </Page>
        </Document>
    );
}
