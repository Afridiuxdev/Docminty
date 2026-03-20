"use client";
import TemplatePicker from "@/components/TemplatePicker";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { INDIAN_STATES } from "@/constants/indianStates";
import { calculateSalary } from "@/engine/salaryCalc";
import { Download, Eye, RefreshCw } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";

const T = "#0D9488";

const DEFAULT_FORM = {
  // Company
  companyName: "", companyAddress: "", companyCity: "",
  companyState: "27", companyPhone: "", companyEmail: "",
  logo: null,
  // Employee
  employeeName: "", employeeId: "", designation: "",
  department: "", panNumber: "", pfNumber: "",
  bankName: "", accountNumber: "", ifscCode: "",
  joiningDate: "",
  // Payroll period
  month: new Date().toLocaleString("en-IN", { month: "long" }),
  year: new Date().getFullYear().toString(),
  paymentDate: new Date().toISOString().split("T")[0],
  // Earnings
  basic: "", hra: "", da: "", conveyance: "1600",
  medical: "1250", otherAllowances: "",
  // Deductions
  incomeTax: "", otherDeductions: "",
  // Settings
  workingDays: "30", paidDays: "30",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function SalaryPreview({ form }) {
  const calc = calculateSalary({
    basic: form.basic, hra: form.hra, da: form.da,
    conveyance: form.conveyance, medical: form.medical,
    otherAllowances: form.otherAllowances,
    incomeTax: form.incomeTax, otherDeductions: form.otherDeductions,
  });
  const companyState = INDIAN_STATES.find(s => s.code === form.companyState);

  return (
    <div className="pdf-preview">
      {/* Header */}
      <div style={{ background: T, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "40px", objectFit: "contain", marginBottom: "8px", display: "block", filter: "brightness(0) invert(1)" }} />}
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#fff", margin: 0 }}>{form.companyName || "Company Name"}</p>
            {form.companyAddress && <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}</p>}
            {companyState && <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{companyState.name}</p>}
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", color: "#fff", margin: 0 }}>SALARY SLIP</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{form.month} {form.year}</p>
          </div>
        </div>
      </div>

      <div className="pdf-body">
        {/* Employee info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", padding: "16px", background: "#F8F9FA", borderRadius: "8px", marginBottom: "16px" }}>
          {[
            ["Employee Name", form.employeeName || "—"],
            ["Employee ID", form.employeeId || "—"],
            ["Designation", form.designation || "—"],
            ["Department", form.department || "—"],
            ["PAN Number", form.panNumber || "—"],
            ["PF Number", form.pfNumber || "—"],
            ["Payment Date", form.paymentDate || "—"],
            ["Working Days", `${form.paidDays} / ${form.workingDays}`],
          ].map(([label, value]) => (
            <div key={label}>
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
              <p style={{ fontSize: "12px", color: "#111827", margin: 0, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Earnings & Deductions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          {/* Earnings */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#fff", background: T, padding: "6px 12px", borderRadius: "4px 4px 0 0", margin: 0, fontFamily: "Space Grotesk, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Earnings</p>
            <table className="pdf-table" style={{ margin: 0 }}>
              <tbody>
                {[
                  ["Basic Salary", `₹${parseFloat(form.basic || 0).toLocaleString("en-IN")}`],
                  ["HRA", `₹${parseFloat(form.hra || 0).toLocaleString("en-IN")}`],
                  ["DA", `₹${parseFloat(form.da || 0).toLocaleString("en-IN")}`],
                  ["Conveyance", `₹${parseFloat(form.conveyance || 0).toLocaleString("en-IN")}`],
                  ["Medical Allow.", `₹${parseFloat(form.medical || 0).toLocaleString("en-IN")}`],
                  form.otherAllowances && ["Other Allowances", `₹${parseFloat(form.otherAllowances).toLocaleString("en-IN")}`],
                ].filter(Boolean).map(([l, v]) => (
                  <tr key={l}>
                    <td style={{ color: "#374151" }}>{l}</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#111827" }}>{v}</td>
                  </tr>
                ))}
                <tr style={{ background: "#F0FDFA" }}>
                  <td style={{ fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}>Gross Salary</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}>₹{parseFloat(calc.grossSalary).toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#fff", background: "#EF4444", padding: "6px 12px", borderRadius: "4px 4px 0 0", margin: 0, fontFamily: "Space Grotesk, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Deductions</p>
            <table className="pdf-table" style={{ margin: 0 }}>
              <tbody>
                {[
                  ["Employee PF", `₹${parseFloat(calc.employeePF).toLocaleString("en-IN")}`],
                  ["Professional Tax", `₹${parseFloat(calc.professionalTax).toLocaleString("en-IN")}`],
                  parseFloat(calc.esi) > 0 && ["ESI", `₹${parseFloat(calc.esi).toLocaleString("en-IN")}`],
                  parseFloat(calc.incomeTax) > 0 && ["Income Tax (TDS)", `₹${parseFloat(calc.incomeTax).toLocaleString("en-IN")}`],
                  parseFloat(calc.otherDeductions) > 0 && ["Other Deductions", `₹${parseFloat(calc.otherDeductions).toLocaleString("en-IN")}`],
                ].filter(Boolean).map(([l, v]) => (
                  <tr key={l}>
                    <td style={{ color: "#374151" }}>{l}</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#111827" }}>{v}</td>
                  </tr>
                ))}
                <tr style={{ background: "#FEF2F2" }}>
                  <td style={{ fontWeight: 700, color: "#EF4444", fontFamily: "Space Grotesk, sans-serif" }}>Total Deductions</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "#EF4444", fontFamily: "Space Grotesk, sans-serif" }}>₹{parseFloat(calc.totalDeductions).toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Pay */}
        <div style={{ background: "#134E4A", borderRadius: "8px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "11px", color: "#99F6E4", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Net Pay</p>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "24px", color: "#fff", margin: 0 }}>₹{parseFloat(calc.netSalary).toLocaleString("en-IN")}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "11px", color: "#99F6E4", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>In Words</p>
            <p style={{ fontSize: "11px", color: "#fff", margin: 0, fontFamily: "Inter, sans-serif", fontStyle: "italic", maxWidth: "200px" }}>
              {`Rupees ${Math.floor(parseFloat(calc.netSalary)).toLocaleString("en-IN")} Only`}
            </p>
          </div>
        </div>

        {/* Bank details */}
        {(form.bankName || form.accountNumber) && (
          <div style={{ marginTop: "16px", padding: "12px 16px", background: "#F8F9FA", borderRadius: "6px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontFamily: "Space Grotesk, sans-serif" }}>Bank Details</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {[["Bank", form.bankName], ["Account", form.accountNumber], ["IFSC", form.ifscCode]].map(([l, v]) => v && (
                <div key={l}>
                  <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>{l}</p>
                  <p style={{ fontSize: "12px", color: "#111827", margin: 0, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "10px", color: "#D1D5DB", fontFamily: "Inter, sans-serif", margin: 0 }}>Generated by DocMinty.com</p>
          <div style={{ borderTop: "1px solid #374151", paddingTop: "4px", minWidth: "120px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>HR Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SalarySlipPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [template, setTemplate] = useState("Classic");
  const [activeTab, setActiveTab] = useState("company");
  const handleDownload = () => {
    download("SalarySlip" + template, form, `SalarySlip-${form.employeeName||"Employee"}-${form.month}-${form.year}.pdf`);
  };
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "company", label: "Company" },
    { id: "employee", label: "Employee" },
    { id: "earnings", label: "Salary" },
    { id: "bank", label: "Bank" },
  ];

  return (
    <>
      <Navbar />
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, margin: 0, color: "#111827" }}>Salary Slip Generator</h1>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Auto PF · TDS · ESI · Professional Tax</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setForm(DEFAULT_FORM)} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
              <RefreshCw size={13} /> Reset
            </button>
            <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">
              <Download size={15} />
              {downloading ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
        <div className="doc-page-wrap">
          <div className="form-panel">
            <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#F0F4F3", borderRadius: "8px", padding: "4px" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 150ms", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "company" && (
              <div>
                <p className="form-label">Company Details</p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Company Logo</p>
                  <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
                <div style={{ marginTop: "16px" }}><TemplatePicker docType="salary" selected={template} onChange={setTemplate} isPro={false} /></div>
</div>
                <div className="form-field"><label className="field-label">Company Name *</label><input className="doc-input" placeholder="Your Company Pvt. Ltd." value={form.companyName} onChange={e => updateField("companyName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Address</label><textarea className="doc-textarea" placeholder="Company address" value={form.companyAddress} onChange={e => updateField("companyAddress", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">City</label><input className="doc-input" placeholder="Mumbai" value={form.companyCity} onChange={e => updateField("companyCity", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">State</label><select className="doc-select" value={form.companyState} onChange={e => updateField("companyState", e.target.value)}>{INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Pay Period</p>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Month</label>
                    <select className="doc-select" value={form.month} onChange={e => updateField("month", e.target.value)}>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Year</label>
                    <select className="doc-select" value={form.year} onChange={e => updateField("year", e.target.value)}>
                      {["2024", "2025", "2026", "2027"].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Working Days</label><input className="doc-input" type="number" value={form.workingDays} onChange={e => updateField("workingDays", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Paid Days</label><input className="doc-input" type="number" value={form.paidDays} onChange={e => updateField("paidDays", e.target.value)} /></div>
                </div>
              </div>
            )}

            {activeTab === "employee" && (
              <div>
                <p className="form-label">Employee Details</p>
                <div className="form-field"><label className="field-label">Employee Name *</label><input className="doc-input" placeholder="Full Name" value={form.employeeName} onChange={e => updateField("employeeName", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Employee ID</label><input className="doc-input" placeholder="EMP001" value={form.employeeId} onChange={e => updateField("employeeId", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Designation</label><input className="doc-input" placeholder="Sr. Developer" value={form.designation} onChange={e => updateField("designation", e.target.value)} /></div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Department</label><input className="doc-input" placeholder="Engineering" value={form.department} onChange={e => updateField("department", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Joining Date</label><input className="doc-input" type="date" value={form.joiningDate} onChange={e => updateField("joiningDate", e.target.value)} /></div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">PAN Number</label><input className="doc-input" placeholder="ABCDE1234F" value={form.panNumber} onChange={e => updateField("panNumber", e.target.value.toUpperCase())} style={{ fontFamily: "monospace" }} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">PF Number</label><input className="doc-input" placeholder="MH/BAN/12345" value={form.pfNumber} onChange={e => updateField("pfNumber", e.target.value)} /></div>
                </div>
                <div className="form-field" style={{ marginTop: "10px" }}><label className="field-label">Payment Date</label><input className="doc-input" type="date" value={form.paymentDate} onChange={e => updateField("paymentDate", e.target.value)} /></div>
              </div>
            )}

            {activeTab === "earnings" && (
              <div>
                <p className="form-label">Earnings (Monthly ₹)</p>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Basic Salary *</label><input className="doc-input" type="number" placeholder="30000" value={form.basic} onChange={e => updateField("basic", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">HRA</label><input className="doc-input" type="number" placeholder="12000" value={form.hra} onChange={e => updateField("hra", e.target.value)} /></div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">DA</label><input className="doc-input" type="number" placeholder="3000" value={form.da} onChange={e => updateField("da", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Conveyance</label><input className="doc-input" type="number" value={form.conveyance} onChange={e => updateField("conveyance", e.target.value)} /></div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Medical Allow.</label><input className="doc-input" type="number" value={form.medical} onChange={e => updateField("medical", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Other Allowances</label><input className="doc-input" type="number" placeholder="0" value={form.otherAllowances} onChange={e => updateField("otherAllowances", e.target.value)} /></div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Extra Deductions</p>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Income Tax (TDS)</label><input className="doc-input" type="number" placeholder="0" value={form.incomeTax} onChange={e => updateField("incomeTax", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Other Deductions</label><input className="doc-input" type="number" placeholder="0" value={form.otherDeductions} onChange={e => updateField("otherDeductions", e.target.value)} /></div>
                </div>
                {/* Live calc summary */}
                {form.basic && (() => {
                  const calc = calculateSalary({ basic: form.basic, hra: form.hra, da: form.da, conveyance: form.conveyance, medical: form.medical, otherAllowances: form.otherAllowances, incomeTax: form.incomeTax, otherDeductions: form.otherDeductions });
                  return (
                    <div style={{ marginTop: "16px", padding: "12px", background: "#F0F4F3", borderRadius: "8px" }}>
                      {[["Gross Salary", `₹${parseFloat(calc.grossSalary).toLocaleString("en-IN")}`, false], ["PF (12%)", `- ₹${parseFloat(calc.employeePF).toLocaleString("en-IN")}`, false], ["Prof. Tax", `- ₹${parseFloat(calc.professionalTax).toLocaleString("en-IN")}`, false], ["Total Deductions", `- ₹${parseFloat(calc.totalDeductions).toLocaleString("en-IN")}`, false], ["Net Pay", `₹${parseFloat(calc.netSalary).toLocaleString("en-IN")}`, true]].map(([l, v, bold]) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: bold ? 0 : "4px", borderTop: bold ? "1px solid #D1D5DB" : "none", paddingTop: bold ? "6px" : 0, marginTop: bold ? "4px" : 0 }}>
                          <span style={{ fontSize: "12px", color: bold ? "#111827" : "#6B7280", fontWeight: bold ? 700 : 400, fontFamily: bold ? "Space Grotesk, sans-serif" : "Inter, sans-serif" }}>{l}</span>
                          <span style={{ fontSize: "12px", color: bold ? T : "#374151", fontWeight: bold ? 700 : 400, fontFamily: bold ? "Space Grotesk, sans-serif" : "Inter, sans-serif" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === "bank" && (
              <div>
                <p className="form-label">Bank Details</p>
                <div className="form-field"><label className="field-label">Bank Name</label><input className="doc-input" placeholder="State Bank of India" value={form.bankName} onChange={e => updateField("bankName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Account Number</label><input className="doc-input" placeholder="XXXXXXXXXXXX" value={form.accountNumber} onChange={e => updateField("accountNumber", e.target.value)} style={{ fontFamily: "monospace" }} /></div>
                <div className="form-field"><label className="field-label">IFSC Code</label><input className="doc-input" placeholder="SBIN0001234" value={form.ifscCode} onChange={e => updateField("ifscCode", e.target.value.toUpperCase())} style={{ fontFamily: "monospace" }} /></div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">
                  <Download size={15} />
                  {downloading ? "Generating..." : "Download PDF"}
                </button>
                <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", margin: "8px 0 0", fontFamily: "Inter, sans-serif" }}>No watermark · No sign-up · Instant download</p>
              </div>
            )}
          </div>

          <div className="preview-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Eye size={14} color="#9CA3AF" />
                <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>LIVE PREVIEW</span>
              </div>
              <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">
                <Download size={15} />
                {downloading ? "Generating..." : "Download PDF"}
              </button>
            </div>
            <SalaryPreview form={form} />
          </div>
        </div>

        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_SALARY" />
        </div>
      </div>
      <Footer />
    </>
  );
}
