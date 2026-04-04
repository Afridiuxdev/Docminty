"use client";
import { useState } from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import { Check, Zap, Shield, Star, Building2, X, ArrowRight } from "lucide-react";
import { initiatePayment } from "@/api/payment";
import { getAccessToken } from "@/api/auth";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import PricingCard from "@/components/PricingCard";

const T = "#0D9488";

const INVOICES = [
    { id: "INV-001", date: "19 Mar 2026", plan: "Business Pro Monthly", amount: "₹199", status: "Paid" },
    { id: "INV-002", date: "19 Feb 2026", plan: "Business Pro Monthly", amount: "₹199", status: "Paid" },
    { id: "INV-003", date: "19 Jan 2026", plan: "Business Pro Monthly", amount: "₹199", status: "Paid" },
    { id: "INV-004", date: "19 Dec 2025", plan: "Business Pro Monthly", amount: "₹199", status: "Paid" },
    { id: "INV-005", date: "19 Nov 2025", plan: "Business Pro Monthly", amount: "₹199", status: "Failed" },
];

const PRICING_PLANS = [
    {
        plan: "Free", price: "₹0", period: "forever",
        description: "For individuals & freelancers getting started",
        subNote: "No expiration date, use anytime.",
        includedFeatures: ["All document types access", "Unlimited PDF downloads", "GST auto-calculation", "2 Free templates"],
        notIncludedFeatures: ["Logo upload", "Batch CSV processing", "Cloud document storage"],
        ctaLabel: "Get Started Free", ctaHref: "/invoice",
        highlighted: false,
    },
    {
        plan: "Business Pro", price: "₹199", originalPrice: "₹399", period: "/month",
        description: "For individuals & growing businesses",
        badge: "Most Popular",
        includedFeatures: ["Everything in Free", "Logo upload & custom branding", "Batch document generation (CSV)", "Store up to 20 documents in cloud", "Premium templates", "Priority support"],
        notIncludedFeatures: [],
        ctaLabel: "Start Pro – ₹199/month", ctaHref: "/signup",
        extraLink: "/batch", extraLinkLabel: "See Batch Processing →",
        highlighted: true,
    },
    {
        plan: "Enterprise", price: "₹399", originalPrice: "₹799", period: "/month",
        description: "For teams & high-volume document workflows",
        badge: "Best for Teams",
        includedFeatures: ["Everything in Pro", "Store up to 50 documents in cloud", "Team access / multi-user login", "Priority processing & faster performance", "Dedicated support"],
        notIncludedFeatures: [],
        ctaLabel: "Upgrade to Enterprise", ctaHref: "/signup",
        highlighted: false,
    },
];

const TRUST_ITEMS = [
    { icon: <Shield size={14} />, text: "Secure payments" },
    { icon: <Zap size={14} />, text: "Instant activation" },
    { icon: <Check size={14} />, text: "No hidden charges" }
];

export default function DashBillingPage() {
    const [billing, setBilling] = useState("monthly");
    const [loading, setLoading] = useState("");
    const isPro = false; // This would typically come from user context
    const router = useRouter();

    const handleUpgrade = async (planName, billingCycle) => {
        const token = getAccessToken();
        if (!token) { toast.error("Please sign in to upgrade"); return; }

        const type = planName === "Enterprise"
            ? (billingCycle === "monthly" ? "MONTHLY_ENTERPRISE" : "ANNUAL_ENTERPRISE")
            : (billingCycle === "monthly" ? "MONTHLY_PRO" : "ANNUAL_PRO");

        setLoading(type);
        await initiatePayment(type,
            () => { toast.success(`Payment successful! You are now on ${planName}.`); setLoading(""); router.refresh(); },
            (err) => { toast.error(err || "Payment failed"); setLoading(""); }
        );
    };

    return (
        <>
            <Toaster position="top-right" />
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
                </div>

                {/* Pricing cards */}
                {!isPro && (
                    <div style={{ marginBottom: "40px" }}>
                        <div style={{
                            display: "flex", justifyContent: "center",
                            marginBottom: "32px",
                        }}>
                            <div style={{
                                display: "inline-flex", background: "#F1F5F9",
                                borderRadius: "12px", padding: "4px", gap: "4px"
                            }}>
                                {[["monthly", "Monthly"], ["annual", "Annual"]].map(([val, label]) => (
                                    <button key={val} onClick={() => setBilling(val)} style={{
                                        padding: "10px 24px", borderRadius: "10px", border: "none",
                                        fontSize: "14px", fontWeight: 700, cursor: "pointer",
                                        fontFamily: "Space Grotesk, sans-serif",
                                        background: billing === val ? "#fff" : "transparent",
                                        color: billing === val ? "#0F172A" : "#64748B",
                                        boxShadow: billing === val ? "0 2px 10px rgba(0,0,0,0.06)" : "none",
                                        transition: "all 0.2s",
                                    }}>
                                        {label}
                                        {val === "annual" && (
                                            <span style={{ marginLeft: "8px", background: T, color: "#fff", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "99px" }}>25% OFF</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "24px", maxWidth: "1200px",
                            margin: "0 auto 32px",
                        }}>
                            {PRICING_PLANS.map((plan, i) => (
                                <PricingCard
                                    key={i}
                                    {...plan}
                                    billing={billing}
                                    onClick={plan.plan !== "Free" ? () => handleUpgrade(plan.plan, billing) : undefined}
                                />
                            ))}
                        </div>

                        {/* Simple Trust Bar */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "24px",
                            flexWrap: "wrap",
                            padding: "20px",
                            background: "#F8FAFC",
                            borderRadius: "16px",
                            border: "1px solid #F1F5F9",
                            maxWidth: "1200px",
                            margin: "0 auto"
                        }}>
                            {TRUST_ITEMS.map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748B", fontSize: "14px", fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
                                    <span style={{ color: T }}>{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
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
                                    <td style={{ padding: "12px 16px", display: "flex", gap: "6px" }}>
                                        <button 
                                            onClick={() => router.push(`/dashboard/billing/invoice/${inv.id}`)}
                                            style={{
                                                padding: "4px 12px",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "6px", background: "#fff",
                                                fontSize: "11px", fontWeight: 600,
                                                color: T, cursor: "pointer",
                                                fontFamily: "Inter, sans-serif",
                                            }}>View</button>
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