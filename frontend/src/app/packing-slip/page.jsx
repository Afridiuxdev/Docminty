"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { INDIAN_STATES } from "@/constants/indianStates";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import SignatureModal from "@/components/SignatureModal";
import { Plus, Trash2, Download, Eye, RefreshCw, Cloud, PenTool, ChevronDown, Search } from "lucide-react";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useRouter } from "next/navigation";
import { useProfileSync } from "@/hooks/useProfileSync";
import TemplatePicker from "@/components/TemplatePicker";
import TemplateColorPicker from "@/components/TemplateColorPicker";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";

const T = "#0D9488";

const COURIER_COMPANIES = [
  "Blue Dart", "Delhivery", "Ecom Express", "DTDC", "Gati", "XpressBees",
  "Shadowfax", "SafeExpress", "India Post (Speed Post)", "Professional Couriers",
  "First Flight", "Amazon Shipping", "Shiprocket", "Pickrr", "DotZot", "Aramex",
  "FedEx India", "DHL Express India", "UPS India", "Shree Maruti Courier",
  "Trackon Couriers", "Anjani Courier", "Skyking Couriers", "Madhur Couriers",
  "Tirupati Courier", "ST Courier", "Franch Express", "Bombino Express",
  "Overnight Express", "Speed@First", "Wow Express", "Other"
];

const DEFAULT_FORM = {
  slipNumber: `PS-${new Date().getFullYear()}-001`,
  slipDate: new Date().toISOString().split("T")[0],
  fromName: "", fromGSTIN: "", fromAddress: "", fromCity: "", fromState: "27",
  fromPhone: "", fromEmail: "",
  toName: "", toGSTIN: "", toAddress: "", toCity: "", toState: "27",
  toPhone: "", toEmail: "",
  orderNumber: "", shippingMethod: "", trackingNumber: "",
  courierName: "", customCourier: "", deliveryDate: "",
  items: [{ description: "", sku: "", qty: "1", weight: "", notes: "" }],
  logo: null,
  signature: null,
  packagingNotes: "",
  templateColor: "#0D9488",
};

