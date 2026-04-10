"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function ModernTemplate({ form }) {
    const T = form.templateColor || "#6366F1";
    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 20, backgroundColor: "#ffffff" },
        // Floating border system
        mainWrapper: { flex: 1, border: "1px solid #E5E7EB", position: "relative", padding: 40, alignItems: "center", justifyContent: "center" },
        
        // Dynamic corner accents
        cornerAccent: { position: "absolute", width: 40, height: 40, zIndex: 10 },
        topLeft: { top: -1, left: -1, borderTop: `4pt solid ${T}`, borderLeft: `4pt solid ${T}` },
        bottomRight: { bottom: -1, right: -1, borderBottom: `4pt solid ${T}`, borderRight: `4pt solid ${T}` },
        
        logo: { height: 48, objectFit: "contain", marginBottom: 12 },
        orgName: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 24 },
        
        typeTag: { borderBottomWidth: 1, borderBottomColor: T, paddingBottom: 4, marginBottom: 20 },
        typeText: { fontSize: 24, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 6, textAlign: "center" },
        
        certifyTxt: { fontSize: 12, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 },
        recipName: { fontSize: 40, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textAlign: "center", marginBottom: 16 },
        
        descBox: { maxWidth: 500, alignItems: "center", marginBottom: 20 },
        descText: { fontSize: 12, color: "#4B5563", textAlign: "center", lineHeight: 1.6 },
        courseName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T, marginTop: 4 },
        
        metaSection: { borderTopWidth: 1, borderTopColor: "#F3F4F6", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", padding: "12 0", width: "100%", flexDirection: "row", justifyContent: "center", gap: 60, marginBottom: 32 },
        metaItem: { alignItems: "center" },
        metaLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
        metaValue: { fontSize: 12, fontWeight: 700, color: "#111827" },
        
        footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", width: "100%" },
        sigBox: { alignItems: "center", minWidth: 150 },
        signature: { height: 40, width: 120, objectFit: "contain", marginBottom: 4 },
        sigLine: { borderTopWidth: 1, borderTopColor: "#111827", width: "100%", paddingTop: 6, alignItems: "center" },
        sigName: { fontSize: 11, fontWeight: 700, color: "#111827" },
        sigDesig: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
        
        qrBox: { width: 44, height: 44, border: "1px solid #F3F4F6", borderRadius: 4, padding: 4 },
        verifId: { fontSize: 7, color: "#D1D5DB", marginTop: 4, fontFamily: "Inter" }
    });

    return (
        <Document title={`Certificate-${form.recipientName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.mainWrapper}>
                    <View style={[styles.cornerAccent, styles.topLeft]} />
                    <View style={[styles.cornerAccent, styles.bottomRight]} />
                    
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                    
                    <View style={styles.typeTag}>
                        <Text style={styles.typeText}>{form.certType}</Text>
                    </View>
                    
                    <Text style={styles.recipName}>{form.recipientName || "Recipient Name"}</Text>
                    
                    <View style={styles.descBox}>
                        <Text style={styles.descText}>
                            {form.description || "has shown exceptional proficiency and successfully completed the professional development requirements in"}
                        </Text>
                        {form.course && <Text style={styles.courseName}>{form.course}</Text>}
                    </View>
                    
                    <View style={styles.metaSection}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Duration</Text>
                            <Text style={styles.metaValue}>{form.duration || "N/A"}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Issue Date</Text>
                            <Text style={styles.metaValue}>{form.issueDate}</Text>
                        </View>
                        {form.grade && (
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Grade</Text>
                                <Text style={[styles.metaValue, { color: T }]}>{form.grade}</Text>
                            </View>
                        )}
                    </View>
                    
                    <View style={styles.footer}>
                        <View style={styles.sigBox}>
                            {form.signature ? (
                                <Image src={form.signature} style={styles.signature} />
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
                                        <View style={{ width: "100%", height: "100%", backgroundColor: "#F9FAFB" }} />
                                    )}
                                </View>
                                <Text style={styles.verifId}>{form.verificationId}</Text>
                            </View>
                        )}
                    </View>
                    
                    <Text style={{ position: "absolute", bottom: 10, left: 10, fontSize: 7, color: "#D1D5DB" }}>Generated by DocMinty.com</Text>
                </View>
            </Page>
        </Document>
    );
}
