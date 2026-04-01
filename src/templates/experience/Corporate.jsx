"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout.",
};

export default function ExperienceCorporateTemplate({ form }) {
    const T = form.templateColor || "#1E3A5F";
    const joining = form.dateOfJoining
        ? new Date(form.dateOfJoining).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : "???";
    const leaving = form.dateOfLeaving
        ? new Date(form.dateOfLeaving).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : "???";
    const perfText = PERF_TEXT[form.performance] || PERF_TEXT.good;
    const empInfo = form.employeeId
        ? (form.employeeName || "") + " (ID: " + form.employeeId + ")"
        : form.employeeName || "[Employee Name]";

    const styles = StyleSheet.create({
        page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
        header: { backgroundColor: T, padding: "30 40", textAlign: "center", color: "#ffffff" },
        logo: { width: 50, height: 35, objectFit: "contain", margin: "0 auto 10", filter: "brightness(0) invert(1)" },
        compName: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 4 },
        compAddr: { fontSize: 9, color: "rgba(255,255,255,0.8)" },
        titleBox: { marginTop: 15, backgroundColor: "rgba(255,255,255,0.15)", padding: "6 20", borderRadius: 4, alignSelf: "center" },
        titleText: { fontSize: 14, fontFamily: "Helvetica-Bold", letterSpacing: 1 },
        refDate: { fontSize: 9, color: "rgba(255,255,255,0.8)", marginTop: 4 },
        bodyWrap: { padding: "40 50" },
        body: { fontSize: 10, color: "#374151", lineHeight: 1.8, marginBottom: 15 },
        signBox: { marginTop: 40, alignItems: "center" },
        signLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 5, width: 180, textAlign: "center" },
        signName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
        signDesig: { fontSize: 9, color: "#6B7280" },
        footer: { position: "absolute", bottom: 30, left: 50, right: 50, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F3F4F6", textAlign: "center" },
        footerG: { fontSize: 8, color: "#D1D5DB" },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {form.logo && <Image src={form.logo} style={styles.logo} />}
                    <Text style={styles.compName}>{form.companyName || "Company Name"}</Text>
                    {form.companyAddress && <Text style={styles.compAddr}>{form.companyAddress}</Text>}
                    
                    <View style={styles.titleBox}>
                        <Text style={styles.titleText}>EXPERIENCE CERTIFICATE</Text>
                    </View>
                    <Text style={styles.refDate}>{"Ref: " + form.letterNumber + "  |  Date: " + form.letterDate}</Text>
                </View>

                <View style={styles.bodyWrap}>
                    <Text style={styles.body}>To Whomsoever It May Concern,</Text>

                    <Text style={styles.body}>
                        {"This is to certify that "}
                        <Text style={{ fontFamily: "Helvetica-Bold" }}>{empInfo}</Text>
                        {" was employed with "}
                        <Text style={{ fontFamily: "Helvetica-Bold" }}>{form.companyName || "[Company]"}</Text>
                        {form.designation ? " as " + form.designation : ""}
                        {form.department ? " in the " + form.department + " department" : ""}
                        {" from "}
                        <Text style={{ color: T, fontFamily: "Helvetica-Bold" }}>{joining}</Text>
                        {" to "}
                        <Text style={{ color: T, fontFamily: "Helvetica-Bold" }}>{leaving}</Text>
                        {"."}
                    </Text>

                    <Text style={styles.body}>{perfText}</Text>
                    {form.additionalNote && <Text style={styles.body}>{form.additionalNote}</Text>}
                    <Text style={styles.body}>{"We wish " + (form.employeeName || "them") + " all the best in their future endeavours."}</Text>

                    <View style={styles.signBox}>
                        {form.signature && <Image src={form.signature} style={{ height: 40, marginBottom: 5, objectFit: "contain" }} />}
                        <View style={styles.signLine}>
                            <Text style={styles.signName}>{form.signatoryName || "Authorised Signatory"}</Text>
                            <Text style={styles.signDesig}>{form.signatoryDesignation || "Designation"}</Text>
                        </View>
                    </View>

                    <View style={styles.footer}><Text style={styles.footerG}>Generated by DocMinty.com</Text></View>
                </View>
            </Page>
        </Document>
    );
}