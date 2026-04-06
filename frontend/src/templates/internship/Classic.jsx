"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

const PERF_MAP = {
    excellent: "demonstrated exceptional commitment, creativity, and technical skills",
    good: "showed good work ethic and contributed meaningfully to the team",
    satisfactory: "performed their assigned duties satisfactorily"
};

export default function InternshipClassicTemplate({ form }) {
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
        page: { padding: 40, fontFamily: "Inter" },
        border: { border: "5 solid #F0F4F3", padding: 10, height: "100%", borderRadius: 6, position: "relative" },
        outline: { border: `2 solid ${T}`, padding: 40, height: "100%", borderRadius: 4, alignItems: "center", backgroundColor: "#ffffff" },
        background: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03 },
        
        logo: { height: 50, marginBottom: 15, objectFit: "contain" },
        orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5, textAlign: "center" },
        orgInfo: { fontSize: 9, color: "#6B7280", textAlign: "center", marginBottom: 2 },
        
        badge: { backgroundColor: T, color: "#ffffff", padding: "4 24", borderRadius: 2, marginTop: 20, marginBottom: 25 },
        badgeText: { fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 },
        
        intro: { fontSize: 11, color: "#6B7280", marginBottom: 10 },
        internName: { fontSize: 26, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", marginBottom: 10, borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 5 },
        
        content: { fontSize: 11, color: "#374151", textAlign: "center", lineHeight: 1.8, maxWidth: 450, marginTop: 10 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        project: { fontSize: 10, color: "#374151", marginTop: 15 },
        issue: { fontSize: 9, color: "#9CA3AF", marginTop: 15 },
        
        footer: { width: "100%", marginTop: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
        sigBox: { width: 140, textAlign: "left" },
        sigImage: { height: 35, marginBottom: 5, objectFit: "contain" },
        sigLine: { borderTopWidth: 1, borderTopColor: "#111827", paddingTop: 5 },
        sigName: { fontSize: 10, fontWeight: 700, color: "#111827" },
        sigDesig: { fontSize: 8, color: "#6B7280" },
        
        qrBox: { alignItems: "center" },
        qrImage: { width: 45, height: 45, marginBottom: 5 },
        qrLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase" },
        verifyId: { fontSize: 7, color: "#D1D5DB", fontFamily: "Courier", marginTop: 10 }
    });

    return (
        <Document title={`Internship-Certificate-${form.internName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.border}>
                    <View style={styles.outline}>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.orgName}>{form.orgName || "ORGANISATION NAME"}</Text>
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
                                    <Text style={styles.sigName}>{form.signatoryName || "Authorized Official"}</Text>
                                    <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                                    <Text style={styles.sigDesig}>{form.orgName || ""}</Text>
                                </View>
                            </View>

                            <View style={{ alignItems: "center" }}>
                                {form.enableQR && (
                                    <View style={styles.qrBox}>
                                        {form.qrCodeDataUrl && <Image src={form.qrCodeDataUrl} style={styles.qrImage} />}
                                        <Text style={styles.qrLabel}>Verify Certificate</Text>
                                    </View>
                                )}
                            </View>
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
