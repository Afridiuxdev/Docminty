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
import { Plus, Trash2, Download, Eye, RefreshCw } from "lucide-react";

const T = "#0D9488";

// ── Default form state ────────────────────────────────────────
const DEFAULT_FORM = {
    // Invoice info
    invoiceNumber: "INV-2026-001",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    poNumber: "",

    // From (seller)
    fromName: "",
    fromGSTIN: "",
    fromAddress: "",
    fromCity: "",
    fromState: "27",
    fromPhone: "",
    fromEmail: "",

    // To (buyer)
    toName: "",
    toGSTIN: "",
    toAddress: "",
    toCity: "",
    toState: "27",
    toPhone: "",
    toEmail: "",

    // Tax settings
    taxType: "cgst_sgst", // cgst_sgst | igst | none
    gstRate: "18",

    // Line items
    items: [
        { description: "", hsn: "", qty: "1", rate: "", discount: "0", gstRate: "18", amount: "0.00" },
    ],

    // Extra
    notes: "",
    terms: "Payment due within 30 days.",
    logo: null,
    showHSN: true,
    showDiscount: false,
    currency: "₹",
};

// ── Line item row ─────────────────────────────────────────────
function ItemRow({ item, index, onChange, onRemove, showHSN, showDiscount }) {
    const update = (field, value) => {
        const updated = { ...item, [field]: value };
        const qty = parseFloat(updated.qty) || 0;
        const rate = parseFloat(updated.rate) || 0;
        const discount = parseFloat(updated.discount) || 0;
        const subtotal = qty * rate - discount;
        const gst = (subtotal * (parseFloat(updated.gstRate) || 0)) / 100;
        updated.amount = (subtotal + gst).toFixed(2);
        onChange(index, updated);
    };

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: showHSN
                ? showDiscount ? "2fr 0.6fr 0.5fr 0.7fr 0.6fr 0.5fr 0.7fr auto"
                    : "2fr 0.6fr 0.5fr 0.7fr 0.5fr 0.7fr auto"
                : showDiscount ? "2fr 0.5fr 0.7fr 0.6fr 0.5fr 0.7fr auto"
                    : "2fr 0.5fr 0.7fr 0.5fr 0.7fr auto",
            gap: "6px",
            marginBottom: "6px",
            alignItems: "center",
        }}>
            <input className="doc-input" placeholder="Item description"
                value={item.description}
                onChange={e => update("description", e.target.value)}
            />
            {showHSN && (
                <input className="doc-input" placeholder="HSN"
                    value={item.hsn}
                    onChange={e => update("hsn", e.target.value)}
                />
            )}
            <input className="doc-input" type="number" placeholder="1"
                value={item.qty}
                onChange={e => update("qty", e.target.value)}
            />
            <input className="doc-input" type="number" placeholder="0.00"
                value={item.rate}
                onChange={e => update("rate", e.target.value)}
            />
            {showDiscount && (
                <input className="doc-input" type="number" placeholder="0"
                    value={item.discount}
                    onChange={e => update("discount", e.target.value)}
                />
            )}
            <select className="doc-select" value={item.gstRate}
                onChange={e => update("gstRate", e.target.value)}>
                {[0, 5, 12, 18, 28].map(r => (
                    <option key={r} value={r}>{r}%</option>
                ))}
            </select>
            <span style={{
                fontSize: "12px", fontWeight: 700,
                color: "#111827", fontFamily: "Inter, sans-serif",
                textAlign: "right", whiteSpace: "nowrap",
            }}>
                ₹{item.amount}
            </span>
            <button className="remove-item-btn" onClick={() => onRemove(index)}>
                <Trash2 size={13} />
            </button>
        </div>
    );
}

