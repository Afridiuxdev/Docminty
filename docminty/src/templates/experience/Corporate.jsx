"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation, consistently meeting and exceeding the high standards of our corporate environment.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member who integrated well with our corporate culture.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout their employment with our firm.",
};

export default function CorporateTemplate({ form }) {
    const T = form.templateColor || "#1E3A5F";
    
    const formatDate = (dateStr) => {
        if (!dateStr) return "DD Month YYYY";
        try {
            return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        } catch (e) {
            return dateStr;
        }
    };

    const joining = formatDate(form.dateOfJoining);
    const leaving = formatDate(form.dateOfLeaving);
    const perfText = PERF_TEXT[form.performance] || PERF_TEXT.good;
    const empInfo = (form.employeeName || "[Employee Name]") + (form.employeeId ? ` (Employee ID: ${form.employeeId})` : "");

    const styles = StyleSheet.create({
        page: { fontFamily: "Inter", fontSize: 10, color: "#111827", padding: 0, backgroundColor: "#ffffff" },
        header: { backgroundColor: T, padding: "40 50", alignItems: "center", color: "#ffffff" },
        logo: { height: 40, objectFit: "contain", marginBottom: 12, filter: "brightness(0) invert(1)" },
        compName: { fontSize: 18, fontFamily: "Space Grotesk", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 },
        compAddr: { fontSize: 10, color: "rgba(255,255,255,0.8)", textAlign: "center", maxWidth: 450, lineHeight: 1.4 },
        
        titleBox: { marginTop: 24, padding: "8 32", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
        titleText: { fontSize: 14, fontFamily: "Space Grotesk", fontWeight: 700, letterSpacing: 2, color: "#ffffff", textTransform: "uppercase" },
        refDate: { fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 16, fontFamily: "Inter" },
        
        bodyWrap: { padding: "48 60" },
        body: { fontSize: 11, color: "#374151", lineHeight: 1.8, textAlign: "justify", marginBottom: 20 },
        salutation: { fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 24 },
        bold: { fontWeight: 700, color: "#111827" },
        accent: { fontWeight: 700, color: T },
        
        signBox: { marginTop: 40, alignItems: "center" },
        signatureImage: { height: 45, marginBottom: 5, objectFit: "contain" },
        signLine: { borderTopWidth: 1.5, borderTopColor: T, paddingTop: 10, width: 220, textAlign: "center" },
        signName: { fontSize: 11, fontWeight: 700, color: "#111827" },
        signDesig: { fontSize: 9, color: "#6B7280", marginTop: 2 },
        
        footer: { position: "absolute", bottom: 40, left: 60, right: 60, borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 12 },
        footerText: { fontSize: 8, color: "#D1D5DB", textAlign: "center", letterSpacing: 0.5 }
    });

    return (
        <Document title={`Experience-Certificate-${form.employeeName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.compName}>{form.companyName || "Organization Name"}</Text>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.compAddr}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}</Text>
                        {(form.companyPhone || form.companyEmail) && (
                            <Text style={[styles.compAddr, { fontSize: 9, marginTop: 2 }]}>
                                {form.companyPhone && `Ph: ${form.companyPhone} `}
                                {form.companyEmail && `Em: ${form.companyEmail}`}
                            </Text>
                        )}
                        {form.companyWebsite && <Text style={[styles.compAddr, { fontSize: 9 }]}>{form.companyWebsite}</Text>}
                    </View>
                    
                    <View style={styles.titleBox}>
                        <Text style={styles.titleText}>Experience & Relieving Certificate</Text>
                    </View>
                    <Text style={styles.refDate}>Ref: {form.letterNumber}   |   Date: {form.letterDate}</Text>
                </View>

                <View style={styles.bodyWrap}>
                    <Text style={styles.salutation}>To Whomsoever It May Concern,</Text>

                    <Text style={styles.body}>
                        {"This is to formally certify that "}
                        <Text style={styles.bold}>{empInfo}</Text>
                        {" was an esteemed employee of "}
                        <Text style={styles.bold}>{form.companyName || "our firm"}</Text>
                        {form.designation ? " in the professional capacity of " : ""}
                        <Text style={styles.bold}>{form.designation || ""}</Text>
                        {form.department ? " within our " + form.department + " division" : ""}
                        {" from "}
                        <Text style={styles.accent}>{joining}</Text>
                        {" to "}
                        <Text style={styles.accent}>{leaving}</Text>
                        {"."}
                    </Text>

                    <Text style={styles.body}>{perfText}</Text>
                    
                    {form.additionalNote && (
                        <Text style={styles.body}>{form.additionalNote}</Text>
                    )}

                    <Text style={styles.body}>
                        {"We record our appreciation for the contribution made by "}
                        <Text style={styles.bold}>{form.employeeName || "the employee"}</Text>
                        {" during their association with us and wish them immense success in their future career path."}
                    </Text>

                    <View style={styles.signBox}>
                        {form.signature ? (
                            <Image src={form.signature} style={styles.signatureImage} />
                        ) : (
                            <View style={{ height: 45 }} />
                        )}
                        <View style={styles.signLine}>
                            <Text style={styles.signName}>{form.signatoryName || "Authorised Signatory"}</Text>
                            <Text style={styles.signDesig}>{form.signatoryDesignation || "Designation"}{form.signatoryDept ? ` — ${form.signatoryDept}` : ""}</Text>
                            <Text style={styles.signDesig}>{form.companyName || ""}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Certified Record of Employment Release — DocMinty.com</Text>
                    <Text style={[styles.footerText, { marginTop: 4, color: "#E5E7EB" }]}>Powered by DocMinty PRO</Text>
                </View>
            </Page>
        </Document>
    );
}