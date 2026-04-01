"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout.",
};

export default function ExperienceModernTemplate({ form }) {
    const T = form.templateColor || "#6366F1";
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
        page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0, flexDirection: "row" },
        sidebar: { width: 140, backgroundColor: T, padding: "30 20", color: "#ffffff" },
        logo: { width: 50, height: 35, objectFit: "contain", marginBottom: 20 },
        sideTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 5 },
        sideRef: { fontSize: 8, color: "rgba(255,255,255,0.7)", marginBottom: 15 },
        sideLabel: { fontSize: 7, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 2 },
        sideVal: { fontSize: 9, color: "#ffffff", marginBottom: 12 },
        main: { flex: 1, padding: "40 30" },
        body: { fontSize: 10, color: "#374151", lineHeight: 1.8, marginBottom: 12 },
        signBox: { marginTop: 30 },
        signLine: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 5, width: 150 },
        signName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
        signDesig: { fontSize: 9, color: "#6B7280", marginTop: 2 },
        footer: { position: "absolute", bottom: 30, left: 30, right: 30, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
        footerG: { fontSize: 8, color: "#D1D5DB" },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.sidebar}>
                    {form.logo && <Image src={form.logo} style={[styles.logo, { filter: "brightness(0) invert(1)" }]} />}
                    <Text style={styles.sideTitle}>EXPERIENCE LETTER</Text>
                    <Text style={styles.sideRef}>{"Ref: " + form.letterNumber}</Text>
                    
                    <Text style={styles.sideLabel}>Date</Text>
                    <Text style={styles.sideVal}>{form.letterDate}</Text>
                    
                    <Text style={styles.sideLabel}>Company</Text>
                    <Text style={[styles.sideVal, { fontFamily: "Helvetica-Bold" }]}>{form.companyName || "Company"}</Text>
                </View>

                <View style={styles.main}>
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
                            {form.signatoryDept && <Text style={styles.signDesig}>{form.signatoryDept}</Text>}
                        </View>
                    </View>

                    <View style={styles.footer}><Text style={styles.footerG}>Generated by DocMinty.com</Text></View>
                </View>
            </Page>
        </Document>
    );
}