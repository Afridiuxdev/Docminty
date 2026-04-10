"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function RoyalTemplate({ form }) {
    const T = form.templateColor || "#D97706";
    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 6, backgroundColor: "#fff" },
        outer: { border: `3px solid ${T}`, borderRadius: 4, flex: 1, padding: 6 },
        inner: { border: `1px solid ${T}`, borderRadius: 2, flex: 1, padding: "32 40", alignItems: "center", justifyContent: "center", position: "relative" },
        
        corner: { position: "absolute", width: 20, height: 20 },
        cornerTopLeft: { top: 12, left: 12, borderTop: `2px solid ${T}`, borderLeft: `2px solid ${T}` },
        cornerTopRight: { top: 12, right: 12, borderTop: `2px solid ${T}`, borderRight: `2px solid ${T}` },
        cornerBottomLeft: { bottom: 12, left: 12, borderBottom: `2px solid ${T}`, borderLeft: `2px solid ${T}` },
        cornerBottomRight: { bottom: 12, right: 12, borderBottom: `2px solid ${T}`, borderRight: `2px solid ${T}` },

        logo: { height: 48, objectFit: "contain", marginBottom: 16 },
        orgName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 24 },
        
        typeBadge: { backgroundColor: T, padding: "6 32", borderRadius: 2, marginBottom: 20 },
        typeText: { fontSize: 13, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff", textTransform: "uppercase", letterSpacing: 3, textAlign: "center" },
        
        certifyTxt: { fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 10 },
        recipName: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 8, marginBottom: 12, minWidth: 200 },
        descText: { fontSize: 13, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 400, marginBottom: 10 },
        courseName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textAlign: "center", marginBottom: 16 },
        
        metaRow: { flexDirection: "row", justifyContent: "center", marginBottom: 24 },
        metaItem: { alignItems: "center", marginHorizontal: 12 },
        metaLabel: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2 },
        metaValue: { fontSize: 13, fontWeight: 700, color: "#111827" },
        
        sigSection: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end", width: "100%" },
        sigBox: { alignItems: "center", width: 140, marginRight: 60 },
        sigLine: { borderTopWidth: 2, borderTopColor: T, width: "100%", paddingTop: 6, marginTop: 4, alignItems: "center" },
        sigName: { fontSize: 12, fontWeight: 700, color: "#111827", textAlign: "center" },
        sigDesig: { fontSize: 10, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
        
        qrBox: { width: 56, height: 56, backgroundColor: "#ffffff", border: `2px solid ${T}`, borderRadius: 4, alignItems: "center", justifyContent: "center", padding: 4 },
        verifId: { fontSize: 9, color: "#D1D5DB", textAlign: "center", marginTop: 12, fontFamily: "Inter" }
    });

    return (
        <Document title={`Certificate-${form.recipientName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.outer}>
                    <View style={styles.inner}>
                        <View style={[styles.corner, styles.cornerTopLeft]} />
                        <View style={[styles.corner, styles.cornerTopRight]} />
                        <View style={[styles.corner, styles.cornerBottomLeft]} />
                        <View style={[styles.corner, styles.cornerBottomRight]} />

                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                        
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
                        
                        <View style={styles.sigSection}>
                            <View style={styles.sigBox}>
                                {form.signature ? (
                                    <Image src={form.signature} style={{ height: 40, width: 120, objectFit: "contain", marginBottom: 4 }} />
                                ) : (
                                    <View style={{ height: 30 }} />
                                )}
                                <View style={styles.sigLine}>
                                    <Text style={styles.sigName}>{form.signatoryName || "Authorized Signatory"}</Text>
                                    <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                                </View>
                            </View>
                            
                            {form.enableQR && (
                                <View style={{ alignItems: "center" }}>
                                    <View style={styles.qrBox}>
                                        {form.qrCodeDataUrl ? (
                                            <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%", padding: 2 }} />
                                        ) : (
                                            <View style={{ width: "100%", height: "100%", backgroundColor: "#ffffff" }} />
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 9, color: T, marginTop: 4, fontWeight: 700 }}>Scan to Verify</Text>
                                </View>
                            )}
                        </View>
                        
                        {form.enableQR && form.verificationId && (
                            <Text style={styles.verifId}>Verification Code: {form.verificationId}</Text>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
}