export function PackingPreview({ form, template = "Classic", accent = "#0D9488" }) {
  const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
  const toState = INDIAN_STATES.find(s => s.code === form.toState);
  const totalQty = form.items.reduce((s, i) =>
    s + (parseFloat(i.qty) || 0), 0);

  const sharedBody = (
    <div className="pdf-body">
      {/* From + Ship To + Shipment Info */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: "20px", marginBottom: "20px"
      }}>
        <div>
          <p style={{
            fontSize: "10px", fontWeight: 700,
            color: "#9CA3AF", textTransform: "uppercase",
            letterSpacing: "0.08em", margin: "0 0 6px",
            fontFamily: "Space Grotesk, sans-serif"
          }}>From / Sender</p>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 700,
            fontSize: "13px", color: "#111827", margin: 0
          }}>{form.fromName || "Your Business"}</p>
          {form.fromGSTIN && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>GSTIN: {form.fromGSTIN}</p>}
          {form.fromAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
            {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}
          </p>}
          {fromState && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{fromState.name}</p>}
          {(form.fromPhone || form.fromEmail) && (
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
              {form.fromPhone && <span style={{ display: "block" }}>Ph: {form.fromPhone}</span>}
              {form.fromEmail && <span style={{ display: "block", wordBreak: "break-all" }}>Em: {form.fromEmail}</span>}
            </p>
          )}
        </div>
        <div>
          <p style={{
            fontSize: "10px", fontWeight: 700,
            color: "#9CA3AF", textTransform: "uppercase",
            letterSpacing: "0.08em", margin: "0 0 6px",
            fontFamily: "Space Grotesk, sans-serif"
          }}>Ship To</p>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700, fontSize: "13px",
            color: "#111827", margin: 0
          }}>
            {form.toName || "Recipient"}
          </p>
          {form.toGSTIN && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>GSTIN: {form.toGSTIN}</p>}
          {form.toAddress && (
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
              {form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}
            </p>
          )}
          {toState && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{toState.name}</p>}
          {(form.toPhone || form.toEmail) && (
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
              {form.toPhone && <span style={{ display: "block" }}>Ph: {form.toPhone}</span>}
              {form.toEmail && <span style={{ display: "block", wordBreak: "break-all" }}>Em: {form.toEmail}</span>}
            </p>
          )}
        </div>
        <div>
          <p style={{
            fontSize: "10px", fontWeight: 700,
            color: "#9CA3AF", textTransform: "uppercase",
            letterSpacing: "0.08em", margin: "0 0 6px",
            fontFamily: "Space Grotesk, sans-serif"
          }}>Shipment Info</p>
          {[
            ["Order #", form.orderNumber],
            ["Date", form.slipDate],
            ["Expected Delivery", form.deliveryDate],
            ["Shipping Method", form.shippingMethod],
            ["Courier", form.courierName === "Other" ? form.customCourier : form.courierName],
            ["Tracking #", form.trackingNumber],
          ].map(([l, v]) => v && (
            <div key={l} style={{ marginBottom: "4px" }}>
              <span style={{
                fontSize: "10px", color: "#9CA3AF",
                fontFamily: "Inter, sans-serif"
              }}>{l}: </span>
              <span style={{
                fontSize: "11px", fontWeight: 600,
                color: l === "Tracking #" ? accent : "#111827",
                fontFamily: "Inter, sans-serif"
              }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items table */}
      <table className="pdf-table">
        <thead>
          <tr>
            <th>#</th>
            <th style={{ width: "50%" }}>Description</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {form.items.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.description || "—"}</td>
              <td>{item.sku || "—"}</td>
              <td style={{ fontWeight: 600 }}>{item.qty}</td>
              <td>{item.weight || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary bar */}
      <div style={{
        marginTop: "12px", padding: "12px 16px",
        background: accent + "10", borderRadius: "8px",
        display: "flex", justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          fontSize: "13px", fontWeight: 700,
          color: accent, fontFamily: "Space Grotesk, sans-serif"
        }}>
          Total Items: {form.items.length}
        </span>
        <span style={{
          fontSize: "13px", fontWeight: 700,
          color: accent, fontFamily: "Space Grotesk, sans-serif"
        }}>
          Total Qty: {totalQty}
        </span>
      </div>

      {form.packagingNotes && (
        <div style={{
          marginTop: "12px", padding: "10px 14px",
          background: "#F8F9FA", borderRadius: "6px",
          borderLeft: `3px solid ${accent}`
        }}>
          <p style={{
            fontSize: "11px", color: "#9CA3AF",
            margin: "0 0 2px", fontFamily: "Inter, sans-serif",
            textTransform: "uppercase", letterSpacing: "0.05em"
          }}>
            Packaging Notes
          </p>
          <p style={{
            fontSize: "12px", color: "#374151",
            margin: 0, fontFamily: "Inter, sans-serif"
          }}>
            {form.packagingNotes}
          </p>
        </div>
      )}

      <div style={{
        marginTop: "24px", paddingTop: "12px",
        borderTop: "1px solid #E5E7EB", display: "flex",
        justifyContent: "space-between", alignItems: "center"
      }}>
        <p style={{
          fontSize: "10px", color: "#D1D5DB",
          fontFamily: "Inter, sans-serif", margin: 0
        }}>
          Generated by DocMinty.com
        </p>
        <div style={{ textAlign: "right", minWidth: "120px" }}>
          {form.signature && (
            <div style={{ marginBottom: "4px" }}>
              <img src={form.signature} alt="Signature" style={{ maxHeight: "45px", maxWidth: "140px", display: "block", marginLeft: "auto" }} />
            </div>
          )}
          <div style={{ borderTop: "1px solid #374151", paddingTop: "4px" }}>
            <p style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", margin: 0 }}>Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Modern — Sidebar
  if (template === "Modern") {
    return (
      <div className="pdf-preview" style={{ display: "flex", padding: 0, overflow: "hidden" }}>
        <div style={{ width: "140px", background: accent, padding: "24px 14px", flexShrink: 0, color: "#fff", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>PACKING</p>
          <p style={{ fontSize: "10px", opacity: 0.75, margin: "0 0 24px" }}>#{form.slipNumber}</p>
          <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>From</p>
          <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 4px" }}>{form.fromName || "Your Company"}</p>
          <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 4px", lineHeight: 1.4 }}>
            {form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromState?.name}
          </p>
          {form.fromGSTIN && <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 4px" }}>GSTIN: {form.fromGSTIN}</p>}
          {(form.fromPhone || form.fromEmail) && (
            <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 16px", lineHeight: 1.4 }}>
              {form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? " | " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}
            </p>
          )}
          <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>To</p>
          <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 16px" }}>{form.toName || "Recipient"}</p>
          <div style={{ marginTop: "auto" }}>
            <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", margin: "0 0 3px" }}>Total Items</p>
            <p style={{ fontSize: "12px", fontWeight: 700, margin: 0 }}>{form.items.length}</p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "32px", objectFit: "contain" }} />}
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", color: "#9CA3AF", margin: 0 }}>Date: {form.slipDate}</p>
            </div>
          </div>
          {sharedBody}
        </div>
      </div>
    );
  }

  // Corporate — Centered
  if (template === "Corporate") {
    return (
      <div className="pdf-preview">
        <div style={{ textAlign: "center", padding: "20px 24px 16px", borderBottom: `2px solid ${accent}` }}>
          {form.logo && <img src={form.logo} alt="Logo" style={{ height: "36px", margin: "0 auto 8px", display: "block" }} />}
          <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", color: accent, margin: "0 0 2px" }}>{form.fromName || "Company Name"}</p>
          <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 auto 4px", maxWidth: "400px" }}>{form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromState?.name}</p>
          {form.fromGSTIN && <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 auto 4px" }}>GSTIN: {form.fromGSTIN}</p>}
          {(form.fromPhone || form.fromEmail) && (
            <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 auto 8px" }}>
              {form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? "  |  " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "10px", color: "#9CA3AF", fontWeight: 700 }}>
            <span>SLIP: #{form.slipNumber}</span>
            <span>ORDER: #{form.orderNumber}</span>
            <span>DATE: {form.slipDate}</span>
          </div>
        </div>
        {sharedBody}
      </div>
    );
  }

  // Elegant — Accent Bar
  if (template === "Elegant") {
    return (
      <div className="pdf-preview">
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "12px" }}>
            <div>
              {form.logo && <img src={form.logo} alt="Logo" style={{ height: "36px", marginBottom: "6px" }} />}
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.fromName || "Business Name"}</p>
              <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0" }}>{form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}{fromState?.name ? `, ${fromState.name}` : ""}</p>
              {form.fromGSTIN && <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0" }}>GSTIN: {form.fromGSTIN}</p>}
              {(form.fromPhone || form.fromEmail) && (
                <p style={{ fontSize: "10px", color: "#6B7280", margin: "2px 0 0" }}>{form.fromPhone && `Ph: ${form.fromPhone}`}{form.fromPhone && form.fromEmail ? "  |  " : ""}{form.fromEmail && `Em: ${form.fromEmail}`}</p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: accent, margin: 0 }}>PACKING SLIP</p>
              <p style={{ fontSize: "11px", color: "#6B7280" }}>#{form.slipNumber}</p>
            </div>
          </div>
          <div style={{ height: "4px", background: accent, borderRadius: "2px" }} />
        </div>
        {sharedBody}
      </div>
    );
  }

  // Classic/Minimal (Default)
  return (
    <div className="pdf-preview">
      <div className="pdf-header" style={{ borderBottom: `2px solid ${accent}` }}>
        <div>
          {form.logo && (
            <img src={form.logo} alt="Logo"
              style={{ height: "48px", objectFit: "contain", display: "block" }} />
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 800,
            fontSize: "22px", color: accent, margin: 0
          }}>PACKING SLIP</p>
          <p style={{
            fontSize: "12px", color: "#6B7280",
            margin: "4px 0 0", fontFamily: "Inter, sans-serif"
          }}>
            #{form.slipNumber}
          </p>
          <p style={{
            fontSize: "11px", color: "#9CA3AF",
            margin: "4px 0 0", fontFamily: "Inter, sans-serif"
          }}>
            Date: {form.slipDate}
          </p>
          {form.deliveryDate && (
            <p style={{
              fontSize: "11px", color: "#9CA3AF",
              margin: "2px 0 0", fontFamily: "Inter, sans-serif"
            }}>
              Exp. Delivery: {form.deliveryDate}
            </p>
          )}
        </div>
      </div>
      {sharedBody}
    </div>
  );
}

export default function PackingSlipPage() {
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
  const { download, generateBlob, downloading } = useDownloadPDF();
  const router = useRouter();
  const plan = user?.plan?.toUpperCase() || "FREE";
  useProfileSync(form, setForm, plan);
  const isUserPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";
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
  const templateMeta = TEMPLATE_REGISTRY.packing[template] || TEMPLATE_REGISTRY.packing.Classic;
  const showWatermark = templateMeta.pro && !isUserPro;

  const handleDownload = () => {
    download("packing", template, form, `PackingSlip-${form.slipNumber}.pdf`);
  };

  const handleSave = async () => {
    if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
    const payload = { docType: "packing-slip", title: "Packing Slip #" + form.slipNumber, referenceNumber: form.slipNumber, templateName: template, partyName: form.toName, amount: "", formData: JSON.stringify(form) };
    try {
      const pendingToast = toast.loading("Saving document...");
      payload.file = await generateBlob("packing", template, form, `PackingSlip-${form.slipNumber}.pdf`);
      await documentsApi.save(payload);
      toast.dismiss(pendingToast);
      toast.success("Saved to your dashboard!");
    } catch (err) { if (err.message !== "PLAN_LIMIT_REACHED") toast.error("Save failed"); }
  };
  const [activeTab, setActiveTab] = useState("from");
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [courierSearch, setCourierSearch] = useState("");
  const [showCourierDropdown, setShowCourierDropdown] = useState(false);

  const updateField = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), []);

  const updateItem = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item),
    }));
  };

  const addItem = () =>
    setForm(prev => ({
      ...prev,
      items: [...prev.items,
      { description: "", sku: "", qty: "1", weight: "", notes: "" }],
    }));

  const removeItem = (index) =>
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

  const TABS = [
    { id: "from", label: "Sender" },
    { id: "to", label: "Ship To" },
    { id: "shipment", label: "Shipment" },
    { id: "items", label: "Items" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />

      {/* Page header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "14px 24px"
      }}>
        <div style={{
          maxWidth: "1300px", margin: "0 auto", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "12px"
        }}>
          <div>
            <h1 style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "18px", fontWeight: 700,
              margin: 0, color: "#111827"
            }}>
              Packing Slip Generator
            </h1>
            <p style={{
              fontSize: "12px", color: "#9CA3AF",
              margin: "2px 0 0", fontFamily: "Inter, sans-serif"
            }}>
              Shipment packing list
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setForm(DEFAULT_FORM)} style={{
              display: "flex", alignItems: "center", gap: "6px",
              height: "36px", padding: "0 14px",
              border: "1px solid #E5E7EB", borderRadius: "8px",
              background: "#fff", fontSize: "13px", fontWeight: 600,
              color: "#6B7280", cursor: "pointer",
              fontFamily: "Inter, sans-serif"
            }}>
              <RefreshCw size={13} /> Reset
            </button>
            <button onClick={handleDownload} disabled={downloading} className="download-pdf-btn">

              <Download size={15} />

              {downloading ? "Generating..." : "Download PDF"}

            </button>
            {user && isUserPro && (
              <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", border: "1px solid #0D9488", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#0D9488", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 150ms" }}>
                <Cloud size={14} /> Save
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{
        background: "#F0F4F3",
        minHeight: "calc(100vh - 120px)"
      }}>
        <div className="doc-page-wrap">

          {/* Form Panel */}
          <div className="form-panel">

            {/* Tabs */}
            <div className="tab-bar" style={{
              display: "flex", gap: "4px",
              marginBottom: "20px", background: "#F0F4F3",
              borderRadius: "8px", padding: "4px"
            }}>
              {TABS.map(tab => (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1, padding: "6px 4px",
                    borderRadius: "6px", border: "none",
                    fontSize: "12px", fontWeight: 600,
                    cursor: "pointer", transition: "all 150ms",
                    fontFamily: "Inter, sans-serif",
                    background: activeTab === tab.id ? "#fff" : "transparent",
                    color: activeTab === tab.id ? T : "#6B7280",
                    boxShadow: activeTab === tab.id
                      ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* SENDER TAB */}
            {activeTab === "from" && (
              <div>
                <p className="form-label">Sender Details</p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{
                    fontSize: "11px", fontWeight: 600,
                    color: "#6B7280", margin: "0 0 6px",
                    fontFamily: "Inter, sans-serif"
                  }}>Company Logo</p>
                  {isUserPro ? (
                    <LogoUpload value={form.logo}
                      onChange={v => updateField("logo", v)} />
                  ) : (
                    <div onClick={() => router.push("/#pricing")} style={{ padding: "14px 16px", border: "1px dashed #D1D5DB", borderRadius: "8px", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                      <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Logo upload — <strong style={{ color: "#6366F1" }}>Pro feature</strong></span>
                      <span style={{ fontSize: "11px", background: "#EDE9FE", color: "#6366F1", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>Upgrade</span>
                    </div>
                  )}
                </div>
                <div className="form-field">
                  <label className="field-label">Company Name *</label>
                  <input className="doc-input"
                    placeholder="Your Company Name"
                    value={form.fromName}
                    onChange={e => updateField("fromName", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">GSTIN</label>
                  <input className="doc-input" placeholder="22AAAAA0000A1Z5"
                    value={form.fromGSTIN}
                    onChange={e => updateField("fromGSTIN", e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                    maxLength={15}
                    style={{ fontFamily: "monospace", letterSpacing: "0.05em" }} />
                </div>
                <div className="form-field">
                  <label className="field-label">Address</label>
                  <textarea className="doc-textarea"
                    placeholder="Street address"
                    value={form.fromAddress}
                    onChange={e => updateField("fromAddress", e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">City</label>
                    <input className="doc-input" placeholder="Mumbai"
                      value={form.fromCity}
                      onChange={e => updateField("fromCity", e.target.value)} />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">State</label>
                    <select className="doc-select"
                      value={form.fromState}
                      onChange={e => updateField("fromState", e.target.value)}>
                      {INDIAN_STATES.map(s =>
                        <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Phone</label>
                    <input className="doc-input"
                      placeholder="+91 98765 43210"
                      value={form.fromPhone}
                      onChange={e => updateField("fromPhone", e.target.value)} />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Email</label>
                    <input className="doc-input" type="email"
                      placeholder="you@company.com"
                      value={form.fromEmail}
                      onChange={e => updateField("fromEmail", e.target.value)} />
                  </div>
                </div>
                <div style={{
                  borderTop: "1px solid #F3F4F6",
                  margin: "16px 0"
                }} />
                <p className="form-label">Slip Details</p>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Slip Number</label>
                    <input className="doc-input"
                      value={form.slipNumber}
                      onChange={e => updateField("slipNumber", e.target.value)} />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Date</label>
                    <input className="doc-input" type="date"
                      value={form.slipDate}
                      onChange={e => updateField("slipDate", e.target.value)} />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                <p className="form-label">Signature</p>
                <div style={{
                  border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", background: "#fff"
                }}>
                  {form.signature ? (
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <div style={{
                        padding: "16px", background: "#F9FAFB", borderRadius: "8px",
                        border: "1px dashed #D1D5DB", display: "inline-block", minWidth: "200px"
                      }}>
                        <img src={form.signature} alt="Signature" style={{ height: "60px", maxWidth: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
                        <button onClick={() => setIsSigModalOpen(true)} style={{
                          padding: "8px 16px", borderRadius: "8px", border: "1px solid #D1D5DB",
                          background: "#fff", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer"
                        }}>Change</button>
                        <button onClick={() => updateField("signature", null)} style={{
                          padding: "8px 16px", borderRadius: "8px", border: "1px solid #FEE2E2",
                          background: "#FEF2F2", fontSize: "13px", fontWeight: 600, color: "#EF4444", cursor: "pointer"
                        }}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setIsSigModalOpen(true)} style={{
                      width: "100%", padding: "40px 20px", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: "12px", background: "#F9FAFB", border: "1px dashed #D1D5DB",
                      borderRadius: "10px", cursor: "pointer", transition: "all 200ms"
                    }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "50%", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}>
                        <PenTool size={20} color="#9CA3AF" />
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>Add digital signature</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* SHIP TO TAB */}
            {activeTab === "to" && (
              <div>
                <p className="form-label">Recipient Details</p>
                <div className="form-field">
                  <label className="field-label">Recipient Name *</label>
                  <input className="doc-input"
                    placeholder="Customer / Company Name"
                    value={form.toName}
                    onChange={e => updateField("toName", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">GSTIN</label>
                  <input className="doc-input" placeholder="22AAAAA0000A1Z5"
                    value={form.toGSTIN}
                    onChange={e => updateField("toGSTIN", e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                    maxLength={15}
                    style={{ fontFamily: "monospace", letterSpacing: "0.05em" }} />
                </div>
                <div className="form-field">
                  <label className="field-label">Delivery Address</label>
                  <textarea className="doc-textarea"
                    placeholder="Full delivery address"
                    value={form.toAddress}
                    onChange={e => updateField("toAddress", e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">City</label>
                    <input className="doc-input" placeholder="Delhi"
                      value={form.toCity}
                      onChange={e => updateField("toCity", e.target.value)} />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">State</label>
                    <select className="doc-select"
                      value={form.toState}
                      onChange={e => updateField("toState", e.target.value)}>
                      {INDIAN_STATES.map(s =>
                        <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: "10px" }}>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Phone</label>
                    <input className="doc-input"
                      value={form.toPhone}
                      onChange={e => updateField("toPhone", e.target.value)} />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="field-label">Email</label>
                    <input className="doc-input" type="email"
                      value={form.toEmail}
                      onChange={e => updateField("toEmail", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* SHIPMENT TAB */}
            {activeTab === "shipment" && (
              <div>
                <p className="form-label">Shipment Information</p>
                <div className="form-field">
                  <label className="field-label">Order Number</label>
                  <input className="doc-input"
                    placeholder="ORD-2026-001"
                    value={form.orderNumber}
                    onChange={e => updateField("orderNumber", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">Shipping Method</label>
                  <select className="doc-select"
                    value={form.shippingMethod}
                    onChange={e => updateField("shippingMethod", e.target.value)}>
                    <option value="">Select...</option>
                    {["Standard Delivery", "Express Delivery",
                      "Same Day Delivery", "Overnight Delivery",
                      "Surface Transport", "Air Freight"].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="field-label">Courier / Carrier</label>
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => setShowCourierDropdown(!showCourierDropdown)}
                      style={{
                        width: "100%", height: "40px", padding: "0 12px",
                        border: "1px solid #E5E7EB", borderRadius: "8px",
                        background: "#fff", display: "flex", alignItems: "center",
                        justifyContent: "space-between", cursor: "pointer",
                        fontSize: "13px", color: form.courierName ? "#111827" : "#9CA3AF"
                      }}
                    >
                      <span>{form.courierName || "Select Courier..."}</span>
                      <ChevronDown size={14} color="#9CA3AF" />
                    </button>

                    {showCourierDropdown && (
                      <div style={{
                        position: "absolute", top: "100%", left: 0, right: 0,
                        zIndex: 50, marginTop: "4px", background: "#fff",
                        border: "1px solid #E5E7EB", borderRadius: "10px",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        maxHeight: "300px", display: "flex", flexDirection: "column"
                      }}>
                        <div style={{ padding: "8px", borderBottom: "1px solid #F3F4F6" }}>
                          <div style={{ position: "relative" }}>
                            <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                            <input
                              autoFocus
                              placeholder="Search courier..."
                              value={courierSearch}
                              onChange={(e) => setCourierSearch(e.target.value)}
                              style={{
                                width: "100%", height: "32px", padding: "0 10px 0 32px",
                                border: "1px solid #F3F4F6", borderRadius: "6px",
                                fontSize: "12px", outline: "none", background: "#F9FAFB"
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ overflowY: "auto", padding: "4px" }}>
                          {COURIER_COMPANIES.filter(c => 
                            c.toLowerCase().includes(courierSearch.toLowerCase())
                          ).map(courier => (
                            <button
                              key={courier}
                              onClick={() => {
                                updateField("courierName", courier);
                                setShowCourierDropdown(false);
                                setCourierSearch("");
                              }}
                              style={{
                                width: "100%", padding: "8px 12px", textAlign: "left",
                                background: form.courierName === courier ? "#F0FDFA" : "transparent",
                                border: "none", borderRadius: "6px", cursor: "pointer",
                                fontSize: "12px", color: form.courierName === courier ? T : "#374151"
                              }}
                            >
                              {courier}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {form.courierName === "Other" && (
                  <div className="form-field" style={{ marginTop: "-10px" }}>
                    <label className="field-label">Custom Courier Name</label>
                    <input
                      className="doc-input"
                      placeholder="Enter courier name"
                      value={form.customCourier}
                      onChange={(e) => updateField("customCourier", e.target.value)}
                    />
                  </div>
                )}
                <div className="form-field">
                  <label className="field-label">Tracking Number</label>
                  <input className="doc-input"
                    placeholder="AWB / Tracking ID"
                    value={form.trackingNumber}
                    onChange={e => updateField("trackingNumber",
                      e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">Expected Delivery Date</label>
                  <input className="doc-input" type="date"
                    value={form.deliveryDate}
                    onChange={e => updateField("deliveryDate", e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="field-label">Packaging Notes</label>
                  <textarea className="doc-textarea"
                    placeholder="Handle with care, Fragile, Keep upright..."
                    value={form.packagingNotes}
                    onChange={e => updateField("packagingNotes",
                      e.target.value)} />
                </div>
              </div>
            )}

            {/* ITEMS TAB */}
            {activeTab === "items" && (
              <div>
                <p className="form-label">Packed Items</p>

                

                {/* Item rows */}
                {form.items.map((item, i) => (
                  <div key={i} style={{
                      background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px",
                      padding: "16px", marginBottom: "12px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)", position: "relative"
                  }}>
                      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
                              <input className="doc-input" placeholder="Item description" value={item.description} onChange={e => updateItem(i, "description", e.target.value)} style={{ background: "#F9FAFB" }} />
                          </div>
                          <button onClick={() => removeItem(i)} title="Remove Item" style={{ background: "#FEE2E2", color: "#EF4444", border: "none", width: "36px", height: "36px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: "18px", transition: "background 150ms" }}>
                              <Trash2 size={16} />
                          </button>
                      </div>
                      <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "12px", alignItems: "end"
                      }}>
                          <div>
                              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>SKU</label>
                              <input className="doc-input" placeholder="SKU" value={item.sku} onChange={e => updateItem(i, "sku", e.target.value)} style={{ background: "#F9FAFB" }} />
                          </div>
                          <div>
                              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Qty</label>
                              <input className="doc-input" type="number" placeholder="1" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} style={{ background: "#F9FAFB" }} />
                          </div>
                          <div>
                              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Weight</label>
                              <input className="doc-input" placeholder="kg" value={item.weight} onChange={e => updateItem(i, "weight", e.target.value)} style={{ background: "#F9FAFB" }} />
                          </div>
                      </div>
                  </div>
                ))}

                <button className="add-item-btn" onClick={addItem}>
                  <Plus size={14} /> Add Item
                </button>

                {/* Summary */}
                <div style={{
                  marginTop: "16px", padding: "12px",
                  background: "#F0F4F3", borderRadius: "8px",
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between", marginBottom: "4px"
                  }}>
                    <span style={{
                      fontSize: "12px", color: "#6B7280",
                      fontFamily: "Inter, sans-serif"
                    }}>Total Items</span>
                    <span style={{
                      fontSize: "12px", fontWeight: 700,
                      color: "#111827",
                      fontFamily: "Space Grotesk, sans-serif"
                    }}>
                      {form.items.length}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #D1D5DB",
                    paddingTop: "6px", marginTop: "4px"
                  }}>
                    <span style={{
                      fontSize: "12px", color: "#6B7280",
                      fontFamily: "Inter, sans-serif"
                    }}>Total Qty</span>
                    <span style={{
                      fontSize: "13px", fontWeight: 700,
                      color: T,
                      fontFamily: "Space Grotesk, sans-serif"
                    }}>
                      {form.items.reduce((s, i) =>
                        s + (parseFloat(i.qty) || 0), 0)}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
              </div>
            )}

            {activeTab === "templates" && (
              <div>
                <p className="form-label">Template Design</p>
                <TemplatePicker 
                  docType="packing" 
                  selected={template} 
                  onChange={(val) => setTemplate(val)} 
                  isPro={isUserPro} 
                />
                <div style={{ borderTop: "1px solid #F3F4F6", margin: "20px 0" }} />
                <TemplateColorPicker 
                  value={form.templateColor || "#0D9488"} 
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

          {/* Preview Panel */}
          <div className="preview-panel">
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
              <Eye size={14} color="#9CA3AF" />
              <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>LIVE PREVIEW</span>
            </div>
            <div style={{ position: "relative" }}>
              {showWatermark && <WatermarkOverlay />}
              <PackingPreview form={form} template={template} accent={form.templateColor || "#0D9488"} />
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: "1300px", margin: "0 auto",
          padding: "0 24px 40px",
        }}>
          <AdSense adSlot="SLOT_ID_PACKING" />
        </div>
      </div>

      <Footer />
      <SignatureModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onSave={(sig) => updateField("signature", sig)}
      />
    </>
  );
}