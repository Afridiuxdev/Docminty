"use client";
import { useState, useEffect } from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import { Check, Zap, Shield, Star, Building2, X, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import PricingCard from "@/components/PricingCard";
import { authApi, getAccessToken } from "@/api/auth";
import { paymentApi, initiatePayment } from "@/api/payment";

const T = "#0D9488";

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

export default function DashBillingPage() {
    const [billing, setBilling] = useState("monthly");
    const [loading, setLoading] = useState("");
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const router = useRouter();

    useEffect(() => {
        authApi.me().then(res => setUser(res.data.data)).catch(() => {});
        paymentApi.getHistory().then(res => setHistory(res.data.data)).catch(() => {});
    }, []);

    const plan = user?.plan?.toUpperCase() || "FREE";
    const isPro = plan === "PRO" || plan === "ENTERPRISE";
    const isEnterprise = plan === "ENTERPRISE";

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
            <style>{`
                .billing-container { padding: 24px; }
                .billing-banner { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; padding: 20px 24px; border-radius: 12px; }
                .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto 32px; }
                .table-container { background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; overflow-x: auto; }
                
                @media (max-width: 768px) {
                    .billing-container { padding: 16px; }
                    .billing-banner { flex-direction: column; text-align: center; gap: 20px; }
                    .billing-banner div { justify-content: center; width: 100%; }
                    .pricing-grid { grid-template-columns: 1fr; }
                    .billing-tabs button { padding: 10px 16px !important; font-size: 13px !important; }
                }
            `}</style>
            <Toaster position="top-right" />
            <DashHeader title="Billing" subtitle="Manage your subscription and payment history" />
            
            <div className="billing-container">
                {/* Current plan banner */}
                <div className="billing-banner" style={{ background: isPro ? "#F0FDFA" : "#F8F9FA", border: `1px solid ${isPro ? T : "#E5E7EB"}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "44px", height: "44px",
                            background: isPro ? T : "#E5E7EB",
                            borderRadius: "50%", display: "flex",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <Shield size={20} color={isPro ? "#fff" : "#9CA3AF"} />
                        </div>
                        <div style={{ textAlign: "left" }}>
                            <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "15px", color: "#111827", margin: 0 }}>
                                {isEnterprise ? "Enterprise" : (isPro ? "Business Pro" : "Free Plan")}
                            </p>
                            <p style={{ fontSize: "13px", color: "#6B7280", fontFamily: "Inter, sans-serif", margin: "2px 0 0" }}>
                                {isPro
                                    ? `Your subscription renews on ${user?.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Apr 19, 2026"}`
                                    : "You are on the free plan. Upgrade for more features."}
                            </p>
                        </div>
                    </div>
                    {isPro && (
                        <div style={{ background: "#F0FDFA", border: "1px solid #99F6E4", color: T, padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif" }}>ACTIVE</div>
                    )}
                </div>

                {/* Pricing cards */}
                {!isEnterprise && (
                    <div style={{ marginBottom: "40px" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
                            <div className="billing-tabs" style={{ display: "inline-flex", background: "#F1F5F9", borderRadius: "12px", padding: "4px", gap: "4px" }}>
                                {["monthly", "annual"].map(val => (
                                    <button key={val} onClick={() => setBilling(val)} style={{
                                        padding: "10px 24px", borderRadius: "10px", border: "none",
                                        fontSize: "14px", fontWeight: 700, cursor: "pointer",
                                        fontFamily: "Space Grotesk, sans-serif",
                                        background: billing === val ? "#fff" : "transparent",
                                        color: billing === val ? "#0F172A" : "#64748B",
                                        boxShadow: billing === val ? "0 2px 10px rgba(0,0,0,0.06)" : "none",
                                        transition: "all 0.2s",
                                    }}>
                                        {val.charAt(0).toUpperCase() + val.slice(1)}
                                        {val === "annual" && (
                                            <span style={{ marginLeft: "8px", background: T, color: "#fff", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "99px" }}>25% OFF</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pricing-grid">
                            {PRICING_PLANS.map((p, i) => {
                                const isCurrent = (p.plan === "Free" && plan === "FREE") || 
                                                (p.plan === "Business Pro" && plan === "PRO") ||
                                                (p.plan === "Enterprise" && plan === "ENTERPRISE");
                                return (
                                    <PricingCard
                                        key={i}
                                        {...p}
                                        billing={billing}
                                        onClick={p.plan !== "Free" && !isCurrent ? () => handleUpgrade(p.plan, billing) : undefined}
                                        ctaLabel={isCurrent ? "Current Plan" : p.ctaLabel}
                                        disabled={isCurrent}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Billing history */}
                <div className="table-container">
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
                        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", color: "#111827", margin: 0 }}>Billing History</p>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                            <thead>
                                <tr style={{ background: "#F8F9FA" }}>
                                    {["Invoice", "Date", "Description", "Amount", "Status", ""].map(h => (
                                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "Inter, sans-serif", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: "13px", fontFamily: "Inter, sans-serif" }}>No billing history found.</td>
                                    </tr>
                                ) : history.map((inv, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                                        <td style={{ padding: "12px 16px" }}><span style={{ fontFamily: "monospace", fontSize: "11px", color: "#9CA3AF" }}>{inv.id}</span></td>
                                        <td style={{ padding: "12px 16px", fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif" }}>{new Date(inv.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                                        <td style={{ padding: "12px 16px", fontSize: "12px", color: "#374151", fontFamily: "Inter, sans-serif", textTransform: "capitalize" }}>{inv.plan.toLowerCase()}</td>
                                        <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>{inv.amount}</td>
                                        <td style={{ padding: "12px 16px" }}><span style={{ background: inv.status === "PAID" ? "#ECFDF5" : "#FEF2F2", color: inv.status === "PAID" ? "#10B981" : "#EF4444", padding: "2px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, fontFamily: "Inter, sans-serif", textTransform: "uppercase" }}>{inv.status}</span></td>
                                        <td style={{ padding: "12px 16px", display: "flex", gap: "6px" }}>
                                            <button onClick={() => router.push(`/dashboard/billing/invoice/${inv.id}`)} style={{ padding: "4px 10px", border: "1px solid #E5E7EB", borderRadius: "6px", background: "#fff", fontSize: "11px", fontWeight: 600, color: T, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}