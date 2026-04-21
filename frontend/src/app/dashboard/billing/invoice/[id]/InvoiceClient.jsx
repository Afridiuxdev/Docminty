"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { paymentApi } from "@/api/payment";
import { authApi } from "@/api/auth";
import { Shield, FileText, Printer, ArrowLeft, Share2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import DashHeader from "@/components/dashboard/DashHeader";

const T = "#0D9488";

export default function InvoiceClient() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [payment, setPayment] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAutoPrint = searchParams.get("print") === "true";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await authApi.me();
                setUser(userRes.data.data);

                if (id === "receipt") {
                    setLoading(false);
                    return;
                }

                const historyRes = await paymentApi.getHistory();
                const found = historyRes.data.data.find(p => p.id === id);
                if (found) {
                    setPayment(found);
                } else {
                    toast.error("Invoice not found");
                }
            } catch (err) {
                console.error("Fetch failed", err);
                toast.error("Failed to load invoice details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!loading && payment && isAutoPrint) {
            setTimeout(() => window.print(), 800);
        }
    }, [loading, payment, isAutoPrint]);

    const handleShare = async () => {
        const shareData = {
            title: `DocMinty Receipt - ${payment.id}`,
            text: `View your DocMinty receipt for order ${payment.id}.`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Receipt link copied to clipboard!");
            }
        } catch (err) {
            console.error("Share failed", err);
        }
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "Inter, sans-serif" }}>
            <p>Loading receipt...</p>
        </div>
    );

    if (!payment) {
        if (id === "receipt") return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "Inter, sans-serif" }}>
                <p>Preparing receipt...</p>
            </div>
        );
        return (
            <div style={{ padding: "40px", textAlign: "center", fontFamily: "Inter, sans-serif" }}>
                <h2>Invoice Not Found</h2>
                <button onClick={() => router.back()} style={{ color: T, border: "none", background: "none", cursor: "pointer", fontWeight: 600 }}>← Back to Billing</button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#F1F5F9" }} className="no-print-bg">
            <Toaster position="top-right" />
            
            <DashHeader 
              title="Receipt Details" 
              subtitle={`Order ID: ${payment.id}`}
              action={
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handleShare} style={{ 
                        display: "flex", alignItems: "center", gap: "8px", 
                        background: "#fff", border: "1px solid #E2E8F0", padding: "8px 16px", 
                        borderRadius: "8px", color: "#64748B", fontWeight: 600, cursor: "pointer", 
                        fontSize: "13px", fontFamily: "Space Grotesk, sans-serif",
                        transition: "all 0.2s"
                    }}>
                        <Share2 size={16} /> Share
                    </button>
                    <button onClick={() => window.print()} style={{ 
                        display: "flex", alignItems: "center", gap: "8px", 
                        background: T, border: "none", padding: "8px 20px", 
                        borderRadius: "8px", color: "#fff", fontWeight: 600, cursor: "pointer", 
                        fontSize: "13px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        fontFamily: "Space Grotesk, sans-serif"
                    }}>
                        <Printer size={16} /> Print Receipt
                    </button>
                </div>
              }
            />

            <div style={{ padding: "24px" }} className="print-wrapper">
                <style jsx global>{`
                    .receipt-sheet { 
                        width: 100%; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 60px;
                        background: #fff; 
                        border-radius: 12px; 
                        box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                        font-family: 'Inter', sans-serif; 
                        box-sizing: border-box; 
                        position: relative;
                        display: flex;
                        flex-direction: column;
                    }
                    .billing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding-bottom: 24px; border-bottom: 1px solid #F1F5F9; margin-bottom: 40px; }
                    .receipt-header { display: flex; justify-content: space-between; margin-bottom: 60px; }
                    .receipt-title { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 32px; margin: 0 0 4px; color: #111827; }

                    @media (max-width: 640px) {
                        .receipt-sheet { padding: 30px 24px !important; }
                        .billing-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
                        .receipt-header { flex-direction: column !important; gap: 24px !important; margin-bottom: 40px !important; }
                        .receipt-header > div:last-child { text-align: left !important; }
                        .receipt-title { font-size: 24px !important; }
                    }

                    @media print {
                        @page { margin: 0; size: a4 portrait; }
                        body, html { 
                            margin: 0 !important; 
                            background: #fff !important; 
                            height: 297mm !important;
                            width: 210mm !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            overflow: hidden !important;
                        }
                        .no-print, .dash-global-header, .dash-sub-header { display: none !important; }
                        .no-print-bg { background: #E2E8F0 !important; padding: 0 !important; margin: 0 !important; height: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; }
                        .print-wrapper { background: #F1F5F9 !important; padding: 0 !important; margin: 0 !important; height: 100% !important; display: flex !important; justify-content: center !important; align-items: center !important; }
                        .receipt-sheet { 
                            box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important; 
                            border: 1px solid #E2E8F0 !important; /* Explicit border for print match */
                            padding: 20mm !important; 
                            margin: 0 auto !important; 
                            width: 190mm !important;
                            height: 270mm !important; /* Safety height for PDF headers */
                            border-radius: 12px !important;
                            page-break-after: avoid !important;
                            page-break-inside: avoid !important;
                            display: flex !important;
                            flex-direction: column !important;
                            overflow: hidden !important;
                            background: #fff !important;
                            -webkit-print-color-adjust: exact !important;
                        }
                    }
                `}</style>

                {/* The Actual Receipt Sheet */}
                <div className="receipt-sheet" id="receipt-sheet">
                    
                    {/* Brand Header */}
                    <div className="receipt-header">
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                                <div style={{ 
                                    width: "36px", height: "36px", background: T, 
                                    borderRadius: "8px", display: "flex", alignItems: "center", 
                                    justifyContent: "center", WebkitPrintColorAdjust: "exact" 
                                }}>
                                    <FileText size={20} color="#fff" />
                                </div>
                                <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "22px", color: "#111827", letterSpacing: "-0.5px" }}>DocMinty</span>
                            </div>
                            <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>Premium Document Automation</p>
                            <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0" }}>www.docminty.com</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <h1 className="receipt-title">RECEIPT</h1>
                            <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>Order ID: <span style={{ color: "#111827", fontWeight: 600, fontFamily: "monospace" }}>{payment.id}</span></p>
                            <p style={{ fontSize: "13px", color: "#64748B", margin: "2px 0 0" }}>Date: <span style={{ color: "#111827", fontWeight: 600 }}>{new Date(payment.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></p>
                        </div>
                    </div>

                    {/* Billing Details */}
                    <div className="billing-grid">
                        <div style={{ pageBreakInside: "avoid" }}>
                            <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Billed To</p>
                            <p style={{ fontSize: "15px", fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>{user?.name || "Customer"}</p>
                            <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>{user?.email || "—"}</p>
                            {user?.phone && <p style={{ fontSize: "14px", color: "#64748B", margin: "2px 0 0" }}>{user.phone}</p>}
                        </div>
                        <div style={{ textAlign: "right", pageBreakInside: "avoid" }} className="billing-method">
                            <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Payment Method</p>
                            <p style={{ fontSize: "15px", fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>Razorpay Online</p>
                            <div style={{ 
                                display: "inline-flex", background: "#ECFDF5", color: "#10B981", 
                                borderRadius: "99px", padding: "4px 12px", fontSize: "11px", 
                                fontWeight: 700, textTransform: "uppercase", WebkitPrintColorAdjust: "exact" 
                            }}>Completed</div>
                        </div>
                    </div>

                    {/* Item Table */}
                    <div style={{ width: "100%", overflowX: "auto", marginBottom: "30px", pageBreakInside: "avoid" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                              <tr style={{ background: "#F8FAFC", WebkitPrintColorAdjust: "exact" }}>
                                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#475569", borderBottom: "2px solid #F1F5F9" }}>Description</th>
                                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: "#475569", borderBottom: "2px solid #F1F5F9" }}>Amount</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td style={{ padding: "20px 16px", fontSize: "14px", color: "#1E293B" }}>
                                      <p style={{ margin: "0 0 4px", fontWeight: 700 }}>DocMinty {payment.plan} Subscription</p>
                                      <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>Subscription access for selected billing period</p>
                                  </td>
                                  <td style={{ padding: "20px 16px", textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#1E293B" }}>{payment.amount}</td>
                              </tr>
                          </tbody>
                      </table>
                    </div>

                    {/* Totals Section */}
                    <div style={{ display: "flex", justifyContent: "flex-end", flex: 1, minHeight: "50px" }}>
                        <div style={{ width: "220px", pageBreakInside: "avoid" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                <span style={{ fontSize: "14px", color: "#64748B" }}>Subtotal</span>
                                <span style={{ fontSize: "14px", color: "#1E293B", fontWeight: 600 }}>{payment.amount}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                <span style={{ fontSize: "14px", color: "#64748B" }}>Tax (0%)</span>
                                <span style={{ fontSize: "14px", color: "#1E293B", fontWeight: 600 }}>₹0.00</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #F1F5F9", paddingTop: "12px", marginTop: "12px" }}>
                                <span style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B" }}>Total Paid</span>
                                <span style={{ fontSize: "18px", fontWeight: 800, color: T, WebkitPrintColorAdjust: "exact" }}>{payment.amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footnote */}
                    <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid #F1F5F9", textAlign: "center", pageBreakInside: "avoid" }}>
                        <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}>This is a computer-generated receipt and does not require a physical signature.</p>
                        <p style={{ fontSize: "11px", color: "#64748B", margin: "4px 0 0" }}>Thank you for choosing DocMinty for your professional document needs.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
