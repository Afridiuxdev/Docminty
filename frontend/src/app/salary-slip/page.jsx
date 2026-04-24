"use client";
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import TemplatePicker from "@/components/TemplatePicker";
import TemplateColorPicker from "@/components/TemplateColorPicker";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { INDIAN_STATES } from "@/constants/indianStates";
import { calculateSalary } from "@/engine/salaryCalc";
import { numberToWords } from "@/engine/gstCalc";
import { Download, Eye, RefreshCw, Cloud, PenTool, Zap } from "lucide-react";
import SignatureModal from "@/components/SignatureModal";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import { useProfileSync } from "@/hooks/useProfileSync";

const T = "#0D9488";

export const DEFAULT_FORM = {
  // Company
  companyName: "", companyAddress: "", companyCity: "",
  companyState: "27", companyPhone: "", companyEmail: "", companyGst: "",
  logo: null,
  // Employee
  employeeName: "", employeeId: "", designation: "",
  department: "", panNumber: "", pfNumber: "",
  joiningDate: "",
  // Payroll period
  month: new Date().toLocaleString("en-IN", { month: "long" }),
  year: new Date().getFullYear().toString(),
  paymentDate: new Date().toISOString().split("T")[0],
  // Earnings
  basic: "", hra: "", da: "", conveyance: "1600",
  medical: "1250", otherAllowances: "",
  // Deductions
  incomeTax: "", otherDeductions: "", includePF: true, includePT: true,
  // Settings
  workingDays: "30", paidDays: "30",
  hrManagerName: "",
  signature: null,
  templateColor: "#0D9488",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function SalaryPreview({ form, template = "Classic", accent = "#0D9488" }) {
  const calc = calculateSalary({
    basic: form.basic, hra: form.hra, da: form.da,
    conveyance: form.conveyance, medical: form.medical,
    otherAllowances: form.otherAllowances,
    incomeTax: form.incomeTax, otherDeductions: form.otherDeductions,
    includePF: form.includePF !== false,
    includePT: form.includePT !== false,
  });
  const companyState = INDIAN_STATES.find(s => s.code === form.companyState);

  const salaryBody = (
    <div className="pdf-body">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", padding: "16px", background: "#F8F9FA", borderRadius: "8px", marginBottom: "16px" }}>
        {[
          ["Employee Name", form.employeeName || "—"],
          ["Employee ID", form.employeeId || "—"],
          ["Designation", form.designation || "—"],
          ["Department", form.department || "—"],
          ["PAN Number", form.panNumber || "—"],
          ["PF Number", form.pfNumber || "—"],
          ["Joining Date", form.joiningDate || "—"],
          ["Payment Date", form.paymentDate || "—"],
          ["Working Days", `${form.paidDays} / ${form.workingDays}`],
        ].map(([label, value]) => (
          <div key={label}>
            <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
            <p style={{ fontSize: "12px", color: "#111827", margin: 0, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#fff", background: accent, padding: "6px 12px", borderRadius: "4px 4px 0 0", margin: 0, fontFamily: "Space Grotesk, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Earnings</p>
          <table className="pdf-table" style={{ margin: 0 }}>
            <tbody>
              {[
                ["Basic Salary", `Rs.${parseFloat(form.basic || 0).toLocaleString("en-IN")}`],
                ["HRA", `Rs.${parseFloat(form.hra || 0).toLocaleString("en-IN")}`],
                ["DA", `Rs.${parseFloat(form.da || 0).toLocaleString("en-IN")}`],
                ["Conveyance", `Rs.${parseFloat(form.conveyance || 0).toLocaleString("en-IN")}`],
                ["Medical Allow.", `Rs.${parseFloat(form.medical || 0).toLocaleString("en-IN")}`],
                form.otherAllowances && ["Other Allowances", `Rs.${parseFloat(form.otherAllowances).toLocaleString("en-IN")}`],
              ].filter(Boolean).map(([l, v]) => (
                <tr key={l}>
                  <td style={{ color: "#374151" }}>{l}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "#111827" }}>{v}</td>
                </tr>
              ))}
              <tr style={{ background: "#F0F9F8" }}>
                <td style={{ fontWeight: 700, color: accent, fontFamily: "Space Grotesk, sans-serif" }}>Gross Salary</td>
                <td style={{ textAlign: "right", fontWeight: 700, color: accent, fontFamily: "Space Grotesk, sans-serif" }}>Rs.{parseFloat(calc.grossSalary).toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#fff", background: accent, padding: "6px 12px", borderRadius: "4px 4px 0 0", margin: 0, fontFamily: "Space Grotesk, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Deductions</p>
          <table className="pdf-table" style={{ margin: 0 }}>
            <tbody>
              {[
                parseFloat(calc.employeePF) > 0 && ["Employee PF", `Rs.${parseFloat(calc.employeePF).toLocaleString("en-IN")}`],
                parseFloat(calc.professionalTax) > 0 && ["Professional Tax", `Rs.${parseFloat(calc.professionalTax).toLocaleString("en-IN")}`],
                parseFloat(calc.esi) > 0 && ["ESI", `Rs.${parseFloat(calc.esi).toLocaleString("en-IN")}`],
                parseFloat(calc.incomeTax) > 0 && ["Income Tax (TDS)", `Rs.${parseFloat(calc.incomeTax).toLocaleString("en-IN")}`],
                parseFloat(calc.otherDeductions) > 0 && ["Other Deductions", `Rs.${parseFloat(calc.otherDeductions).toLocaleString("en-IN")}`],
              ].filter(Boolean).map(([l, v]) => (
                <tr key={l}>
                  <td style={{ color: "#374151" }}>{l}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "#111827" }}>{v}</td>
                </tr>
              ))}
              <tr style={{ background: "#F8F9FA" }}>
                <td style={{ fontWeight: 700, color: accent, fontFamily: "Space Grotesk, sans-serif" }}>Total Deductions</td>
                <td style={{ textAlign: "right", fontWeight: 700, color: accent, fontFamily: "Space Grotesk, sans-serif" }}>Rs.{parseFloat(calc.totalDeductions).toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ background: accent, borderRadius: "8px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Net Pay</p>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "24px", color: "#fff", margin: 0 }}>Rs.{parseFloat(calc.netSalary).toLocaleString("en-IN")}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>In Words</p>
          <p style={{ fontSize: "11px", color: "#fff", margin: 0, fontFamily: "Inter, sans-serif", fontStyle: "italic", maxWidth: "200px", textAlign: "right" }}>
            {numberToWords(Math.floor(parseFloat(calc.netSalary)))}
          </p>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <p style={{ fontSize: "10px", color: "#D1D5DB", fontFamily: "Inter, sans-serif", margin: 0 }}>Generated by DocMinty.com</p>
        <div style={{ textAlign: "center", minWidth: "120px" }}>
          {form.signature ? (
            <img src={form.signature} alt="Signature" style={{ height: "40px", marginBottom: "4px", display: "block", marginLeft: "auto", marginRight: "auto" }} />
          ) : (
            <div style={{ height: "40px", borderBottom: "1px solid #374151", marginBottom: "4px" }} />
          )}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#111827", fontFamily: "Inter, sans-serif", margin: "0 0 2px" }}>{form.hrManagerName || "HR Manager"}</p>
          <p style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>Authorized Signatory</p>
        </div>
      </div>
    </div>
  );

  if (template === "Modern") {
    return (
      <div className="pdf-preview" style={{ display: "flex", gap: 0, padding: 0, overflow: "hidden" }}>
        <div style={{ width: "140px", minWidth: "140px", background: accent, padding: "24px 16px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {form.logo && <img src={form.logo} alt="Logo" style={{ maxHeight: "36px", width: "auto", objectFit: "contain" }} />}
          <div>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px", color: "#fff", margin: 0 }}>SALARY SLIP</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{form.month} {form.year}</p>
          </div>
          <div>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", margin: "0 0 2px", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>Company</p>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "12px", color: "#fff", margin: 0 }}>{form.companyName || "Company"}</p>
            {form.companyAddress && <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}</p>}
            {companyState && <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", margin: "1px 0 0", fontFamily: "Inter, sans-serif" }}>{companyState.name}</p>}
            {form.companyPhone && <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Ph: {form.companyPhone}</p>}
            {form.companyEmail && <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", margin: "1px 0 0", fontFamily: "Inter, sans-serif", wordBreak: "break-all" }}>Em: {form.companyEmail}</p>}
            {form.companyGst && <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", margin: "1px 0 0", fontFamily: "Inter, sans-serif", wordBreak: "break-all" }}>GST: {form.companyGst}</p>}
          </div>
          <div>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", margin: "0 0 2px", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>Employee</p>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "12px", color: "#fff", margin: 0 }}>{form.employeeName || "—"}</p>
            {form.designation && <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.designation}</p>}
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>{salaryBody}</div>
      </div>
    );
  }

  if (template === "Corporate") {
    return (
      <div className="pdf-preview" style={{ padding: 0 }}>
        {/* Band 1: accent title strip */}
        <div style={{ background: accent, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "3px", height: "28px", background: "#fff", borderRadius: "2px", flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "17px", color: "#fff", margin: 0, letterSpacing: "0.04em" }}>SALARY SLIP</p>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)", margin: "2px 0 0", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>For the period of {form.month} {form.year}</p>
            </div>
          </div>
          {form.logo && (
            <img src={form.logo} alt="Logo" style={{ maxHeight: "36px", width: "auto", objectFit: "contain", flexShrink: 0 }} />
          )}
        </div>
        {/* Band 2: light company info strip */}
        <div style={{ background: "#F8F9FA", borderBottom: `2px solid ${accent}`, padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", color: "#111827", margin: 0 }}>{form.companyName || "Company Name"}</p>
            {(form.companyAddress || companyState) && <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}{companyState ? `, ${companyState.name}` : ""}</p>}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {form.companyPhone && <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>Ph: {form.companyPhone}</p>}
            {form.companyEmail && <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>Em: {form.companyEmail}</p>}
            {form.companyGst && <p style={{ fontSize: "10px", color: "#6B7280", margin: 0, fontFamily: "Inter, sans-serif" }}>GST: {form.companyGst}</p>}
          </div>
        </div>
        {salaryBody}
      </div>
    );
  }

  if (template === "Elegant") {
    return (
      <div className="pdf-preview" style={{ padding: 0 }}>
        <div style={{ display: "flex", minHeight: "90px" }}>
          <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
            {form.logo && <img src={form.logo} alt="Logo" style={{ maxHeight: "36px", width: "auto", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: 0 }}>{form.companyName || "Company Name"}</p>
            {(form.companyAddress || companyState) && <p style={{ fontSize: "10px", color: "#6B7280", margin: "3px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}{companyState ? `, ${companyState.name}` : ""}</p>}
            {form.companyPhone && <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Ph: {form.companyPhone}</p>}
            {form.companyEmail && <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "1px 0 0", fontFamily: "Inter, sans-serif" }}>Em: {form.companyEmail}</p>}
            {form.companyGst && <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "1px 0 0", fontFamily: "Inter, sans-serif" }}>GST: {form.companyGst}</p>}
          </div>
          <div style={{ width: "150px", flexShrink: 0, background: accent, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "20px 16px" }}>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.65)", margin: "0 0 6px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Salary Slip</p>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: "#fff", margin: 0, lineHeight: 1 }}>{form.month.slice(0, 3).toUpperCase()}</p>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", color: "rgba(255,255,255,0.85)", margin: "4px 0 0" }}>{form.year}</p>
          </div>
        </div>
        <div style={{ height: "3px", background: `linear-gradient(90deg, ${accent} 60%, transparent 100%)` }} />
        {salaryBody}
      </div>
    );
  }

  if (template === "Classic") {
    return (
      <div className="pdf-preview">
        <div style={{ background: accent, padding: "20px 24px", minHeight: "72px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ minWidth: 0 }}>
              {form.logo && <img src={form.logo} alt="Logo" style={{ maxHeight: "40px", width: "auto", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#fff", margin: 0 }}>{form.companyName || "Company Name"}</p>
              {form.companyAddress && <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}{companyState ? `, ${companyState.name}` : ""}</p>}
              {form.companyPhone && <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Ph: {form.companyPhone}</p>}
              {form.companyEmail && <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", margin: "1px 0 0", fontFamily: "Inter, sans-serif" }}>Em: {form.companyEmail}</p>}
              {form.companyGst && <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", margin: "1px 0 0", fontFamily: "Inter, sans-serif" }}>GST: {form.companyGst}</p>}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", color: "#fff", margin: 0 }}>SALARY SLIP</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{form.month} {form.year}</p>
            </div>
          </div>
        </div>
        {salaryBody}
      </div>
    );
  }

  // Minimal (default)
  return (
    <div className="pdf-preview">
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #E5E7EB", minHeight: "72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ minWidth: 0 }}>
            {form.logo && <img src={form.logo} alt="Logo" style={{ maxHeight: "40px", width: "auto", objectFit: "contain", marginBottom: "6px", display: "block" }} />}
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: 0 }}>{form.companyName || "Company Name"}</p>
            {form.companyAddress && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.companyAddress}{form.companyCity ? `, ${form.companyCity}` : ""}{companyState ? `, ${companyState.name}` : ""}</p>}
            {form.companyPhone && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "1px 0 0", fontFamily: "Inter, sans-serif" }}>Ph: {form.companyPhone}</p>}
            {form.companyEmail && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "1px 0 0", fontFamily: "Inter, sans-serif" }}>Em: {form.companyEmail}</p>}
            {form.companyGst && <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "1px 0 0", fontFamily: "Inter, sans-serif" }}>GST: {form.companyGst}</p>}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "18px", color: "#111827", margin: 0 }}>SALARY SLIP</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>{form.month} {form.year}</p>
          </div>
        </div>
        <div style={{ height: "2px", background: accent, marginTop: "12px", borderRadius: "1px" }} />
      </div>
      {salaryBody}
    </div>
  );
}

