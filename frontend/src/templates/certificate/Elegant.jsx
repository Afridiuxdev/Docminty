"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function ElegantTemplate({ form }) {
    const T = form.templateColor || "#7C3AED";
    const BG = "#FAFAFE";
    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "28 44", backgroundColor: BG },
        strips: { position: "absolute", top: 0, left: 0, right: 0, height: 10, backgroundColor: T },
        stripsB: { position: "absolute", bottom: 0, left: 0, right: 0, height: 10, backgroundColor: T },
        sideL: { position: "absolute", top: 0, left: 0, bottom: 0, width: 10, backgroundColor: T },
        sideR: { position: "absolute", top: 0, right: 0, bottom: 0, width: 10, backgroundColor: T },
        
        inner: { margin: 20, alignItems: "center" },
        logo: { height: 45, objectFit: "contain", marginBottom: 12, marginTop: 10 },
        orgName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 4 },
        orgAddr: { fontSize: 8, color: "#9CA3AF", textAlign: "center", marginBottom: 2 },
        orgWeb: { fontSize: 8, color: "#9CA3AF", textAlign: "center", marginBottom: 24 },
        
        badge: { backgroundColor: T, padding: "6 32", borderRadius: 4, marginBottom: 24 },
        badgeText: { fontSize: 11, fontFamily: "Space Grotesk", fontWeight: 700, color: "#ffffff", textTransform: "uppercase", letterSpacing: 3, textAlign: "center" },
        
        certifyTxt: { fontSize: 12, color: "#6B7280", textAlign: "center", marginBottom: 10 },
        recipName: { fontSize: 32, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 10, marginBottom: 16, minWidth: 320 },
        descText: { fontSize: 13, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 450, marginBottom: 10 },
        courseName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textAlign: "center", marginBottom: 24 },
        
        metaRow: { flexDirection: "row", gap: 40, justifyContent: "center", marginBottom: 32 },
        metaItem: { alignItems: "center" },
        metaLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 },
        metaValue: { fontSize: 12, fontWeight: 700, color: "#111827" },
        
        sigSection: { flexDirection: "row", gap: 60, justifyContent: "center", alignItems: "flex-end", width: "100%" },
        sigBox: { alignItems: "center", minWidth: 140 },
        sigLine: { borderTopWidth: 2, borderTopColor: T, width: "100%", paddingTop: 6, marginTop: 4 },
        sigName: { fontSize: 11, fontWeight: 700, color: "#111827", textAlign: "center" },
        sigDesig: { fontSize: 9, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
        
        qrBox: { width: 56, height: 56, backgroundColor: "#ffffff", borderWidth: 2, borderColor: T, borderRadius: 2, alignItems: "center", justifyContent: "center", padding: 4 },
        verifId: { fontSize: 7, color: "#D1D5DB", textAlign: "center", marginTop: 12, fontFamily: "Inter" }
    });

    const addrParts = [
        form.orgAddress,
        (form.orgCity || stateName) ? `${form.orgCity ? form.orgCity + ", " : ""}${stateName}` : null
    ].filter(Boolean).join(", ");

    return (
        <Document title={`Certificate-${form.recipientName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.strips} /><View style={styles.stripsB} /><View style={styles.sideL} /><View style={styles.sideR} />
                <View style={styles.inner}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                    <Text style={styles.orgAddr}>{addrParts}</Text>
                    {form.orgWebsite && <Text style={styles.orgWeb}>{form.orgWebsite}</Text>}
                    
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{form.certType || "OFFICIAL CERTIFICATE"}</Text>
                    </View>
                    
                    <Text style={styles.certifyTxt}>This is to certify that</Text>
                    <Text style={styles.recipName}>{form.recipientName || "Recipient Name"}</Text>
                    
                    <Text style={styles.descText}>
                        {form.description || "has shown exceptional skill and successfully completed all requirements for"}
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
                            {form.signature ? (
                                <Image src={form.signature} style={{ height: 45, marginBottom: 4, objectFit: "contain" }} />
                            ) : (
                                <View style={{ height: 45 }} />
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
                                        <View style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ fontSize: 8, color: "#D1D5DB" }}>QR</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={{ fontSize: 7, color: T, marginTop: 4, fontWeight: 700 }}>VERIFY</Text>
                            </View>
                        )}
                    </View>
                    
                    {form.enableQR && form.verificationId && (
                        <Text style={styles.verifId}>Verification ID: {form.verificationId}</Text>
                    )}
                </View>
                <Text style={{ position: "absolute", bottom: 12, left: 16, fontSize: 8, color: "#ffffff" }}>Generated by DocMinty.com</Text>
            </Page>
        </Document>
    );
}
