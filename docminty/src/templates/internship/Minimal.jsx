"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

const PERF_MAP = {
    excellent: "demonstrated exceptional commitment, creativity, and technical skills",
    good: "showed good work ethic and contributed meaningfully to the team",
    satisfactory: "performed their assigned duties satisfactorily"
};

export default function InternshipMinimalTemplate({ form }) {
    const T = form.templateColor || "#111827";
    
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

    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";
    const fullOrgAddr = [
        form.orgAddress,
        (form.orgCity || stateName) ? `${form.orgCity ? form.orgCity + ", " : ""}${stateName}` : null
    ].filter(Boolean).join(", ");

    const styles = StyleSheet.create({
        page: { padding: 50, fontFamily: "Inter", backgroundColor: "#ffffff" },
        borderTop: { borderTopWidth: 3, borderTopColor: T, height: "100%", paddingTop: 30, alignItems: "center" },
        
        logo: { height: 35, marginBottom: 15, objectFit: "contain" },
        orgName: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 },
        orgInfo: { fontSize: 8, color: "#9CA3AF", textAlign: "center", marginBottom: 2 },
        
        title: { fontSize: 10, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1.5, margin: "20 0 30" },
        
        intro: { fontSize: 9, color: "#6B7280", marginBottom: 8 },
        internName: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", marginBottom: 15 },
        
        content: { fontSize: 10, color: "#374151", textAlign: "center", lineHeight: 1.8, maxWidth: 440 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        project: { fontSize: 9, color: "#374151", marginTop: 15 },
        issue: { fontSize: 8, color: "#9CA3AF", marginTop: 15 },
        
        footer: { width: "100%", marginTop: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
        sigBox: { width: 140 },
        sigLine: { borderTopWidth: 1, borderTopColor: "#111827", paddingTop: 5 },
        sigName: { fontSize: 10, fontWeight: 700, color: "#111827" },
        sigDesig: { fontSize: 8, color: "#6B7280" },
        
        qrBox: { alignItems: "center" },
        qrImage: { width: 35, height: 35, marginBottom: 5 },
        qrLabel: { fontSize: 6, color: "#9CA3AF" },
        verifyId: { fontSize: 7, color: "#E5E7EB", position: "absolute", bottom: 0, right: 0 }
    });

    return (
        <Document title={`Internship-Certificate-${form.internName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.borderTop}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.orgName}>{form.orgName || "ORGANISATION"}</Text>
                    {fullOrgAddr ? <Text style={styles.orgInfo}>{fullOrgAddr}</Text> : null}
                    {form.orgWebsite ? <Text style={styles.orgInfo}>{form.orgWebsite}</Text> : null}

                    <Text style={styles.title}>Certificate of Internship</Text>

                    <Text style={styles.intro}>Presented To</Text>
                    <Text style={styles.internName}>{form.internName || "Intern Name"}</Text>

                    <Text style={styles.content}>
                        {perfText} as <Text style={styles.bold}>{form.role || "Intern"}</Text>
                        {form.department ? ` in the ${form.department} department` : ""}
                        {" from "}
                        <Text style={styles.accent}>{start}</Text>
                        {" to "}
                        <Text style={styles.accent}>{end}</Text>
                        {"."}
                    </Text>

                    {form.projectName && (
                        <Text style={styles.project}>Project Title: <Text style={styles.bold}>{form.projectName}</Text></Text>
                    )}

                    <Text style={styles.issue}>Issue Date: {issueDate}</Text>

                    <View style={styles.footer}>
                        <View style={styles.sigBox}>
                            {form.signature ? (
                                <Image src={form.signature} style={{ height: 30, marginBottom: 2, objectFit: "contain" }} />
                            ) : (
                                <View style={{ height: 30 }} />
                            )}
                            <View style={styles.sigLine}>
                                <Text style={styles.sigName}>{form.signatoryName || "Authorized Signatory"}</Text>
                                <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                            </View>
                        </View>

                        <View style={{ alignItems: "center" }}>
                            {form.enableQR && (
                                <View style={styles.qrBox}>
                                    {form.qrCodeDataUrl && <Image src={form.qrCodeDataUrl} style={styles.qrImage} />}
                                    <Text style={styles.qrLabel}>Verify Online</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    
                    {form.enableQR && (
                        <Text style={styles.verifyId}>ID: {form.verificationId}</Text>
                    )}
                </View>
            </Page>
        </Document>
    );
}
