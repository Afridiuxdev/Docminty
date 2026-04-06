"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function MinimalTemplate({ form }) {
    const T = form.templateColor || "#111827";
    const stateName = INDIAN_STATES.find(s => s.code === form.orgState)?.name || "";

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: "36 48", backgroundColor: "#fff" },
        header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 1.5, borderBottomColor: T, paddingBottom: 10, marginBottom: 32 },
        logo: { height: 32, objectFit: "contain" },
        orgName: { fontSize: 13, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 1 },
        orgAddr: { fontSize: 8, color: "#9CA3AF", marginTop: 2 },
        typeT: { fontSize: 10, color: T, textTransform: "uppercase", letterSpacing: 2, textAlign: "right", fontFamily: "Space Grotesk", fontWeight: 700 },
        
        body: { alignItems: "center", paddingVertical: 20 },
        certifyTxt: { fontSize: 11, color: "#9CA3AF", textAlign: "center", marginBottom: 12, letterSpacing: 1.5, textTransform: "uppercase" },
        recipName: { fontSize: 34, fontFamily: "Space Grotesk", fontWeight: 700, color: "#111827", textAlign: "center", marginBottom: 12 },
        accentLine: { width: 240, borderBottomWidth: 2, borderBottomColor: T, marginBottom: 20 },
        descText: { fontSize: 12, color: "#6B7280", textAlign: "center", lineHeight: 1.6, maxWidth: 420, marginBottom: 12 },
        courseName: { fontSize: 16, fontFamily: "Space Grotesk", fontWeight: 700, color: T, textAlign: "center", marginBottom: 24 },
        
        metaRow: { flexDirection: "row", gap: 48, marginBottom: 32 },
        metaItem: { alignItems: "center" },
        metaLabel: { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 },
        metaValue: { fontSize: 11, fontWeight: 700, color: "#111827" },
        
        sigSection: { flexDirection: "row", gap: 60, justifyContent: "center", alignItems: "flex-end" },
        sigBox: { alignItems: "center", minWidth: 140 },
        sigLine: { borderTopWidth: 2, borderTopColor: "#111827", width: "100%", paddingTop: 6, marginTop: 4 },
        sigName: { fontSize: 11, fontWeight: 700, color: "#111827", textAlign: "center" },
        sigDesig: { fontSize: 9, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
        
        qrBox: { width: 56, height: 56, backgroundColor: "#F9FAFB", borderWith: 2, borderColor: T, borderRadius: 4, alignItems: "center", justifyContent: "center", padding: 4, position: "absolute", bottom: 20, right: 0 },
        verifId: { fontSize: 7, color: "#D1D5DB", textAlign: "center", marginTop: 12, fontFamily: "Inter" }
    });

    const addrParts = [
        form.orgAddress,
        (form.orgCity || stateName) ? `${form.orgCity ? form.orgCity + ", " : ""}${stateName}` : null,
        form.orgWebsite
    ].filter(Boolean).join(", ");

    return (
        <Document title={`Certificate-${form.recipientName}`}>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                        <Text style={styles.orgAddr}>{addrParts}</Text>
                    </View>
                    <Text style={styles.typeT}>{form.certType || "OFFICIAL CERTIFICATE"}</Text>
                </View>

                <View style={styles.body}>
                    <View style={{ width: 40, height: 3, backgroundColor: T, marginBottom: 24, borderRadius: 2 }} />
                    <Text style={styles.certifyTxt}>THIS IS TO CERTIFY THAT</Text>
                    <Text style={styles.recipName}>{form.recipientName || "Recipient Name"}</Text>
                    <View style={styles.accentLine} />
                    
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
                            <Text style={styles.metaLabel}>Issued On</Text>
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
                                <Text style={styles.sigName}>{form.signatoryName || "Authorized Official"}</Text>
                                <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={{ width: 40, height: 3, backgroundColor: T, marginTop: 24, borderRadius: 2 }} />
                    
                    {form.enableQR && (
                        <View style={styles.qrBox}>
                            {form.qrCodeDataUrl ? (
                                <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%" }} />
                            ) : (
                                <View style={{ width: "100%", height: "100%", backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 8, color: "#D1D5DB" }}>QR</Text>
                                </View>
                            )}
                        </View>
                    )}
                    
                    {form.enableQR && form.verificationId && (
                        <Text style={styles.verifId}>Verification ID: {form.verificationId}</Text>
                    )}
                </View>
                <Text style={{ position: "absolute", bottom: 12, left: 16, fontSize: 8, color: "#D1D5DB" }}>Generated by DocMinty.com</Text>
            </Page>
        </Document>
    );
}
