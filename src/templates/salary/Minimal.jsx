"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateSalary } from "@/engine/salaryCalc";
import { INDIAN_STATES } from "@/constants/indianStates";

export default function SalaryMinimalTemplate({ form }) {
  const T = form.templateColor || "#111827";
  const calc = calculateSalary({
    basic: form.basic, hra: form.hra, da: form.da,
    conveyance: form.conveyance, medical: form.medical,
    otherAllowances: form.otherAllowances,
    incomeTax: form.incomeTax, otherDeductions: form.otherDeductions,
  });
  const state = INDIAN_STATES.find(function(st) { return st.code === form.companyState; });
  const fmt = function(n) { return "Rs. " + parseFloat(n).toLocaleString("en-IN"); };
  const earnings = [["Basic", fmt(form.basic||0)], ["HRA", fmt(form.hra||0)], ["DA", fmt(form.da||0)], ["Conveyance", fmt(form.conveyance||0)], ["Medical", fmt(form.medical||0)]];
  const deductions = [["PF (12%)", fmt(calc.employeePF)], ["Prof. Tax", fmt(calc.professionalTax)], ["TDS", fmt(calc.incomeTax)]];
  const empDetails = [["Employee", form.employeeName||"-"], ["ID", form.employeeId||"-"], ["Designation", form.designation||"-"], ["Department", form.department||"-"], ["PAN", form.panNumber||"-"], ["PF No", form.pfNumber||"-"], ["Pay Date", form.paymentDate||"-"], ["Days", (form.paidDays||"0") + "/" + (form.workingDays||"0")]];

  const s = StyleSheet.create({
    page:  { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: "40 48" },
    head:  { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    logo:  { width: 44, height: 30, objectFit: "contain", marginBottom: 5 },
    cn:    { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827" },
    ca:    { fontSize: 8, color: "#9CA3AF", marginTop: 1 },
    st:    { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "right" },
    sm:    { fontSize: 10, color: "#9CA3AF", textAlign: "right", marginTop: 2 },
    div:   { borderBottomWidth: 1, borderBottomColor: T, marginBottom: 14, marginTop: 6 },
    grid:  { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
    ei:    { width: "25%", marginBottom: 8 },
    el:    { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
    ev:    { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
    cols:  { flexDirection: "row", gap: 20, marginBottom: 14 },
    col:   { flex: 1 },
    secL:  { fontSize: 8, fontFamily: "Helvetica-Bold", color: T, textTransform: "uppercase", letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: T, paddingBottom: 3, marginBottom: 4 },
    tR:    { flexDirection: "row", justifyContent: "space-between", padding: "3 0", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    rL:    { fontSize: 9, color: "#6B7280" },
    rV:    { fontSize: 9, color: "#111827" },
    gRow:  { flexDirection: "row", justifyContent: "space-between", padding: "4 0", borderTopWidth: 1, borderTopColor: T, marginTop: 2 },
    gL:    { fontSize: 9, fontFamily: "Helvetica-Bold", color: T },
    netB:  { borderWidth: 2, borderColor: T, padding: "12 16", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderRadius: 4 },
    netL:  { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
    netA:  { fontSize: 20, fontFamily: "Helvetica-Bold", color: T },
    netW:  { fontSize: 8, color: "#6B7280", fontStyle: "italic", maxWidth: 200, textAlign: "right" },
    foot:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 8, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footG: { fontSize: 7, color: "#D1D5DB" },
    signB: { borderTopWidth: 1, borderTopColor: "#111827", paddingTop: 4, width: 110, textAlign: "center" },
    signT: { fontSize: 7, color: "#9CA3AF" },
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View>{form.logo && <Image src={form.logo} style={s.logo} />}<Text style={s.cn}>{form.companyName || "Company"}</Text>{state && <Text style={s.ca}>{state.name}</Text>}</View>
          <View><Text style={s.st}>Salary Slip</Text><Text style={s.sm}>{form.month + " " + form.year}</Text></View>
        </View>
        <View style={s.div} />
        <View style={s.grid}>{empDetails.map(function(item) { return (<View key={item[0]} style={s.ei}><Text style={s.el}>{item[0]}</Text><Text style={s.ev}>{item[1]}</Text></View>); })}</View>
        <View style={s.cols}>
          <View style={s.col}>
            <Text style={s.secL}>Earnings</Text>
            {earnings.map(function(item) { return (<View key={item[0]} style={s.tR}><Text style={s.rL}>{item[0]}</Text><Text style={s.rV}>{item[1]}</Text></View>); })}
            <View style={s.gRow}><Text style={s.gL}>Gross Salary</Text><Text style={s.gL}>{fmt(calc.grossSalary)}</Text></View>
          </View>
          <View style={s.col}>
            <Text style={s.secL}>Deductions</Text>
            {deductions.map(function(item) { return (<View key={item[0]} style={s.tR}><Text style={s.rL}>{item[0]}</Text><Text style={s.rV}>{item[1]}</Text></View>); })}
            <View style={s.gRow}><Text style={s.gL}>Total Deductions</Text><Text style={s.gL}>{fmt(calc.totalDeductions)}</Text></View>
          </View>
        </View>
        <View style={s.netB}>
          <View><Text style={s.netL}>Net Pay</Text><Text style={s.netA}>{fmt(calc.netSalary)}</Text></View>
          <Text style={s.netW}>{"Rupees " + Math.floor(parseFloat(calc.netSalary)).toLocaleString("en-IN") + " Only"}</Text>
        </View>
        <View style={s.foot}><Text style={s.footG}>Generated by DocMinty.com</Text><View style={s.signB}><Text style={s.signT}>HR Manager</Text></View></View>
      </Page>
    </Document>
  );
}
