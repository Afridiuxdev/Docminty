"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function ModernTemplate({ form }) {
    const T = form.templateColor || "#6366F1";
    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
        header: { backgroundColor: T, padding: "20 40", alignItems: "center", justifyContent: "center" },
        logo: { height: 44, objectFit: "contain", marginBottom: 12, filter: "brightness(0) invert(1)" },
        orgName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff", textTransform: "uppercase", letterSpacing: 1.5, textAlign: "center" },
        orgAddr: { fontSize: 11, color: "rgba(255,255,255,0.8)", textAlign: "center", marginTop: 4 },
        
        main: { padding: "32 40", flex: 1, alignItems: "center", justifyContent: "center", position: "relative" },
        
        typeTitle: { fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 22, color: "#ffffff", textTransform: "uppercase", letterSpacing: 3, marginBottom: 4 },
        typeSub: { fontSize: 12, color: "rgba(255,255,255,0.8)" },

        certifyTxt: { fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 8 },
        recipName: { fontSize: 26, fontFamily: "Space Grotesk", fontWeight: 800, color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 8, marginBottom: 12, minWidth: 200 },
        descText: { fontSize: 13, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 400, marginBottom: 8 },
        courseName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textAlign: "center", marginBottom: 16 },
        
        metaRow: { flexDirection: "row", gap: 24, justifyContent: "center", marginBottom: 32 },
        metaItem: { alignItems: "center" },
        metaLabel: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
        metaValue: { fontSize: 13, fontWeight: 700, color: "#111827" },
        
        sigSection: { flexDirection: "row", gap: 48, justifyContent: "center", alignItems: "flex-end", width: "100%" },
        sigBox: { alignItems: "center", minWidth: 140 },
        sigLine: { borderTopWidth: 2, borderTopColor: "#374151", width: "100%", paddingTop: 6, marginTop: 4 },
        sigName: { fontSize: 12, fontWeight: 600, color: "#111827", textAlign: "center" },
        sigDesig: { fontSize: 10, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
        
        qrBox: { width: 56, height: 56, border: `2px solid ${T}`, borderRadius: 4, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F9FA", overflow: "hidden" },
        verifId: { fontSize: 9, color: "#D1D5DB", textAlign: "center", marginTop: 16, fontFamily: "Courier" }
    });

    const addrParts = [
        form.orgAddress,
        (form.orgCity || stateName) ? `${form.orgCity ? form.orgCity + ", " : ""}${stateName}` : null
    ].filter(Boolean).join(", ");

    return (
        <Document title={`Certificate-${form.recipientName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.typeTitle}>Certificate</Text>
                    <Text style={styles.typeSub}>{form.certType}</Text>
                </View>

                <View style={styles.main}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                    {addrParts ? <Text style={[styles.orgAddr, { color: "#9CA3AF" }]}>{addrParts}</Text> : null}
                    {form.orgWebsite && <Text style={[styles.orgAddr, { color: "#9CA3AF", marginBottom: 16 }]}>{form.orgWebsite}</Text>}
                    
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
                                <Text style={styles.sigName}>{form.signatoryName || "Signatory Name"}</Text>
                                <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                            </View>
                        </View>
                        
                        {form.enableQR && (
                            <View style={{ alignItems: "center" }}>
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
                </View>
            </Page>
        </Document>
    );
}
