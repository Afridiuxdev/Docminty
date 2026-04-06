"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

const PERF_MAP = {
    excellent: "demonstrated exceptional commitment, creativity, and technical skills",
    good: "showed good work ethic and contributed meaningfully to the team",
    satisfactory: "performed their assigned duties satisfactorily"
};

export default function InternshipModernTemplate({ form }) {
    const T = form.templateColor || "#0D9488";
    
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
        page: { padding: 0, fontFamily: "Inter", backgroundColor: "#ffffff" },
        header: { backgroundColor: T, padding: "20 40", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
        logo: { height: 35, objectFit: "contain", filter: "brightness(0) invert(1)" },
        headerTitle: { fontSize: 13, fontFamily: "Space Grotesk", fontWeight: 800, color: "#ffffff", textTransform: "uppercase", letterSpacing: 1.5 },
        
        main: { padding: "40 60", alignItems: "center" },
        orgName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 },
        orgInfo: { fontSize: 9, color: "#9CA3AF", textAlign: "center", marginBottom: 2 },
        
        divider: { width: 50, height: 3, backgroundColor: T, margin: "20 0" },
        
        intro: { fontSize: 10, color: "#6B7280", marginBottom: 10 },
        internName: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", marginBottom: 15 },
        
        content: { fontSize: 11, color: "#374151", textAlign: "center", lineHeight: 1.8, maxWidth: 460 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        project: { fontSize: 10, color: "#374151", marginTop: 20 },
        issue: { fontSize: 9, color: "#9CA3AF", marginTop: 15 },
        
        footer: { width: "100%", marginTop: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
        sigBox: { width: 140 },
        sigImage: { height: 35, marginBottom: 5, objectFit: "contain" },
        sigLine: { borderTopWidth: 1, borderTopColor: "#111827", paddingTop: 5 },
        sigName: { fontSize: 10, fontWeight: 700, color: "#111827" },
        sigDesig: { fontSize: 8, color: "#6B7280" },
        
        qrBox: { alignItems: "center" },
        qrImage: { width: 40, height: 40, marginBottom: 5 },
        qrLabel: { fontSize: 7, color: "#9CA3AF" },
        verifyId: { fontSize: 7, color: "#D1D5DB", fontFamily: "Courier", marginTop: 10 }
    });

    return (
        <Document title={`Internship-Certificate-${form.internName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.headerTitle}>Internship Certificate</Text>
                </View>

                <View style={styles.main}>
                    <Text style={styles.orgName}>{form.orgName || "ORGANISATION"}</Text>
                    {fullOrgAddr ? <Text style={styles.orgInfo}>{fullOrgAddr}</Text> : null}
                    {form.orgWebsite ? <Text style={styles.orgInfo}>{form.orgWebsite}</Text> : null}

                    <View style={styles.divider} />

                    <Text style={styles.intro}>This is to certify that</Text>
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
                        <Text style={styles.project}>Project: <Text style={styles.bold}>{form.projectName}</Text></Text>
                    )}

                    <Text style={styles.issue}>Issued on: {issueDate}</Text>

                    <View style={styles.footer}>
                        <View style={styles.sigBox}>
                            {form.signature ? (
                                <Image src={form.signature} style={styles.sigImage} />
                            ) : (
                                <View style={{ height: 35 }} />
                            )}
                            <View style={styles.sigLine}>
                                <Text style={styles.sigName}>{form.signatoryName || "Authorized Official"}</Text>
                                <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                            </View>
                        </View>

                        <View style={{ alignItems: "center" }}>
                            {form.enableQR && (
                                <View style={styles.qrBox}>
                                    {form.qrCodeDataUrl && <Image src={form.qrCodeDataUrl} style={styles.qrImage} />}
                                    <Text style={styles.qrLabel}>Verify</Text>
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
