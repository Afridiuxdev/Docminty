"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function CertificateTemplate({ form }) {
    const T = form.templateColor || "#0D9488";
    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
        outerBorder: { margin: 20, borderTop: "8pt solid #F0F4F3", borderBottom: "8pt solid #F0F4F3", borderLeft: "8pt solid #F0F4F3", borderRight: "8pt solid #F0F4F3", padding: 0, position: "relative" },
        innerBorder: { border: `2pt solid ${T}`, margin: 8, padding: "32 40", alignItems: "center" },
        
        corner: { position: "absolute", width: 24, height: 24 },
        cornerTopLeft: { top: 16, left: 16, borderTop: `3pt solid ${T}`, borderLeft: `3pt solid ${T}` },
        cornerTopRight: { top: 16, right: 16, borderTop: `3pt solid ${T}`, borderRight: `3pt solid ${T}` },
        cornerBottomLeft: { bottom: 16, left: 16, borderBottom: `3pt solid ${T}`, borderLeft: `3pt solid ${T}` },
        cornerBottomRight: { bottom: 16, right: 16, borderBottom: `3pt solid ${T}`, borderRight: `3pt solid ${T}` },

        logo: { height: 50, objectFit: "contain", marginBottom: 12 },
        orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 4 },
        orgAddr: { fontSize: 9, color: "#9CA3AF", textAlign: "center", marginBottom: 2 },
        orgWeb: { fontSize: 9, color: "#9CA3AF", textAlign: "center", marginBottom: 20 },
        
        typeBadge: { backgroundColor: T, padding: "6 32", borderRadius: 4, marginBottom: 20 },
        typeText: { fontSize: 12, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff", textTransform: "uppercase", letterSpacing: 3, textAlign: "center" },
        
        certifyTxt: { fontSize: 12, color: "#6B7280", textAlign: "center", marginBottom: 10 },
        recipName: { fontSize: 32, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 10, marginBottom: 16, minWidth: 320 },
        descText: { fontSize: 12, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 450, marginBottom: 10 },
        courseName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textAlign: "center", marginBottom: 24 },
        
        metaRow: { flexDirection: "row", gap: 40, justifyContent: "center", marginBottom: 32 },
        metaItem: { alignItems: "center" },
        metaLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 },
        metaValue: { fontSize: 12, fontWeight: 700, color: "#111827" },
        
        sigSection: { flexDirection: "row", gap: 60, justifyContent: "center", alignItems: "flex-end" },
        sigBox: { alignItems: "center" },
        sigLine: { borderTopWidth: 1.5, borderTopColor: "#374151", width: 140, paddingTop: 6, marginTop: 8 },
        sigName: { fontSize: 11, fontWeight: 700, color: "#111827", textAlign: "center" },
        sigDesig: { fontSize: 9, color: "#9CA3AF", textAlign: "center" },
        
        qrBox: { width: 56, height: 56, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 6, alignItems: "center", justifyContent: "center", padding: 4 },
        verifId: { fontSize: 7, color: "#D1D5DB", textAlign: "center", marginTop: 12, fontFamily: "Inter" }
    });

    const addrParts = [
        form.orgAddress,
        (form.orgCity || stateName) ? `${form.orgCity ? form.orgCity + ", " : ""}${stateName}` : null
    ].filter(Boolean).join(", ");

    return (
        <Document title={`Certificate-${form.recipientName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.outerBorder}>
                    <View style={[styles.corner, styles.cornerTopLeft]} />
                    <View style={[styles.corner, styles.cornerTopRight]} />
                    <View style={[styles.corner, styles.cornerBottomLeft]} />
                    <View style={[styles.corner, styles.cornerBottomRight]} />
                    
                    <View style={styles.innerBorder}>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                        <Text style={styles.orgAddr}>{addrParts}</Text>
                        {form.orgWebsite && <Text style={styles.orgWeb}>{form.orgWebsite}</Text>}
                        
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText}>{form.certType || "PRIDE OF ACHIEVEMENT"}</Text>
                        </View>
                        
                        <Text style={styles.certifyTxt}>This is to certify that</Text>
                        <Text style={styles.recipName}>{form.recipientName || "Recipient Name"}</Text>
                        
                        <Text style={styles.descText}>
                            {form.description || "has successfully demonstrated exceptional performance and dedication in"}
                        </Text>
                        {form.course && <Text style={styles.courseName}>{form.course}</Text>}
                        
                        <View style={styles.metaRow}>
                            {form.duration && (
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Duration</Text>
                                    <Text style={styles.metaValue}>{form.duration}</Text>
                                </View>
                            )}
                            {form.grade && (
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Grade</Text>
                                    <Text style={[styles.metaValue, { color: T }]}>{form.grade}</Text>
                                </View>
                            )}
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Issue Date</Text>
                                <Text style={styles.metaValue}>{form.issueDate}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.sigSection}>
                            <View style={styles.sigBox}>
                                {form.signature && <Image src={form.signature} style={{ height: 45, marginBottom: 2, objectFit: "contain" }} />}
                                <View style={styles.sigLine}>
                                    <Text style={styles.sigName}>{form.signatoryName || "Authorized Signatory"}</Text>
                                    <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                                </View>
                            </View>
                            
                            {form.enableQR && (
                                <View style={{ alignItems: "center" }}>
                                    <View style={styles.qrBox}>
                                        {form.qrCodeDataUrl ? (
                                            <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%" }} />
                                        ) : (
                                            <View style={{ width: "100%", height: "100%", backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ fontSize: 8, color: "#D1D5DB" }}>QR</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 7, color: "#9CA3AF", marginTop: 4 }}>Verify Online</Text>
                                </View>
                            )}
                        </View>
                        
                        {form.enableQR && form.verificationId && (
                            <Text style={styles.verifId}>Verification ID: {form.verificationId}</Text>
                        )}
                        
                        <Text style={{ position: "absolute", bottom: -20, left: 10, fontSize: 8, color: "#D1D5DB" }}>Generated by DocMinty.com</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}