export default function SalarySlipPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_FORM;
    try {
      const raw = localStorage.getItem("docminty_draft");
      if (!raw) return DEFAULT_FORM;
      const saved = JSON.parse(raw);
      const { _docTemplate, docId, editMode, viewMode, autoDownload, ...formData } = saved;
      return { ...DEFAULT_FORM, ...formData };
    } catch { return DEFAULT_FORM; }
  });
  const { download, downloading } = useDownloadPDF();
  const [template, setTemplate] = useState(() => {
    if (typeof window === "undefined") return "Classic";
    try {
      const raw = localStorage.getItem("docminty_draft");
      if (!raw) return "Classic";
      const saved = JSON.parse(raw);
      localStorage.removeItem("docminty_draft");
      return saved._docTemplate || "Classic";
    } catch { return "Classic"; }
  });
  const [activeTab, setActiveTab] = useState("company");
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const router = useRouter();

  const plan = user?.plan?.toUpperCase() || "FREE";
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE";

  // Auto-sync profile for all registered users
  useProfileSync(form, setForm, plan);
  const templateMeta = TEMPLATE_REGISTRY.salary[template] || TEMPLATE_REGISTRY.salary.Classic;
  const isProTemplate = templateMeta.pro;
  const showWatermark = isProTemplate && !isUserPro;

  const handleDownload = () => {
    download("salary", template, form, `SalarySlip-${form.employeeName||"Employee"}-${form.month}-${form.year}.pdf`);
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    if (!isUserPro) {
      toast.error("Cloud saving is a PRO feature. Please upgrade!");
      router.push("/dashboard/billing");
      return;
    }
    try {
      const calc = calculateSalary({ basic: form.basic, hra: form.hra, da: form.da, conveyance: form.conveyance, medical: form.medical, otherAllowances: form.otherAllowances, incomeTax: form.incomeTax, otherDeductions: form.otherDeductions, includePF: form.includePF !== false, includePT: form.includePT !== false });
      await documentsApi.save({ 
        docType: "salary-slip", 
        title: `Salary Slip - ${form.employeeName || "Employee"} ${form.month} ${form.year}`, 
        referenceNumber: `${form.month} ${form.year}`, 
        templateName: template,
        partyName: form.employeeName, 
        amount: calc.netSalary, 
        formData: JSON.stringify(form) 
      });
      toast.success("Saved to your dashboard!");
    } catch (err) { if (err.message !== "PLAN_LIMIT_REACHED") toast.error("Save failed"); }
  };
  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);

  const TABS = [
    { id: "company", label: "Company" },
    { id: "employee", label: "Employee" },
    { id: "earnings", label: "Salary" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <>
      <Toaster position="top-right" />
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
            {user && isUserPro && (
              <div style={{ position: "relative" }}>
                <button onClick={handleSave} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  height: "36px", padding: "0 14px",
                  border: `1px solid ${T}`, borderRadius: "8px",
                  background: "#fff", fontSize: "13px", fontWeight: 600,
                  color: T, cursor: "pointer",
                  fontFamily: "Inter, sans-serif", transition: "all 150ms",
                }}>
                  <Cloud size={14} /> Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
        <div className="doc-page-wrap">
          <div className="form-panel">
            <div className="tab-bar" style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#F0F4F3", borderRadius: "8px", padding: "4px" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 150ms", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "company" && (
              <div>
                <p className="form-label">Company Details</p>

                {!isUserPro && (
                  <div style={{ padding: "10px 14px", background: "#F0FDFA", border: "1px solid #99F6E4", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <Zap size={14} color={T} />
                    <p style={{ fontSize: "11px", color: T, fontWeight: 600, margin: 0, fontFamily: "Inter, sans-serif" }}>
                      Tip: Upgrade to <strong style={{ color: "#0D9488" }}>Business Pro</strong> to auto-fill your profile details.
                    </p>
                  </div>
                )}
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Company Logo</p>
                  {isUserPro ? (
                    <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
                  ) : (
                    <div onClick={() => router.push("/#pricing")} style={{ padding: "14px 16px", border: "1px dashed #D1D5DB", borderRadius: "8px", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                      <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Logo upload — <strong style={{ color: "#6366F1" }}>Pro feature</strong></span>
                      <span style={{ fontSize: "11px", background: "#EDE9FE", color: "#6366F1", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>Upgrade</span>
                    </div>
                  )}
                </div>
                <div className="form-field"><label className="field-label">Company Name *</label><input className="doc-input" placeholder="Your Company Pvt. Ltd." value={form.companyName} onChange={e => updateField("companyName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Address</label><textarea className="doc-textarea" placeholder="Company address" value={form.companyAddress} onChange={e => updateField("companyAddress", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">City</label><input className="doc-input" placeholder="Mumbai" value={form.companyCity} onChange={e => updateField("companyCity", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">State</label><select className="doc-select" value={form.companyState} onChange={e => updateField("companyState", e.target.value)}>{INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Phone</label><input className="doc-input" placeholder="+91 98765 43210" value={form.companyPhone} onChange={e => updateField("companyPhone", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Email</label><input className="doc-input" type="email" placeholder="hr@company.com" value={form.companyEmail} onChange={e => updateField("companyEmail", e.target.value)} /></div>
                </div>
                <div className="form-field" style={{ marginTop: "10px" }}><label className="field-label">GST Number</label><input className="doc-input" placeholder="22AAAAA0000A1Z5" value={form.companyGst || ""} onChange={e => updateField("companyGst", e.target.value.toUpperCase())} style={{ fontFamily: "monospace" }} /></div>
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
                
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Signatory Details</p>
                <div className="form-field"><label className="field-label">HR / Manager Name</label><input className="doc-input" placeholder="Ravi Kumar" value={form.hrManagerName || ""} onChange={e => updateField("hrManagerName", e.target.value)} /></div>
                <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  {form.signature ? (
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <div style={{ padding: "12px", background: "#F9FAFB", borderRadius: "8px", border: "1px dashed #D1D5DB", display: "inline-block" }}>
                        <img src={form.signature} alt="Sig" style={{ height: "45px" }} />
                      </div>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "10px" }}>
                        <button onClick={() => setIsSigModalOpen(true)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", background: "#fff", fontSize: "12px" }}>Change Signature</button>
                        <button onClick={() => updateField("signature", null)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FEE2E2", background: "#FEF2F2", fontSize: "12px", color: "#EF4444" }}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setIsSigModalOpen(true)} style={{ width: "100%", padding: "20px", background: "#F9FAFB", border: "1px dashed #D1D5DB", borderRadius: "8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <PenTool size={20} color="#9CA3AF" />
                      <span style={{ fontSize: "13px", color: "#6B7280" }}>Add HR Manager Signature</span>
                    </button>
                  )}
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
                <p className="form-label">Auto Deductions</p>
                {[
                  { key: "includePF", label: "Employee PF (12% of Basic)", sublabel: form.basic ? `Rs.${Math.min(parseFloat(form.basic || 0) * 0.12, 1800).toFixed(0)} / month, max Rs.1800` : "12% of basic salary, max Rs.1800" },
                  { key: "includePT", label: "Professional Tax", sublabel: "Maharashtra slab: up to Rs.200/month" },
                ].map(({ key, label, sublabel }) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB", marginBottom: "8px" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: form[key] !== false ? "#374151" : "#9CA3AF", margin: 0, fontFamily: "Inter, sans-serif" }}>{label}</p>
                      <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{sublabel}</p>
                    </div>
                    <button onClick={() => updateField(key, form[key] === false)} style={{ padding: "4px 12px", borderRadius: "6px", border: `1px solid ${form[key] !== false ? "#EF4444" : "#0D9488"}`, background: form[key] !== false ? "#FEF2F2" : "#F0FDFA", fontSize: "12px", fontWeight: 600, color: form[key] !== false ? "#EF4444" : "#0D9488", cursor: "pointer", fontFamily: "Inter, sans-serif", flexShrink: 0, marginLeft: "10px" }}>
                      {form[key] !== false ? "Remove" : "Add"}
                    </button>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Extra Deductions</p>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Income Tax (TDS)</label><input className="doc-input" type="number" placeholder="0" value={form.incomeTax} onChange={e => updateField("incomeTax", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Other Deductions</label><input className="doc-input" type="number" placeholder="0" value={form.otherDeductions} onChange={e => updateField("otherDeductions", e.target.value)} /></div>
                </div>
                {/* Live calc summary */}
                {form.basic && (() => {
                  const calc = calculateSalary({ basic: form.basic, hra: form.hra, da: form.da, conveyance: form.conveyance, medical: form.medical, otherAllowances: form.otherAllowances, incomeTax: form.incomeTax, otherDeductions: form.otherDeductions, includePF: form.includePF !== false, includePT: form.includePT !== false });
                  return (
                    <div style={{ marginTop: "16px", padding: "12px", background: "#F0F4F3", borderRadius: "8px" }}>
                      {[["Gross Salary", `Rs.${parseFloat(calc.grossSalary).toLocaleString("en-IN")}`, false], parseFloat(calc.employeePF) > 0 && ["PF (12%)", `- Rs.${parseFloat(calc.employeePF).toLocaleString("en-IN")}`, false], parseFloat(calc.professionalTax) > 0 && ["Prof. Tax", `- Rs.${parseFloat(calc.professionalTax).toLocaleString("en-IN")}`, false], ["Total Deductions", `- Rs.${parseFloat(calc.totalDeductions).toLocaleString("en-IN")}`, false], ["Net Pay", `Rs.${parseFloat(calc.netSalary).toLocaleString("en-IN")}`, true]].filter(Boolean).map(([l, v, bold]) => (
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


            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <div style={{ marginTop: "8px" }}>
                  <TemplatePicker 
                    docType="salary" 
                    selected={template} 
                    onChange={(t) => {
                      setTemplate(t);
                      const meta = TEMPLATE_REGISTRY.salary[t] || TEMPLATE_REGISTRY.salary.Classic;
                      updateField("templateColor", meta.accent);
                    }} 
                    isPro={isUserPro} 
                  />
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "20px 0" }} />
                <p className="form-label">Template Color</p>
                <TemplateColorPicker 
                  value={form.templateColor || templateMeta.accent}
                  onChange={(color) => updateField("templateColor", color)}
                />
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "24px 0" }} />
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn" style={{ width: "100%", justifyContent: "center" }}>
                  <Download size={15} /> Download PDF
                </button>
              </div>
            )}

            {TABS[TABS.length - 1].id !== activeTab && (
              <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setActiveTab(TABS[TABS.findIndex(t => t.id === activeTab) + 1].id)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 20px", background: "#0D9488", color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", border: "none", borderRadius: "8px", cursor: "pointer" }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div className="preview-panel">
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
              <Eye size={14} color="#9CA3AF" />
              <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>LIVE PREVIEW</span>
            </div>
            <div style={{ position: "relative" }}>
              {showWatermark && <WatermarkOverlay />}
              <SalaryPreview form={form} template={template} accent={form.templateColor || templateMeta.accent} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_SALARY" />
        </div>
      </div>
      <Footer />
      <SignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={sig => updateField("signature", sig)}
      />
    </>
  );
}
