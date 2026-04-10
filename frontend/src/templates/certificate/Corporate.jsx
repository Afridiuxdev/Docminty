"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function CorporateTemplate({ form }) {
    const T = form.templateColor || "#1E3A5F";
    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 12, backgroundColor: "#ffffff" },
        outerBorder: { flex: 1, border: `3pt solid ${T}`, padding: 4 },
        midBorder: { flex: 1, border: "1px solid #D1D5DB", padding: "32 40", alignItems: "center", position: "relative" },
        
        logo: { height: 40, objectFit: "contain", marginBottom: 12 },
        orgName: { fontSize: 12, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 },
        
        typeBar: { backgroundColor: T, padding: "8 40", marginBottom: 20 },
        typeText: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff", textTransform: "uppercase", letterSpacing: 6 },
        
        certifyTxt: { fontSize: 11, color: "#6B7280", marginBottom: 12 },
        recipName: { fontSize: 32, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", textAlign: "center", marginBottom: 12 },
        accentLine: { width: 60, height: 2, backgroundColor: T, marginBottom: 16 },
        
        descText: { fontSize: 13, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 500, marginBottom: 8 },
        courseName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T, marginBottom: 24 },
        
        footer: { marginTop: "auto", width: "100%", paddingBottom: 10 },
        
        metaBar: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#E5E7EB", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingVertical: 10, justifyContent: "center", gap: 60, marginBottom: 20 },
        metaItem: { alignItems: "center" },
        metaLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 4 },
        metaValue: { fontSize: 11, fontWeight: 700, color: "#111827" },

        mainActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
        sigBox: { minWidth: 160 },
        signature: { height: 44, width: 120, objectFit: "contain", marginBottom: 2 },
        sigLine: { borderTopWidth: 1.5, borderTopColor: "#111827", paddingTop: 6 },
        sigName: { fontSize: 11, fontWeight: 700, color: "#111827" },
        sigDesig: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
        
        qrBox: { width: 56, height: 56, border: `1.5pt solid ${T}`, borderRadius: 4, padding: 3, position: "relative", backgroundColor: "#fff" },
        qrSeal: { position: "absolute", top: -6, left: -6, padding: "2 6", backgroundColor: T, color: "#fff", fontSize: 6, fontWeight: 700, borderRadius: 1 },
        qrText: { fontSize: 8, fontWeight: 700, color: T, marginTop: 4, textTransform: "uppercase", textAlign: "center" },
        
        verifId: { position: "absolute", bottom: -12, right: 0, fontSize: 8, color: "#D1D5DB", fontFamily: "Inter" }
    });

    return (
        <Document title={`Certificate-${form.recipientName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.outerBorder}>
                    <View style={styles.midBorder} wrap={false}>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>

                        <View style={styles.typeBar}>
                            <Text style={styles.typeText}>{form.certType}</Text>
                        </View>
                        
                        <Text style={styles.certifyTxt}>This high honor is presented to</Text>
                        <Text style={styles.recipName}>{form.recipientName || "Recipient Name"}</Text>
                        <View style={styles.accentLine} />
                        
                        <Text style={styles.descText}>
                            {form.description || "for the successful completion of all required components and demonstrating superior excellence in"}
                        </Text>
                        {form.course && <Text style={styles.courseName}>{form.course}</Text>}

                        <View style={styles.footer} wrap={false}>
                            <View style={styles.metaBar}>
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Issue Date</Text>
                                    <Text style={styles.metaValue}>{form.issueDate}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Duration</Text>
                                    <Text style={styles.metaValue}>{form.duration || "N/A"}</Text>
                                </View>
                                {form.grade && (
                                    <View style={styles.metaItem}>
                                        <Text style={styles.metaLabel}>Rating</Text>
                                        <Text style={[styles.metaValue, { color: T }]}>{form.grade}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.mainActions} wrap={false}>
                                <View style={styles.sigBox}>
                                    {form.signature ? (
                                        <Image src={form.signature} style={styles.signature} />
                                    ) : (
                                        <View style={{ height: 44 }} />
                                    )}
                                    <View style={styles.sigLine}>
                                        <Text style={styles.sigName}>{form.signatoryName || "Authorized Official"}</Text>
                                        <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                                    </View>
                                </View>

                                {form.enableQR && (
                                    <View style={{ alignItems: "center" }}>
                                        <View style={styles.qrBox}>
                                            <View style={styles.qrSeal}><Text>SEAL</Text></View>
                                            {form.qrCodeDataUrl ? (
                                                <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%" }} />
                                            ) : (
                                                <View style={{ width: "100%", height: "100%", backgroundColor: "#fff" }} />
                                            )}
                                        </View>
                                        <Text style={styles.qrText}>Verify Digitally</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        
                        {form.enableQR && <Text style={styles.verifId}>ID: {form.verificationId?.slice(0, 12)}</Text>}
                    </View>
                </View>
            </Page>
        </Document>
    );
}
