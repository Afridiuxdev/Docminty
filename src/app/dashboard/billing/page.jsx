"use client";
import { useState } from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import { Check, Zap, Shield } from "lucide-react";

const T = "#0D9488";

const INVOICES = [
    { id: "INV-001", date: "19 Mar 2026", plan: "Business Pro Monthly", amount: "Rs. 199", status: "Paid" },
    { id: "INV-002", date: "19 Feb 2026", plan: "Business Pro Monthly", amount: "Rs. 199", status: "Paid" },
    { id: "INV-003", date: "19 Jan 2026", plan: "Business Pro Monthly", amount: "Rs. 199", status: "Paid" },
    { id: "INV-004", date: "19 Dec 2025", plan: "Business Pro Monthly", amount: "Rs. 199", status: "Paid" },
    { id: "INV-005", date: "19 Nov 2025", plan: "Business Pro Monthly", amount: "Rs. 199", status: "Failed" },
];

const FREE_FEATURES = [
    "All 14 document types",
    "50 documents/month",
    "200 PDF downloads/month",
    "100 MB storage",
    "Logo upload",
    "GST auto-calculation",
];

const PRO_FEATURES = [
    "Everything in Free",
    "Unlimited documents",
    "Unlimited PDF downloads",
    "5 GB cloud storage",
    "Batch CSV processing",
    "Premium templates",
    "No DocMinty footer",
    "Priority support",
    "API access (coming soon)",
];

