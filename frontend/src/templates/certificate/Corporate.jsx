"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function CorporateTemplate({ form }) {
    const T = form.templateColor || "#1E3A5F";
    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
        topBar: { backgroundColor: T, height: 10 },
        header: { padding: "24 40 16", borderBottomWidth: 1.5, borderBottomColor: "#E5E7EB", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
        logo: { height: 36, objectFit: "contain" },
        orgInfo: { alignItems: "flex-start", maxWidth: "70%" },
        orgName: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textTransform: "uppercase", letterSpacing: 1 },
        orgAddr: { fontSize: 8, color: "#6B7280", marginTop: 2, lineHeight: 1.4 },
        typeBadge: { backgroundColor: T, padding: "6 20", borderRadius: 2 },
        typeText: { fontSize: 10, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff", textTransform: "uppercase", letterSpacing: 2 },
        
        body: { padding: "40 40", alignItems: "center" },
        certifyTxt: { fontSize: 11, color: "#6B7280", textAlign: "center", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 },
        recipName: { fontSize: 30, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 10, marginBottom: 16, minWidth: 320 },
        descText: { fontSize: 12, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 450, marginBottom: 12 },
        courseName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textAlign: "center", marginBottom: 24 },
        
        metaBox: { flexDirection: "row", gap: 32, backgroundColor: "#F8FAFD", padding: "12 24", borderRadius: 6, marginBottom: 32, borderWidth: 1, borderColor: "#E5E7EB" },
        metaItem: { alignItems: "center" },
        metaLabel: { fontSize: 7, color: T, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4, fontWeight: 700 },
        metaValue: { fontSize: 11, fontWeight: 700, color: "#111827" },
        
        sigSection: { flexDirection: "row", gap: 60, justifyContent: "center", alignItems: "flex-end", width: "100%" },
        sigBox: { alignItems: "center", minWidth: 150 },
        signatureImage: { height: 40, marginBottom: 4, objectFit: "contain" },
        sigLine: { borderTopWidth: 1.5, borderTopColor: T, width: "100%", paddingTop: 8, alignItems: "center" },
        sigName: { fontSize: 11, fontWeight: 700, color: "#111827", textAlign: "center" },
        sigDesig: { fontSize: 9, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
        
        qrBox: { width: 52, height: 52, borderWidth: 1, borderColor: T, borderRadius: 4, alignItems: "center", justifyContent: "center", padding: 4 },
        verifId: { fontSize: 7, color: "#D1D5DB", textAlign: "center", marginTop: 12, fontFamily: "Inter" },
        footerBar: { backgroundColor: T, height: 10, position: "absolute", bottom: 0, left: 0, right: 0 }
    });

    const addrParts = [
        form.orgAddress,
        (form.orgCity || stateName) ? `${form.orgCity ? form.orgCity + ", " : ""}${stateName}` : null,
        form.orgWebsite
    ].filter(Boolean).join(" | ");

    return (
        <Document title={`Certificate-${form.recipientName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.topBar} />
                <View style={styles.header}>
                    <View style={styles.orgInfo}>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                        <Text style={styles.orgAddr}>{addrParts}</Text>
                    </View>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{form.certType || "OFFICIAL CERTIFICATE"}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.certifyTxt}>This certificate is proudly presented to</Text>
                    <Text style={styles.recipName}>{form.recipientName || "Recipient Name"}</Text>
                    
                    <Text style={styles.descText}>
                        {form.description || "for successfully fulfilling the professional requirements and demonstrating exceptional competence in"}
                    </Text>
                    {form.course && <Text style={styles.courseName}>{form.course}</Text>}
                    
                    <View style={styles.metaBox}>
                        {form.duration && (
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Duration</Text>
                                <Text style={styles.metaValue}>{form.duration}</Text>
                            </View>
                        )}
                        {form.grade && (
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Performance</Text>
                                <Text style={[styles.metaValue, { color: T }]}>{form.grade}</Text>
                            </View>
                        )}
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Date Issued</Text>
                            <Text style={styles.metaValue}>{form.issueDate}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.sigSection}>
                        <View style={styles.sigBox}>
                            {form.signature ? (
                                <Image src={form.signature} style={styles.signatureImage} />
                            ) : (
                                <View style={{ height: 40 }} />
                            )}
                            <View style={styles.sigLine}>
                                <Text style={styles.sigName}>{form.signatoryName || "Authorized Official"}</Text>
                                <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                            </View>
                        </View>

                        {form.enableQR && (
                            <View style={{ alignItems: "center" }}>
                                <View style={styles.qrBox}>
                                    {form.qrCodeDataUrl ? (
                                        <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%" }} />
                                    ) : (
                                        <View style={{ width: "100%", height: "100%", backgroundColor: "#F8FAFD", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ fontSize: 8, color: "#9CA3AF" }}>QR</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={{ fontSize: 9, color: T, marginTop: 4, fontWeight: 700 }}>VERIFY</Text>
                            </View>
                        )}
                    </View>
                    
                    {form.enableQR && form.verificationId && (
                        <Text style={styles.verifId}>Authorized ID: {form.verificationId}</Text>
                    )}
                </View>
                <View style={styles.footerBar} />
                <Text style={{ position: "absolute", bottom: 12, left: 16, fontSize: 8, color: "#ffffff" }}>Generated by DocMinty.com</Text>
            </Page>
        </Document>
    );
}
