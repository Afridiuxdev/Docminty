"use client";
import TemplatePicker from "@/components/TemplatePicker";

import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { INDIAN_STATES } from "@/constants/indianStates";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { Plus, Trash2, Download, Eye, RefreshCw, Cloud } from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";

const T = "#0D9488";

// Add at top of component:
const DEFAULT_FORM = {
  quoteNumber: "QT-2026-001",
  quoteDate: new Date().toISOString().split("T")[0],
  validUntil: "",
  fromName: "", fromGSTIN: "", fromAddress: "", fromCity: "", fromState: "27",
  fromPhone: "", fromEmail: "",
  toName: "", toGSTIN: "", toAddress: "", toCity: "", toState: "27",
  toPhone: "", toEmail: "",
  taxType: "cgst_sgst",
  items: [{ description: "", hsn: "", qty: "1", rate: "", discount: "0", gstRate: "18", amount: "0.00" }],
  notes: "", terms: "This quotation is valid for 30 days.",
  logo: null, showHSN: true, showDiscount: false,
};

function ItemRow({ item, index, onChange, onRemove, showHSN, showDiscount }) {
  const update = (field, value) => {
    const u = { ...item, [field]: value };
    const qty = parseFloat(u.qty) || 0;
    const rate = parseFloat(u.rate) || 0;
    const discount = parseFloat(u.discount) || 0;
    const subtotal = qty * rate - discount;
    const gst = (subtotal * (parseFloat(u.gstRate) || 0)) / 100;
    u.amount = (subtotal + gst).toFixed(2);
    onChange(index, u);
  };
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: showHSN ? "2fr 0.6fr 0.5fr 0.7fr 0.5fr 0.7fr auto" : "2fr 0.5fr 0.7fr 0.5fr 0.7fr auto",
      gap: "6px", marginBottom: "6px", alignItems: "center",
    }}>
      <input className="doc-input" placeholder="Item description" value={item.description} onChange={e => update("description", e.target.value)} />
      {showHSN && <input className="doc-input" placeholder="HSN" value={item.hsn} onChange={e => update("hsn", e.target.value)} />}
      <input className="doc-input" type="number" placeholder="1" value={item.qty} onChange={e => update("qty", e.target.value)} />
      <input className="doc-input" type="number" placeholder="0.00" value={item.rate} onChange={e => update("rate", e.target.value)} />
      <select className="doc-select" value={item.gstRate} onChange={e => update("gstRate", e.target.value)}>
        {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
      </select>
      <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827", fontFamily: "Inter, sans-serif", textAlign: "right", whiteSpace: "nowrap" }}>₹{item.amount}</span>
      <button className="remove-item-btn" onClick={() => onRemove(index)}><Trash2 size={13} /></button>
    </div>
  );
}