// ── PDF Preview ───────────────────────────────────────────────
function InvoicePreview({ form }) {
    const calc = calculateLineItems(
        form.items,
        form.taxType === "igst"
    );

    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);

    return (
        <div className="pdf-preview">
            {/* Header */}
            <div className="pdf-header">
                <div>
                    {form.logo && (
                        <img src={form.logo} alt="Logo"
                            style={{ height: "48px", objectFit: "contain", marginBottom: "8px", display: "block" }}
                        />
                    )}
                    <p style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 700, fontSize: "16px",
                        color: "#111827", margin: 0,
                    }}>
                        {form.fromName || "Your Business Name"}
                    </p>
                    {form.fromGSTIN && (
                        <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
                            GSTIN: {form.fromGSTIN}
                        </p>
                    )}
                    {form.fromAddress && (
                        <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
                            {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}
                        </p>
                    )}
                    {fromState && (
                        <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
                            {fromState.name}
                        </p>
                    )}
                    {form.fromPhone && (
                        <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
                            Ph: {form.fromPhone}
                        </p>
                    )}
                </div>

                <div style={{ textAlign: "right" }}>
                    <p style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 800, fontSize: "22px",
                        color: T, margin: 0,
                    }}>
                        INVOICE
                    </p>
                    <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>
                        #{form.invoiceNumber}
                    </p>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>
                        Date: {form.invoiceDate}
                    </p>
                    {form.dueDate && (
                        <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
                            Due: {form.dueDate}
                        </p>
                    )}
                    {form.poNumber && (
                        <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
                            PO#: {form.poNumber}
                        </p>
                    )}
                </div>
            </div>

            <div className="pdf-body">
                {/* Bill To */}
                <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: "24px", marginBottom: "20px",
                }}>
                    <div>
                        <p style={{
                            fontSize: "10px", fontWeight: 700,
                            color: "#9CA3AF", textTransform: "uppercase",
                            letterSpacing: "0.08em", margin: "0 0 6px",
                            fontFamily: "Space Grotesk, sans-serif",
                        }}>Bill To</p>
                        <p style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontWeight: 700, fontSize: "13px",
                            color: "#111827", margin: 0,
                        }}>
                            {form.toName || "Client Name"}
                        </p>
                        {form.toGSTIN && (
                            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
                                GSTIN: {form.toGSTIN}
                            </p>
                        )}
                        {form.toAddress && (
                            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
                                {form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}
                            </p>
                        )}
                        {toState && (
                            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>
                                {toState.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <p style={{
                            fontSize: "10px", fontWeight: 700,
                            color: "#9CA3AF", textTransform: "uppercase",
                            letterSpacing: "0.08em", margin: "0 0 6px",
                            fontFamily: "Space Grotesk, sans-serif",
                        }}>Tax Type</p>
                        <p style={{
                            fontSize: "12px", color: "#374151",
                            fontFamily: "Inter, sans-serif", margin: 0,
                        }}>
                            {form.taxType === "cgst_sgst" ? "CGST + SGST (Intrastate)" :
                                form.taxType === "igst" ? "IGST (Interstate)" :
                                    "No Tax"}
                        </p>
                    </div>
                </div>

                {/* Line items table */}
                <table className="pdf-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th style={{ width: "35%" }}>Description</th>
                            {form.showHSN && <th>HSN/SAC</th>}
                            <th>Qty</th>
                            <th>Rate</th>
                            {form.showDiscount && <th>Disc</th>}
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
                                {form.showDiscount && <td>₹{item.discount}</td>}
                                <td>{item.gstRate}%</td>
                                <td style={{ textAlign: "right", fontWeight: 600 }}>₹{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div className="pdf-totals">
                        <div className="pdf-total-row">
                            <span style={{ color: "#6B7280" }}>Subtotal</span>
                            <span>₹{calc.subtotal}</span>
                        </div>
                        {parseFloat(calc.totalDiscount) > 0 && (
                            <div className="pdf-total-row">
                                <span style={{ color: "#6B7280" }}>Discount</span>
                                <span style={{ color: "#EF4444" }}>-₹{calc.totalDiscount}</span>
                            </div>
                        )}
                        {form.taxType === "cgst_sgst" && (
                            <>
                                <div className="pdf-total-row">
                                    <span style={{ color: "#6B7280" }}>CGST</span>
                                    <span>₹{calc.totalCGST}</span>
                                </div>
                                <div className="pdf-total-row">
                                    <span style={{ color: "#6B7280" }}>SGST</span>
                                    <span>₹{calc.totalSGST}</span>
                                </div>
                            </>
                        )}
                        {form.taxType === "igst" && (
                            <div className="pdf-total-row">
                                <span style={{ color: "#6B7280" }}>IGST</span>
                                <span>₹{calc.totalIGST}</span>
                            </div>
                        )}
                        <div className="pdf-total-final">
                            <span>Total</span>
                            <span>₹{calc.grandTotal}</span>
                        </div>
                    </div>
                </div>

                {/* Amount in words */}
                <div style={{
                    marginTop: "16px", padding: "10px 14px",
                    background: "#F8F9FA", borderRadius: "6px",
                    borderLeft: `3px solid ${T}`,
                }}>
                    <p style={{
                        fontSize: "11px", color: "#9CA3AF",
                        margin: "0 0 2px", fontFamily: "Inter, sans-serif",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                        Amount in Words
                    </p>
                    <p style={{
                        fontSize: "12px", color: "#374151",
                        margin: 0, fontFamily: "Inter, sans-serif",
                        fontStyle: "italic",
                    }}>
                        {numberToWords(parseFloat(calc.grandTotal))}
                    </p>
                </div>

                {/* Notes & Terms */}
                {(form.notes || form.terms) && (
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                        gap: "16px", marginTop: "20px",
                    }}>
                        {form.notes && (
                            <div>
                                <p style={{
                                    fontSize: "10px", fontWeight: 700,
                                    color: "#9CA3AF", textTransform: "uppercase",
                                    letterSpacing: "0.08em", margin: "0 0 4px",
                                    fontFamily: "Space Grotesk, sans-serif",
                                }}>Notes</p>
                                <p style={{
                                    fontSize: "11px", color: "#6B7280",
                                    fontFamily: "Inter, sans-serif",
                                    lineHeight: 1.6, margin: 0,
                                }}>
                                    {form.notes}
                                </p>
                            </div>
                        )}
                        {form.terms && (
                            <div>
                                <p style={{
                                    fontSize: "10px", fontWeight: 700,
                                    color: "#9CA3AF", textTransform: "uppercase",
                                    letterSpacing: "0.08em", margin: "0 0 4px",
                                    fontFamily: "Space Grotesk, sans-serif",
                                }}>Terms & Conditions</p>
                                <p style={{
                                    fontSize: "11px", color: "#6B7280",
                                    fontFamily: "Inter, sans-serif",
                                    lineHeight: 1.6, margin: 0,
                                }}>
                                    {form.terms}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div style={{
                    marginTop: "24px", paddingTop: "12px",
                    borderTop: "1px solid #E5E7EB",
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <p style={{
                        fontSize: "10px", color: "#D1D5DB",
                        fontFamily: "Inter, sans-serif", margin: 0,
                    }}>
                        Generated by DocMinty.com
                    </p>
                    <div style={{
                        borderTop: "1px solid #374151",
                        paddingTop: "4px",
                        minWidth: "120px", textAlign: "center",
                    }}>
                        <p style={{
                            fontSize: "10px", color: "#9CA3AF",
                            fontFamily: "Inter, sans-serif", margin: 0,
                        }}>
                            Authorised Signatory
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Invoice Page ─────────────────────────────────────────
export default function InvoicePage() {
  const { download, downloading } = useDownloadPDF();
  const [template, setTemplate] = useState("Classic");
    const [form, setForm] = useState(DEFAULT_FORM);
    const [activeTab, setActiveTab] = useState("from");

    const updateField = useCallback((field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateItem = useCallback((index, updated) => {
        setForm(prev => ({
            ...prev,
            items: prev.items.map((item, i) => i === index ? updated : item),
        }));
    }, []);

    const addItem = useCallback(() => {
        setForm(prev => ({
            ...prev,
            items: [...prev.items, {
                description: "", hsn: "", qty: "1",
                rate: "", discount: "0", gstRate: "18", amount: "0.00",
            }],
        }));
    }, []);

    const removeItem = useCallback((index) => {
        setForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    }, []);

    const handleDownload = () => {
        download("Invoice" + template, form, `Invoice-${form.invoiceNumber}.pdf`);
    };

    const FORM_TABS = [
        { id: "from", label: "Your Details" },
        { id: "to", label: "Client Details" },
        { id: "items", label: "Items" },
        { id: "extra", label: "Settings" },
    ];

    return (
        <>
            <Navbar />

            {/* Page header */}
            <div style={{
                background: "#fff", borderBottom: "1px solid #E5E7EB",
                padding: "14px 24px",
            }}>
                <div style={{
                    maxWidth: "1300px", margin: "0 auto",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: "18px", fontWeight: 700,
                            margin: 0, color: "#111827",
                        }}>
                            GST Invoice Generator
                        </h1>
                        <p style={{
                            fontSize: "12px", color: "#9CA3AF",
                            margin: "2px 0 0", fontFamily: "Inter, sans-serif",
                        }}>
                            Free · No sign-up · FY 2025-26 compliant
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                            onClick={() => setForm(DEFAULT_FORM)}
                            style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                height: "36px", padding: "0 14px",
                                border: "1px solid #E5E7EB", borderRadius: "8px",
                                background: "#fff", fontSize: "13px", fontWeight: 600,
                                color: "#6B7280", cursor: "pointer",
                                fontFamily: "Inter, sans-serif", transition: "all 150ms",
                            }}
                        >
                            <RefreshCw size={13} /> Reset
                        </button>
                        <button onClick={handleDownload} className="download-pdf-btn">
                            <Download size={15} /> Download PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Main layout */}
            <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
                <div className="doc-page-wrap">

                    {/* ── LEFT: FORM ── */}
                    <div className="form-panel">

                        {/* Form tabs */}
                        <div style={{
                            display: "flex", gap: "4px",
                            marginBottom: "20px",
                            background: "#F0F4F3",
                            borderRadius: "8px",
                            padding: "4px",
                        }}>
                            {FORM_TABS.map(tab => (
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
                                        boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ── YOUR DETAILS TAB ── */}
                        {activeTab === "from" && (
                            <div>
                                <p className="form-label">Your Business Details</p>

                                <div style={{ marginBottom: "16px" }}>
                                    <p style={{
                                        fontSize: "11px", fontWeight: 600,
                                        color: "#6B7280", margin: "0 0 6px",
                                        fontFamily: "Inter, sans-serif",
                                    }}>Company Logo</p>
                                    <LogoUpload
                                        value={form.logo}
                                        onChange={(v) => updateField("logo", v)}
                                    />
                                    <div style={{ marginTop: "16px" }}><TemplatePicker 
                                        docType="invoice"
                                        selected={template}
                                        onChange={setTemplate}
                                        isPro={false} /></div>
                                </div>

                                <div className="form-field">
                                    <label className="field-label">Business Name *</label>
                                    <input className="doc-input"
                                        placeholder="Your Company Name"
                                        value={form.fromName}
                                        onChange={e => updateField("fromName", e.target.value)}
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="field-label">GSTIN</label>
                                    <input className="doc-input"
                                        placeholder="22AAAAA0000A1Z5"
                                        value={form.fromGSTIN}
                                        onChange={e => updateField("fromGSTIN", e.target.value.toUpperCase())}
                                        style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="field-label">Address</label>
                                    <textarea className="doc-textarea"
                                        placeholder="Street address"
                                        value={form.fromAddress}
                                        onChange={e => updateField("fromAddress", e.target.value)}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">City</label>
                                        <input className="doc-input"
                                            placeholder="Mumbai"
                                            value={form.fromCity}
                                            onChange={e => updateField("fromCity", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">State</label>
                                        <select className="doc-select"
                                            value={form.fromState}
                                            onChange={e => updateField("fromState", e.target.value)}
                                        >
                                            {INDIAN_STATES.map(s => (
                                                <option key={s.code} value={s.code}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row" style={{ marginTop: "10px" }}>
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">Phone</label>
                                        <input className="doc-input"
                                            placeholder="+91 98765 43210"
                                            value={form.fromPhone}
                                            onChange={e => updateField("fromPhone", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">Email</label>
                                        <input className="doc-input"
                                            type="email" placeholder="you@company.com"
                                            value={form.fromEmail}
                                            onChange={e => updateField("fromEmail", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                                <p className="form-label">Invoice Details</p>

                                <div className="form-row">
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">Invoice Number</label>
                                        <input className="doc-input"
                                            value={form.invoiceNumber}
                                            onChange={e => updateField("invoiceNumber", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">Invoice Date</label>
                                        <input className="doc-input" type="date"
                                            value={form.invoiceDate}
                                            onChange={e => updateField("invoiceDate", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-row" style={{ marginTop: "10px" }}>
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">Due Date</label>
                                        <input className="doc-input" type="date"
                                            value={form.dueDate}
                                            onChange={e => updateField("dueDate", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">PO Number</label>
                                        <input className="doc-input"
                                            placeholder="Optional"
                                            value={form.poNumber}
                                            onChange={e => updateField("poNumber", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── CLIENT DETAILS TAB ── */}
                        {activeTab === "to" && (
                            <div>
                                <p className="form-label">Client / Bill To</p>

                                <div className="form-field">
                                    <label className="field-label">Client Name *</label>
                                    <input className="doc-input"
                                        placeholder="Client Company Name"
                                        value={form.toName}
                                        onChange={e => updateField("toName", e.target.value)}
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="field-label">Client GSTIN</label>
                                    <input className="doc-input"
                                        placeholder="22AAAAA0000A1Z5"
                                        value={form.toGSTIN}
                                        onChange={e => updateField("toGSTIN", e.target.value.toUpperCase())}
                                        style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="field-label">Address</label>
                                    <textarea className="doc-textarea"
                                        placeholder="Client address"
                                        value={form.toAddress}
                                        onChange={e => updateField("toAddress", e.target.value)}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">City</label>
                                        <input className="doc-input"
                                            placeholder="Delhi"
                                            value={form.toCity}
                                            onChange={e => updateField("toCity", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">State</label>
                                        <select className="doc-select"
                                            value={form.toState}
                                            onChange={e => updateField("toState", e.target.value)}
                                        >
                                            {INDIAN_STATES.map(s => (
                                                <option key={s.code} value={s.code}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row" style={{ marginTop: "10px" }}>
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">Phone</label>
                                        <input className="doc-input"
                                            placeholder="+91 98765 43210"
                                            value={form.toPhone}
                                            onChange={e => updateField("toPhone", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-field" style={{ marginBottom: 0 }}>
                                        <label className="field-label">Email</label>
                                        <input className="doc-input"
                                            type="email" placeholder="client@company.com"
                                            value={form.toEmail}
                                            onChange={e => updateField("toEmail", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                                <p className="form-label">Tax Configuration</p>

                                <div className="form-field">
                                    <label className="field-label">Tax Type</label>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        {[
                                            { value: "cgst_sgst", label: "CGST + SGST" },
                                            { value: "igst", label: "IGST" },
                                            { value: "none", label: "No Tax" },
                                        ].map(opt => (
                                            <button key={opt.value}
                                                onClick={() => updateField("taxType", opt.value)}
                                                className={`toggle-btn ${form.taxType === opt.value ? "active" : ""}`}>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {form.taxType !== "none" && (
                                    <div className="form-field">
                                        <label className="field-label">Default GST Rate</label>
                                        <select className="doc-select"
                                            value={form.gstRate}
                                            onChange={e => updateField("gstRate", e.target.value)}
                                        >
                                            {[0, 5, 12, 18, 28].map(r => (
                                                <option key={r} value={r}>{r}%</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── ITEMS TAB ── */}
                        {activeTab === "items" && (
                            <div>
                                <div style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "center", marginBottom: "12px",
                                }}>
                                    <p className="form-label" style={{ margin: 0, borderBottom: "none" }}>Line Items</p>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button
                                            onClick={() => updateField("showHSN", !form.showHSN)}
                                            className={`toggle-btn ${form.showHSN ? "active" : ""}`}
                                        >
                                            HSN
                                        </button>
                                        <button
                                            onClick={() => updateField("showDiscount", !form.showDiscount)}
                                            className={`toggle-btn ${form.showDiscount ? "active" : ""}`}
                                        >
                                            Discount
                                        </button>
                                    </div>
                                </div>

                                {/* Column headers */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: form.showHSN
                                        ? form.showDiscount ? "2fr 0.6fr 0.5fr 0.7fr 0.6fr 0.5fr 0.7fr auto"
                                            : "2fr 0.6fr 0.5fr 0.7fr 0.5fr 0.7fr auto"
                                        : form.showDiscount ? "2fr 0.5fr 0.7fr 0.6fr 0.5fr 0.7fr auto"
                                            : "2fr 0.5fr 0.7fr 0.5fr 0.7fr auto",
                                    gap: "6px",
                                    marginBottom: "6px",
                                    padding: "0 0 6px",
                                    borderBottom: "1px solid #E5E7EB",
                                }}>
                                    {["Description", form.showHSN && "HSN", "Qty", "Rate",
                                        form.showDiscount && "Disc", "GST%", "Amount", ""]
                                        .filter(Boolean)
                                        .map((h, i) => (
                                            <span key={i} style={{
                                                fontSize: "10px", fontWeight: 700,
                                                color: "#9CA3AF", textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                                fontFamily: "Inter, sans-serif",
                                            }}>{h}</span>
                                        ))}
                                </div>

                                {/* Item rows */}
                                {form.items.map((item, i) => (
                                    <ItemRow
                                        key={i}
                                        item={item}
                                        index={i}
                                        onChange={updateItem}
                                        onRemove={removeItem}
                                        showHSN={form.showHSN}
                                        showDiscount={form.showDiscount}
                                    />
                                ))}

                                <button className="add-item-btn" onClick={addItem}>
                                    <Plus size={14} /> Add Line Item
                                </button>

                                {/* Totals summary */}
                                {(() => {
                                    const calc = calculateLineItems(form.items, form.taxType === "igst");
                                    return (
                                        <div style={{
                                            marginTop: "16px", padding: "12px",
                                            background: "#F0F4F3", borderRadius: "8px",
                                        }}>
                                            {[
                                                ["Subtotal", `₹${calc.subtotal}`],
                                                form.taxType === "cgst_sgst" && ["CGST", `₹${calc.totalCGST}`],
                                                form.taxType === "cgst_sgst" && ["SGST", `₹${calc.totalSGST}`],
                                                form.taxType === "igst" && ["IGST", `₹${calc.totalIGST}`],
                                            ].filter(Boolean).map(([l, v]) => (
                                                <div key={l} style={{
                                                    display: "flex", justifyContent: "space-between",
                                                    marginBottom: "4px",
                                                }}>
                                                    <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>{l}</span>
                                                    <span style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{v}</span>
                                                </div>
                                            ))}
                                            <div style={{
                                                display: "flex", justifyContent: "space-between",
                                                borderTop: "1px solid #D1D5DB",
                                                paddingTop: "6px", marginTop: "4px",
                                            }}>
                                                <span style={{
                                                    fontSize: "13px", fontWeight: 700,
                                                    fontFamily: "Space Grotesk, sans-serif", color: "#111827",
                                                }}>Grand Total</span>
                                                <span style={{
                                                    fontSize: "13px", fontWeight: 700,
                                                    color: T, fontFamily: "Space Grotesk, sans-serif",
                                                }}>₹{calc.grandTotal}</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* ── SETTINGS TAB ── */}
                        {activeTab === "extra" && (
                            <div>
                                <p className="form-label">Notes & Terms</p>

                                <div className="form-field">
                                    <label className="field-label">Notes (optional)</label>
                                    <textarea className="doc-textarea"
                                        placeholder="Any additional notes for the client..."
                                        value={form.notes}
                                        onChange={e => updateField("notes", e.target.value)}
                                        style={{ minHeight: "80px" }}
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="field-label">Terms & Conditions</label>
                                    <textarea className="doc-textarea"
                                        value={form.terms}
                                        onChange={e => updateField("terms", e.target.value)}
                                        style={{ minHeight: "80px" }}
                                    />
                                </div>

                                <div style={{ borderTop: "1px solid #F3F4F6", margin: "16px 0" }} />
                                <p className="form-label">Download</p>

                                <button onClick={handleDownload} className="download-pdf-btn"
                                    style={{ width: "100%", justifyContent: "center" }}>
                                    <Download size={15} /> Download PDF — Free
                                </button>

                                <p style={{
                                    fontSize: "11px", color: "#9CA3AF",
                                    textAlign: "center", margin: "8px 0 0",
                                    fontFamily: "Inter, sans-serif",
                                }}>
                                    No watermark · No sign-up · Instant download
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: PREVIEW ── */}
                    <div className="preview-panel">
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", marginBottom: "16px",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <Eye size={14} color="#9CA3AF" />
                                <span style={{
                                    fontSize: "12px", color: "#9CA3AF",
                                    fontFamily: "Inter, sans-serif", fontWeight: 600,
                                }}>
                                    LIVE PREVIEW
                                </span>
                            </div>
                            <button onClick={handleDownload} className="download-pdf-btn">
                                <Download size={14} /> Download PDF
                            </button>
                        </div>
                        <InvoicePreview form={form} />
                    </div>
                </div>

                {/* Ad below */}
                <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
                    <AdSense adSlot="SLOT_ID_INVOICE" />
                </div>
            </div>

            <Footer />
        </>
    );
}
