"use client";
import Link from "next/link";
import { 
    Check, X, FileText, Layout, Image, Cloud, 
    MessageSquare, Zap, Users, ShieldCheck, 
    ArrowRight, Star 
} from "lucide-react";

const T = "#0D9488";

// Helper to map feature text to icons
const FeatureIcon = ({ text, color }) => {
    const t = text.toLowerCase();
    if (t.includes("document") || t.includes("pdf")) return <FileText size={16} color={color} />;
    if (t.includes("template")) return <Layout size={16} color={color} />;
    if (t.includes("logo") || t.includes("branding")) return <Image size={16} color={color} />;
    if (t.includes("cloud") || t.includes("store")) return <Cloud size={16} color={color} />;
    if (t.includes("support")) return <MessageSquare size={16} color={color} />;
    if (t.includes("batch") || t.includes("process") || t.includes("faster")) return <Zap size={16} color={color} />;
    if (t.includes("team") || t.includes("user")) return <Users size={16} color={color} />;
    return <Check size={16} color={color} />;
};

export default function PricingCard({
    plan,
    price,
    originalPrice,
    period,
    description,
    subNote,
    includedFeatures,
    notIncludedFeatures,
    ctaLabel,
    ctaHref,
    promoCode,
    extraLink,
    extraLinkLabel,
    highlighted = false,
    badge, // New prop for custom badges
    billing = "monthly", // "monthly" | "annual"
    discountPct = 25,    // Annual discount percentage, admin-controlled
    onClick,
    disabled = false,
}) {
    // Parse numeric price
    const numericPrice = parseInt(price?.replace(/[^\d]/g, "") || "0", 10);
    const isPaidPlan = numericPrice > 0;

    // Apply dynamic annual discount to all paid plans
    const discountFactor = 1 - (discountPct / 100);
    const annualPerMonth = isPaidPlan ? Math.round(numericPrice * discountFactor) : 0;
    const annualTotal = annualPerMonth * 12;

    const displayPrice = isPaidPlan && billing === "annual" ? `₹${annualPerMonth}` : price;
    const displayOriginal = isPaidPlan && billing === "annual" ? `₹${numericPrice}` : originalPrice;
    const displayPeriod = isPaidPlan ? (billing === "annual" ? "/mo" : period) : period;
    
    const annualSavings = isPaidPlan && billing === "annual"
        ? `Save ₹${numericPrice * 12 - annualTotal}/yr`
        : null;
    const annualBilledText = isPaidPlan && billing === "annual"
        ? `Billed annually at ₹${annualTotal}`
        : null;

    const finalHref = ctaHref === "/signup" && isPaidPlan 
        ? `/signup?plan=${encodeURIComponent(plan)}&billing=${billing}`
        : ctaHref;

    return (
        <div 
            className="pricing-card-container"
            style={{
                border: highlighted ? `2px solid ${T}` : "1px solid #E2E8F0",
                borderRadius: "20px",
                background: "#fff",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: highlighted ? `0 20px 50px rgba(13,148,136,0.12)` : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                height: "100%",
                cursor: "default",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = highlighted 
                    ? "0 30px 60px rgba(13,148,136,0.18)" 
                    : "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = highlighted 
                    ? "0 20px 50px rgba(13,148,136,0.12)" 
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
            }}
        >
            {/* Header Badge */}
            {(highlighted || badge) && (
                <div style={{
                    position: "absolute",
                    top: "20px", right: "20px",
                    background: highlighted ? T : "#F1F5F9",
                    color: highlighted ? "white" : "#475569",
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "4px 12px",
                    borderRadius: "99px",
                    fontFamily: "Space Grotesk, sans-serif",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    zIndex: 10,
                }}>
                    {highlighted && <Star size={10} fill="currentColor" />}
                    {badge || "Most Popular"}
                </div>
            )}

            <div style={{ padding: "32px 32px 24px" }}>
                {/* Plan Title */}
                <h3 style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "#0F172A",
                    margin: "0 0 4px",
                    fontFamily: "Space Grotesk, sans-serif",
                }}>
                    {plan}
                </h3>
                
                {/* Subtitle / Description */}
                <p style={{
                    fontSize: "14px",
                    color: "#64748B",
                    margin: "0 0 24px",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.5,
                    minHeight: "42px",
                }}>
                    {description}
                </p>

                {/* Price Display */}
                <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                    marginBottom: "8px",
                }}>
                    <span style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: "44px",
                        fontWeight: 800,
                        color: "#0F172A",
                        lineHeight: 1,
                    }}>
                        {displayPrice}
                    </span>
                    {displayPeriod && (
                        <span style={{
                            fontSize: "15px",
                            color: "#64748B",
                            fontWeight: 500,
                            fontFamily: "Inter, sans-serif",
                        }}>
                            {displayPeriod}
                        </span>
                    )}
                </div>

                {/* Original Price / Savings */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "22px", marginBottom: "20px" }}>
                    {displayOriginal && (
                        <span style={{
                            fontSize: "15px",
                            color: "#94A3B8",
                            textDecoration: "line-through",
                            fontFamily: "Space Grotesk, sans-serif",
                        }}>
                            {displayOriginal}
                        </span>
                    )}
                    {annualSavings && (
                        <span style={{
                            background: "#DCFCE7",
                            color: "#166534",
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            fontFamily: "Inter, sans-serif",
                            textTransform: "uppercase",
                        }}>
                            {annualSavings}
                        </span>
                    )}
                </div>

                {/* Billed Text */}
                {annualBilledText && (
                    <p style={{
                        fontSize: "13px",
                        color: "#166534",
                        fontWeight: 600,
                        margin: "-12px 0 24px",
                        fontFamily: "Inter, sans-serif",
                    }}>
                        {annualBilledText}
                    </p>
                )}
                {subNote && billing !== "annual" && (
                    <p style={{
                        fontSize: "13px",
                        color: "#94A3B8",
                        margin: "-12px 0 24px",
                        fontFamily: "Inter, sans-serif",
                    }}>
                        {subNote}
                    </p>
                )}

                <div style={{ height: "1px", background: "#F1F5F9", width: "100%", margin: "0 0 24px" }} />

                {/* Features List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {/* INCLUDED */}
                    {includedFeatures?.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            <div style={{ 
                                marginTop: "2px",
                                padding: "4px",
                                borderRadius: "6px",
                                background: highlighted ? "#F0FDFA" : "#F8FAFC",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <FeatureIcon text={f} color={highlighted ? T : "#475569"} />
                            </div>
                            <span style={{
                                fontSize: "14px",
                                color: "#334155",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 500,
                                lineHeight: 1.4,
                            }}>
                                {f}
                            </span>
                        </div>
                    ))}

                    {/* NOT INCLUDED */}
                    {notIncludedFeatures?.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", opacity: 0.6 }}>
                            <div style={{ 
                                marginTop: "2px",
                                padding: "4px",
                                borderRadius: "6px",
                                background: "#F8FAFC",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <X size={14} color="#94A3B8" />
                            </div>
                            <span style={{
                                fontSize: "14px",
                                color: "#94A3B8",
                                fontFamily: "Inter, sans-serif",
                                textDecoration: "line-through",
                                lineHeight: 1.4,
                            }}>
                                {f}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div style={{ padding: "0 32px 32px", marginTop: "auto" }}>
                {onClick ? (
                    <button 
                        onClick={onClick}
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: 700,
                            fontFamily: "Space Grotesk, sans-serif",
                            border: "none",
                            background: highlighted ? T : "#0F172A",
                            color: "#fff",
                            cursor: disabled ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            boxShadow: highlighted ? `0 10px 20px -5px rgba(13,148,136,0.3)` : "none",
                            opacity: disabled ? 0.6 : 1,
                        }}
                        onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "scale(1.02)"; }}
                        onMouseLeave={e => { if (!disabled) e.currentTarget.style.transform = "scale(1)"; }}
                        disabled={disabled}
                    >
                        {ctaLabel}
                        <ArrowRight size={18} />
                    </button>
                ) : (
                    <Link href={finalHref} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        width: "100%",
                        padding: "16px",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: 700,
                        fontFamily: "Space Grotesk, sans-serif",
                        textDecoration: "none",
                        background: highlighted ? T : "#F8FAFC",
                        color: highlighted ? "#fff" : "#0F172A",
                        border: highlighted ? "none" : "1px solid #E2E8F0",
                        transition: "all 0.2s",
                        opacity: disabled ? 0.6 : 1,
                        pointerEvents: disabled ? "none" : "auto",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                    >
                        {ctaLabel}
                        <ArrowRight size={18} />
                    </Link>
                )}

                {extraLink && (
                    <Link href={extraLink} style={{
                        display: "block",
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: T,
                        textDecoration: "none",
                        marginTop: "16px",
                        fontFamily: "Space Grotesk, sans-serif",
                        letterSpacing: "0.02em",
                    }}>
                        {extraLinkLabel}
                    </Link>
                )}
            </div>
        </div>
    );
}