export default function DashBillingPage() {
    const [billing, setBilling] = useState("monthly");
    const isPro = false;

    const price = billing === "monthly" ? "199" : "1,990";
    const saving = billing === "annual" ? "Save Rs. 398/year" : "";

    return (
        <>
            <DashHeader title="Billing" subtitle="Manage your subscription and payment history" />
            <div style={{ padding: "24px" }}>

                {/* Current plan banner */}
                <div style={{
                    background: isPro ? "#F0FDFA" : "#F8F9FA",
                    border: `1px solid ${isPro ? T : "#E5E7EB"}`,
                    borderRadius: "12px", padding: "20px 24px",
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: "24px",
                    flexWrap: "wrap", gap: "12px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "44px", height: "44px",
                            background: isPro ? T : "#E5E7EB",
                            borderRadius: "50%", display: "flex",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <Shield size={20} color={isPro ? "#fff" : "#9CA3AF"} />
                        </div>
                        <div>
                            <p style={{
                                fontFamily: "Space Grotesk, sans-serif",
                                fontWeight: 700, fontSize: "15px",
                                color: "#111827", margin: 0,
                            }}>
                                {isPro ? "Business Pro" : "Free Plan"}
                            </p>
                            <p style={{
                                fontSize: "13px", color: "#6B7280",
                                fontFamily: "Inter, sans-serif", margin: "2px 0 0",
                            }}>
                                {isPro
                                    ? "Your subscription renews on Apr 19, 2026"
                                    : "You are on the free plan. Upgrade for more features."}
                            </p>
                        </div>
                    </div>
                    {isPro && (
                        <button style={{
                            padding: "8px 18px",
                            border: "1px solid #FCA5A5",
                            borderRadius: "8px", background: "#FEF2F2",
                            color: "#EF4444", fontSize: "13px",
                            fontWeight: 600, cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                        }}>
                            Cancel Subscription
                        </button>
                    )}
                </div>

                {/* Pricing cards */}
                {!isPro && (
                    <div style={{ marginBottom: "28px" }}>
                        <div style={{
                            display: "flex", justifyContent: "center",
                            marginBottom: "20px",
                        }}>
                            <div style={{
                                display: "flex", gap: "4px",
                                background: "#F3F4F6",
                                borderRadius: "8px", padding: "4px",
                            }}>
                                {[
                                    { v: "monthly", l: "Monthly" },
                                    { v: "annual", l: "Annual (Save 17%)" },
                                ].map(opt => (
                                    <button key={opt.v} onClick={() => setBilling(opt.v)} style={{
                                        padding: "6px 18px", borderRadius: "6px",
                                        border: "none", fontSize: "13px", fontWeight: 600,
                                        cursor: "pointer", fontFamily: "Inter, sans-serif",
                                        background: billing === opt.v ? "#fff" : "transparent",
                                        color: billing === opt.v ? "#111827" : "#6B7280",
                                        boxShadow: billing === opt.v
                                            ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                                        transition: "all 150ms",
                                    }}>{opt.l}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "16px", maxWidth: "700px",
                            margin: "0 auto",
                        }}>
                            {/* Free */}
                            <div style={{
                                background: "#fff",
                                border: "1px solid #E5E7EB",
                                borderRadius: "12px", padding: "24px",
                            }}>
                                <p style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 700, fontSize: "16px",
                                    color: "#111827", margin: "0 0 4px",
                                }}>Free</p>
                                <div style={{ marginBottom: "16px" }}>
                                    <span style={{
                                        fontFamily: "Space Grotesk, sans-serif",
                                        fontWeight: 800, fontSize: "28px", color: "#111827",
                                    }}>Rs. 0</span>
                                    <span style={{
                                        fontSize: "13px", color: "#9CA3AF",
                                        fontFamily: "Inter, sans-serif",
                                    }}>/forever</span>
                                </div>
                                <div style={{
                                    display: "flex", flexDirection: "column", gap: "8px",
                                    marginBottom: "20px",
                                }}>
                                    {FREE_FEATURES.map((f, i) => (
                                        <div key={i} style={{
                                            display: "flex", alignItems: "flex-start", gap: "8px",
                                        }}>
                                            <Check size={13} color={T} style={{ marginTop: "1px", flexShrink: 0 }} />
                                            <span style={{
                                                fontSize: "12px", color: "#6B7280",
                                                fontFamily: "Inter, sans-serif",
                                            }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <button style={{
                                    width: "100%", padding: "10px",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "8px", background: "#F8F9FA",
                                    color: "#9CA3AF", fontSize: "13px",
                                    fontWeight: 700, cursor: "default",
                                    fontFamily: "Space Grotesk, sans-serif",
                                }}>
                                    Current Plan
                                </button>
                            </div>

                            {/* Pro */}
                            <div style={{
                                background: "#F0FDFA",
                                border: `2px solid ${T}`,
                                borderRadius: "12px", padding: "24px",
                                position: "relative",
                            }}>
                                <div style={{
                                    position: "absolute", top: "-11px",
                                    left: "50%", transform: "translateX(-50%)",
                                    background: T, color: "#fff",
                                    fontSize: "10px", fontWeight: 700,
                                    padding: "3px 14px", borderRadius: "10px",
                                    fontFamily: "Inter, sans-serif",
                                    letterSpacing: "0.05em",
                                    whiteSpace: "nowrap",
                                }}>RECOMMENDED</div>

                                <p style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 700, fontSize: "16px",
                                    color: "#111827", margin: "0 0 4px",
                                }}>Business Pro</p>
                                <div style={{ marginBottom: "4px" }}>
                                    <span style={{
                                        fontFamily: "Space Grotesk, sans-serif",
                                        fontWeight: 800, fontSize: "28px", color: T,
                                    }}>Rs. {price}</span>
                                    <span style={{
                                        fontSize: "13px", color: "#9CA3AF",
                                        fontFamily: "Inter, sans-serif",
                                    }}>/{billing === "monthly" ? "month" : "year"}</span>
                                </div>
                                {saving && (
                                    <p style={{
                                        fontSize: "11px", color: "#10B981",
                                        fontFamily: "Inter, sans-serif",
                                        fontWeight: 600, margin: "0 0 12px",
                                    }}>{saving}</p>
                                )}
                                <div style={{
                                    display: "flex", flexDirection: "column", gap: "8px",
                                    marginBottom: "20px",
                                }}>
                                    {PRO_FEATURES.map((f, i) => (
                                        <div key={i} style={{
                                            display: "flex", alignItems: "flex-start", gap: "8px",
                                        }}>
                                            <Check size={13} color={T} style={{ marginTop: "1px", flexShrink: 0 }} />
                                            <span style={{
                                                fontSize: "12px", color: "#374151",
                                                fontFamily: "Inter, sans-serif",
                                            }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <button style={{
                                    width: "100%", padding: "10px",
                                    border: "none", borderRadius: "8px",
                                    background: T, color: "#fff",
                                    fontSize: "13px", fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: "Space Grotesk, sans-serif",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: "6px",
                                }}>
                                    <Zap size={14} /> Upgrade Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Billing history */}
                <div style={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}>
                    <div style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #F3F4F6",
                    }}>
                        <p style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontWeight: 700, fontSize: "14px",
                            color: "#111827", margin: 0,
                        }}>Billing History</p>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#F8F9FA" }}>
                                {["Invoice", "Date", "Description", "Amount", "Status", ""].map(h => (
                                    <th key={h} style={{
                                        padding: "10px 16px", textAlign: "left",
                                        fontSize: "11px", fontWeight: 700,
                                        color: "#9CA3AF", textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                        fontFamily: "Inter, sans-serif",
                                        borderBottom: "1px solid #E5E7EB",
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {INVOICES.map((inv, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#9CA3AF" }}>
                                            {inv.id}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>
                                        {inv.date}
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#374151", fontFamily: "Inter, sans-serif" }}>
                                        {inv.plan}
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>
                                        {inv.amount}
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{
                                            background: inv.status === "Paid" ? "#ECFDF5" : "#FEF2F2",
                                            color: inv.status === "Paid" ? "#10B981" : "#EF4444",
                                            padding: "2px 10px", borderRadius: "20px",
                                            fontSize: "11px", fontWeight: 700,
                                            fontFamily: "Inter, sans-serif",
                                        }}>{inv.status}</span>
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <button style={{
                                            padding: "4px 10px",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "6px", background: "#fff",
                                            fontSize: "11px", fontWeight: 600,
                                            color: "#6B7280", cursor: "pointer",
                                            fontFamily: "Inter, sans-serif",
                                        }}>Download</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}