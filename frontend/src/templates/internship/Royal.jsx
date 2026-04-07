"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

const PERF_MAP = {
    excellent: "demonstrated exceptional commitment, creativity, and technical skills",
    good: "showed good work ethic and contributed meaningfully to the team",
    satisfactory: "performed their assigned duties satisfactorily"
};

export default function InternshipRoyalTemplate({ form }) {
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
        page: { padding: 8, fontFamily: "Inter", backgroundColor: "#fff" },
        border: { border: `8 solid ${T}`, margin: "8", height: "100%", borderRadius: 4, position: "relative" },
        inner: { flex: 1, border: `1px solid ${T}`, margin: "2", borderRadius: "2", padding: "28 36", alignItems: "center", justifyContent: "center", position: "relative" },
        
        corner: { position: "absolute", width: 16, height: 16 },
        cornerTL: { top: 8, left: 8, borderTop: `3pt solid ${T}`, borderLeft: `3pt solid ${T}` },
        cornerTR: { top: 8, right: 8, borderTop: `3pt solid ${T}`, borderRight: `3pt solid ${T}` },
        cornerBL: { bottom: 8, left: 8, borderBottom: `3pt solid ${T}`, borderLeft: `3pt solid ${T}` },
        cornerBR: { bottom: 8, right: 8, borderBottom: `3pt solid ${T}`, borderRight: `3pt solid ${T}` },

        logo: { height: 44, marginBottom: 10, objectFit: "contain" },
        orgName: { fontSize: 15, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2, textAlign: "center" },
        orgInfo: { fontSize: 10, color: "#9CA3AF", textAlign: "center", marginBottom: 2 },
        
        badge: { backgroundColor: T, color: "#ffffff", padding: "3 18", borderRadius: 2, marginTop: 12, marginBottom: 12 },
        badgeText: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 },
        
        intro: { fontSize: 10, color: "#6B7280", marginBottom: 5 },
        internName: { fontSize: 20, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", marginBottom: 8, borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 6, minWidth: 200, textAlign: "center" },
        
        content: { fontSize: 10, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 450, marginTop: 6 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        project: { fontSize: 10, color: "#374151", marginTop: 5 },
        issue: { fontSize: 9, color: "#9CA3AF", marginTop: 6 },
        
        footer: { width: "100%", marginTop: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
        sigBox: { minWidth: 110, textAlign: "left" },
        sigImage: { height: 35, width: 100, marginBottom: 2, objectFit: "contain" },
        sigLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4 },
        sigName: { fontSize: 10, fontWeight: 700, color: "#111827" },
        sigDesig: { fontSize: 9, color: "#9CA3AF" },
        
        qrBox: { width: 40, height: 40, backgroundColor: "#F0FDFA", border: `2px solid ${T}`, borderRadius: 5, alignItems: "center", justifyContent: "center", padding: 2, overflow: "hidden" },
        qrLabel: { fontSize: 8, color: "#9CA3AF", marginTop: 2 },
        verifyId: { fontSize: 8, color: "#D1D5DB", fontFamily: "Courier", marginTop: 6 }
    });

    return (
        <Document title={`Internship-Certificate-${form.internName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.border}>
                    <View style={styles.inner}>
                        <View style={[styles.corner, styles.cornerTL]} />
                        <View style={[styles.corner, styles.cornerTR]} />
                        <View style={[styles.corner, styles.cornerBL]} />
                        <View style={[styles.corner, styles.cornerBR]} />
                        
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                        {fullOrgAddr ? <Text style={styles.orgInfo}>{fullOrgAddr}</Text> : null}
                        {form.orgWebsite ? <Text style={styles.orgInfo}>{form.orgWebsite}</Text> : null}

                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Internship Certificate</Text>
                        </View>

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

                        <Text style={styles.issue}>Date of Issue: {issueDate}</Text>

                        <View style={styles.footer}>
                            <View style={styles.sigBox}>
                                {form.signature ? (
                                    <Image src={form.signature} style={styles.sigImage} />
                                ) : (
                                    <View style={{ height: 35 }} />
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
                                            <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%" }} />
                                        ) : (
                                            <View style={{ width: "100%", height: "100%", backgroundColor: "#F3F4F6" }} />
                                        )}
                                    </View>
                                    <Text style={styles.qrLabel}>Scan to Verify</Text>
                                </View>
                            )}
                        </View>
                        
                        {form.enableQR && (
                            <Text style={styles.verifyId}>ID: {form.verificationId}</Text>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
}
