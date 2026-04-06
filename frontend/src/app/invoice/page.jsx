"use client";

import TemplatePicker from "@/components/TemplatePicker";
import TemplateColorPicker from "@/components/TemplateColorPicker";
import { useDownloadPDF } from "@/hooks/useDownloadPDF";
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import LogoUpload from "@/components/LogoUpload";
import { INDIAN_STATES } from "@/constants/indianStates";
import { calculateLineItems, numberToWords } from "@/engine/gstCalc";
import { Plus, Trash2, Download, Eye, RefreshCw, Cloud, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { documentsApi } from "@/api/documents";
import { getAccessToken } from "@/api/auth";
import SignatureModal from "@/components/SignatureModal";
import { PenTool } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import { useProfileSync } from "@/hooks/useProfileSync";
import { useDraftLoader } from "@/hooks/useDraftLoader";

const T = "#0D9488";

// ── Default form state ────────────────────────────────────────
export const DEFAULT_FORM = {
    logo: "",
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
    signature: null,
    showHSN: true,
    showDiscount: false,
    currency: "₹",
    templateColor: "#0D9488",
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
            background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px",
            padding: "16px", marginBottom: "12px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)", position: "relative"
        }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
                    <input className="doc-input" placeholder="Item description" value={item.description} onChange={e => update("description", e.target.value)} style={{ background: "#F9FAFB" }} />
                </div>
                <button onClick={() => onRemove(index)} title="Remove Item" style={{ background: "#FEE2E2", color: "#EF4444", border: "none", width: "36px", height: "36px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: "18px", transition: "background 150ms" }}>
                    <Trash2 size={16} />
                </button>
            </div>
            <div style={{
                display: "grid",
                gridTemplateColumns: showHSN ? (showDiscount ? "repeat(5, 1fr) auto" : "repeat(4, 1fr) auto") : (showDiscount ? "repeat(4, 1fr) auto" : "repeat(3, 1fr) auto"),
                gap: "12px", alignItems: "end"
            }}>
                {showHSN && (
                    <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>HSN</label>
                        <input className="doc-input" placeholder="HSN" value={item.hsn} onChange={e => update("hsn", e.target.value)} style={{ background: "#F9FAFB" }} />
                    </div>
                )}
                <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Qty</label>
                    <input className="doc-input" type="number" placeholder="1" value={item.qty} onChange={e => update("qty", e.target.value)} style={{ background: "#F9FAFB" }} />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Rate</label>
                    <input className="doc-input" type="number" placeholder="0.00" value={item.rate} onChange={e => update("rate", e.target.value)} style={{ background: "#F9FAFB" }} />
                </div>
                {showDiscount && (
                    <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Disc</label>
                        <input className="doc-input" type="number" placeholder="0" value={item.discount} onChange={e => update("discount", e.target.value)} style={{ background: "#F9FAFB" }} />
                    </div>
                )}
                <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>GST (%)</label>
                    <select className="doc-select" value={item.gstRate} onChange={e => update("gstRate", e.target.value)} style={{ background: "#F9FAFB" }}>
                        {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                    </select>
                </div>
                <div style={{ textAlign: "right", height: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>Amount</span>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "#0D9488", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>₹{item.amount}</span>
                </div>
            </div>
        </div>
    );
}

// ── PDF Preview ───────────────────────────────────────────────
export function InvoicePreview({ form, template = "Classic", accent = "#0D9488" }) {
    const calc = calculateLineItems(form.items, form.taxType === "igst");
    const fromState = INDIAN_STATES.find(s => s.code === form.fromState);
    const toState = INDIAN_STATES.find(s => s.code === form.toState);

    // Shared body used by all template variants
    const sharedBody = (
        <div className="pdf-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
                <div style={{ wordBreak: "break-word" }}>
                    <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px", fontFamily: "Space Grotesk, sans-serif" }}>Bill To</p>
                    <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "13px", color: "#111827", margin: 0 }}>{form.toName || "Client Name"}</p>
                    {form.toGSTIN && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>GSTIN: {form.toGSTIN}</p>}
                    {form.toAddress && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif", whiteSpace: "pre-wrap" }}>{form.toAddress}{form.toCity ? `, ${form.toCity}` : ""}</p>}
                    {toState && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>{toState.name}</p>}
                    {(form.toPhone || form.toEmail) && (
                        <p style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
                            {form.toPhone && <span style={{ display: "block" }}>Ph: {form.toPhone}</span>}
                            {form.toEmail && <span style={{ display: "block", wordBreak: "break-all" }}>Em: {form.toEmail}</span>}
                        </p>
                    )}
                </div>
                <div>
                    <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px", fontFamily: "Space Grotesk, sans-serif" }}>Tax Type</p>
                    <p style={{ fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", margin: 0 }}>
                        {form.taxType === "cgst_sgst" ? "CGST + SGST (Intrastate)" : form.taxType === "igst" ? "IGST (Interstate)" : "No Tax"}
                    </p>
                </div>
            </div>
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
                            <td>Rs.{item.rate}</td>
                            {form.showDiscount && <td>Rs.{item.discount}</td>}
                            <td>{item.gstRate}%</td>
                            <td style={{ textAlign: "right", fontWeight: 600 }}>Rs.{item.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="pdf-totals">
                    <div className="pdf-total-row"><span style={{ color: "#6B7280" }}>Subtotal</span><span>Rs.{calc.subtotal}</span></div>
                    {parseFloat(calc.totalDiscount) > 0 && <div className="pdf-total-row"><span style={{ color: "#6B7280" }}>Discount</span><span style={{ color: "#EF4444" }}>-Rs.{calc.totalDiscount}</span></div>}
                    {form.taxType === "cgst_sgst" && (<><div className="pdf-total-row"><span style={{ color: "#6B7280" }}>CGST</span><span>Rs.{calc.totalCGST}</span></div><div className="pdf-total-row"><span style={{ color: "#6B7280" }}>SGST</span><span>Rs.{calc.totalSGST}</span></div></>)}
                    {form.taxType === "igst" && <div className="pdf-total-row"><span style={{ color: "#6B7280" }}>IGST</span><span>Rs.{calc.totalIGST}</span></div>}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: accent + "18", borderRadius: "6px", marginTop: "6px", fontWeight: 700, fontSize: "13px", color: accent }}>
                        <span>Total</span><span>Rs.{calc.grandTotal}</span>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: "16px", padding: "10px 14px", background: "#F8F9FA", borderRadius: "6px", borderLeft: `3px solid ${accent}` }}>
                <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 2px", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount in Words</p>
                <p style={{ fontSize: "12px", color: "#374151", margin: 0, fontFamily: "Inter, sans-serif", fontStyle: "italic" }}>{numberToWords(parseFloat(calc.grandTotal))}</p>
            </div>
            {(form.notes || form.terms) && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
                    {form.notes && <div><p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>Notes</p><p style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif", lineHeight: 1.6, margin: 0 }}>{form.notes}</p></div>}
                    {form.terms && <div><p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>Terms & Conditions</p><p style={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter, sans-serif", lineHeight: 1.6, margin: 0 }}>{form.terms}</p></div>}
                </div>
            )}
            <div style={{ marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "10px", color: "#D1D5DB", fontFamily: "Inter, sans-serif", margin: 0 }}>Generated by DocMinty.com</p>
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

    // Modern — sidebar layout
    if (template === "Modern") {
        return (
            <div className="pdf-preview" style={{ display: "flex", padding: 0, overflow: "hidden" }}>
                <div style={{ width: "135px", background: accent, padding: "24px 14px", flexShrink: 0, color: "#fff", display: "flex", flexDirection: "column", wordBreak: "break-word" }}>
                    <p style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 4px", fontFamily: "Space Grotesk, sans-serif" }}>INVOICE</p>
                    <p style={{ fontSize: "10px", opacity: 0.75, margin: "0 0 24px" }}>#{form.invoiceNumber}</p>
                    <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>From</p>
                    <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 4px", lineHeight: 1.3 }}>{form.fromName || "Your Business"}</p>
                    <p style={{ fontSize: "9px", opacity: 0.8, margin: "0 0 16px", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                        {form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromState && fromState.name}
                        {form.fromPhone && <><br />Ph: {form.fromPhone}</>}
                        {form.fromEmail && <><br /><span style={{ wordBreak: "break-all" }}>Em: {form.fromEmail}</span></>}
                    </p>

                    <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>Bill To</p>
                    <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 16px", lineHeight: 1.4 }}>{form.toName || "Client Name"}</p>

                    <div style={{ marginTop: "auto" }}>
                        {(form.dueDate || form.poNumber) && (
                            <div style={{ marginBottom: "16px" }}>
                                {form.dueDate && <p style={{ fontSize: "8px", opacity: 0.7, margin: "0 0 2px" }}>DUE: {form.dueDate}</p>}
                                {form.poNumber && <p style={{ fontSize: "8px", opacity: 0.7, margin: 0 }}>PO#: {form.poNumber}</p>}
                            </div>
                        )}
                        <p style={{ fontSize: "8px", fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>Amount Due</p>
                        <p style={{ fontSize: "11px", fontWeight: 700, margin: 0 }}>Rs.{calc.grandTotal}</p>
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F3F4F6" }}>
                        {form.logo && <img src={form.logo} alt="Logo" style={{ height: "36px", objectFit: "contain", marginBottom: "6px", display: "block" }} />}
                        {form.fromGSTIN && <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "0 0 1px", fontFamily: "Inter, sans-serif" }}>GSTIN: {form.fromGSTIN}</p>}
                        <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 12px", fontFamily: "Inter, sans-serif" }}>Date: {form.invoiceDate}</p>
                        {form.signature && (
                            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "8px" }}>
                                <img src={form.signature} alt="Signature" style={{ maxHeight: "36px", maxWidth: "100px", display: "block" }} />
                                <p style={{ fontSize: "8px", color: "#9CA3AF", margin: "2px 0 0" }}>Authorised Signatory</p>
                            </div>
                        )}
                    </div>
                    {sharedBody}
                </div>
            </div>
        );
    }

    // Corporate — centered header
    if (template === "Corporate") {
        return (
            <div className="pdf-preview">
                <div style={{ textAlign: "center", padding: "20px 24px 16px", borderBottom: `2px solid ${accent}`, wordBreak: "break-word" }}>
                    {form.logo && <img src={form.logo} alt="Logo" style={{ height: "40px", objectFit: "contain", display: "block", margin: "0 auto 8px" }} />}
                    <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "20px", color: accent, margin: "0 0 2px", letterSpacing: "0.05em" }}>{form.fromName || "Your Business Name"}</p>
                    <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 6px", lineHeight: 1.5, maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
                        {form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromState && fromState.name}
                        {(form.fromPhone || form.fromEmail) && <><br />{form.fromPhone && `Ph: ${form.fromPhone}`} {form.fromEmail && `| Em: ${form.fromEmail}`}</>}
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                        {form.fromGSTIN && <span>GSTIN: {form.fromGSTIN}</span>}
                        <span>INV: #{form.invoiceNumber}</span>
                        <span>Date: {form.invoiceDate}</span>
                    </div>
                    {(form.dueDate || form.poNumber) && (
                        <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "9px", color: "#9CA3AF", marginTop: "4px" }}>
                            {form.dueDate && <span>DUE BY: {form.dueDate}</span>}
                            {form.poNumber && <span>PO#: {form.poNumber}</span>}
                        </div>
                    )}
                    {form.signature && (
                        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <img src={form.signature} alt="Signature" style={{ maxHeight: "40px", maxWidth: "120px", display: "block" }} />
                            <p style={{ fontSize: "8px", color: "#9CA3AF", margin: "2px 0 0" }}>Authorised Signatory</p>
                        </div>
                    )}
                </div>
                {sharedBody}
            </div>
        );
    }

    // Elegant — bottom accent bar separator
    if (template === "Elegant") {
        return (
            <div className="pdf-preview">
                <div style={{ padding: "20px 24px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "12px", wordBreak: "break-word" }}>
                        <div style={{ maxWidth: "60%" }}>
                            {form.logo && <img src={form.logo} alt="Logo" style={{ height: "40px", objectFit: "contain", marginBottom: "6px", display: "block" }} />}
                            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.fromName || "Your Business Name"}</p>
                            <p style={{ fontSize: "10px", color: "#6B7280", margin: "4px 0 0", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                                {form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromState && fromState.name}
                                {(form.fromPhone || form.fromEmail || form.fromGSTIN) && (
                                    <><br />{form.fromGSTIN && `GSTIN: ${form.fromGSTIN}`} {form.fromPhone && `| Ph: ${form.fromPhone}`} {form.fromEmail && `| Em: ${form.fromEmail}`}</>
                                )}
                            </p>
                        </div>
                        <div style={{ textAlign: "right", maxWidth: "35%" }}>
                            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: accent, margin: 0 }}>INVOICE</p>
                            <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>#{form.invoiceNumber}</p>
                            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Date: {form.invoiceDate}</p>
                            {form.dueDate && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0" }}>Due: {form.dueDate}</p>}
                            {form.poNumber && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0" }}>PO#: {form.poNumber}</p>}
                        </div>
                    </div>
                    <div style={{ height: "4px", background: accent, borderRadius: "2px" }} />
                </div>
                {sharedBody}
            </div>
        );
    }

    // Classic — full colored header bar
    if (template === "Classic") {
        return (
            <div className="pdf-preview">
                <div style={{ background: accent, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", wordBreak: "break-word" }}>
                    <div style={{ maxWidth: "60%" }}>
                        {form.logo && <img src={form.logo} alt="Logo" style={{ height: "36px", objectFit: "contain", marginBottom: "6px", display: "block" }} />}
                        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#fff", margin: 0 }}>{form.fromName || "Your Business Name"}</p>
                        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.85)", margin: "4px 0 0", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                            {form.fromAddress} {form.fromCity && `${form.fromCity}, `} {fromState && fromState.name}
                            {(form.fromPhone || form.fromEmail || form.fromGSTIN) && (
                                <><br />{form.fromGSTIN && `GSTIN: ${form.fromGSTIN}`} {form.fromPhone && `| Ph: ${form.fromPhone}`} {form.fromEmail && `| Em: ${form.fromEmail}`}</>
                            )}
                        </p>
                    </div>
                    <div style={{ textAlign: "right", maxWidth: "35%" }}>
                        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "24px", color: "#fff", margin: 0 }}>INVOICE</p>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>#{form.invoiceNumber}</p>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", marginTop: "4px", display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span>Date: {form.invoiceDate}</span>
                            {form.dueDate && <span>Due: {form.dueDate}</span>}
                            {form.poNumber && <span>PO#: {form.poNumber}</span>}
                        </div>
                    </div>
                </div>
                {sharedBody}
            </div>
        );
    }

    // Minimal (default) — accent underline separator
    return (
        <div className="pdf-preview">
            <div className="pdf-header" style={{ borderBottom: `2px solid ${accent}`, wordBreak: "break-word" }}>
                <div style={{ maxWidth: "60%" }}>
                    {form.logo && <img src={form.logo} alt="Logo" style={{ height: "48px", objectFit: "contain", marginBottom: "8px", display: "block" }} />}
                    <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", margin: 0 }}>{form.fromName || "Your Business Name"}</p>
                    {form.fromGSTIN && <p style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 1px", fontFamily: "Inter, sans-serif" }}>GSTIN: {form.fromGSTIN}</p>}
                    <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0", fontFamily: "Inter, sans-serif", whiteSpace: "pre-wrap" }}>
                        {form.fromAddress}{form.fromCity ? `, ${form.fromCity}` : ""}
                    </p>
                    {fromState && <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0" }}>{fromState.name}</p>}
                    {(form.fromPhone || form.fromEmail) && (
                        <p style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 0", lineHeight: 1.4 }}>
                            {form.fromPhone && <span style={{ display: "block" }}>Ph: {form.fromPhone}</span>}
                            {form.fromEmail && <span style={{ display: "block", wordBreak: "break-all" }}>Em: {form.fromEmail}</span>}
                        </p>
                    )}
                </div>
                <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: "#111827", margin: 0 }}>Invoice</p>
                    <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>#{form.invoiceNumber}</p>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0", fontFamily: "Inter, sans-serif" }}>Date: {form.invoiceDate}</p>
                    {form.dueDate && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>Due: {form.dueDate}</p>}
                    {form.poNumber && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", fontFamily: "Inter, sans-serif" }}>PO#: {form.poNumber}</p>}
                </div>
            </div>
            {sharedBody}
        </div>
    );
}

// ── Main Invoice Page ─────────────────────────────────────────
export default function InvoicePage() {
    const { user } = useAuth();
    const { download, generateBlob, downloading } = useDownloadPDF();
    const router = useRouter();
    const [template, setTemplate] = useState("Classic");
    const [form, setForm] = useState(DEFAULT_FORM);
    const [activeTab, setActiveTab] = useState("from");
    const [isSigModalOpen, setIsSigModalOpen] = useState(false);

    const plan = user?.plan?.toUpperCase() || "FREE";
    const isUserPro = plan === "PRO" || plan === "ENTERPRISE" || plan === "BUSINESS PRO";

    // Auto-sync profile for Pro/Enterprise
    useProfileSync(form, setForm, plan);
    const { isEditMode, docMetaData } = useDraftLoader(setForm, () => {
        // We use a slight hack to trigger download function from the hook
        const btn = document.querySelector(".download-pdf-btn");
        if (btn) btn.click();
    });

    const templateMeta = TEMPLATE_REGISTRY.invoice[template] || TEMPLATE_REGISTRY.invoice.Classic;
    const isProTemplate = templateMeta.pro;
    const showWatermark = isProTemplate && !isUserPro;

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
                rate: "", discount: "0", gstRate: prev.gstRate || "18", amount: "0.00",
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
        download("invoice", template, form, `Invoice-${form.invoiceNumber}.pdf`);
    };

    const handleSave = async () => {
        if (!getAccessToken()) { toast.error("Please sign in to save"); router.push("/login"); return; }
        if (!isUserPro) {
            toast.error("Cloud saving is a PRO feature. Please upgrade!");
            router.push("/dashboard/billing");
            return;
        }
        const payload = {
            docType: "invoice",
            title: "Invoice #" + form.invoiceNumber,
            referenceNumber: form.invoiceNumber,
            templateName: template,
            partyName: form.toName,
            amount: form.items.reduce((s, i) => s + parseFloat(i.amount || 0), 0).toFixed(2),
            formData: JSON.stringify(form),
        };
        if (isEditMode && docMetaData?.id) {
            payload.id = docMetaData.id;
        }

        try {
            const pendingToast = toast.loading("Saving document...");
            payload.file = await generateBlob("invoice", template, form, `Invoice-${form.invoiceNumber}.pdf`);
            await documentsApi.save(payload);
            toast.dismiss(pendingToast);
            toast.success(isEditMode ? "Document updated successfully!" : "Saved to your dashboard!");
        } catch (err) { if (err.message !== "PLAN_LIMIT_REACHED") toast.error("Save failed"); }
    };

    const FORM_TABS = [
        { id: "from", label: "Your Details" },
        { id: "to", label: "Client Details" },
        { id: "items", label: "Items" },
        { id: "extra", label: "Settings" },
        { id: "templates", label: "Templates" },
    ];

    return (
        <>
            <Toaster position="top-right" />
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
                        {user && isUserPro && !docMetaData?.viewMode && (
                            <div style={{ position: "relative" }}>
                                <button onClick={handleSave} style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    height: "36px", padding: "0 14px",
                                    border: `1px solid ${T}`, borderRadius: "8px",
                                    background: "#fff", fontSize: "13px", fontWeight: 600,
                                    color: T, cursor: "pointer",
                                    fontFamily: "Inter, sans-serif", transition: "all 150ms",
                                }}>
                                    <Cloud size={14} /> {isEditMode ? "Update" : "Save"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main layout */}
            <div style={{ background: "#F0F4F3", minHeight: "calc(100vh - 120px)" }}>
                <div className="doc-page-wrap">

                    {/* ── LEFT: FORM ── */}
                    <div className="form-panel">

                        {/* Form tabs */}
                        <div className="tab-bar" style={{
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

                                {!isUserPro && (
                                    <div style={{ padding: "10px 14px", background: "#F0FDFA", border: "1px solid #99F6E4", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                                        <Zap size={14} color={T} />
                                        <p style={{ fontSize: "11px", color: T, fontWeight: 600, margin: 0, fontFamily: "Inter, sans-serif" }}>
                                            Tip: Upgrade to <strong style={{ color: "#0D9488" }}>Business Pro</strong> to auto-fill your profile details.
                                        </p>
                                    </div>
                                )}

                                <div style={{ marginBottom: "16px" }}>
                                    <p style={{
                                        fontSize: "11px", fontWeight: 600,
                                        color: "#6B7280", margin: "0 0 6px",
                                        fontFamily: "Inter, sans-serif",
                                    }}>Company Logo</p>
                                    {isUserPro ? (
                                        <LogoUpload value={form.logo} onChange={(v) => updateField("logo", v)} />
                                    ) : (
                                        <div onClick={() => router.push("/#pricing")} style={{ padding: "14px 16px", border: "1px dashed #D1D5DB", borderRadius: "8px", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                                            <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>Logo upload — <strong style={{ color: "#6366F1" }}>Pro feature</strong></span>
                                            <span style={{ fontSize: "11px", background: "#EDE9FE", color: "#6366F1", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>Upgrade</span>
                                        </div>
                                    )}
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
                                        onChange={e => updateField("fromGSTIN", e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                                        maxLength={15}
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
                                        onChange={e => updateField("toGSTIN", e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                                        maxLength={15}
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

                        {activeTab === "templates" && (
                            <div>
                                <p className="form-label">Template Design</p>
                                <div style={{ marginTop: "8px" }}>
                                    <TemplatePicker
                                        docType="invoice"
                                        selected={template}
                                        onChange={(val) => {
                                            setTemplate(val);
                                            const defaultAccent = TEMPLATE_REGISTRY.invoice[val]?.accent || "#0D9488";
                                            updateField("templateColor", defaultAccent);
                                        }}
                                        isPro={isUserPro} />
                                </div>
                                <div style={{ borderTop: "1px solid #F3F4F6", margin: "20px 0" }} />
                                <TemplateColorPicker
                                    selectedColor={form.templateColor || "#0D9488"}
                                    onChange={(color) => updateField("templateColor", color)}
                                />
                                <div style={{ borderTop: "1px solid #F3F4F6", margin: "24px 0" }} />
                                <button onClick={handleDownload} className="download-pdf-btn"
                                    style={{ width: "100%", justifyContent: "center" }}>
                                    <Download size={15} /> Download PDF
                                </button>
                            </div>
                        )}

                        {FORM_TABS[FORM_TABS.length - 1].id !== activeTab && (
                            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end" }}>
                                <button
                                    onClick={() => setActiveTab(FORM_TABS[FORM_TABS.findIndex(t => t.id === activeTab) + 1].id)}
                                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 20px", background: "#0D9488", color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", border: "none", borderRadius: "8px", cursor: "pointer" }}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: PREVIEW ── */}
                    <div className="preview-panel">
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                            <Eye size={14} color="#9CA3AF" />
                            <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>LIVE PREVIEW</span>
                        </div>
                        <div style={{ position: "relative" }}>
                            {showWatermark && <WatermarkOverlay />}
                            <InvoicePreview form={form} template={template} accent={form.templateColor || templateMeta.accent} />
                        </div>
                    </div>
                </div>

                {/* Ad below */}
                <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 24px 40px" }}>
                    <AdSense adSlot="SLOT_ID_INVOICE" />
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
