"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function CertificateTemplate({ form }) {
    const T = form.templateColor || "#0D9488";
    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
        // Replaced outerBorder 92% height with flex:1 and nested View for standard borders
        outerWrapper: { flex: 1, padding: 12 },
        outerBorder: { flex: 1, border: "8pt solid #F0F4F3", padding: 8, position: "relative" },
        innerBorder: { flex: 1, border: `1px solid ${T}`, padding: "32 40", alignItems: "center", justifyContent: "center", position: "relative" },
        // Replaced outline with a secondary border-like view
        secondaryBorder: { position: "absolute", top: 8, left: 8, right: 8, bottom: 8, border: `2px solid ${T}`, pointerEvents: "none" },
        
        corner: { position: "absolute", width: 24, height: 24, zIndex: 10 },
        cornerTopLeft: { top: 6, left: 6, borderTop: `3pt solid ${T}`, borderLeft: `3pt solid ${T}` },
        cornerTopRight: { top: 6, right: 6, borderTop: `3pt solid ${T}`, borderRight: `3pt solid ${T}` },
        cornerBottomLeft: { bottom: 6, left: 6, borderBottom: `3pt solid ${T}`, borderLeft: `3pt solid ${T}` },
        cornerBottomRight: { bottom: 6, right: 6, borderBottom: `3pt solid ${T}`, borderRight: `3pt solid ${T}` },

        logo: { height: 52, objectFit: "contain", marginBottom: 12 },
        orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 4 },
        orgAddr: { fontSize: 11, color: "#9CA3AF", textAlign: "center", marginBottom: 2 },
        orgWeb: { fontSize: 11, color: "#9CA3AF", textAlign: "center", marginBottom: 20 },
        
        typeBadge: { backgroundColor: T, padding: "6 28", borderRadius: 2, marginBottom: 20 },
        typeText: { fontSize: 13, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff", textTransform: "uppercase", letterSpacing: 3, textAlign: "center" },
        
        certifyTxt: { fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 8 },
        recipName: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 8, marginBottom: 12, minWidth: 200 },
        descText: { fontSize: 13, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 400, marginBottom: 8 },
        courseName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textAlign: "center", marginBottom: 8 },
        
        metaRow: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
        metaItem: { alignItems: "center", marginHorizontal: 12 },
        metaLabel: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2 },
        metaValue: { fontSize: 13, fontWeight: 700, color: "#111827" },
        
        sigArea: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end", width: "100%", marginTop: 10 },
        sigBox: { alignItems: "center", width: 140, marginRight: 48 }, // Using margin instead of gap
        sigLine: { borderTopWidth: 2, borderTopColor: "#374151", paddingTop: 6, width: "100%", alignItems: "center" },
        sigName: { fontSize: 12, fontWeight: 700, color: "#111827", textAlign: "center" },
        sigDesig: { fontSize: 10, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
        
        qrSection: { alignItems: "center" },
        qrBox: { width: 56, height: 56, border: `2px solid ${T}`, borderRadius: 4, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F9FA", overflow: "hidden" },
        verifId: { fontSize: 9, color: "#D1D5DB", textAlign: "center", marginTop: 12, fontFamily: "Courier", letterSpacing: 0.5 }
    });

    const addrParts = [
        form.orgAddress,
        (form.orgCity || stateName) ? `${form.orgCity ? form.orgCity + ", " : ""}${stateName}` : null
    ].filter(Boolean).join(", ");

    return (
        <Document title={`Certificate-${form.recipientName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.outerWrapper}>
                    <View style={styles.outerBorder}>
                        <View style={styles.innerBorder}>
                            <View style={styles.secondaryBorder} />
                            <View style={[styles.corner, styles.cornerTopLeft]} />
                            <View style={[styles.corner, styles.cornerTopRight]} />
                            <View style={[styles.corner, styles.cornerBottomLeft]} />
                            <View style={[styles.corner, styles.cornerBottomRight]} />

                            {form.logo && <Image src={form.logo} style={styles.logo} />}
                            <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                            {addrParts ? <Text style={styles.orgAddr}>{addrParts}</Text> : null}
                            {form.orgWebsite && <Text style={styles.orgWeb}>{form.orgWebsite}</Text>}
                            
                            <View style={styles.typeBadge}>
                                <Text style={styles.typeText}>{form.certType}</Text>
                            </View>
                            
                            <Text style={styles.certifyTxt}>This is to certify that</Text>
                            <Text style={styles.recipName}>{form.recipientName || "Recipient Name"}</Text>
                            
                            <Text style={styles.descText}>
                                {form.description || "has successfully completed the course in"}
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
                                    <Text style={styles.metaLabel}>Date</Text>
                                    <Text style={styles.metaValue}>{form.issueDate}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.sigArea}>
                                <View style={styles.sigBox}>
                                    {form.signature ? (
                                        <Image src={form.signature} style={{ height: 40, width: 120, objectFit: "contain", marginBottom: 4 }} />
                                    ) : (
                                        <View style={{ height: 30 }} />
                                    )}
                                    <View style={styles.sigLine}>
                                        <Text style={styles.sigName}>{form.signatoryName || "Signatory Name"}</Text>
                                        <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                                    </View>
                                </View>
                                
                                {form.enableQR && (
                                    <View style={styles.qrSection}>
                                        <View style={styles.qrBox}>
                                            {form.qrCodeDataUrl ? (
                                                <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%", padding: 2 }} />
                                            ) : (
                                                <View style={{ width: "100%", height: "100%", backgroundColor: "#F3F4F6" }} />
                                            )}
                                        </View>
                                        <Text style={{ fontSize: 9, color: "#9CA3AF", marginTop: 4 }}>Scan to Verify</Text>
                                    </View>
                                )}
                            </View>
                            
                            {form.enableQR && form.verificationId && (
                                <Text style={styles.verifId}>Verification ID: {form.verificationId}</Text>
                            )}
                            
                            <Text style={{ position: "absolute", bottom: -20, left: 10, fontSize: 8, color: "#D1D5DB" }}>Generated by DocMinty.com</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}