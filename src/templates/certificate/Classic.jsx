"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export default function CertificateTemplate({ form }) {
    const T = form.templateColor || "#0D9488";

    const styles = StyleSheet.create({
        page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
        outerBorder: { margin: 20, borderTop: `8pt solid #F0F4F3`, borderBottom: `8pt solid #F0F4F3`, borderLeft: `8pt solid #F0F4F3`, borderRight: `8pt solid #F0F4F3`, padding: 0, position: "relative" },
        innerBorder: { border: `2pt solid ${T}`, margin: 8, padding: "32 40", alignItems: "center" },
        orgName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#111827", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 4 },
        orgAddr: { fontSize: 9, color: "#9CA3AF", textAlign: "center", marginBottom: 20 },
        typeBadge: { backgroundColor: T, padding: "5 24", borderRadius: 2, marginBottom: 20 },
        typeText: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#ffffff", textTransform: "uppercase", letterSpacing: 2, textAlign: "center" },
        certifyTxt: { fontSize: 11, color: "#6B7280", textAlign: "center", marginBottom: 8 },
        recipName: { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 8, marginBottom: 12 },
        descText: { fontSize: 11, color: "#374151", textAlign: "center", lineHeight: 1.6, maxWidth: 360, marginBottom: 8 },
        courseName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: T, textAlign: "center", marginBottom: 12 },
        metaRow: { flexDirection: "row", gap: 32, justifyContent: "center", marginBottom: 20 },
        metaItem: { alignItems: "center" },
        metaLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
        metaValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
        sigRow: { flexDirection: "row", gap: 48, justifyContent: "center", alignItems: "flex-end" },
        sigBox: { alignItems: "center" },
        sigLine: { borderTopWidth: 1.5, borderTopColor: "#374151", width: 120, paddingTop: 5, marginTop: 5 },
        sigName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center" },
        sigDesig: { fontSize: 8, color: "#9CA3AF", textAlign: "center" },
        qrBox: { width: 52, height: 52, backgroundColor: "#F0FDFA", borderWidth: 2, borderColor: T, borderRadius: 4, alignItems: "center", justifyContent: "center" },
        qrText: { fontSize: 7, color: T, fontFamily: "Helvetica-Bold", textAlign: "center" },
        verifId: { fontSize: 7, color: "#D1D5DB", textAlign: "center", marginTop: 10, fontFamily: "Courier" },
        logo: { width: 55, height: 38, objectFit: "contain", marginBottom: 10 },
    });

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.outerBorder}>
                    <View style={styles.innerBorder}>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.orgName}>{form.orgName || "Organisation Name"}</Text>
                        {form.orgAddress && <Text style={styles.orgAddr}>{form.orgAddress}</Text>}
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText}>{form.certType || "Certificate"}</Text>
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
                                    <Text style={{ ...styles.metaValue, color: T }}>{form.grade}</Text>
                                </View>
                            )}
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Issue Date</Text>
                                <Text style={styles.metaValue}>{form.issueDate}</Text>
                            </View>
                        </View>
                        <View style={styles.sigRow}>
                            <View style={styles.sigBox}>
                                {form.signature && <Image src={form.signature} style={{ height: 40, marginBottom: 5, objectFit: "contain" }} />}
                                <View style={styles.sigLine}>
                                    <Text style={styles.sigName}>{form.signatoryName || "Signatory"}</Text>
                                    <Text style={styles.sigDesig}>{form.signatoryDesignation || "Designation"}</Text>
                                </View>
                            </View>
                            {form.enableQR && (
                                <View style={{ alignItems: "center" }}>
                                    <View style={styles.qrBox}>
                                        {form.qrCodeDataUrl ? (
                                            <Image src={form.qrCodeDataUrl} style={{ width: "100%", height: "100%", padding: 2 }} />
                                        ) : (
                                            <Text style={styles.qrText}>QR{"\n"}CODE</Text>
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 7, color: "#9CA3AF", marginTop: 3 }}>Scan to Verify</Text>
                                </View>
                            )}
                        </View>
                        {form.enableQR && (
                            <Text style={styles.verifId}>ID: {form.verificationId}</Text>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
}