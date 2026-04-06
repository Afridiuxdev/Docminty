"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function ModernTemplate({ form }) {
    const T = form.templateColor || "#6366F1";
    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
        header: { backgroundColor: T, padding: "32 40", alignItems: "center" },
        logo: { height: 40, objectFit: "contain", marginBottom: 12, filter: "brightness(0) invert(1)" },
        orgName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff", textTransform: "uppercase", letterSpacing: 2, textAlign: "center" },
        orgAddr: { fontSize: 9, color: "rgba(255,255,255,0.75)", textAlign: "center", marginTop: 4, lineHeight: 1.4 },
        
        body: { padding: "32 40", alignItems: "center" },
        badge: { backgroundColor: T + "15", borderWidth: 1, borderColor: T, padding: "6 24", borderRadius: 4, marginBottom: 20 },
        badgeText: { fontSize: 11, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 2, textAlign: "center" },
        
        certifyTxt: { fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 8 },
        recipName: { fontSize: 28, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 8, marginBottom: 16, minWidth: 280 },
        descText: { fontSize: 13, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 420, marginBottom: 10 },
        courseName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textAlign: "center", marginBottom: 24 },
        
        metaRow: { flexDirection: "row", gap: 32, justifyContent: "center", marginBottom: 32 },
        metaItem: { alignItems: "center" },
        metaLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
        metaValue: { fontSize: 13, fontWeight: 600, color: "#111827" },
        
        sigSection: { flexDirection: "row", gap: 60, justifyContent: "center", alignItems: "flex-end", width: "100%" },
        sigBox: { alignItems: "center", minWidth: 140 },
        sigLine: { borderTopWidth: 2, borderTopColor: "#374151", width: "100%", paddingTop: 6, marginTop: 4 },
        sigName: { fontSize: 12, fontWeight: 600, color: "#111827", textAlign: "center" },
        sigDesig: { fontSize: 10, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
        
        qrBox: { width: 56, height: 56, backgroundColor: "#F8F9FA", borderWidth: 2, borderColor: T, borderRadius: 4, alignItems: "center", justifyContent: "center", padding: 4 },
        verifId: { fontSize: 8, color: "#D1D5DB", textAlign: "center", marginTop: 16, fontFamily: "Inter" },
        accentBottom: { backgroundColor: T, height: 8, position: "absolute", bottom: 0, left: 0, right: 0 }
    });

    const addrParts = [
        form.orgAddress,
        (form.orgCity || stateName) ? `${form.orgCity ? form.orgCity + ", " : ""}${stateName}` : null,
        form.orgWebsite
    ].filter(Boolean).join(" | ");

    return (
        <Document title={`Certificate-${form.recipientName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.header}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                    <Text style={styles.orgAddr}>{addrParts}</Text>
                </View>

                <View style={styles.body}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{form.certType || "PRIDE OF ACHIEVEMENT"}</Text>
                    </View>
                    
                    <Text style={styles.certifyTxt}>This is to certify that</Text>
                    <Text style={styles.recipName}>{form.recipientName || "Recipient Name"}</Text>
                    
                    <Text style={styles.descText}>
                        {form.description || "has successfully demonstrated professional excellence and fulfilled all educational requirements for"}
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
                                <Image src={form.signature} style={{ height: 40, marginBottom: 4, objectFit: "contain" }} />
                            ) : (
                                <View style={{ height: 40 }} />
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
                                        <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%" }} />
                                    ) : (
                                        <View style={{ width: "100%", height: "100%", backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ fontSize: 8, color: "#D1D5DB" }}>QR</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={{ fontSize: 9, color: "#9CA3AF", marginTop: 4 }}>Scan to Verify</Text>
                            </View>
                        )}
                    </View>
                    
                    {form.enableQR && form.verificationId && (
                        <Text style={styles.verifId}>Verification ID: {form.verificationId}</Text>
                    )}
                </View>
                <View style={styles.accentBottom} />
                <Text style={{ position: "absolute", bottom: 12, left: 16, fontSize: 8, color: "#D1D5DB" }}>Generated by DocMinty.com</Text>
            </Page>
        </Document>
    );
}
