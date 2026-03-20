"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateSalary } from "@/engine/salaryCalc";
import { INDIAN_STATES } from "@/constants/indianStates";
const A = "#6366F1";
const s = StyleSheet.create({
  page:  { fontFamily: "Helvetica", fontSize: 10, color: "#111827", padding: 0 },
  head:  { backgroundColor: A, padding: "18 36", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  logo:  { width: 44, height: 30, objectFit: "contain", marginBottom: 5 },
  cn:    { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#fff" },
  ca:    { fontSize: 8, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  st:    { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#fff", textAlign: "right" },
  sm:    { fontSize: 11, color: "rgba(255,255,255,0.8)", textAlign: "right", marginTop: 3 },
  body:  { padding: "18 36" },
  grid:  { flexDirection: "row", flexWrap: "wrap", backgroundColor: "#F8F9FA", padding: "10 14", borderRadius: 5, marginBottom: 14 },
  ei:    { width: "25%", marginBottom: 7 },
  el:    { fontSize: 7, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  ev:    { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
  secH:  { backgroundColor: A, padding: "5 8", borderRadius: 3 },
  secHR: { backgroundColor: "#EF4444", padding: "5 8", borderRadius: 3 },
  secT:  { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#fff", textTransform: "uppercase", letterSpacing: 1 },
  tR:    { flexDirection: "row", justifyContent: "space-between", padding: "4 8", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  rL:    { fontSize: 9, color: "#374151" },
  rV:    { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
  gRow:  { flexDirection: "row", justifyContent: "space-between", padding: "6 8", backgroundColor: "#EEF2FF" },
  gL:    { fontSize: 9, fontFamily: "Helvetica-Bold", color: A },
  dTR:   { flexDirection: "row", justifyContent: "space-between", padding: "6 8", backgroundColor: "#FEF2F2" },
  dTL:   { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#EF4444" },
  netB:  { backgroundColor: "#1E1B4B", padding: "14 18", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 6, marginTop: 14 },
  netL:  { fontSize: 8, color: "#C7D2FE", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
  netA:  { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#fff" },
  netW:  { fontSize: 8, color: "#C7D2FE", fontStyle: "italic", maxWidth: 180, textAlign: "right" },
  foot:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  footG: { fontSize: 7, color: "#D1D5DB" },
  signB: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 4, width: 110, textAlign: "center" },
  signT: { fontSize: 7, color: "#9CA3AF" },
});
export default function SalaryModernTemplate({ form }) {
  const calc = calculateSalary({
    basic: form.basic, hra: form.hra, da: form.da,
    conveyance: form.conveyance, medical: form.medical,
    otherAllowances: form.otherAllowances,
    incomeTax: form.incomeTax, otherDeductions: form.otherDeductions,
  });
  const state = INDIAN_STATES.find(function(st) { return st.code === form.companyState; });
  var fmt = function(n) { return "Rs. " + parseFloat(n).toLocaleString("en-IN"); };
  var earnings = [
    ["Basic Salary", fmt(form.basic || 0)],
    ["HRA", fmt(form.hra || 0)],
    ["DA", fmt(form.da || 0)],
    ["Conveyance", fmt(form.conveyance || 0)],
    ["Medical Allow.", fmt(form.medical || 0)],
  ];
  var deductions = [
    ["Employee PF", fmt(calc.employeePF)],
    ["Professional Tax", fmt(calc.professionalTax)],
    ["Income Tax (TDS)", fmt(calc.incomeTax)],
  ];
  var empDetails = [
    ["Employee Name", form.employeeName || "-"],
    ["Employee ID", form.employeeId || "-"],
    ["Designation", form.designation || "-"],
    ["Department", form.department || "-"],
    ["PAN Number", form.panNumber || "-"],
    ["PF Number", form.pfNumber || "-"],
    ["Payment Date", form.paymentDate || "-"],
    ["Working Days", (form.paidDays || "0") + "/" + (form.workingDays || "0")],
  ];
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View>
            {form.logo && <Image src={form.logo} style={s.logo} />}
            <Text style={s.cn}>{form.companyName || "Company"}</Text>
            {form.companyAddress && <Text style={s.ca}>{form.companyAddress + (form.companyCity ? ", " + form.companyCity : "")}</Text>}
            {state && <Text style={s.ca}>{state.name}</Text>}
          </View>
          <View>
            <Text style={s.st}>SALARY SLIP</Text>
            <Text style={s.sm}>{form.month + " " + form.year}</Text>
          </View>
        </View>
        <View style={s.body}>
          <View style={s.grid}>
            {empDetails.map(function(item) { return (
              <View key={item[0]} style={s.ei}>
                <Text style={s.el}>{item[0]}</Text>
                <Text style={s.ev}>{item[1]}</Text>
              </View>
            ); })}
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <View style={s.secH}><Text style={s.secT}>Earnings</Text></View>
              {earnings.map(function(item) { return (
                <View key={item[0]} style={s.tR}>
                  <Text style={s.rL}>{item[0]}</Text>
                  <Text style={s.rV}>{item[1]}</Text>
                </View>
              ); })}
              <View style={s.gRow}>
                <Text style={s.gL}>Gross Salary</Text>
                <Text style={s.gL}>{fmt(calc.grossSalary)}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.secHR}><Text style={s.secT}>Deductions</Text></View>
              {deductions.map(function(item) { return (
                <View key={item[0]} style={s.tR}>
                  <Text style={s.rL}>{item[0]}</Text>
                  <Text style={[s.rV, { color: "#EF4444" }]}>{item[1]}</Text>
                </View>
              ); })}
              <View style={s.dTR}>
                <Text style={s.dTL}>Total Deductions</Text>
                <Text style={s.dTL}>{fmt(calc.totalDeductions)}</Text>
              </View>
            </View>
          </View>
          <View style={s.netB}>
            <View>
              <Text style={s.netL}>Net Pay</Text>
              <Text style={s.netA}>{fmt(calc.netSalary)}</Text>
            </View>
            <Text style={s.netW}>{"Rupees " + Math.floor(parseFloat(calc.netSalary)).toLocaleString("en-IN") + " Only"}</Text>
          </View>
          <View style={s.foot}>
            <Text style={s.footG}>Generated by DocMinty.com</Text>
            <View style={s.signB}><Text style={s.signT}>HR Manager</Text></View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
