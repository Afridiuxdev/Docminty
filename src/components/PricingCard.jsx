"use client";
import Link from "next/link";
import { Check, X } from "lucide-react";

const T = "#0D9488";
const TL = "#F0FDFA";

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
    dark = false,
}) {
    return (
        <div style={{
            border: highlighted ? `2px solid ${T}` : "1px solid #D1D5DB",
            borderRadius: "12px",
            background: highlighted ? "#fff" : "#fff",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: highlighted
                ? `0 20px 60px rgba(13,148,136,0.15)`
                : "none",
        }}>

            {/* Most Popular badge */}
            {highlighted && (
                <div style={{
                    position: "absolute",
                    top: "16px", right: "16px",
                    background: T,
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "4px",
                    fontFamily: "Space Grotesk, sans-serif",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                }}>
                    Most Popular
                </div>
            )}

            {/* Card body */}
            <div style={{ padding: "24px 24px 0" }}>

                {/* Plan name */}
                <p style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#111827",
                    margin: "0 0 6px",
                    fontFamily: "Space Grotesk, sans-serif",
                    paddingRight: highlighted ? "100px" : "0",
                }}>
                    {plan}
                </p>

                {/* Description */}
                <p style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    margin: "0 0 16px",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.5,
                }}>
                    {description}
                </p>

                {/* Price row */}
                <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                    marginBottom: "4px",
                    flexWrap: "wrap",
                }}>
                    {originalPrice && (
                        <span style={{
                            fontSize: "16px",
                            color: "#9CA3AF",
                            textDecoration: "line-through",
                            fontFamily: "Space Grotesk, sans-serif",
                        }}>
                            {originalPrice}
                        </span>
                    )}
                    <span style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: "36px",
                        fontWeight: 700,
                        color: "#111827",
                        lineHeight: 1,
                    }}>
                        {price}
                    </span>
                    {period && (
                        <span style={{
                            fontSize: "15px",
                            color: "#6B7280",
                            fontFamily: "Inter, sans-serif",
                        }}>
                            {period}
                        </span>
                    )}
                </div>

                {/* Sub note */}
                {subNote && (
                    <p style={{
                        fontSize: "13px",
                        color: "#9CA3AF",
                        margin: "0 0 20px",
                        fontFamily: "Inter, sans-serif",
                    }}>
                        {subNote}
                    </p>
                )}

                {/* Divider */}
                <div style={{ borderTop: "1px solid #E5E7EB", margin: "16px 0 14px" }} />

                {/* INCLUDED */}
                {includedFeatures?.length > 0 && (
                    <>
                        <p style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#9CA3AF",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            margin: "0 0 10px",
                            fontFamily: "Inter, sans-serif",
                        }}>
                            INCLUDED
                        </p>
                        <div style={{
                            display: "flex", flexDirection: "column",
                            gap: "8px", marginBottom: "16px",
                        }}>
                            {includedFeatures.map((f, i) => (
                                <div key={i} style={{
                                    display: "flex", alignItems: "flex-start", gap: "8px",
                                }}>
                                    <Check
                                        size={14}
                                        color={T}
                                        style={{ flexShrink: 0, marginTop: "3px" }}
                                    />
                                    <span style={{
                                        fontSize: "13px",
                                        color: "#374151",
                                        fontFamily: "Inter, sans-serif",
                                        lineHeight: 1.5,
                                    }}>
                                        {f}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* NOT INCLUDED */}
                {notIncludedFeatures?.length > 0 && (
                    <>
                        <p style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#9CA3AF",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            margin: "0 0 10px",
                            fontFamily: "Inter, sans-serif",
                        }}>
                            NOT INCLUDED
                        </p>
                        <div style={{
                            display: "flex", flexDirection: "column",
                            gap: "8px", marginBottom: "20px",
                        }}>
                            {notIncludedFeatures.map((f, i) => (
                                <div key={i} style={{
                                    display: "flex", alignItems: "flex-start", gap: "8px",
                                }}>
                                    <X
                                        size={14}
                                        color="#D1D5DB"
                                        style={{ flexShrink: 0, marginTop: "3px" }}
                                    />
                                    <span style={{
                                        fontSize: "13px",
                                        color: "#9CA3AF",
                                        fontFamily: "Inter, sans-serif",
                                        lineHeight: 1.5,
                                    }}>
                                        {f}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* CTA — sticks to bottom */}
            <div style={{ padding: "0 24px 20px", marginTop: "auto" }}>

                {/* Divider */}
                <div style={{ borderTop: "1px solid #E5E7EB", marginBottom: "16px" }} />

                <Link href={ctaHref} style={{
                    display: "block",
                    textAlign: "center",
                    padding: "13px",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "Space Grotesk, sans-serif",
                    textDecoration: "none",
                    background: highlighted ? T : "transparent",
                    color: highlighted ? "#fff" : "#111827",
                    border: highlighted ? "none" : "1px solid #D1D5DB",
                    transition: "all 150ms",
                }}
                    onMouseEnter={e => {
                        if (highlighted) {
                            e.currentTarget.style.background = "#0F766E";
                        } else {
                            e.currentTarget.style.borderColor = T;
                            e.currentTarget.style.color = T;
                        }
                    }}
                    onMouseLeave={e => {
                        if (highlighted) {
                            e.currentTarget.style.background = T;
                        } else {
                            e.currentTarget.style.borderColor = "#D1D5DB";
                            e.currentTarget.style.color = "#111827";
                        }
                    }}
                >
                    {ctaLabel}
                </Link>

                {/* Promo code */}
                {promoCode && (
                    <p style={{
                        fontSize: "12px",
                        color: "#9CA3AF",
                        textAlign: "center",
                        margin: "8px 0 0",
                        fontFamily: "Inter, sans-serif",
                    }}>
                        Use code{" "}
                        <strong style={{ color: "#374151", letterSpacing: "0.05em" }}>
                            {promoCode}
                        </strong>{" "}
                        at checkout
                    </p>
                )}

                {/* Extra link */}
                {extraLink && (
                    <Link href={extraLink} style={{
                        display: "block",
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: T,
                        textDecoration: "none",
                        marginTop: "10px",
                        fontFamily: "Space Grotesk, sans-serif",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                    }}>
                        {extraLinkLabel}
                    </Link>
                )}
            </div>
        </div>
    );
}