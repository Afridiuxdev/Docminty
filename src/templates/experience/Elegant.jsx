"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PERF_TEXT = {
    excellent: "During their tenure, they demonstrated exceptional dedication, professionalism, and technical expertise. Their contributions have been invaluable to the organisation.",
    good: "During their tenure, they showed good work ethic, dedication, and performed their duties responsibly. We found them to be a reliable team member.",
    satisfactory: "During their tenure, they performed their assigned duties satisfactorily and maintained professional conduct throughout.",
};

export default function ExperienceElegantTemplate({ form }) {
    const T = form.templateColor || "#D97706";
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
        page: { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: "40 50", backgroundColor: "#FFFDF5" },
        topBorder: { height: 4, backgroundColor: T, marginBottom: 20 },
        header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingBottom: 15, marginBottom: 25 },
        logo: { width: 50, height: 35, objectFit: "contain", marginBottom: 5 },
        compName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#111827" },
        compAddr: { fontSize: 8, color: "#6B7280" },
        title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: T, textAlign: "right" },
        refDate: { fontSize: 9, color: "#9CA3AF", textAlign: "right", marginTop: 2 },
        body: { fontSize: 10, color: "#374151", lineHeight: 2, marginBottom: 15 },
        signBox: { marginTop: 40, flexDirection: "row", justifyContent: "flex-end" },
        signWrap: { width: 160, textAlign: "right" },
        signLine: { borderTopWidth: 1, borderTopColor: T, paddingTop: 5, marginTop: 5 },
        signName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
        signDesig: { fontSize: 9, color: "#6B7280" },
        footer: { position: "absolute", bottom: 40, left: 50, right: 50, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
        footerG: { fontSize: 8, color: "#D1D5DB" },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.topBorder} />
                <View style={styles.header}>
                    <View>
                        {form.logo && <Image src={form.logo} style={styles.logo} />}
                        <Text style={styles.compName}>{form.companyName || "Company Name"}</Text>
                        {form.companyAddress && <Text style={styles.compAddr}>{form.companyAddress}</Text>}
                    </View>
                    <View>
                        <Text style={styles.title}>Experience Letter</Text>
                        <Text style={styles.refDate}>{"Ref: " + form.letterNumber}</Text>
                        <Text style={styles.refDate}>{form.letterDate}</Text>
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
                    <View style={styles.signWrap}>
                        {form.signature && <Image src={form.signature} style={{ height: 40, marginBottom: 5, objectFit: "contain", alignSelf: "flex-end" }} />}
                        <View style={styles.signLine}>
                            <Text style={styles.signName}>{form.signatoryName || "Authorised Signatory"}</Text>
                            <Text style={styles.signDesig}>{form.signatoryDesignation || "Designation"}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}><Text style={styles.footerG}>Generated by DocMinty.com</Text></View>
            </Page>
        </Document>
    );
}