function QuotationPreview({ form }) {
  const calc = calculateLineItems(form.items, form.taxType === "igst");
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);
  return (
    <div className="pdf-preview">
      <div className="pdf-header">
        <div>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "48px", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.fromName || "Your Business Name"}</p>
          {form.fromGSTIN && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>GSTIN: {form.fromGSTIN}</p>}
          {form.fromAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}</p>}
          {fromState && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{fromState.name}</p>}
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: T, margin: 0 }}>QUOTATION</p>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>#{form.quoteNumber}</p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>Date: {form.quoteDate}</p>
          {form.validUntil && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Valid Until: {form.validUntil}</p>}
        </div>
      </div>
      <div className="pdf-body">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px", fontFamily: "Space Grotesk, sans-serif" }}>Quote For</p>
            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", color: "#111827", margin: 0 }}>{form.toName || "Client Name"}</p>
            {form.toGSTIN && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>GSTIN: {form.toGSTIN}</p>}
            {form.toAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{form.toAddress}</p>}
            {toState && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{toState.name}</p>}
          </div>
        </div>
        <table className="pdf-table">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ width: "40%" }}>Description</th>
              {form.showHSN && <th>HSN</th>}
              <th>Qty</th>
              <th>Rate</th>
              <th>GST%</th>
              <th style={{ textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {calc.items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.description || "—"}</td>
                {form.showHSN && <td>{item.hsn || "—"}</td>}
                <td>{item.qty}</td>
                <td>₹{item.rate}</td>
                <td>{item.gstRate}%</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div className="pdf-totals">
            <div className="pdf-total-row"><span style={{ color: "#6B7280" }}>Subtotal</span><span>₹{calc.subtotal}</span></div>
            {form.taxType === "cgst_sgst" && <>
              <div className="pdf-total-row"><span style={{ color: "#6B7280" }}>CGST</span><span>₹{calc.totalCGST}</span></div>
              <div className="pdf-total-row"><span style={{ color: "#6B7280" }}>SGST</span><span>₹{calc.totalSGST}</span></div>
            </>}
            {form.taxType === "igst" && <div className="pdf-total-row"><span style={{ color: "#6B7280" }}>IGST</span><span>₹{calc.totalIGST}</span></div>}
            <div className="pdf-total-final"><span>Total</span><span>₹{calc.grandTotal}</span></div>
          </div>
        </div>
        <div style={{ marginTop: "16px", padding: "10px 14px", background: "#F8F9FA", borderRadius: "6px", borderLeft: `3px solid ${T}` }}>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount in Words</p>
          <p style={{ fontSize: "12px", color: "#374151", margin: 0, fontFamily: "Inter, sans-serif", fontStyle: "italic" }}>{numberToWords(parseFloat(calc.grandTotal))}</p>
        </div>
        {(form.notes || form.terms) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
            {form.notes && <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>Notes</p>
              <p style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif", lineHeight: 1.6, margin: 0 }}>{form.notes}</p>
            </div>}
            {form.terms && <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>Terms</p>
              <p style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif", lineHeight: 1.6, margin: 0 }}>{form.terms}</p>
            </div>}
          </div>
        )}
        <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "10px", color: "#D1D5DB", fontFamily: "Inter, sans-serif", margin: 0 }}>Generated by DocMinty.com</p>
          <div style={{ borderTop: "1px solid #374151", paddingTop: "4px", minWidth: "120px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuotationPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const { download, downloading } = useDownloadPDF();
  const [template, setTemplate] = useState("Classic");
  const [activeTab, setActiveTab] = useState("from");
  const router = useRouter();

  const isUserPro = user?.plan === "Business Pro" || user?.plan === "Enterprise";
  const templateMeta = TEMPLATE_REGISTRY.quotation[template] || TEMPLATE_REGISTRY.quotation.Classic;
  const isProTemplate = templateMeta.pro;
  const showWatermark = isProTemplate && !isUserPro;

  const handleDownload = () => {
    if (showWatermark) {
      toast.error("This is a PRO template. Please upgrade to download without watermark!");
      router.push("/#pricing");
      return;
    }
    download("Quotation" + template, form, `Quotation-${form.quoteNumber}.pdf`);
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    try {
      await documentsApi.save({ docType: "quotation", title: "Quotation #" + form.quoteNumber, referenceNumber: form.quoteNumber, partyName: form.toName, amount: form.items.reduce((s, i) => s + parseFloat(i.amount || 0), 0).toFixed(2), formData: JSON.stringify(form) });
      toast.success("Saved to your dashboard!");
    } catch { toast.error("Save failed"); }
  };

  const updateField = useCallback((field, value) => setForm(prev => ({ ...prev, [field]: value })), []);
  const updateItem = useCallback((index, updated) => setForm(prev => ({ ...prev, items: prev.items.map((item, i) => i === index ? updated : item) })), []);
  const addItem = useCallback(() => setForm(prev => ({ ...prev, items: [...prev.items, { description: "", hsn: "", qty: "1", rate: "", discount: "0", gstRate: "18", amount: "0.00" }] })), []);
  const removeItem = useCallback((index) => setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) })), []);

  const TABS = [
    { id: "from", label: "Your Details" },
    { id: "to", label: "Client" },
    { id: "items", label: "Items" },
    { id: "extra", label: "Settings" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 24px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: 700, margin: 0, color: "#111827" }}>Quotation Generator</h1>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Free · No sign-up · Professional quotes</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setForm(DEFAULT_FORM)} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
              <RefreshCw size={13} /> Reset
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="download-pdf-btn">
              <Download size={15} />
              {downloading ? "Generating..." : "Download PDF"}
            </button>
            <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #0D9488", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#0D9488", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 150ms" }}>
              <Cloud size={14} /> Save
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
        <div className="doc-page-wrap">

          {/* Form */}
          <div className="form-panel">
            <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#F0F4F3", borderRadius: "8px", padding: "4px" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 150ms", fontFamily: "Inter, sans-serif", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? T : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "from" && (
              <div>
                <p className="form-label">Your Business Details</p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>Company Logo</p>
                  <LogoUpload value={form.logo} onChange={v => updateField("logo", v)} />
                </div>
                <div className="form-field"><label className="field-label">Business Name</label><input className="doc-input" placeholder="Your Company Name" value={form.fromName} onChange={e => updateField("fromName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">GSTIN</label><input className="doc-input" placeholder="22AAAAA0000A1Z5" value={form.fromGSTIN} onChange={e => updateField("fromGSTIN", e.target.value.toUpperCase())} style={{ fontFamily: "monospace" }} /></div>
                <div className="form-field"><label className="field-label">Address</label><textarea className="doc-textarea" placeholder="Street address" value={form.fromAddress} onChange={e => updateField("fromAddress", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">City</label><input className="doc-input" placeholder="Mumbai" value={form.fromCity} onChange={e => updateField("fromCity", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">State</label><select className="doc-select" value={form.fromState} onChange={e => updateField("fromState", e.target.value)}>{INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Quote Details</p>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Quote Number</label><input className="doc-input" value={form.quoteNumber} onChange={e => updateField("quoteNumber", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">Quote Date</label><input className="doc-input" type="date" value={form.quoteDate} onChange={e => updateField("quoteDate", e.target.value)} /></div>
                </div>
                <div className="form-field" style={{ marginTop: "10px" }}><label className="field-label">Valid Until</label><input className="doc-input" type="date" value={form.validUntil} onChange={e => updateField("validUntil", e.target.value)} /></div>
              </div>
            )}

            {activeTab === "to" && (
              <div>
                <p className="form-label">Client Details</p>
                <div className="form-field"><label className="field-label">Client Name</label><input className="doc-input" placeholder="Client Company" value={form.toName} onChange={e => updateField("toName", e.target.value)} /></div>
                <div className="form-field"><label className="field-label">Client GSTIN</label><input className="doc-input" placeholder="22AAAAA0000A1Z5" value={form.toGSTIN} onChange={e => updateField("toGSTIN", e.target.value.toUpperCase())} style={{ fontFamily: "monospace" }} /></div>
                <div className="form-field"><label className="field-label">Address</label><textarea className="doc-textarea" placeholder="Client address" value={form.toAddress} onChange={e => updateField("toAddress", e.target.value)} /></div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">City</label><input className="doc-input" placeholder="Delhi" value={form.toCity} onChange={e => updateField("toCity", e.target.value)} /></div>
                  <div className="form-field" style={{ marginBottom: 0 }}><label className="field-label">State</label><select className="doc-select" value={form.toState} onChange={e => updateField("toState", e.target.value)}>{INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Tax Settings</p>
                <div className="form-field">
                  <label className="field-label">Tax Type</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[{ value: "cgst_sgst", label: "CGST+SGST" }, { value: "igst", label: "IGST" }, { value: "none", label: "No Tax" }].map(opt => (
                      <button key={opt.value} onClick={() => updateField("taxType", opt.value)} className={`toggle-btn ${form.taxType === opt.value ? "active" : ""}`}>{opt.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "items" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <p className="form-label" style={{ margin: 0, borderBottom: "none" }}>Line Items</p>
                  <button onClick={() => updateField("showHSN", !form.showHSN)} className={`toggle-btn ${form.showHSN ? "active" : ""}`}>HSN</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: form.showHSN ? "2fr 0.6fr 0.5fr 0.7fr 0.5fr 0.7fr auto" : "2fr 0.5fr 0.7fr 0.5fr 0.7fr auto", gap: "6px", marginBottom: "6px", paddingBottom: "6px", borderBottom: "1px solid #E5E7EB" }}>
                  {["Description", form.showHSN && "HSN", "Qty", "Rate", "GST%", "Amt", ""].filter(Boolean).map((h, i) => (
                    <span key={i} style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Inter, sans-serif" }}>{h}</span>
                  ))}
                </div>
                {form.items.map((item, i) => <ItemRow key={i} item={item} index={i} onChange={updateItem} onRemove={removeItem} showHSN={form.showHSN} showDiscount={false} />)}
                <button className="add-item-btn" onClick={addItem}><Plus size={14} /> Add Line Item</button>
                {(() => {
                  const calc = calculateLineItems(form.items, form.taxType === "igst");
                  return (
                    <div style={{ marginTop: "16px", padding: "12px", background: "#F0F4F3", borderRadius: "8px" }}>
                      {[["Subtotal", `₹${calc.subtotal}`], form.taxType === "cgst_sgst" && ["CGST", `₹${calc.totalCGST}`], form.taxType === "cgst_sgst" && ["SGST", `₹${calc.totalSGST}`], form.taxType === "igst" && ["IGST", `₹${calc.totalIGST}`]].filter(Boolean).map(([l, v]) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{l}</span>
                          <span style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #D1D5DB", paddingTop: "6px", marginTop: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", color: "#111827" }}>Total</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: T, fontFamily: "Space Grotesk, sans-serif" }}>₹{calc.grandTotal}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === "extra" && (
              <div>
                <p className="form-label">Notes & Terms</p>
                <div className="form-field"><label className="field-label">Notes</label><textarea className="doc-textarea" placeholder="Additional notes..." value={form.notes} onChange={e => updateField("notes", e.target.value)} style={{ minHeight: "80px" }} /></div>
                <div className="form-field"><label className="field-label">Terms</label><textarea className="doc-textarea" value={form.terms} onChange={e => updateField("terms", e.target.value)} style={{ minHeight: "80px" }} /></div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn" style={{ width: "100%", justifyContent: "center" }}><Download size={15} /> Download PDF</button>
              </div>
            )}

            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <div style={{ marginTop: "8px" }}>
                  <TemplatePicker 
                    docType="quotation" 
                    selected={template} 
                    onChange={setTemplate} 
                    isPro={isUserPro} 
                  />
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "24px 0" }} />
                <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn" style={{ width: "100%", justifyContent: "center" }}>
                  <Download size={15} /> Download PDF
                </button>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="preview-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Eye size={14} color="#9CA3AF" />
                <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>LIVE PREVIEW</span>
              </div>
              <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn"><Download size={14} />{downloading ? "Generating..." : "Download PDF"}</button>
            </div>
            <div style={{ position: "relative" }}>
              {showWatermark && <WatermarkOverlay />}
              <QuotationPreview form={form} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
          <AdSense adSlot="SLOT_ID_QUOTATION" />
        </div>
      </div>
      <Footer />
    </>
  );
}
