"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const T = "#EF4444";

const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 40 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: T, paddingBottom: 14, marginBottom: 16 },
    logo: { width: 55, height: 38, objectFit: "contain", marginBottom: 5 },
    fromName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827" },
    small: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: T, textAlign: "right" },
    ref: { fontSize: 10, color: "#6B7280", textAlign: "right", marginTop: 3 },
    dateText: { fontSize: 9, color: "#9CA3AF", textAlign: "right", marginTop: 2 },
    body: { fontSize: 10, color: "#374151", lineHeight: 1.8, marginBottom: 12 },
    signBox: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 5, marginTop: 32, width: 160 },
    signName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
    signDesig: { fontSize: 9, color: "#6B7280", marginTop: 2 },
    footer: { marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footerG: { fontSize: 8, color: "#D1D5DB" },
});

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout.",
};

export default function ExperienceBoldTemplate({ form }) {
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

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.fromName}>{form.companyName || "Company Name"}</Text>
                        {form.companyAddress && <Text style={styles.small}>{form.companyAddress}</Text>}
                        {form.companyPhone && <Text style={styles.small}>{"Ph: " + form.companyPhone + (form.companyEmail ? " | " + form.companyEmail : "")}</Text>}
                    </View>
                    <View>
                        <Text style={styles.title}>EXPERIENCE LETTER</Text>
                        <Text style={styles.ref}>{"Ref: " + form.letterNumber}</Text>
                        <Text style={styles.dateText}>{"Date: " + form.letterDate}</Text>
                    </View>
                </View>

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
                    <Text style={styles.signName}>{form.signatoryName || "Authorised Signatory"}</Text>
                    <Text style={styles.signDesig}>{form.signatoryDesignation || "Designation"}</Text>
                    {form.signatoryDept && <Text style={styles.signDesig}>{form.signatoryDept}</Text>}
                    <Text style={styles.signDesig}>{form.companyName || ""}</Text>
                </View>

                <View style={styles.footer}><Text style={styles.footerG}>Generated by DocMinty.com</Text></View>
            </Page>
        </Document>
    );
}