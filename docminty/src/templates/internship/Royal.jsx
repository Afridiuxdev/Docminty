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
    const T = form.templateColor || "#B8860B";
    
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
        page: { padding: 30, fontFamily: "Inter", backgroundColor: "#ffffff" },
        royalBorder: { border: `10 double ${T}`, height: "100%", padding: 20, borderRadius: 4 },
        corner: { position: "absolute", width: 30, height: 30, borderColor: T },
        cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
        cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
        cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
        cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
        
        main: { flex: 1, alignItems: "center", padding: "40 50" },
        logo: { height: 60, marginBottom: 20, objectFit: "contain" },
        orgName: { fontSize: 20, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 2, marginBottom: 5 },
        orgInfo: { fontSize: 10, color: "#9CA3AF", textAlign: "center", marginBottom: 2 },
        
        titleBox: { margin: "30 0", alignItems: "center" },
        title: { fontSize: 14, fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 5 },
        subtitle: { fontSize: 8, color: "#9CA3AF", marginTop: 5, letterSpacing: 1 },
        
        intro: { fontSize: 11, color: "#6B7280", fontStyle: "italic", marginBottom: 15 },
        internName: { fontSize: 34, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", marginBottom: 20, textDecoration: "underline" },
        
        content: { fontSize: 12, color: "#374151", textAlign: "center", lineHeight: 2, maxWidth: 480 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        project: { fontSize: 11, color: "#374151", marginTop: 30 },
        issue: { fontSize: 10, color: "#9CA3AF", marginTop: 25 },
        
        footer: { width: "100%", marginTop: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
        sigBox: { width: 180 },
        signatureImage: { height: 45, marginBottom: 5, objectFit: "contain" },
        sigLine: { borderTopWidth: 2, borderTopColor: T, paddingTop: 10 },
        sigName: { fontSize: 12, fontWeight: 700, color: "#111827" },
        sigDesig: { fontSize: 10, color: "#6B7280" },
        
        qrBox: { alignItems: "center" },
        qrImage: { width: 50, height: 50, marginBottom: 5 },
        qrLabel: { fontSize: 8, color: "#9CA3AF" },
        verifyId: { fontSize: 8, color: "#D3D3D3", position: "absolute", bottom: -10, left: 0 }
    });

    return (
        <Document title={`Royal-Certificate-${form.internName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.royalBorder}>
                    <View style={[styles.corner, styles.cornerTL]} />
                    <View style={[styles.corner, styles.cornerTR]} />
                    <View style={[styles.corner, styles.cornerBL]} />
                    <View style={[styles.corner, styles.cornerBR]} />
                    
                    <View style={styles.main}>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.orgName}>{form.orgName || "ORGANISATION NAME"}</Text>
                        {fullOrgAddr ? <Text style={styles.orgInfo}>{fullOrgAddr}</Text> : null}
                        {form.orgWebsite ? <Text style={styles.orgInfo}>{form.orgWebsite}</Text> : null}

                        <View style={styles.titleBox}>
                            <Text style={styles.title}>Internship Completion Certificate</Text>
                            <Text style={styles.subtitle}>OFFICIAL RECOGNITION OF PROFESSIONAL EXCELLENCE</Text>
                        </View>

                        <Text style={styles.intro}>This high distinction is hereby awarded to</Text>
                        <Text style={styles.internName}>{form.internName || "Intern Name"}</Text>

                        <Text style={styles.content}>
                            {perfText} as <Text style={styles.bold}>{form.role || "Intern"}</Text>
                            {form.department ? ` in the ${form.department} department` : ""}
                            {" during their tenure from "}
                            <Text style={styles.accent}>{start}</Text>
                            {" to "}
                            <Text style={styles.accent}>{end}</Text>
                            {"."}
                        </Text>

                        {form.projectName && (
                            <Text style={styles.project}>For successful completion of project: <Text style={styles.bold}>{form.projectName}</Text></Text>
                        )}

                        <Text style={styles.issue}>Issue Date: {issueDate}</Text>

                        <View style={styles.footer}>
                            <View style={styles.sigBox}>
                                {form.signature ? (
                                    <Image src={form.signature} style={styles.signatureImage} />
                                ) : (
                                    <View style={{ height: 45 }} />
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
                                        <Text style={styles.qrLabel}>Status: Verified</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        
                        {form.enableQR && (
                            <Text style={styles.verifyId}>CERT-ID: {form.verificationId}</Text>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
}
