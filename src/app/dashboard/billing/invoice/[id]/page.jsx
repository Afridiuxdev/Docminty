"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Download, FileText } from "lucide-react";
import { authApi } from "@/api/auth";

const T = "#0D9488";

const INVOICES = [
    { id: "INV-001", date: "19 Mar 2026", plan: "Business Pro Monthly", amount: "₹199", status: "Paid" },
    { id: "INV-002", date: "19 Feb 2026", plan: "Business Pro Monthly", amount: "₹199", status: "Paid" },
    { id: "INV-003", date: "19 Jan 2026", plan: "Business Pro Monthly", amount: "₹199", status: "Paid" },
    { id: "INV-004", date: "19 Dec 2025", plan: "Business Pro Monthly", amount: "₹199", status: "Paid" },
    { id: "INV-005", date: "19 Nov 2025", plan: "Business Pro Monthly", amount: "₹199", status: "Failed" },
];

export default function InvoicePage({ params }) {
    const { id } = React.use(params);
    const invoice = INVOICES.find(inv => inv.id === id) || INVOICES[0];
    const [user, setUser] = useState({ name: "User", email: "support@docminty.com", phone: "", city: "", state: "" });

    useEffect(() => {
        authApi.me()
            .then(res => { if (res.data.data) setUser(res.data.data); })
            .catch(err => console.error("Error fetching user for invoice:", err));
    }, []);

    const handlePrint = () => { window.print(); };

    return (
        <main style={{ minHeight: "100vh", background: "#F1F5F9", paddingBottom: "80px" }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: #fff !important; }
                    main { padding: 0 !important; }
                    .invoice-paper { box-shadow: none !important; border: none !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; border-radius: 0 !important; }
                }
            `}} />

            {/* Navigation Bar */}
            <div className="no-print" style={{ 
                background: "#fff", borderBottom: "1px solid #E2E8F0", 
                padding: "16px 24px", position: "sticky", top: 0, zIndex: 100,
                display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Link href="/dashboard/billing" style={{ 
                        display: "flex", alignItems: "center", gap: "8px", 
                        textDecoration: "none", color: "#64748B", fontSize: "14px", fontWeight: 600
                    }}>
                        <ArrowLeft size={18} /> Back to Billing
                    </Link>
                    <div style={{ width: "1px", height: "24px", background: "#E2E8F0" }} />
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#1E293B", fontFamily: "Space Grotesk, sans-serif" }}>
                        Tax Invoice #{invoice.id}
                    </span>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={handlePrint} style={{ 
                        display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px",
                        background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px",
                        fontSize: "13px", fontWeight: 700, color: "#334155", cursor: "pointer",
                        transition: "all 0.2s"
                    }}>
                        <Printer size={16} /> Print
                    </button>
                    <button style={{ 
                        display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px",
                        background: T, border: "none", borderRadius: "8px",
                        fontSize: "13px", fontWeight: 700, color: "#fff", cursor: "pointer",
                        transition: "all 0.2s"
                    }}>
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>

            {/* Invoice Paper Area */}
            <div style={{ padding: "40px 20px", display: "flex", justifyContent: "center" }}>
                <div className="invoice-paper" style={{
                    background: "#fff", width: "100%", maxWidth: "840px", 
                    borderRadius: "16px", border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                    overflow: "hidden"
                }}>
                    
                    {/* Document Header Section */}
                    <div style={{ padding: "48px 60px 40px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                                    {/* Official Brand Logo Implementation */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                                        <div style={{ width: "32px", height: "32px", background: T, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <FileText size={18} color="white" />
                                        </div>
                                        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: "#111827" }}>
                                            Doc<span style={{ color: T }}>Minty</span>
                                        </div>
                                    </div>
                                </div>
                                <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0F172A", margin: "16px 0 0", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.03em" }}>TAX INVOICE</h1>
                                <p style={{ fontSize: "13px", color: "#64748B", margin: "6px 0 0", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Digital Original</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#0F172A", margin: 0, fontFamily: "Space Grotesk, sans-serif" }}>{invoice.id.replace("INV-", "ORD-")}</h2>
                                <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                                    <span style={{
                                        background: invoice.status === "Paid" ? "#DCFCE7" : "#FEE2E2", 
                                        color: invoice.status === "Paid" ? "#15803D" : "#B91C1C", 
                                        padding: "4px 14px", borderRadius: "99px",
                                        fontSize: "12px", fontWeight: 800, textTransform: "uppercase", 
                                        letterSpacing: "0.06em", fontFamily: "Inter, sans-serif"
                                    }}>{invoice.status}</span>
                                </div>
                                <div style={{ marginTop: "24px" }}>
                                    <p style={{ fontSize: "12px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", margin: 0, fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.04em" }}>Issue Date</p>
                                    <p style={{ fontSize: "14px", color: "#64748B", margin: "4px 0 0", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{invoice.date}</p>
                                </div>
                            </div>
                        </div>

                        {/* Billed info grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "40px", marginBottom: "40px", paddingBottom: "32px", borderBottom: "1px solid #F1F5F9" }}>
                            <div>
                                <p style={{ fontSize: "12px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", margin: "0 0 12px", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.04em" }}>Billed From</p>
                                <p style={{ fontSize: "16px", fontWeight: 900, color: "#0F172A", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>DocMinty</p>
                                <p style={{ fontSize: "13px", color: "#64748B", margin: 0, lineHeight: 1.6, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                                    Anna Nagar, Chennai,<br />
                                    India - 600040
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: "12px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", margin: "0 0 12px", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.04em" }}>Billed To</p>
                                <p style={{ fontSize: "16px", fontWeight: 900, color: "#0F172A", margin: "0 0 6px", fontFamily: "Inter, sans-serif" }}>{user?.name}</p>
                                <p style={{ fontSize: "13px", color: "#64748B", margin: 0, lineHeight: 1.6, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                                    {user?.phone && `${user.phone}, `}{user?.email}<br />
                                    {user?.city}{user?.state && `, ${user.state}`}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: "12px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", margin: "0 0 12px", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.04em" }}>Payment Details</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <div>
                                        <p style={{ fontSize: "11px", fontWeight: 800, color: "#0F172A", margin: "0 0 2px", textTransform: "uppercase", fontFamily: "Space Grotesk, sans-serif" }}>Method</p>
                                        <p style={{ fontSize: "13px", color: "#64748B", margin: 0, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Online Payment</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: "11px", fontWeight: 800, color: "#0F172A", margin: "0 0 2px", textTransform: "uppercase", fontFamily: "Space Grotesk, sans-serif" }}>Transaction ID</p>
                                        <p style={{ fontSize: "13px", color: "#64748B", margin: 0, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>UTR-4829103</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table Section */}
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
                            <thead>
                                <tr style={{ borderBottom: "1.5px solid #0F172A" }}>
                                    <th style={{ padding: "16px 0", textAlign: "left", fontSize: "12px", fontWeight: 900, color: "#0F172A", textTransform: "uppercase", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.05em" }}>Description</th>
                                    <th style={{ padding: "16px 0", textAlign: "right", fontSize: "12px", fontWeight: 900, color: "#0F172A", textTransform: "uppercase", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.05em" }}>Taxable Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                                    <td style={{ padding: "32px 0" }}>
                                        <p style={{ fontSize: "16px", fontWeight: 900, color: "#0F172A", margin: 0, fontFamily: "Inter, sans-serif" }}>DocMinty - {invoice.plan}</p>
                                        <p style={{ fontSize: "13px", color: "#64748B", margin: "8px 0 0", fontStyle: "italic", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>Subscription active for one calendar cycle from payment date. Access to all premium templates and features included.</p>
                                    </td>
                                    <td style={{ padding: "32px 0", textAlign: "right", fontSize: "16px", fontWeight: 900, color: "#0F172A", fontFamily: "Inter, sans-serif" }}>{invoice.amount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Highly Professional Dark Footer */}
                    <div style={{ background: "#0F172A", padding: "48px 60px", color: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: "11px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", margin: "0 0 14px", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.05em" }}>Total in Words</p>
                                <p style={{ fontSize: "20px", fontWeight: 900, color: "#fff", margin: "0 0 32px", fontFamily: "Space Grotesk, sans-serif" }}>One Hundred Ninety Nine Only</p>
                                
                                <div style={{ borderLeft: `3px solid ${T}`, paddingLeft: "16px" }}>
                                    <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0, fontStyle: "italic", maxWidth: "340px", lineHeight: 1.7, fontFamily: "Inter, sans-serif" }}>
                                        Note: This is a computer-generated invoice and does not require a physical signature as per Section 65 of the Information Technology Act. Document verified digitally.
                                    </p>
                                </div>
                            </div>
                            
                            <div style={{ minWidth: "280px" }}>
                                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px", marginBottom: "20px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                        <span style={{ fontSize: "14px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>Subtotal</span>
                                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>{invoice.amount}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                        <span style={{ fontSize: "14px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>CGST (0%)</span>
                                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>₹0</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: "14px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>SGST (0%)</span>
                                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>₹0</span>
                                    </div>
                                </div>
                                
                                <div style={{ background: T, padding: "18px 24px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: `0 4px 12px ${T}33` }}>
                                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#fff", textTransform: "uppercase", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.04em" }}>Grand Total</span>
                                    <span style={{ fontSize: "24px", fontWeight: 900, color: "#fff", fontFamily: "Space Grotesk, sans-serif" }}>{invoice.amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page Footer (Legal) */}
                    <div className="no-print" style={{ padding: "24px 60px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", textAlign: "center" }}>
                        <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0, fontFamily: "Inter, sans-serif" }}>
                            Terms of Service apply. For any billing queries, contact support@docminty.com
                        </p>
                    </div>

                </div>
            </div>
        </main>
    );
}
